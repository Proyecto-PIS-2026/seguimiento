import { NextRequest, NextResponse } from 'next/server'
import { listActors, saveActor } from '../../../server/prototypeStore'

export function GET() {
  return NextResponse.json({ items: listActors('operator') })
}

export async function POST(request: NextRequest) {
  return NextResponse.json(saveActor('operator', await request.json()), { status: 201 })
}
