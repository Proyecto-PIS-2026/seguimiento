import { getDatabase } from '../src/server/database'
import { getActorProductPriceOptions, products } from '../src/shared'
import { demoProfiles } from '../src/server/demoProfiles'

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('Configurá DATABASE_URL antes de cargar los ejemplos.')
  const database = getDatabase()
  const seedName = 'operator-original-market-v1'
  try {
    await database.$transaction(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(781246)`
      const applied = await tx.prototype_seeds.findUnique({ where: { name: seedName } })
      if (applied) {
        console.log('Los ejemplos de operador/operador ya fueron cargados. Se conservan las ediciones y eliminaciones posteriores.')
        return
      }

      const profile = demoProfiles.operator
      let inserted = 0
      for (const [index, product] of products.entries()) {
        const publishedActor = product.operators.find(actor => actor.name === profile.name) ?? profile
        const options = getActorProductPriceOptions(product, publishedActor, index)
        for (const option of options) {
          const { variety, unit, presentation, calibre, category } = option
          const combination = { variety, unit, presentation, calibre, category }
          const price = Number(option.price.replace(/^\$/, ''))
          const result = await tx.publications.createMany({
            data: [{ actor_id: profile.id, role: 'operator', species_id: product.id, combination, price, photo: option.photo, active: true }],
            skipDuplicates: true,
          })
          inserted += result.count
        }
      }
      await tx.market_settings.upsert({ where: { actor_id: profile.id }, create: { actor_id: profile.id }, update: {} })
      await tx.prototype_seeds.create({ data: { name: seedName } })
      console.log(`Restauradas ${inserted} combinaciones de ${products.length} especies para operador/operador (${profile.name}).`)
    }, { timeout: 60000 })
  } finally {
    await database.$disconnect()
  }
}

main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1 })
