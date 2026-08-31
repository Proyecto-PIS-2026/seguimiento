import { NextRequest, NextResponse } from 'next/server'
import { listActors, saveActor } from '../../../server/prototypeStore'
import { getSessionRole } from '../../../server/auth'

export async function GET() {
  const role = await getSessionRole()
  if (role !== 'operator' && role !== 'admin') return NextResponse.json({ error: 'Acceso no autorizado.' }, { status: role ? 403 : 401 })
  return NextResponse.json({ items: listActors('producer') })
}

export async function POST(request: NextRequest) {
  const role = await getSessionRole()
  if (role !== 'admin') return NextResponse.json({ error: 'Acceso no autorizado.' }, { status: role ? 403 : 401 })
  return NextResponse.json(saveActor('producer', await request.json()), { status: 201 })
}
