import { NextRequest } from 'next/server'
import { saveActor, deleteActor } from '../../../../server/actors'
import { respond, requireSession, jsonBody, assertOrigin } from '../../../../server/http'
type Context = { params: Promise<{ id: string }> }
export async function PATCH(request: NextRequest, context: Context) { return respond(async () => { await requireSession(['admin']); return saveActor('operator', await jsonBody(request), (await context.params).id) }) }
export async function DELETE(request: NextRequest, context: Context) { return respond(async () => { await requireSession(['admin']); assertOrigin(request); return deleteActor('operator', (await context.params).id) }) }
