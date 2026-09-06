import { NextRequest } from 'next/server'
import { respond,requireSession,jsonBody,HttpError } from '../../../../server/http'
import { getDatabase } from '../../../../server/database'
import { products } from '../../../../shared'
export async function GET(){return respond(async()=>{await requireSession(['admin']);return {items:(await getDatabase().query('SELECT species_id AS "speciesId",price FROM recommended_prices ORDER BY species_id')).rows}})}
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
  const client=await getDatabase().connect()
  try{await client.query('BEGIN');for(const row of rows)await client.query('INSERT INTO recommended_prices(species_id,price) VALUES($1,$2) ON CONFLICT(species_id) DO UPDATE SET price=EXCLUDED.price,updated_at=now()',[row.speciesId,row.price]);await client.query('COMMIT');return {updated:rows.length}}catch(error){await client.query('ROLLBACK');throw error}finally{client.release()}
})}
