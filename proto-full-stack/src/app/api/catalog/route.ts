import { NextResponse } from 'next/server'
import { productWebserviceCatalog } from '../../../shared'

export function GET() {
  return NextResponse.json({ items: productWebserviceCatalog.map(({ product, ...definition }) => definition) })
}
