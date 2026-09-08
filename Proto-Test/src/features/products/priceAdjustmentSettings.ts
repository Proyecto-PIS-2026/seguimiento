import { useSyncExternalStore } from 'react'
import { normalizePrice } from './priceInput'

export const PRICE_ADJUSTMENT_KEY = 'proto-test:price-adjustment'
const changedEvent = 'proto-test:price-adjustment-changed'
const read = () => {
  try { return Number(normalizePrice(localStorage.getItem(PRICE_ADJUSTMENT_KEY) ?? '') ?? '10') }
  catch { return 10 }
}
const subscribe = (notify: () => void) => {
  const storage = (event: StorageEvent) => { if (!event.key || event.key === PRICE_ADJUSTMENT_KEY) notify() }
  window.addEventListener('storage', storage); window.addEventListener(changedEvent, notify)
  return () => { window.removeEventListener('storage', storage); window.removeEventListener(changedEvent, notify) }
}
export const usePriceAdjustment = () => useSyncExternalStore(subscribe, read, () => 10)
export function savePriceAdjustment(value: string) {
  const normalized = normalizePrice(value)
  if (!normalized) throw new Error('Ingresá un importe entero mayor a 0.')
  try { localStorage.setItem(PRICE_ADJUSTMENT_KEY, normalized) }
  catch { throw new Error('No pudimos guardar el ajuste en este navegador.') }
  window.dispatchEvent(new Event(changedEvent))
}
