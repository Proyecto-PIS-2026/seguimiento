import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const databaseGlobal = globalThis as typeof globalThis & { prisma?: PrismaClient }

export function getDatabase() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL no está configurada.')
  if (!databaseGlobal.prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    })
    databaseGlobal.prisma = new PrismaClient({ adapter })
  }
  return databaseGlobal.prisma
}
