export class ApiError extends Error { constructor(message: string, public status: number) { super(message) } }
export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/${path}`, { ...options, credentials: 'include', cache: 'no-store', headers: { 'Content-Type':'application/json', ...options.headers } })
  const result = await response.json().catch(()=>null)
  if(!response.ok) throw new ApiError(result?.error ?? 'No se pudo completar la operación.',response.status)
  return result as T
}
export async function saveActorRecord(kind: 'operator'|'producer', actor: Record<string,unknown>) {
  const path=kind==='operator'?'operators':'producers'
  return api(`${path}${actor.id?`/${actor.id}`:''}`,{method:actor.id?'PATCH':'POST',body:JSON.stringify(actor)})
}
export async function listOperatorRecords(signal?:AbortSignal){return (await api('operators',{signal})).items}
