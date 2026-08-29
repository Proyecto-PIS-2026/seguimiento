import { operatorDirectory, producerDirectory, products } from '../shared'

type ActorKind = 'operator' | 'producer'
type ActorRecord = Record<string, unknown> & { id?: string | number }

const records: Record<ActorKind, ActorRecord[]> = {
  operator: operatorDirectory.map((entry, index) => ({ ...entry, id: `operator-${index + 1}` })),
  producer: producerDirectory.map((entry, index) => ({ ...entry, id: `producer-${index + 1}` })),
}

export function listCatalog() {
  return products
}

export function listActors(kind: ActorKind) {
  return records[kind]
}

export function saveActor(kind: ActorKind, actor: ActorRecord) {
  const id = actor.id ?? `${kind}-${Date.now()}`
  const savedActor = { ...actor, id }
  const index = records[kind].findIndex((entry) => entry.id === id)
  if (index >= 0) records[kind][index] = savedActor
  else records[kind].push(savedActor)
  return savedActor
}
