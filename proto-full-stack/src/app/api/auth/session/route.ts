import { NextRequest, NextResponse } from 'next/server'
import { authenticate, createSession, deleteSession, getSession, SESSION_COOKIE, SESSION_MAX_AGE } from '../../../../server/auth'
import { isSameOriginRequest, isSecureRequest } from '../../../../server/request'

export async function GET() {
  const session = await getSession()
  return NextResponse.json({ role: session?.role ?? null, username: session?.username ?? null }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 })
  }
  let credentials: { username?: unknown; password?: unknown } | null
  try {
    credentials = await request.json()
  } catch {
    return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 400 })
  }
  const session = authenticate(credentials?.username, credentials?.password)
  if (!session) return NextResponse.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 })
  await deleteSession()
  const response = NextResponse.json(session)
  response.cookies.set(SESSION_COOKIE, createSession(session), {
    httpOnly: true, sameSite: 'lax', secure: isSecureRequest(request), path: '/', maxAge: SESSION_MAX_AGE,
  })
  return response
}

export async function DELETE(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 })
  }
  await deleteSession()
  const response = NextResponse.json({ role: null, username: null })
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
