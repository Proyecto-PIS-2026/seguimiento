import type { UserRole } from '../../shared/auth/access'

export type AuthSession = { role: UserRole; username: string }

export async function login(username: string, password: string): Promise<AuthSession> {
  const response = await fetch('/api/auth/session', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error ?? 'No se pudo iniciar sesión.')
  return { role: result.role, username: result.username }
}

export async function logout(): Promise<void> {
  const response = await fetch('/api/auth/session', { method: 'DELETE' })
  if (!response.ok) throw new Error('No se pudo cerrar la sesión. Intentá nuevamente.')
}
