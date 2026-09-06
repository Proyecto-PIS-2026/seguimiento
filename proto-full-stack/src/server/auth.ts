import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import type { UserRole } from '../shared/auth/access'
import { getDatabase } from './database'
import { verifyPassword } from './passwords'
import { demoProfiles } from './demoProfiles'

export const SESSION_COOKIE = 'mercado-session'
export const SESSION_MAX_AGE = 60 * 60 * 8
export type SessionUser = { role: UserRole; username: string; actorId?: string; name?: string }
const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex')

export async function authenticate(username: unknown, password: unknown): Promise<SessionUser | null> {
  if (typeof username !== 'string' || typeof password !== 'string' || password.length > 128) return null
  const login = username.trim().toLowerCase()
  const demo: Record<string, UserRole> = { admin: 'admin', operador: 'operator', productor: 'producer' }
  if (Object.hasOwn(demo, login) && password === login) return { role: demo[login], username: login, actorId: login === 'admin' ? undefined : demoProfiles[demo[login] as 'operator' | 'producer'].id, name: login === 'admin' ? 'Administrador' : demoProfiles[demo[login] as 'operator' | 'producer'].name }
  const result = await getDatabase().query(`SELECT c.*, a.name FROM actor_credentials c JOIN (
    SELECT id,name,active FROM operators UNION ALL SELECT id,name,active FROM producers
  ) a ON a.id=c.actor_id WHERE c.email=$1 AND a.active=true`, [login])
  const account = result.rows[0]
  if (!account || !await verifyPassword(password, account.password_hash)) return null
  return { role: account.role, username: account.email, actorId: account.actor_id, name: account.name }
}
export async function createSession(user: SessionUser): Promise<string> {
  const token = randomBytes(32).toString('hex')
  await getDatabase().query('DELETE FROM sessions WHERE expires_at < now()')
  await getDatabase().query(`INSERT INTO sessions(token_hash,role,username,actor_id,expires_at) VALUES($1,$2,$3,$4,now()+interval '8 hours')`, [tokenHash(token), user.role, user.username, user.actorId ?? null])
  return token
}
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const record = (await getDatabase().query('SELECT * FROM sessions WHERE token_hash=$1 AND expires_at>now()', [tokenHash(token)])).rows[0]
  if (!record) return null
  if (record.actor_id && !Object.values(demoProfiles).some(profile => profile.id === record.actor_id && profile.role === record.role)) {
    const actor = (await getDatabase().query(`SELECT name,email,active FROM ${record.role === 'operator' ? 'operators' : 'producers'} WHERE id=$1`, [record.actor_id])).rows[0]
    if (!actor?.active) return null
    return { role: record.role, username: actor.email, actorId: record.actor_id, name: actor.name }
  }
  return { role: record.role, username: record.username, actorId: record.actor_id ?? undefined, name: record.role === 'admin' ? 'Administrador' : demoProfiles[record.role as 'operator' | 'producer'].name }
}
export async function getSessionRole(): Promise<UserRole | null> { return (await getSession())?.role ?? null }
export async function deleteSession(): Promise<void> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (token) await getDatabase().query('DELETE FROM sessions WHERE token_hash=$1', [tokenHash(token)])
}
