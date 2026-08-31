type ActorKind = 'operator' | 'producer'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '')

export async function saveActorRecord<T extends Record<string, unknown>>(kind: ActorKind, actor: T): Promise<T> {
  const response = await fetch(`${apiBaseUrl ?? ''}/api/${kind === 'operator' ? 'operators' : 'producers'}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actor),
  })
  if (!response.ok) throw new Error(`No se pudo guardar el ${kind === 'operator' ? 'operador' : 'productor'}.`)
  return response.json() as Promise<T>
}
