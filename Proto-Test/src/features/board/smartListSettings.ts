import { useSyncExternalStore } from 'react'

export const DEFAULT_SMART_LIST_URL = 'https://uam.com.uy/wp-content/uploads/2026/09/MGAP_Lista_Inteligente_PDF.pdf'
export const SMART_LIST_STORAGE_KEY = 'proto-test:uam-smart-list-pdf'
const changedEvent = 'proto-test:smart-list-link-changed'

export function normalizeSmartListUrl(value: string): string | null {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' && !url.username && !url.password && /\.pdf$/i.test(url.pathname) ? url.href : null
  } catch { return null }
}

function readUrl() {
  try { return normalizeSmartListUrl(localStorage.getItem(SMART_LIST_STORAGE_KEY) ?? '') ?? DEFAULT_SMART_LIST_URL }
  catch { return DEFAULT_SMART_LIST_URL }
}

function subscribe(notify: () => void) {
  const storage = (event: StorageEvent) => { if (!event.key || event.key === SMART_LIST_STORAGE_KEY) notify() }
  window.addEventListener('storage', storage)
  window.addEventListener(changedEvent, notify)
  return () => { window.removeEventListener('storage', storage); window.removeEventListener(changedEvent, notify) }
}

export function useSmartListUrl() { return useSyncExternalStore(subscribe, readUrl, () => DEFAULT_SMART_LIST_URL) }

export function saveSmartListUrl(value: string) {
  const url = normalizeSmartListUrl(value)
  if (!url) throw new Error('Ingresá un enlace HTTPS a un archivo PDF.')
  try { localStorage.setItem(SMART_LIST_STORAGE_KEY, url) }
  catch { throw new Error('No pudimos guardar el enlace en este navegador. Intentá nuevamente.') }
  window.dispatchEvent(new Event(changedEvent))
}
