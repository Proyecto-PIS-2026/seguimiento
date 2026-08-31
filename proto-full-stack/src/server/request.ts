import type { NextRequest } from 'next/server'

export function getForwardedOrigin(request: NextRequest) {
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const host = forwardedHost || request.headers.get('host') || request.nextUrl.host
  const protocol = forwardedProto || request.nextUrl.protocol.replace(':', '')
  return `${protocol}://${host}`
}

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    const requestOrigins = new Set([request.nextUrl.origin, getForwardedOrigin(request)])
    return requestOrigins.has(new URL(origin).origin)
  } catch {
    return false
  }
}

export function isSecureRequest(request: NextRequest) {
  return request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() === 'https'
}
