import { getDatabase } from './database'
import { hashPassword } from './passwords'
import { HttpError, requiredText, uuid } from './http'

export type ActorKind = 'operator' | 'producer'
const table = (kind: ActorKind) => kind === 'operator' ? 'operators' : 'producers'
const columns = (kind: ActorKind) => `a.id, a.name, a.email, a.responsible, a.whatsapp, a.legal_name AS "legalName", a.address, a.active,
  ${kind === 'operator' ? "a.nave, a.puesto, a.nave || ' · Puesto ' || a.puesto" : 'a.address'} AS place,
  EXISTS(SELECT 1 FROM actor_credentials c WHERE c.actor_id = a.id) AS "hasPassword"`

export async function listActors(kind: ActorKind) {
  return (await getDatabase().query(`SELECT ${columns(kind)} FROM ${table(kind)} a ORDER BY a.created_at, a.id`)).rows
}
export async function findActor(kind: ActorKind, id: string) {
  return (await getDatabase().query(`SELECT ${columns(kind)} FROM ${table(kind)} a WHERE a.id = $1`, [uuid(id)])).rows[0]
}
export async function saveActor(kind: ActorKind, data: Record<string, unknown>, id?: string) {
  const fields = ['name', 'email', 'responsible', 'whatsapp', 'legalName', 'address']
  const labels = ['Nombre', 'Email', 'Persona responsable', 'WhatsApp', 'Razón social', 'Dirección']
  const values: unknown[] = fields.map((field, i) => requiredText(data[field], labels[i]))
  values[1] = String(values[1]).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values[1]))) throw new HttpError(400, 'El email no es válido.')
  if (typeof data.active !== 'boolean') throw new HttpError(400, 'Estado inválido.')
  values.push(data.active)
  const names = ['name', 'email', 'responsible', 'whatsapp', 'legal_name', 'address', 'active']
  if (kind === 'operator') {
    const nave = requiredText(data.nave, 'Nave')
    if (!['Nave 1', 'Nave 2', 'Nave 3', 'Nave 4'].includes(nave)) throw new HttpError(400, 'Nave inválida.')
    names.push('nave', 'puesto'); values.push(nave, requiredText(data.puesto, 'Puesto'))
  }
  const password = data.password
  if ((!id || password) && (typeof password !== 'string' || password.length < 8 || password.length > 128)) throw new HttpError(400, 'La contraseña debe tener entre 8 y 128 caracteres.')
  const passwordHash = password ? await hashPassword(password as string) : null
  const client = await getDatabase().connect()
  try {
    await client.query('BEGIN')
    // Serialize account changes to keep emails unique across operators and producers.
    await client.query('SELECT pg_advisory_xact_lock(781245)')
    const conflict = await client.query(`SELECT id FROM operators WHERE lower(email)=$1 AND id::text<>$2 UNION ALL SELECT id FROM producers WHERE lower(email)=$1 AND id::text<>$2`, [values[1], id ?? ''])
    if (conflict.rowCount) throw new HttpError(409, 'Ya existe una cuenta con ese email.')
    let savedId: string
    if (id) {
      uuid(id)
      const result = await client.query(`UPDATE ${table(kind)} SET ${names.map((name, index) => `${name}=$${index + 1}`).join(',')} WHERE id=$${values.length + 1} RETURNING id`, [...values, id])
      if (!result.rowCount) throw new HttpError(404, 'El registro ya no existe.')
      savedId = id
    } else {
      savedId = (await client.query(`INSERT INTO ${table(kind)} (${names.join(',')}) VALUES (${values.map((_, i) => `$${i + 1}`).join(',')}) RETURNING id`, values)).rows[0].id
    }
    if (passwordHash) {
      await client.query(`INSERT INTO actor_credentials(actor_id,role,email,password_hash) VALUES ($1,$2,$3,$4) ON CONFLICT(actor_id) DO UPDATE SET email=EXCLUDED.email,password_hash=EXCLUDED.password_hash`, [savedId, kind, values[1], passwordHash])
    } else await client.query('UPDATE actor_credentials SET email=$1 WHERE actor_id=$2', [values[1], savedId])
    if (passwordHash || data.active === false) await client.query('DELETE FROM sessions WHERE actor_id=$1', [savedId])
    await client.query('COMMIT')
    return findActor(kind, savedId)
  } catch (error) { await client.query('ROLLBACK'); throw error }
  finally { client.release() }
}
export async function deleteActor(kind: ActorKind, id: string) {
  uuid(id)
  const client = await getDatabase().connect()
  try {
    await client.query('BEGIN')
    const deleted = await client.query(`DELETE FROM ${table(kind)} WHERE id=$1`, [id])
    if (!deleted.rowCount) throw new HttpError(404, 'El registro ya no existe.')
    for (const name of ['actor_credentials','sessions','publications','market_settings']) await client.query(`DELETE FROM ${name} WHERE actor_id=$1`, [id])
    await client.query('COMMIT')
    return { deleted: true }
  } catch (error) { await client.query('ROLLBACK'); throw error }
  finally { client.release() }
}
