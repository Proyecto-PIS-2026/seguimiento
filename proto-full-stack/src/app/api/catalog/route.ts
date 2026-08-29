import { NextResponse } from 'next/server'
import { listCatalog } from '../../../server/prototypeStore'

export function GET() {
  return NextResponse.json({ items: listCatalog() })
}
