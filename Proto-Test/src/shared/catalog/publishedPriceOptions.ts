import { getActorPublishedProducts, getActorProductPriceOptions } from '../../shared'

export function publishedPriceOptions(product: any, entry: any, role: string, overrides: any = {}, removed: string[] = [], usePhotos = false, index = 0) {
  const actor = product.operators?.find(operator => operator.name === entry.name) ?? entry
  const stableIndex = getActorPublishedProducts(entry, role).findIndex(item => item.id === product.id)
  return getActorProductPriceOptions(product, { ...actor, available: true, price: actor.price ?? entry.price ?? product.price }, stableIndex < 0 ? product.actorProductIndex ?? index : stableIndex)
    .filter(option => !removed.includes(`${product.id}:${option.key}`))
    .map((option, optionIndex) => ({ ...option, photo: option.photo ?? (!product.persisted && usePhotos && ((product.id * 7 + optionIndex * 3) % 5 < 2) ? product.image : null), ...(overrides[`${product.id}:${option.key}`] ?? {}) }))
}
