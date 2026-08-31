import { NextRequest, NextResponse } from 'next/server'
import { authenticate, createSession, deleteSession, type SessionUser, SESSION_COOKIE, SESSION_MAX_AGE } from '../../../../../server/auth'
import { getForwardedOrigin, isSecureRequest } from '../../../../../server/request'
import { getAccessiblePath } from '../../../../../shared/auth/access'

function getRedirectPath(request: NextRequest, session: SessionUser) {
  const requestedNext = request.nextUrl.searchParams.get('next') || '/'
  let pathname = '/'
  let search = ''
  try {
    const target = new URL(requestedNext, request.nextUrl.origin)
    if (target.origin === request.nextUrl.origin) {
      pathname = target.pathname
      search = target.search
    }
  } catch {
    pathname = '/'
  }
  return `${getAccessiblePath(pathname, session.role)}${search}`
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('user')
  const password = request.nextUrl.searchParams.get('pass')
  const session = authenticate(username, password)
  await deleteSession()

  if (!session) {
    const response = NextResponse.redirect(new URL('/ingresar', getForwardedOrigin(request)))
    response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
    return response
  }

  const response = NextResponse.redirect(new URL(getRedirectPath(request, session), getForwardedOrigin(request)))
  response.cookies.set(SESSION_COOKIE, createSession(session), {
    httpOnly: true, sameSite: 'lax', secure: isSecureRequest(request), path: '/', maxAge: SESSION_MAX_AGE,
  })
  return response
}
