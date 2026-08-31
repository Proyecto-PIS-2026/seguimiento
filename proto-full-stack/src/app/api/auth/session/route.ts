import { NextRequest, NextResponse } from 'next/server'
import { authenticate, createSession, deleteSession, getSessionRole, SESSION_COOKIE, SESSION_MAX_AGE } from '../../../../server/auth'

function getForwardedOrigin(request: NextRequest) {
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const host = forwardedHost || request.headers.get('host') || request.nextUrl.host
  const protocol = forwardedProto || request.nextUrl.protocol.replace(':', '')
  return `${protocol}://${host}`
}

function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    const requestOrigins = new Set([request.nextUrl.origin, getForwardedOrigin(request)])
    return requestOrigins.has(new URL(origin).origin)
  } catch {
    return false
  }
}

function isSecureRequest(request: NextRequest) {
  return request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() === 'https'
}

export async function GET() {
  return NextResponse.json({ role: await getSessionRole() }, { headers: { 'Cache-Control': 'no-store' } })
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
  const role = authenticate(credentials?.username, credentials?.password)
  if (!role) return NextResponse.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 })
  await deleteSession()
  const response = NextResponse.json({ role })
  response.cookies.set(SESSION_COOKIE, createSession(role), {
    httpOnly: true, sameSite: 'lax', secure: isSecureRequest(request), path: '/', maxAge: SESSION_MAX_AGE,
  })
  return response
}

export async function DELETE(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 })
  }
  await deleteSession()
  const response = NextResponse.json({ role: null })
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
