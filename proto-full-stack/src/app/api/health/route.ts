import { respond } from '../../../server/http'
import { getDatabase } from '../../../server/database'
export async function GET(){return respond(async()=>{await getDatabase().$queryRaw`SELECT 1`;return {status:'ok',database:'ok',application:'mercado-hoy-proto-full-stack'}})}
