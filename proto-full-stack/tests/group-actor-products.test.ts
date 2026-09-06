import test from 'node:test'
import assert from 'node:assert/strict'
import { groupActorProducts } from '../src/shared/catalog/groupActorProducts'
import { getActorProductPriceOptions } from '../src/shared'

test('agrupa variedades por especie conservando ids, precios y filas al paginar', () => {
  const publications = [
    { id: 101, sourceProductId: 8, persisted: true, name: 'Durazno Amarillo', price: '$70.50', combination: { variety: 'Amarillo' }, photo: 'foto-amarillo' },
    { id: 102, sourceProductId: 4, persisted: true, name: 'Banana Cavendish', price: '$50.25', combination: { variety: 'Cavendish' } },
    { id: 103, sourceProductId: 8, persisted: true, name: 'Durazno Blanco', price: '$65.75', combination: { variety: 'Blanco' }, photo: 'foto-blanco' },
  ]
  const groups = groupActorProducts(publications)
  assert.equal(groups.length, 2)
  assert.equal(groups[0].name, 'Durazno')
  assert.equal(groups[0].price, '$65.75')
  assert.deepEqual(groups[0].publicationItems.map(item => item.id), [101, 103])
  assert.equal(groups.slice(0, 1)[0].publicationItems.length, 2)
  const rows = getActorProductPriceOptions(groups[0], {})
  assert.deepEqual(rows.map(row => row.publicationId), [101, 103])
  assert.deepEqual(rows.map(row => row.price), ['$70.50', '$65.75'])
  assert.deepEqual(rows.map(row => row.photo), ['foto-amarillo', 'foto-blanco'])
  assert.equal(groupActorProducts(groups)[0].publicationItems.length, 2)
  assert.equal(publications[0].name, 'Durazno Amarillo')
  assert.equal(groupActorProducts(publications.filter(item => item.combination.variety === 'Blanco'))[0].publicationItems.length, 1)
})
