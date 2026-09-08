export const MIN_SLIDER_PRICE = 1
export const SLIDER_PIXELS_PER_PESO = 5

export function draggedPrice(initial: number, startY: number, currentY: number, maximum: number): number {
  const delta = Math.round((startY - currentY) / SLIDER_PIXELS_PER_PESO)
  return Math.min(maximum, Math.max(MIN_SLIDER_PRICE, Math.round(initial) + delta))
}
