import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { getDatabase } from '../src/server/database'

const base=process.env.TEST_BASE_URL??'http://localhost:3002'
const database=getDatabase()
function client(){
  let cookie=''
  return async(path:string,method='GET',body?:unknown)=>{
    const response=await fetch(`${base}/api/${path}`,{method,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:body===undefined?undefined:JSON.stringify(body)})
    const setCookie=response.headers.get('set-cookie');if(setCookie)cookie=setCookie.split(';')[0]
    return {status:response.status,data:await response.json()}
  }
}

test('cuentas, aislamiento, publicaciones, vacaciones, recomendaciones y recuperación',async()=>{
  const admin=client(),operator=client(),other=client(),producer=client(),anonymous=client()
  const tag=randomUUID()
  const email=`test-${tag}@example.test`
  const password=`Test-${tag}`
  const actors:Array<{kind:string;id:string}>=[]
  let smartId:number|undefined
  let speciesId:number|undefined
  let previousPrice:any
  const input={name:`Prueba ${tag}`,nave:'Nave 1',puesto:'TEST',email,responsible:'Prueba',whatsapp:'099123456',legalName:'Prueba SRL',address:'UAM',active:true,password}
  try{
    assert.equal((await anonymous('health')).data.database,'ok')
    assert.equal((await anonymous('operators','POST',input)).status,401)
    assert.equal((await admin('auth/session','POST',{username:'admin',password:'admin'})).status,200)
    assert.equal((await admin('operators','POST',{...input,password:'short'})).status,400)
    const concurrent = await Promise.all(['operators','producers'].map(async kind => ({
      kind, result: await admin(kind,'POST',{...input,email:`race-${tag}@example.test`}),
    })))
    for (const {kind,result} of concurrent) if (result.status===201) actors.push({kind,id:result.data.id})
    assert.deepEqual(concurrent.map(x=>x.result.status).sort(),[201,409])
    const created=await admin('operators','POST',input);assert.equal(created.status,201);actors.push({kind:'operators',id:created.data.id})
    assert.ok(created.data.hasPassword);assert.equal(created.data.password,undefined);assert.equal(created.data.password_hash,undefined)
    assert.equal((await admin('operators','POST',input)).status,409)
    assert.equal((await admin('producers','POST',{...input,email:email.toUpperCase()})).status,409)
    const stored=await database.actor_credentials.findUniqueOrThrow({where:{actor_id:created.data.id}})
    assert.ok(stored.password_hash.startsWith('scrypt:'));assert.notEqual(stored.password_hash,password)
    assert.equal((await operator('auth/session','POST',{username:email.toUpperCase(),password})).status,200)
    const own=await operator('market/mine');assert.equal(own.data.profile.id,created.data.id);assert.equal(own.data.items.length,0)
    assert.equal((await operator('operators')).status,403)
    const updated=await admin(`operators/${created.data.id}`,'PATCH',{...input,password:undefined,name:'Operador editado'});assert.equal(updated.status,200)
    assert.equal((await operator('market/mine')).data.profile.name,'Operador editado')
    const second=await admin('operators','POST',{...input,email:`other-${tag}@example.test`});actors.push({kind:'operators',id:second.data.id})
    assert.equal((await other('auth/session','POST',{username:second.data.email,password})).status,200)
    const photo='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII='
    const pub={sourceProductId:1,combination:{variety:'Fuji',unit:'KG',presentation:'Granel',calibre:'M',category:'I'},price:'$12.34',photo}
    assert.equal((await operator('market/mine','POST',{...pub,price:'Sin precio'})).status,400)
    const published=await operator('market/mine','POST',pub);assert.equal(published.status,201);assert.equal(published.data.price,'$12.34');assert.equal(published.data.photo,photo)
    assert.equal((await operator('market/mine','POST',pub)).status,409)
    assert.equal((await other('market/mine','POST',{...pub,id:published.data.id,price:'$20.15'})).status,404)
    assert.equal((await other(`market/mine?id=${published.data.id}`,'DELETE')).status,404)
    assert.equal((await operator('market/mine','POST',{...pub,id:published.data.id,price:'$20.15'})).status,201)
    assert.equal((await operator('market/mine')).data.items[0].price,'$20.15')
    const publicMarket=(await anonymous('market')).data
    assert.ok(publicMarket.products.find((p:any)=>p.id===1).operators.some((x:any)=>x.id===created.data.id))
    assert.equal(publicMarket.operators.find((x:any)=>x.id===created.data.id).email,undefined)
    assert.equal((await operator('market/mine','POST',{...pub,id:published.data.id,available:false})).status,201)
    assert.equal((await operator('market/mine')).data.items[0].available,false)
    assert.ok(!(await anonymous('market')).data.products.some((p:any)=>p.operators.some((x:any)=>x.id===created.data.id)))
    assert.equal((await operator('market/mine','POST',{...pub,id:published.data.id,available:true})).status,201)
    assert.equal((await operator('market/mine','PATCH',{schedule:{days:['mon'],opening:'15:00',closing:'10:00'}})).status,400)
    assert.equal((await operator('market/mine','PATCH',{schedule:{days:['mon'],opening:'05:00',closing:'11:00'}})).status,200)
    assert.equal((await operator('market/mine')).data.schedule.opening,'05:00')
    assert.equal((await operator('market/mine','PATCH',{schedule:{days:['tue'],opening:'06:00',closing:'12:00'},vacation:{start:'invalid',end:'invalid',description:'Prueba'}})).status,400)
    assert.equal((await operator('market/mine')).data.schedule.opening,'05:00')
    assert.equal((await operator('market/mine','PATCH',{vacation:{start:'2026-10-10',end:'2026-10-01',description:'Prueba',substitute:null}})).status,400)
    assert.equal((await operator('market/mine','PATCH',{vacation:{start:'2099-10-01',end:'2099-10-10',description:'Prueba',substitute:{id:second.data.id}}})).status,200)
    assert.equal((await operator('market/mine')).data.vacation.substitute.id,second.data.id)
    const prod=await admin('producers','POST',{...input,email:`producer-${tag}@example.test`});assert.equal(prod.status,201);actors.push({kind:'producers',id:prod.data.id})
    assert.equal((await producer('auth/session','POST',{username:prod.data.email,password})).status,200)
    assert.equal((await producer('market/mine','POST',pub)).status,201)
    assert.ok((await anonymous('market')).data.producerProducts.find((p:any)=>p.id===1).operators.some((x:any)=>x.id===prod.data.id))
    const used=new Set((await anonymous('market')).data.smartItems.map((x:any)=>x.product.id))
    speciesId=Array.from({length:20},(_,i)=>i+1).find(id=>!used.has(id))
    if(speciesId){
      previousPrice=await database.recommended_prices.findUnique({where:{species_id:speciesId}})
      const smart=await admin('admin/smart','POST',{product:{id:speciesId},description:'Prueba de recomendación'});assert.equal(smart.status,200);smartId=smart.data.id
      assert.equal((await admin('admin/prices','POST',{rows:[{speciesId,price:42.75}]})).status,200)
      const savedSmart=(await anonymous('market')).data.smartItems.find((x:any)=>x.id===smartId);assert.equal(savedSmart.product.price,'$42.75')
    }
    assert.equal((await anonymous('recovery','POST',{name:'Prueba',email,problem:'No puedo ingresar'})).status,201)
    const recovery=(await admin('recovery')).data.items.find((x:any)=>x.email===email);assert.ok(recovery)
    assert.equal((await admin('recovery','PATCH',{id:recovery.id})).status,200)
    assert.equal((await admin('recovery')).data.items.find((x:any)=>x.id===recovery.id).status,'Resuelta')
    assert.equal((await admin(`operators/${created.data.id}`,'PATCH',{...input,password:undefined,active:false})).status,200)
    assert.equal((await operator('market/mine')).status,401)
    assert.equal((await operator('auth/session','POST',{username:email,password})).status,401)
    const newPassword=password+'-new'
    assert.equal((await admin(`operators/${created.data.id}`,'PATCH',{...input,password:newPassword})).status,200)
    assert.equal((await operator('auth/session','POST',{username:email,password})).status,401)
    assert.equal((await operator('auth/session','POST',{username:email,password:newPassword})).status,200)
    assert.equal((await operator('market/mine','POST',{...pub,combination:{...pub.combination,variety:'Granny Smith'}})).status,201)
    assert.equal((await other('market/mine','POST',pub)).status,201)
    assert.equal((await operator('market/mine?id=1&speciesId=1','DELETE')).status,400)
    assert.equal((await operator(`market/mine?id=${published.data.id}`,'DELETE')).status,200)
    assert.equal((await operator('market/mine')).data.items.length,1)
    assert.equal((await operator('market/mine?speciesId=1','DELETE')).status,200)
    assert.equal((await other('market/mine')).data.items.length,1)

    assert.equal((await operator('market/mine')).data.items.length,0)
  }finally{
    for(const actor of actors)assert.equal((await admin(`${actor.kind}/${actor.id}`,'DELETE')).status,200)
    if(smartId)await admin(`admin/smart?id=${smartId}`,'DELETE')
    await database.recovery_requests.deleteMany({where:{email}})
    if(speciesId){if(previousPrice)await database.recommended_prices.update({where:{species_id:speciesId},data:{price:previousPrice.price,updated_at:previousPrice.updated_at}});else await database.recommended_prices.deleteMany({where:{species_id:speciesId}})}
    await database.$disconnect()
  }
})
