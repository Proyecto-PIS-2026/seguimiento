import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import type { UserRole } from '../shared/auth/access'

export const SESSION_COOKIE = 'mercado-session'
export const SESSION_MAX_AGE = 60 * 60 * 8
export type SessionUser = { role: UserRole; username: string }
type Session = SessionUser & { expiresAt: number }

// Demo sessions live on the server; the browser only receives an opaque token.
const sessionGlobal = globalThis as typeof globalThis & { mercadoSessions?: Map<string, Session> }
const sessions = sessionGlobal.mercadoSessions ??= new Map<string, Session>()

export function authenticate(username: unknown, password: unknown): SessionUser | null {
  if (typeof username !== 'string' || typeof password !== 'string') return null
  const normalizedUsername = username.trim().toLocaleLowerCase('es')
  const accounts: Record<string, UserRole> = { operador: 'operator', productor: 'producer', admin: 'admin' }
  return Object.hasOwn(accounts, normalizedUsername) && password === normalizedUsername
    ? { role: accounts[normalizedUsername], username: normalizedUsername }
    : null
}

export function createSession(user: SessionUser): string {
  for (const [token, session] of sessions) {
    if (session.expiresAt <= Date.now()) sessions.delete(token)
  }
  const token = randomBytes(32).toString('hex')
  sessions.set(token, { ...user, expiresAt: Date.now() + SESSION_MAX_AGE * 1000 })
  return token
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  const session = token ? sessions.get(token) : null
  if (!session || session.expiresAt <= Date.now()) {
    if (token) sessions.delete(token)
    return null
  }
  return { role: session.role, username: session.username ?? session.role }
}

export async function getSessionRole(): Promise<UserRole | null> {
  return (await getSession())?.role ?? null
}

export async function deleteSession(): Promise<void> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (token) sessions.delete(token)
}
