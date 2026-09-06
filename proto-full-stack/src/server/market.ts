import { getDatabase } from './database'
import { findActor, type ActorKind } from './actors'
import { demoProfiles } from './demoProfiles'
import { HttpError, requiredText } from './http'
import { products, productWebserviceCatalog, buildPricedProduct } from '../shared'
import type { SessionUser } from './auth'

export const defaultSchedule = { days: ['mon','tue','wed','thu','fri','sat'], opening: '04:00', closing: '13:00' }
export const defaultVacation = { start: '', end: '', description: '', substitute: null }
export function publicationProduct(row: any) {
  const definition = productWebserviceCatalog.find((entry) => entry.id === row.species_id)
  if (!definition) return null
  return { ...buildPricedProduct({ definition, baseProduct: { id: Number(row.id) }, ...row.combination, price: Number(row.price).toFixed(2), photo: row.photo }), persisted: true, available: row.active, photo: row.photo ?? null, operators: [] }
}
export async function ownMarket(session: SessionUser) {
  const id = session.actorId!
  const profile = Object.values(demoProfiles).some(profile => profile.id === id && profile.role === session.role) ? demoProfiles[session.role as ActorKind] : await findActor(session.role as ActorKind, id)
  const items = (await getDatabase().query('SELECT * FROM publications WHERE actor_id=$1 ORDER BY species_id,id', [id])).rows.map(publicationProduct).filter(Boolean)
  const settings = (await getDatabase().query('SELECT schedule,vacation FROM market_settings WHERE actor_id=$1', [id])).rows[0]
  return { profile, items, schedule: settings?.schedule ?? defaultSchedule, vacation: settings?.vacation ?? defaultVacation }
}
export async function savePublication(session: SessionUser, data: any) {
  const speciesId = Number(data.sourceProductId)
  const definition = productWebserviceCatalog.find((entry) => entry.id === speciesId)
  if (!definition) throw new HttpError(400, 'Seleccioná una especie del catálogo.')
  const combination = data.combination
  if (!combination || typeof combination !== 'object') throw new HttpError(400, 'Completá la combinación comercial.')
  const checks: Record<string,string[]> = { variety: definition.varieties, presentation: definition.presentations, unit: definition.units.map(x=>x.code), calibre: definition.calibres.map(x=>x.code), category: definition.categories.map(x=>x.code) }
  const clean: Record<string,string> = {}
  for (const [key, values] of Object.entries(checks)) {
    if (!values.includes(combination[key])) throw new HttpError(400, `El valor de ${key} no pertenece a la especie.`)
    clean[key] = combination[key]
  }
  const price = typeof data.price === 'string' ? Number(data.price.replace(/^\$/, '')) : Number(data.price)
  if (!Number.isFinite(price) || price <= 0 || price > 9_999_999_999.99 || Math.abs(price*100-Math.round(price*100)) > 0.0001) throw new HttpError(400, 'Ingresá un precio positivo con hasta dos decimales.')
  const photo = data.photo !== undefined ? data.photo : data.image ?? null
  if (photo && (typeof photo !== 'string' || photo.length > 2_800_000 || !/^(https:\/\/|data:image\/(png|jpeg|webp);base64,)/.test(photo))) throw new HttpError(400, 'La foto debe ser JPG, PNG o WebP de hasta 2 MB.')
  const active = data.available ?? true
  if (typeof active !== 'boolean') throw new HttpError(400, 'Disponibilidad inválida.')
  let result
  if (data.id !== undefined) {
    if (!Number.isSafeInteger(Number(data.id)) || Number(data.id)<1) throw new HttpError(400,'Publicación inválida.')
    result = await getDatabase().query(`UPDATE publications SET species_id=$1,combination=$2,price=$3,photo=$4,active=$7,updated_at=now() WHERE id=$5 AND actor_id=$6 RETURNING *`, [speciesId,clean,price,photo,data.id,session.actorId,active])
    if (!result.rowCount) throw new HttpError(404, 'La publicación no existe en tu mercado.')
  } else result = await getDatabase().query('INSERT INTO publications(actor_id,role,species_id,combination,price,photo,active) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *', [session.actorId,session.role,speciesId,clean,price,photo,active])
  return publicationProduct(result.rows[0])
}
export async function saveSettings(session: SessionUser, data: any) {
  const client = await getDatabase().connect()
  try {
    await client.query('BEGIN')
    await client.query('INSERT INTO market_settings(actor_id) VALUES($1) ON CONFLICT DO NOTHING', [session.actorId])
    if (data.schedule) {
      const { days, opening, closing } = data.schedule
      if (!Array.isArray(days) || !days.length || !days.every(x=>['mon','tue','wed','thu','fri','sat','sun'].includes(x)) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(opening) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(closing) || opening>=closing) throw new HttpError(400, 'Seleccioná días y un horario de apertura anterior al cierre.')
      await client.query('UPDATE market_settings SET schedule=$1 WHERE actor_id=$2', [{ days:[...new Set(days)],opening,closing },session.actorId])
    }
    if (data.vacation) {
      if(session.role !== 'operator') throw new HttpError(403,'Las vacaciones corresponden a operadores.')
      const { start,end,description,substitute }=data.vacation
      const validDate=(x: unknown)=>typeof x==='string' && /^\d{4}-\d{2}-\d{2}$/.test(x) && !Number.isNaN(Date.parse(x)) && new Date(x).toISOString().slice(0,10)===x
      if (!(start===''&&end==='') && (!validDate(start)||!validDate(end)||end<start)) throw new HttpError(400,'Revisá las fechas de vacaciones.')
      let replacement = null
      if(substitute?.id) {
        if(substitute.id===session.actorId) throw new HttpError(400,'Elegí otro operador como reemplazo.')
        const found=await findActor('operator',substitute.id)
        if(!found?.active) throw new HttpError(400,'El reemplazo no está activo.')
        replacement={id:found.id,name:found.name,place:found.place}
      }
      const vacation={start,end,description:start?requiredText(description,'Descripción',2000):'',substitute:replacement}
      await client.query('UPDATE market_settings SET vacation=$1 WHERE actor_id=$2',[vacation,session.actorId])
    }
    await client.query('COMMIT')
    return { saved:true }
  } catch(error){await client.query('ROLLBACK');throw error} finally{client.release()}
}
export async function marketSnapshot() {
  const db=getDatabase()
  const [actorRows,pubRows,smartRows,priceRows,demoSettings]=await Promise.all([
    db.query(`SELECT a.id::text,a.name,a.whatsapp,a.nave || ' · Puesto ' || a.puesto AS place,'operator' AS role,s.schedule,s.vacation FROM operators a LEFT JOIN market_settings s ON s.actor_id=a.id::text WHERE a.active
      UNION ALL SELECT a.id::text,a.name,a.whatsapp,a.address AS place,'producer' AS role,s.schedule,s.vacation FROM producers a LEFT JOIN market_settings s ON s.actor_id=a.id::text WHERE a.active`),
    db.query('SELECT * FROM publications WHERE active=true ORDER BY species_id,id'),
    db.query('SELECT id,species_id,description FROM smart_recommendations ORDER BY id'),
    db.query('SELECT species_id,price FROM recommended_prices'),
    db.query('SELECT actor_id,schedule,vacation FROM market_settings WHERE actor_id = ANY($1::text[])', [Object.values(demoProfiles).map(profile => profile.id)])])
  const actors=actorRows.rows
  for (const role of ['operator','producer']) if(pubRows.rows.some(x=>x.actor_id===demoProfiles[role as ActorKind].id)) actors.push({...demoProfiles[role as ActorKind], ...demoSettings.rows.find(x=>x.actor_id===demoProfiles[role as ActorKind].id)})
  const today=new Date().toLocaleDateString('en-CA',{timeZone:'America/Montevideo'})
  const directories=actors.map(actor=>{
    const items=pubRows.rows.filter(row=>row.actor_id===actor.id).map(publicationProduct).filter(Boolean)
    return {...actor,persisted:true,publishedProducts:items,productCount:new Set(items.map(item=>item.sourceProductId)).size,product:items[0]??null,available:!(actor.vacation?.start && actor.vacation.start<=today && actor.vacation.end>=today)}
  })
  const board=(role:string)=>products.map(product=>{
    const offers=directories.filter(actor=>actor.role===role && actor.available).flatMap(actor=>{
      const publications=actor.publishedProducts.filter(item=>item.sourceProductId===product.id)
      if(!publications.length)return []
      const options=publications.map(item=>({...item.combination,key:String(item.id),price:item.price,numericPrice:Number(item.price.slice(1)),photo:item.photo,publicationId:item.id}))
      return [{...actor,price:options[0].price,priceOptions:options}]
    })
    if(!offers.length)return null
    const prices=offers.flatMap(actor=>actor.priceOptions.map(x=>x.numericPrice))
    return {...product,persisted:true,operators:offers,sellers:offers.length,price:`$${Math.min(...prices).toFixed(2)}`,recommendedPrice:priceRows.rows.find(x=>x.species_id===product.id)?.price??null}
  }).filter(Boolean)
  const publicBoard=board('operator')
  return {operators:directories.filter(x=>x.role==='operator'),producers:directories.filter(x=>x.role==='producer'),products:publicBoard,producerProducts:board('producer'),smartItems:smartRows.rows.map(row=>({id:Number(row.id),description:row.description,product:{...(publicBoard.find(p=>p.id===row.species_id)??{...products.find(p=>p.id===row.species_id),price:'Sin publicaciones',persisted:true,operators:[]}),price:priceRows.rows.find(x=>x.species_id===row.species_id)?`$${Number(priceRows.rows.find(x=>x.species_id===row.species_id).price).toFixed(2)}`:(publicBoard.find(p=>p.id===row.species_id)?.price??'Sin publicaciones'),recommendedPrice:priceRows.rows.find(x=>x.species_id===row.species_id)?.price??null}}))}
}
