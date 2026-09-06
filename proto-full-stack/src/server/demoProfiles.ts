import { products, producerDirectory } from '../shared'

export const demoProfiles = {
  operator: { ...products[0].operators[0], id: 'frutas-del-norte', role: 'operator', active: true, whatsapp: '' },
  producer: { ...producerDirectory[0], id: 'demo-producer', role: 'producer', active: true, whatsapp: '' },
}
