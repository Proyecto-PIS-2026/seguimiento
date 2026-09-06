import { loadEnvFile } from 'node:process'
import { existsSync } from 'node:fs'
import { defineConfig } from 'prisma/config'

if (existsSync('.env.local')) loadEnvFile('.env.local')

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations', seed: 'tsx --env-file=.env.local scripts/seed-demo.ts' },
  datasource: { url: process.env.DATABASE_URL },
})
