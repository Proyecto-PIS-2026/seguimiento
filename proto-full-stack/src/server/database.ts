import { Pool } from 'pg'

const databaseGlobal = globalThis as typeof globalThis & { operatorPool?: Pool }

export function getDatabase() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL no está configurada.')
  if (!databaseGlobal.operatorPool) {
    databaseGlobal.operatorPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    })
    databaseGlobal.operatorPool.on('error', () => console.error('Se perdió una conexión inactiva a PostgreSQL.'))
  }
  return databaseGlobal.operatorPool
}
