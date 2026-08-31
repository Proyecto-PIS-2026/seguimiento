import { NextRequest, NextResponse } from 'next/server'
import { deleteSession, SESSION_COOKIE } from '../../../../../server/auth'
import { getForwardedOrigin } from '../../../../../server/request'
import { getAccessiblePath } from '../../../../../shared/auth/access'

function getClientRedirectPath(request: NextRequest) {
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
  const accessiblePath = getAccessiblePath(pathname, null)
  return accessiblePath === '/ingresar' ? '/' : `${accessiblePath}${search}`
}

export async function GET(request: NextRequest) {
  await deleteSession()
  const response = NextResponse.redirect(new URL(getClientRedirectPath(request), getForwardedOrigin(request)))
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
