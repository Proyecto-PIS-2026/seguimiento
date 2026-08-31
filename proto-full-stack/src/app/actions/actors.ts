'use server'

import { saveActor } from '../../server/prototypeStore'
import { getSessionRole } from '../../server/auth'

type ActorKind = 'operator' | 'producer'

export async function saveActorAction<T extends Record<string, unknown>>(kind: ActorKind, actor: T): Promise<T> {
  if (await getSessionRole() !== 'admin') throw new Error('Acceso no autorizado.')
  return saveActor(kind, actor) as unknown as T
}
