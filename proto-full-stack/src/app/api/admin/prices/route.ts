import { NextRequest } from 'next/server'
import { respond,requireSession,jsonBody,HttpError } from '../../../../server/http'
import { getDatabase } from '../../../../server/database'
import { products } from '../../../../shared'
export async function GET(){return respond(async()=>{await requireSession(['admin']);return {items:(await getDatabase().recommended_prices.findMany({ orderBy: { species_id: 'asc' } })).map(row => ({ speciesId: row.species_id, price: row.price.toFixed(2) }))}})}
export async function POST(request:NextRequest){return respond(async()=>{
  await requireSession(['admin'])
  const data=await jsonBody(request)
  if(!Array.isArray(data.rows)||!data.rows.length||data.rows.length>1000)throw new HttpError(400,'La planilla debe contener entre 1 y 1000 filas.')
  const seen=new Set<number>()
  const rows=data.rows.map((row:any)=>{
    const speciesId=Number(row.speciesId),price=Number(row.price)
    if(!products.some(p=>p.id===speciesId)||seen.has(speciesId))throw new HttpError(400,'La planilla contiene especies inválidas o repetidas.')
    if(!Number.isFinite(price)||price<=0||price>9_999_999_999.99||Math.abs(price*100-Math.round(price*100))>0.0001)throw new HttpError(400,'Los precios deben ser positivos y tener hasta dos decimales.')
    seen.add(speciesId);return {speciesId,price}
  })
  await getDatabase().$transaction(rows.map((row: { speciesId: number; price: number }) => getDatabase().recommended_prices.upsert({
    where: { species_id: row.speciesId },
    create: { species_id: row.speciesId, price: row.price },
    update: { price: row.price, updated_at: new Date() },
  })))
  return {updated:rows.length}
})
}
