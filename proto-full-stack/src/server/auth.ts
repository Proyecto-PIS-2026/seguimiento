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
  const db = getDatabase()
  const account = await db.actor_credentials.findUnique({ where: { email: login } })
  if (!account || !await verifyPassword(password, account.password_hash)) return null
  const actor = account.role === 'operator'
    ? await db.operators.findUnique({ where: { id: account.actor_id } })
    : await db.producers.findUnique({ where: { id: account.actor_id } })
  if (!actor?.active) return null
  return { role: account.role as UserRole, username: account.email, actorId: account.actor_id, name: actor.name }
}
export async function createSession(user: SessionUser): Promise<string> {
  const token = randomBytes(32).toString('hex')
  await getDatabase().sessions.deleteMany({ where: { expires_at: { lt: new Date() } } })
  await getDatabase().sessions.create({ data: { token_hash: tokenHash(token), role: user.role, username: user.username, actor_id: user.actorId ?? null, expires_at: new Date(Date.now() + SESSION_MAX_AGE * 1000) } })
  return token
}
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const record = await getDatabase().sessions.findFirst({ where: { token_hash: tokenHash(token), expires_at: { gt: new Date() } } })
  if (!record) return null
  if (record.actor_id && !Object.values(demoProfiles).some(profile => profile.id === record.actor_id && profile.role === record.role)) {
    const where = { id: record.actor_id }
    const actor = record.role === 'operator' ? await getDatabase().operators.findUnique({ where }) : await getDatabase().producers.findUnique({ where })
    if (!actor?.active) return null
    return { role: record.role as UserRole, username: actor.email, actorId: record.actor_id, name: actor.name }
  }
  return { role: record.role as UserRole, username: record.username, actorId: record.actor_id ?? undefined, name: record.role === 'admin' ? 'Administrador' : demoProfiles[record.role as 'operator' | 'producer'].name }
}
export async function getSessionRole(): Promise<UserRole | null> { return (await getSession())?.role ?? null }
export async function deleteSession(): Promise<void> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (token) await getDatabase().sessions.deleteMany({ where: { token_hash: tokenHash(token) } })
}
