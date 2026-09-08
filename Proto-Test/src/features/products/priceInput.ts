/** Prices entered in the UI are positive whole pesos. Accept legacy trailing zeros. */
export function normalizePrice(value: string): string | null {
  const normalized = value.trim().replace(',', '.')
  if (!/^\d+(\.0+)?$/.test(normalized)) return null
  const amount = Number(normalized)
  return Number.isSafeInteger(amount) && amount > 0 ? String(amount) : null
}

/** Keep unavailable labels and ranges intact while displaying whole pesos. */
export function formatPrice(value: string): string {
  return String(value).replace(/\d+(?:[.,]\d+)?/g, amount => String(Math.round(Number(amount.replace(',', '.')))))
}
