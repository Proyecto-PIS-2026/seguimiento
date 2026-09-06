import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './auth'
import { isSameOriginRequest } from './request'
import type { UserRole } from '../shared/auth/access'

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message) }
}
export async function requireSession(roles: UserRole[]) {
  const session = await getSession()
  if (!session) throw new HttpError(401, 'La sesión venció. Volvé a ingresar.')
  if (!roles.includes(session.role)) throw new HttpError(403, 'Acceso no autorizado.')
  return session
}
export async function jsonBody(request: NextRequest) {
  if (!isSameOriginRequest(request)) throw new HttpError(403, 'Origen no permitido.')
  const text = await request.text()
  if (text.length > 3_000_000) throw new HttpError(413, 'Los datos enviados son demasiado grandes.')
  try {
    const body = JSON.parse(text)
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error()
    return body
  } catch { throw new HttpError(400, 'Los datos enviados no son válidos.') }
}
export function assertOrigin(request: NextRequest) {
  if (!isSameOriginRequest(request)) throw new HttpError(403, 'Origen no permitido.')
}
export async function respond(action: () => Promise<unknown>, status = 200) {
  try { return NextResponse.json(await action(), { status, headers: { 'Cache-Control': 'no-store' } }) }
  catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status })
    if ((error as { code?: string })?.code === 'P2002') return NextResponse.json({ error: 'Ya existe un registro con ese email o combinación.' }, { status: 409 })
    console.error('Error en API:', error instanceof Error ? error.message : 'Error desconocido')
    return NextResponse.json({ error: 'No se pudo completar la operación. Intentá nuevamente.' }, { status: 503 })
  }
}
export function requiredText(value: unknown, label: string, max = 255) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new HttpError(400, `${label}: completá un texto de hasta ${max} caracteres.`)
  return value.trim()
}
export function uuid(value: unknown) {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw new HttpError(400, 'Identificador inválido.')
  return value
}
