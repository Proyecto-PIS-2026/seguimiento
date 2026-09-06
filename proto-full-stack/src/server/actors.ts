import { getDatabase } from './database'
import { hashPassword } from './passwords'
import { HttpError, requiredText, uuid } from './http'
import type { operators, producers } from '../generated/prisma/client'

export type ActorKind = 'operator' | 'producer'
function actorView(actor: operators | producers, hasPassword: boolean) {
  const { legal_name, created_at: _createdAt, ...fields } = actor
  return { ...fields, legalName: legal_name, place: 'nave' in actor ? `${actor.nave} · Puesto ${actor.puesto}` : actor.address, hasPassword }
}
export async function listActors(kind: ActorKind) {
  const db = getDatabase()
  const orderBy = [{ created_at: 'asc' as const }, { id: 'asc' as const }]
  const actors = kind === 'operator' ? await db.operators.findMany({ orderBy }) : await db.producers.findMany({ orderBy })
  const credentials = await db.actor_credentials.findMany({ where: { actor_id: { in: actors.map(a => a.id) } }, select: { actor_id: true } })
  const ids = new Set(credentials.map(c => c.actor_id))
  return actors.map(actor => actorView(actor, ids.has(actor.id)))
}
export async function findActor(kind: ActorKind, id: string) {
  const db = getDatabase()
  const where = { id: uuid(id) }
  const actor = kind === 'operator' ? await db.operators.findUnique({ where }) : await db.producers.findUnique({ where })
  if (!actor) return undefined
  return actorView(actor, !!await db.actor_credentials.findUnique({ where: { actor_id: id }, select: { actor_id: true } }))
}
export async function saveActor(kind: ActorKind, data: Record<string, unknown>, id?: string) {
  if (id) uuid(id)
  const email = requiredText(data.email, 'Email').toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'El email no es válido.')
  if (typeof data.active !== 'boolean') throw new HttpError(400, 'Estado inválido.')
  const values = {
    name: requiredText(data.name, 'Nombre'), email,
    responsible: requiredText(data.responsible, 'Persona responsable'),
    whatsapp: requiredText(data.whatsapp, 'WhatsApp'),
    legal_name: requiredText(data.legalName, 'Razón social'),
    address: requiredText(data.address, 'Dirección'), active: data.active,
  }
  const nave = kind === 'operator' ? requiredText(data.nave, 'Nave') : ''
  const puesto = kind === 'operator' ? requiredText(data.puesto, 'Puesto') : ''
  if (kind === 'operator' && !['Nave 1', 'Nave 2', 'Nave 3', 'Nave 4'].includes(nave)) throw new HttpError(400, 'Nave inválida.')
  const password = data.password
  if ((!id || password) && (typeof password !== 'string' || password.length < 8 || password.length > 128)) throw new HttpError(400, 'La contraseña debe tener entre 8 y 128 caracteres.')
  const passwordHash = password ? await hashPassword(password as string) : null
  const savedId = await getDatabase().$transaction(async tx => {
    // PostgreSQL lock preserves email uniqueness across the two actor tables.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(781245)`
    const where = { email: { equals: email, mode: 'insensitive' as const }, ...(id ? { id: { not: id } } : {}) }
    if (await tx.operators.findFirst({ where }) || await tx.producers.findFirst({ where })) throw new HttpError(409, 'Ya existe una cuenta con ese email.')
    let saved: { id: string }
    if (id) {
      const updated = kind === 'operator'
        ? await tx.operators.updateMany({ where: { id }, data: { ...values, nave, puesto } })
        : await tx.producers.updateMany({ where: { id }, data: values })
      if (!updated.count) throw new HttpError(404, 'El registro ya no existe.')
      saved = { id }
    } else saved = kind === 'operator'
      ? await tx.operators.create({ data: { ...values, nave, puesto } })
      : await tx.producers.create({ data: values })
    if (passwordHash) await tx.actor_credentials.upsert({
      where: { actor_id: saved.id },
      create: { actor_id: saved.id, role: kind, email, password_hash: passwordHash },
      update: { email, password_hash: passwordHash },
    })
    else await tx.actor_credentials.updateMany({ where: { actor_id: saved.id }, data: { email } })
    if (passwordHash || !data.active) await tx.sessions.deleteMany({ where: { actor_id: saved.id } })
    return saved.id
  })
  return findActor(kind, savedId)
}
export async function deleteActor(kind: ActorKind, id: string) {
  uuid(id)
  return getDatabase().$transaction(async tx => {
    const deleted = kind === 'operator' ? await tx.operators.deleteMany({ where: { id } }) : await tx.producers.deleteMany({ where: { id } })
    if (!deleted.count) throw new HttpError(404, 'El registro ya no existe.')
    const where = { actor_id: id }
    await tx.actor_credentials.deleteMany({ where })
    await tx.sessions.deleteMany({ where })
    await tx.publications.deleteMany({ where })
    await tx.market_settings.deleteMany({ where })
    return { deleted: true }
  })
}
