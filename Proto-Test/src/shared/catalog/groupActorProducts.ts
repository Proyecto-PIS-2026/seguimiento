import { productWebserviceCatalog } from '../../shared'

// Group only for presentation; each row keeps the publication id used by the API.
export function groupActorProducts(items: any[]): any[] {
  const groups = new Map<string, any>()
  for (const item of items) {
    if (!item.persisted) {
      groups.set(`legacy:${item.id}`, item)
      continue
    }
    const speciesId = item.sourceProductId ?? item.id
    const key = `species:${speciesId}`
    const definition = productWebserviceCatalog.find(entry => entry.id === speciesId)
    const publications = item.publicationItems ?? [item]
    let group = groups.get(key)
    if (!group) {
      group = { ...item, name: definition?.species ?? item.name, image: definition?.product.image ?? item.image, publicationItems: [] }
      groups.set(key, group)
    }
    group.publicationItems.push(...publications)
    const prices = group.publicationItems.map(entry => Number(String(entry.price).replace(/^\$/, ''))).filter(Number.isFinite)
    if (prices.length) group.price = group.marketPrice = `$${Math.min(...prices).toFixed(2)}`
  }
  return [...groups.values()]
}
