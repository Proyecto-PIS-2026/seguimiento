import { NextRequest } from 'next/server'
import { ownMarket, savePublication, saveSettings } from '../../../../server/market'
import { respond,requireSession,jsonBody,assertOrigin,HttpError } from '../../../../server/http'
import { getDatabase } from '../../../../server/database'
export async function GET(){return respond(async()=>ownMarket(await requireSession(['operator','producer'])))}
export async function POST(request:NextRequest){return respond(async()=>savePublication(await requireSession(['operator','producer']),await jsonBody(request)),201)}
export async function PATCH(request:NextRequest){return respond(async()=>saveSettings(await requireSession(['operator','producer']),await jsonBody(request)))}
export async function DELETE(request:NextRequest){
  return respond(async()=>{
    const session=await requireSession(['operator','producer'])
    assertOrigin(request)
    const params=request.nextUrl.searchParams
    if(params.has('id')===params.has('speciesId'))throw new HttpError(400,'Indicá una publicación o una especie.')
    const bySpecies=params.has('speciesId')
    const id=Number(params.get(bySpecies?'speciesId':'id'))
    if(!Number.isSafeInteger(id)||id<1)throw new HttpError(400,'Publicación inválida.')
    const result=await getDatabase().publications.deleteMany({ where: { actor_id: session.actorId!, ...(bySpecies ? { species_id: id } : { id: BigInt(id) }) } })
    if(!result.count)throw new HttpError(404,'La publicación no existe en tu mercado.')
    return {deleted:true,count:result.count}
  })
}
