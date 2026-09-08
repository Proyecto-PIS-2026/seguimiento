import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { normalizePrice, formatPrice } from '../src/features/products/priceInput'
import { draggedPrice } from '../src/features/products/sliderPrice'
import { buildPricedProduct, getActorProductPriceOptions, productWebserviceCatalog, products } from '../src/shared'
import { groupActorProducts } from '../src/shared/catalog/groupActorProducts'

test('catalog data, relationships, filtering and route helpers remain unchanged', () => {
  assert.equal(readFileSync(new URL('../src/shared.ts', import.meta.url), 'utf8'), readFileSync(new URL('../../proto-ui/src/shared.ts', import.meta.url), 'utf8'))
  assert.equal(readFileSync(new URL('../src/shared/catalog/groupActorProducts.ts', import.meta.url), 'utf8'), readFileSync(new URL('../../proto-ui/src/shared/catalog/groupActorProducts.ts', import.meta.url), 'utf8'))
})

test('price input accepts whole pesos and rejects fractional, malformed or nonpositive prices', () => {
  for (const value of ['55', '55.00', ' 55,0 ']) assert.equal(normalizePrice(value), '55')
  assert.equal(normalizePrice('10'), '10')
  assert.equal(formatPrice('$55.00'), '$55')
  assert.equal(formatPrice('$55.60'), '$56')
  assert.equal(formatPrice('$50–60'), '$50–60')
  assert.equal(formatPrice('Sin precio'), 'Sin precio')
  for (const value of ['', '0', '-4', '55,50', '0,01', '1.234', '1,2,3', '1e3', 'NaN', 'Infinity', 'hola']) assert.equal(normalizePrice(value), null, value)
})

test('vertical gestures move in whole pesos in both directions and respect valid limits', () => {
  assert.equal(draggedPrice(55.25, 300, 200, 1000), 75)
  assert.equal(draggedPrice(55.25, 200, 300, 1000), 35)
  assert.equal(draggedPrice(5, 0, 200, 1000), 1)
  assert.equal(draggedPrice(990, 200, 0, 1000), 1000)
})

test('updating a price preserves every commercial attribute and publication identity', () => {
  const definition = productWebserviceCatalog[0]
  const option = getActorProductPriceOptions(products[0], products[0].operators[0])[0]
  const draft = buildPricedProduct({ definition, baseProduct: products[0], ...option, photo: option.photo, price: '99.25' })
  assert.equal(draft.id, products[0].id)
  assert.equal(draft.sourceProductId, definition.id)
  assert.equal(draft.price, '$99.25')
  for (const key of ['variety', 'unit', 'presentation', 'calibre', 'category']) assert.equal(draft.combination[key], option[key])
})

test('species grouping preserves individual publication ids and all commercial rows', () => {
  const definition = productWebserviceCatalog[0]
  const combination = { variety: 'Fuji', unit: 'KG', presentation: 'Granel', calibre: 'G', category: 'I' }
  const items = [101, 102].map((id, index) => ({ ...products[0], id, sourceProductId: definition.id, persisted: true, price: `$${50 + index * 10}`, combination }))
  const grouped = groupActorProducts(items)
  assert.equal(grouped.length, 1)
  assert.deepEqual(grouped[0].publicationItems.map(item => item.id), [101, 102])
  assert.deepEqual(getActorProductPriceOptions(grouped[0], products[0].operators[0]).map(option => option.publicationId), [101, 102])
})
