export function matchesPriceBounds(price: unknown, minimum = '', maximum = ''): boolean {
  if (!minimum && !maximum) return true
  const min = minimum ? Number(minimum) : 0
  const max = maximum ? Number(maximum) : Infinity
  if (!Number.isSafeInteger(min) || min < 0 || (maximum && (!Number.isSafeInteger(max) || max < 0)) || min > max) return false
  const values = String(price ?? '').match(/\d+(?:[.,]\d+)?/g)?.map(value => Number(value.replace(',', '.')))
  return Boolean(values?.length && Math.max(...values) >= min && Math.min(...values) <= max)
}
