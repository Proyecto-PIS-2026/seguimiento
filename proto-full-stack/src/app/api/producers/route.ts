import { NextRequest } from 'next/server'
import { listActors, saveActor } from '../../../server/actors'
import { respond, requireSession, jsonBody } from '../../../server/http'
export async function GET() { return respond(async () => { await requireSession(['admin']); return { items: await listActors('producer') } }) }
export async function POST(request: NextRequest) { return respond(async () => { await requireSession(['admin']); return saveActor('producer', await jsonBody(request)) }, 201) }
