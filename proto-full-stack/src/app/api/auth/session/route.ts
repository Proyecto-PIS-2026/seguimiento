import { NextRequest, NextResponse } from 'next/server'
import { authenticate, createSession, deleteSession, getSessionRole, SESSION_COOKIE, SESSION_MAX_AGE } from '../../../../server/auth'

export async function GET() {
  return NextResponse.json({ role: await getSessionRole() }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') && request.headers.get('origin') !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 })
  }
  let credentials: { username?: unknown; password?: unknown } | null
  try {
    credentials = await request.json()
  } catch {
    return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 400 })
  }
  const role = authenticate(credentials?.username, credentials?.password)
  if (!role) return NextResponse.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 })
  await deleteSession()
  const response = NextResponse.json({ role })
  response.cookies.set(SESSION_COOKIE, createSession(role), {
    httpOnly: true, sameSite: 'lax', secure: request.nextUrl.protocol === 'https:', path: '/', maxAge: SESSION_MAX_AGE,
  })
  return response
}

export async function DELETE(request: NextRequest) {
  if (request.headers.get('origin') && request.headers.get('origin') !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 })
  }
  await deleteSession()
  const response = NextResponse.json({ role: null })
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
