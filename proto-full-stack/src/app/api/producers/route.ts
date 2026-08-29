import { NextRequest, NextResponse } from 'next/server'
import { listActors, saveActor } from '../../../server/prototypeStore'

export function GET() {
  return NextResponse.json({ items: listActors('producer') })
}

export async function POST(request: NextRequest) {
  return NextResponse.json(saveActor('producer', await request.json()), { status: 201 })
}
