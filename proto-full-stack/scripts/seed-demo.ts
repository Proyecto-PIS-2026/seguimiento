import { Pool } from 'pg'
import { getActorProductPriceOptions, products } from '../src/shared'
import { demoProfiles } from '../src/server/demoProfiles'

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('Configurá DATABASE_URL antes de cargar los ejemplos.')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const client = await pool.connect()
  const seedName = 'operator-original-market-v1'
  try {
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(781246)')
    const applied = await client.query('SELECT name FROM prototype_seeds WHERE name=$1', [seedName])
    if (applied.rowCount) {
      await client.query('COMMIT')
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
        const result = await client.query(
          `INSERT INTO publications(actor_id,role,species_id,combination,price,photo,active)
           VALUES($1,'operator',$2,$3,$4,$5,true)
           ON CONFLICT(actor_id,species_id,combination) DO NOTHING`,
          [profile.id, product.id, combination, price, option.photo],
        )
        inserted += result.rowCount ?? 0
      }
    }
    await client.query('INSERT INTO market_settings(actor_id) VALUES($1) ON CONFLICT DO NOTHING', [profile.id])
    await client.query('INSERT INTO prototype_seeds(name) VALUES($1)', [seedName])
    await client.query('COMMIT')
    console.log(`Restauradas ${inserted} combinaciones de ${products.length} especies para operador/operador (${profile.name}).`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1 })
