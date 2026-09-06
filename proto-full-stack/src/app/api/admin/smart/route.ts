import { NextRequest } from 'next/server'
import { respond,requireSession,jsonBody,requiredText,HttpError,assertOrigin } from '../../../../server/http'
import { getDatabase } from '../../../../server/database'
import { products } from '../../../../shared'

export async function POST(request:NextRequest){return respond(async()=>{
  await requireSession(['admin'])
  const data=await jsonBody(request)
  const speciesId=Number(data.product?.id)
  if(!products.some(p=>p.id===speciesId))throw new HttpError(400,'Especie inválida.')
  const description=requiredText(data.description,'Descripción',2000)
  const values={species_id:speciesId,description}
  let id: bigint
  if(data.id){
    if(!Number.isSafeInteger(Number(data.id))||Number(data.id)<1)throw new HttpError(400,'Identificador inválido.')
    id=BigInt(data.id)
    const result=await getDatabase().smart_recommendations.updateMany({where:{id},data:values})
    if(!result.count)throw new HttpError(404,'La recomendación no existe.')
  }else id=(await getDatabase().smart_recommendations.create({data:values})).id
  return {id:Number(id),product:products.find(p=>p.id===speciesId),description}
})}
export async function DELETE(request:NextRequest){return respond(async()=>{
  await requireSession(['admin']);assertOrigin(request)
  const id=Number(request.nextUrl.searchParams.get('id'))
  if(!Number.isSafeInteger(id)||id<1)throw new HttpError(400,'Identificador inválido.')
  await getDatabase().smart_recommendations.deleteMany({where:{id:BigInt(id)}})
  return {deleted:true}
})}
