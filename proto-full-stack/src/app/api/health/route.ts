import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ status: 'ok', application: 'mercado-hoy-proto-full-stack' })
}
