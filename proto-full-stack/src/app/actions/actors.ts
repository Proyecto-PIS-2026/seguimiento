'use server'

import { saveActor } from '../../server/prototypeStore'

type ActorKind = 'operator' | 'producer'

export async function saveActorAction<T extends Record<string, unknown>>(kind: ActorKind, actor: T): Promise<T> {
  return saveActor(kind, actor) as T
}
