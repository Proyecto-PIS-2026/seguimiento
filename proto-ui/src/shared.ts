import { useEffect, useRef, useState } from 'react'

export const featuredProducts = [
  {
    id: 1,
    name: 'Manzana Fuji',
    detail: 'Grande · Categoría I',
    price: '$50–60',
    unit: '/ kg',
    sellers: 6,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=85',
    accent: '#f3d9d6',
    operators: [
      { name: 'Frutas del Norte', place: 'Nave 2 · Puesto 18', price: '$58', available: true },
      { name: 'Los Aromos', place: 'Nave 1 · Puesto 42', price: '$55', available: true },
      { name: 'Granja San José', place: 'Nave 3 · Puesto 07', price: '$60', available: true },
      { name: 'El Trébol', place: 'Nave 2 · Puesto 31', price: '$52', available: true },
      { name: 'Frutas del Este', place: 'Nave 4 · Puesto 09', price: '$56', available: true },
      { name: 'Puesto La Estación', place: 'Nave 1 · Puesto 24', price: '—', available: false },
    ],
  },
  {
    id: 2,
    name: 'Tomate redondo',
    detail: 'Mediano · Categoría I',
    price: '$90–100',
    unit: '/ kg',
    sellers: 12,
    image: 'https://images.unsplash.com/photo-1569603343957-619e98fcfe71?auto=format&fit=crop&w=700&q=85',
    accent: '#f4d6cf',
    operators: [
      { name: 'Puesto La Huerta', place: 'Nave 4 · Puesto 11', price: '$92', available: true },
      { name: 'Campos del Sur', place: 'Nave 3 · Puesto 28', price: '$95', available: true },
      { name: 'Mercado Verde', place: 'Nave 1 · Puesto 15', price: '—', available: false },
      { name: 'La Chacra', place: 'Nave 2 · Puesto 06', price: '$90', available: true },
      { name: 'Hortalizas Central', place: 'Nave 1 · Puesto 33', price: '$98', available: true },
      { name: 'El Cantero', place: 'Nave 3 · Puesto 04', price: '$94', available: true },
      { name: 'Puesto del Prado', place: 'Nave 4 · Puesto 22', price: '$96', available: true },
      { name: 'Quinta del Sol', place: 'Nave 2 · Puesto 38', price: '$91', available: true },
      { name: 'Distribuidora Sur', place: 'Nave 3 · Puesto 19', price: '$99', available: true },
      { name: 'La Cosecha', place: 'Nave 1 · Puesto 02', price: '$93', available: true },
      { name: 'Huerta Oriental', place: 'Nave 4 · Puesto 30', price: '$97', available: true },
      { name: 'Los Tilos', place: 'Nave 2 · Puesto 14', price: '—', available: false },
    ],
  },
  {
    id: 3,
    name: 'Palta Hass',
    detail: 'Grande · Categoría I',
    price: '$180–190',
    unit: '/ kg',
    sellers: 4,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=85',
    accent: '#dbe8cc',
    operators: [
      { name: 'Importadora Rivera', place: 'Nave 2 · Puesto 03', price: '$185', available: true },
      { name: 'El Ombú', place: 'Nave 2 · Puesto 29', price: '$188', available: true },
      { name: 'Tropical del Plata', place: 'Nave 1 · Puesto 17', price: '$180', available: true },
      { name: 'Distribuidora Norte', place: 'Nave 4 · Puesto 05', price: '$190', available: true },
    ],
  },
  {
    id: 4,
    name: 'Banana Cavendish',
    detail: 'Grande · Categoría I',
    price: 'Sin precio',
    unit: '/ kg',
    sellers: 8,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=700&q=85',
    accent: '#f5e7ae',
    operators: [
      { name: 'Tropicales UY', place: 'Nave 1 · Puesto 08', price: '$38', available: true },
      { name: 'Distribuidora Central', place: 'Nave 4 · Puesto 36', price: '$39', available: true },
      { name: 'Frutas del Litoral', place: 'Nave 2 · Puesto 12', price: '$36', available: true },
      { name: 'El Ceibo', place: 'Nave 3 · Puesto 25', price: '$37', available: true },
      { name: 'Mercado Tropical', place: 'Nave 1 · Puesto 39', price: '$39', available: true },
      { name: 'Puesto Atlántico', place: 'Nave 4 · Puesto 18', price: '$38', available: true },
      { name: 'La Ribera', place: 'Nave 2 · Puesto 27', price: '$37', available: true },
      { name: 'Costa Verde', place: 'Nave 3 · Puesto 10', price: '—', available: false },
    ],
  },
]

export const createOperators = (price) => [
  { name: 'Mercado Central', place: 'Nave 1 · Puesto 14', price: `$${price}`, available: true },
  { name: 'Puesto del Prado', place: 'Nave 2 · Puesto 27', price: `$${price + 3}`, available: true },
  { name: 'La Cosecha', place: 'Nave 3 · Puesto 09', price: `$${price + 5}`, available: true },
]

export const additionalProducts = [
  { id: 5, name: 'Limón', detail: 'Mediano · Categoría I', price: '$65–70', basePrice: 65, image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=700&q=85' },
  { id: 6, name: 'Naranja', detail: 'Grande · Categoría I', price: '$55–62', basePrice: 55, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=700&q=85' },
  { id: 7, name: 'Pera Williams', detail: 'Mediana · Categoría I', price: '$82–90', basePrice: 82, image: 'https://images.unsplash.com/photo-1588613654961-592bfbc5859f?auto=format&fit=crop&w=700&q=85' },
  { id: 8, name: 'Durazno', detail: 'Mediano · Categoría I', price: '$110–125', basePrice: 110, image: 'https://images.unsplash.com/photo-1568584711611-4dfa4cd196f1?auto=format&fit=crop&w=700&q=85' },
  { id: 9, name: 'Uva rosada', detail: 'Racimo · Categoría I', price: '$120–135', basePrice: 120, image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=700&q=85' },
  { id: 10, name: 'Sandía', detail: 'Grande · Categoría I', price: '$32–38', basePrice: 32, image: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&w=700&q=85' },
  { id: 11, name: 'Papa blanca', detail: 'Mediana · Categoría I', price: '$42–48', basePrice: 42, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85' },
  { id: 12, name: 'Cebolla', detail: 'Mediana · Categoría I', price: '$38–45', basePrice: 38, image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=85' },
  { id: 13, name: 'Zanahoria', detail: 'Mediana · Categoría I', price: '$48–55', basePrice: 48, image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=700&q=85' },
  { id: 14, name: 'Morrón rojo', detail: 'Grande · Categoría I', price: '$135–150', basePrice: 135, image: 'https://images.unsplash.com/photo-1608737637507-9aaeb9f4bf30?auto=format&fit=crop&w=700&q=85' },
  { id: 15, name: 'Zapallito', detail: 'Mediano · Categoría I', price: '$58–65', basePrice: 58, image: 'https://borga.com.uy/statics/images/products/zapallito.jpg' },
  { id: 16, name: 'Berenjena', detail: 'Grande · Categoría I', price: '$72–80', basePrice: 72, image: 'https://images.unsplash.com/photo-1578283360724-288afbe9cffb?auto=format&fit=crop&w=700&q=85' },
  { id: 17, name: 'Brócoli', detail: 'Unidad · Categoría I', price: '$68–75', basePrice: 68, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=700&q=85' },
  { id: 18, name: 'Lechuga mantecosa', detail: 'Unidad · Categoría I', price: '$35–42', basePrice: 35, image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=700&q=85' },
  { id: 19, name: 'Ananá', detail: 'Unidad · Categoría I', price: '$95–110', basePrice: 95, image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=700&q=85' },
  { id: 20, name: 'Frutilla', detail: 'Bandeja · Categoría I', price: '$105–120', basePrice: 105, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=85' },
]

export const products = [
  ...featuredProducts,
  ...additionalProducts.map(({ basePrice, ...product }) => ({
    ...product,
    unit: '/ kg',
    sellers: 3,
    accent: '#e8eadf',
    operators: createOperators(basePrice),
  })),
].map((product) => {
  const unitTypes = ['kg', 'cajón', 'unidad', 'bandeja']
  const unitType = product.id <= 3 ? 'kg' : unitTypes[(product.id - 4) % unitTypes.length]
  return { ...product, unitType, unit: `/ ${unitType}` }
})

export const fallbackProductImage = featuredProducts[0].image

export const operatorDirectory = products.slice(0, 8).map((product) => ({
  ...product.operators[0],
  product,
  productCount: product.operators.length,
}))

export const actorOptionKey = (entry) => `${entry.name}|${entry.place}`

export const vacationReplacementOptions = Array.from(new Map(operatorDirectory.slice(1).map((entry) => [actorOptionKey(entry), entry])).values())

export const producerDirectory = [
  { name: 'Granja Santa Rosa', place: 'Canelones · Ruta 5', price: '$48', available: true, product: products[12], productCount: 8 },
  { name: 'Finca La Esperanza', place: 'Montevideo · Melilla', price: '$65', available: true, product: products[4], productCount: 6 },
  { name: 'Productores del Este', place: 'San Carlos · Maldonado', price: '$72', available: true, product: products[15], productCount: 11 },
  { name: 'Quinta Los Tilos', place: 'Las Piedras · Canelones', price: '$42', available: true, product: products[10], productCount: 5 },
]

export const slugify = (value) => value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const formatShortDate = (value) => new Intl.DateTimeFormat('es-UY', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`))

export const allOperators = Array.from(new Map(products.flatMap((product) => product.operators.map((operator) => [operator.name, { ...operator, product, productCount: products.length }]))).values())

export const staticViewRoutes = {
  board: '/',
  operators: '/operadores',
  producerBoard: '/operador/pizarron-productores',
  producers: '/operador/productores',
  producerDetail: '/productores/granja-santa-rosa',
  provider: '/operador/mercado',
  producerMarket: '/productor/mercado',
  publish: '/operador/publicar',
  login: '/ingresar',
  twoFactorChallenge: '/ingresar/2fa',
  twoFactorSetup: '/seguridad/configurar-2fa',
  recovery: '/recuperar-contrasena',
  resetPassword: '/restablecer-contrasena',
  vacations: '/operador/vacaciones',
  absentProvider: '/operadores/ausente',
  adminOperators: '/administracion/operadores',
  adminProducers: '/administracion/productores',
  adminSmartList: '/administracion/lista-inteligente',
  adminRecovery: '/administracion/recuperacion-de-cuentas',
  adminRevaluation: '/administracion/revalorizacion-de-precios',
}

export const initialRecoveryRequests = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: ['María Silva', 'Jorge Pereira', 'Lucía Rodríguez', 'Carlos Méndez'][index % 4],
  email: `contacto${index + 1}@mercado.uy`,
  problem: index % 3 === 0 ? 'Perdí acceso al segundo factor.' : index % 3 === 1 ? 'No recuerdo mi contraseña.' : 'La cuenta quedó bloqueada.',
  status: index < 8 ? 'Pendiente' : 'Resuelta',
}))

export function resolveRoute(pathname) {
  if (pathname === '/lista-inteligente') return { view: 'board', smartList: true }
  const staticEntry = Object.entries(staticViewRoutes).find(([, path]) => path === pathname)
  if (staticEntry) return { view: staticEntry[0] }

  const operatorMatch = pathname.match(/^\/operadores\/([^/]+)$/)
  if (operatorMatch) {
    const operator = allOperators.find((entry) => slugify(entry.name) === operatorMatch[1])
    if (operator) return { view: 'provider', providerMarket: { operator, product: operator.product }, providerBackView: 'operators' }
  }

  const producerMatch = pathname.match(/^\/productores\/([^/]+)$/)
  if (producerMatch) {
    const producer = producerDirectory.find((entry) => slugify(entry.name) === producerMatch[1])
    if (producer) return { view: 'producerDetail', providerMarket: { operator: producer, product: producer.product }, providerBackView: 'producers' }
  }

  const productMatch = pathname.match(/^\/(?:operador\/)?productos\/(\d+)\/(operadores|productores)$/)
  if (productMatch) {
    const product = products.find((entry) => entry.id === Number(productMatch[1]))
    if (product) return { view: 'productDetail', productPage: { product, role: productMatch[2] === 'productores' ? 'producer' : 'operator' } }
  }

  const editMatch = pathname.match(/^\/(operador|productor)\/mercado\/(\d+)\/editar$/)
  if (editMatch) {
    const product = products.find((entry) => entry.id === Number(editMatch[2]))
    if (product) return { view: 'editPrice', editingProduct: product, editReturnView: editMatch[1] === 'productor' ? 'producerMarket' : 'provider' }
  }

  return { view: 'board' }
}

export const smartPicks = [
  { productId: 1, description: 'Buena calidad y oferta estable esta semana.' },
  { productId: 4, description: 'Producto de estación en el período actual.' },
  { productId: 2, description: 'Oferta abundante y precios competitivos.' },
  { productId: 5, description: 'Recomendado por su disponibilidad estacional.' },
  { productId: 13, description: 'Alta disponibilidad durante esta semana.' },
  { productId: 6, description: 'En temporada, con buena relación precio-calidad.' },
  { productId: 12, description: 'Precio estable en el mercado mayorista.' },
  { productId: 7, description: 'Calidad destacada para el período actual.' },
  { productId: 11, description: 'Oferta abundante y precio conveniente.' },
]

export const calendarDays = [
  { id: 'mon', short: 'L', label: 'Lunes' },
  { id: 'tue', short: 'M', label: 'Martes' },
  { id: 'wed', short: 'X', label: 'Miércoles' },
  { id: 'thu', short: 'J', label: 'Jueves' },
  { id: 'fri', short: 'V', label: 'Viernes' },
  { id: 'sat', short: 'S', label: 'Sábado' },
  { id: 'sun', short: 'D', label: 'Domingo' },
]

export function scrollToProductList(listRef) {
  window.requestAnimationFrame(() => {
    const list = listRef.current
    if (!list) return
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
    const top = list.getBoundingClientRect().top + window.scrollY - headerHeight - 12
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  })
}

export function usePageTransition(setCurrentPage, listRef) {
  const [isPageChanging, setIsPageChanging] = useState(false)
  const transitionTimer = useRef(null)
  useEffect(() => () => window.clearTimeout(transitionTimer.current), [])
  const changePage = (page) => {
    setIsPageChanging(true)
    window.clearTimeout(transitionTimer.current)
    transitionTimer.current = window.setTimeout(() => {
      setCurrentPage(page)
      scrollToProductList(listRef)
      transitionTimer.current = window.setTimeout(() => setIsPageChanging(false), 160)
    }, 160)
  }
  return { changePage, isPageChanging }
}

export function productMatchesFilters(product, { groupFilter, speciesFilter, priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter }) {
  const numericPrice = product.price.match(/\d+/)?.[0]
  const price = numericPrice ? Number(numericPrice) : null
  const definition = productWebserviceCatalog.find((entry) => entry.id === (product.sourceProductId ?? product.id))
  const combination = getProductCombination(product)
  const nave = product.filterNave ?? product.operators[0]?.place.split(' · ')[0] ?? ''
  const matchesPrice = priceFilter === 'all' || (priceFilter === 'noPrice' && price === null) || (price !== null && ((priceFilter === 'under50' && price < 50) || (priceFilter === '50to100' && price >= 50 && price <= 100) || (priceFilter === 'over100' && price > 100)))
  return matchesPrice
    && (groupFilter === 'all' || definition?.group === groupFilter)
    && (speciesFilter === 'all' || definition?.species === speciesFilter)
    && (varietyFilter === 'all' || combination?.variety === varietyFilter)
    && (presentationFilter === 'all' || combination?.presentation === presentationFilter)
    && (calibreFilter === 'all' || combination?.calibre === calibreFilter)
    && (categoryFilter === 'all' || combination?.category === categoryFilter)
    && (naveFilter === 'all' || nave === naveFilter)
    && (unitFilter === 'all' || combination?.unit === unitFilter)
}

export function getActorPublishedProducts(entry, role) {
  const directlyPublished = role === 'producer' ? [entry.product] : products.filter((product) => product.operators.some((operator) => operator.name === entry.name))
  return [...new Map([...directlyPublished, ...products].filter(Boolean).map((product) => [product.id, product])).values()].slice(0, Math.min(6, entry.productCount ?? 6))
}

export const measureUnits = [
  { code: 'KG', name: 'Kilogramo', value: 'kg' },
  { code: 'CAJ', name: 'Cajón', value: 'cajón' },
  { code: 'BAN', name: 'Bandeja', value: 'bandeja' },
  { code: 'UN', name: 'Unidad', value: 'unidad' },
  { code: 'DOC', name: 'Docena', value: 'docena' },
]

export const calibreCatalog = [{ code: 'G', name: 'Grande' }, { code: 'M', name: 'Mediano' }, { code: 'C', name: 'Chico' }, { code: 'EG', name: 'Extragrande' }]

export const categoryCatalog = [{ code: 'E', description: 'Especial' }, { code: 'I', description: 'Primera' }, { code: 'II', description: 'Segunda' }]

export const knownSpecies = {
  1: ['Frutas de hoja caduca', 'Manzana', 'Fuji'], 2: ['Frutos de huerta', 'Tomate', 'Redondo'], 3: ['Exóticos/importados', 'Palta', 'Hass'], 4: ['Exóticos/importados', 'Banana', 'Cavendish'],
  7: ['Frutas de hoja caduca', 'Pera', 'Williams'], 8: ['Frutas de hoja caduca', 'Durazno', 'Amarillo'], 14: ['Frutos de huerta', 'Morrón', 'Rojo'], 15: ['Frutos de huerta', 'Zapallito', 'Criollo'], 16: ['Frutos de huerta', 'Berenjena', 'Negra'],
}

export const knownVarieties = {
  Manzana: ['Fuji', 'Granny Smith', 'Red Delicious'], Tomate: ['Redondo', 'Perita', 'Cherry'], Palta: ['Hass', 'Fuerte'], Banana: ['Cavendish', 'Williams'],
  Pera: ['Williams', 'Packham'], Durazno: ['Amarillo', 'Blanco'], Morrón: ['Rojo', 'Verde'], Zapallito: ['Criollo', 'Redondo'], Berenjena: ['Negra', 'Listada'],
}

export const productWebserviceCatalog = products.map((product) => {
  const [group, species, variety] = knownSpecies[product.id] ?? ['Frutas y hortalizas', product.name, 'Estándar']
  const defaultUnit = measureUnits.find((unit) => unit.value === product.unitType) ?? measureUnits[0]
  const defaultCalibre = calibreCatalog.find((calibre) => product.detail.startsWith(calibre.name)) ?? calibreCatalog[1]
  const presentations = defaultUnit.code === 'CAJ' ? ['Cajón', 'Atado'] : defaultUnit.code === 'BAN' ? ['Bandeja', 'Caja'] : defaultUnit.code === 'UN' ? ['Unidad', 'Atado'] : ['Granel', 'Cajón']
  const varieties = [...new Set([variety, ...(knownVarieties[species] ?? (variety === 'Estándar' ? ['Común'] : []))])]
  return { id: product.id, product, group, species, variety, varieties, varietyCode: String(product.id).padStart(3, '0'), units: [defaultUnit, ...measureUnits.filter((unit) => unit.code !== defaultUnit.code)], presentations, calibres: [defaultCalibre, ...calibreCatalog.filter((calibre) => calibre.code !== defaultCalibre.code)], categories: categoryCatalog }
})

export function getProductCombination(product) {
  const definition = productWebserviceCatalog.find((entry) => entry.id === (product.sourceProductId ?? product.id))
  if (!definition) return null
  return { variety: definition.variety, unit: definition.units[0].code, presentation: definition.presentations[0], calibre: definition.calibres[0].code, category: definition.categories.find((entry) => entry.code === 'I')?.code ?? definition.categories[0].code, ...(product.combination ?? {}) }
}

export function getOperatorPriceOptions(product, operator, operatorIndex = 0) {
  if (!operator.available) return []
  const definition = productWebserviceCatalog.find((entry) => entry.id === (product.sourceProductId ?? product.id))
  const combination = getProductCombination(product)
  if (!definition || !combination) return []
  const basePrice = Number(operator.price?.match(/\d+/)?.[0] ?? product.price.match(/\d+/)?.[0] ?? 0)
  const combinations = [combination]
  if (definition.presentations.length > 1) {
    combinations.push({
      variety: definition.varieties[(operatorIndex + 1) % definition.varieties.length],
      unit: definition.units[(operatorIndex + 1) % definition.units.length].code,
      presentation: definition.presentations[(operatorIndex + 1) % definition.presentations.length],
      calibre: definition.calibres[(operatorIndex + 1) % definition.calibres.length].code,
      category: definition.categories[(operatorIndex + 1) % definition.categories.length].code,
    })
  }
  return combinations.map((entry, index) => {
    const calibre = definition.calibres.find((value) => value.code === entry.calibre)
    const unit = measureUnits.find((value) => value.code === entry.unit)
    const productLabel = entry.variety === 'Estándar' ? definition.species : entry.variety
    const numericPrice = basePrice + (index * 4)
    return {
      ...entry,
      key: `${entry.variety}-${entry.unit}-${entry.presentation}-${entry.calibre}-${entry.category}`,
      label: `${entry.presentation} · ${productLabel} · ${calibre?.name ?? entry.calibre} · Cat. ${entry.category}`,
      price: `$${numericPrice}`,
      numericPrice,
      unit: unit?.code ?? entry.unit,
    }
  })
}

export function getActorProductPriceOptions(product, actor, productIndex = 0) {
  const definition = productWebserviceCatalog.find((entry) => entry.id === (product.sourceProductId ?? product.id))
  if (!definition) return []
  const seed = [...`${actor.name ?? 'actor'}-${product.id}-${productIndex}`].reduce((total, character) => total + character.charCodeAt(0), 0)
  const optionCount = 2 + (seed % 6)
  const basePrice = Number(actor.price?.match(/\d+/)?.[0] ?? product.price.match(/\d+/)?.[0] ?? 0)
  return Array.from({ length: optionCount }, (_, index) => {
    const variety = definition.varieties[(seed + index) % definition.varieties.length]
    const unit = definition.units[(seed + index * 2) % definition.units.length]
    const presentation = definition.presentations[(seed + index) % definition.presentations.length]
    const calibre = definition.calibres[(seed + index * 3) % definition.calibres.length]
    const category = definition.categories[(seed + index) % definition.categories.length]
    return {
      key: `${product.id}-${variety}-${unit.code}-${category.code}-${calibre.code}-${index}`,
      variety,
      unit: unit.code,
      presentation,
      category: category.code,
      calibre: calibre.code,
      price: `$${basePrice + index * 4}`,
      photo: ((product.id * 7 + index * 3) % 5 < 2) ? actor.photo ?? product.image : null,
    }
  })
}

export function buildPricedProduct({ definition, baseProduct, variety, unit, presentation, calibre, category, photo, price }) {
  if (!definition || !variety || !unit || !presentation || !calibre || !category || !price) return null
  const selectedUnit = measureUnits.find((entry) => entry.code === unit)
  const selectedCalibre = definition.calibres.find((entry) => entry.code === calibre)
  return {
    ...definition.product,
    ...baseProduct,
    id: baseProduct?.id ?? Date.now(),
    sourceProductId: definition.id,
    name: variety === 'Estándar' || variety === 'Común' ? definition.species : `${definition.species} ${variety}`,
    detail: `${presentation} · ${selectedCalibre?.name ?? calibre} · Categoría ${category}`,
    unitType: selectedUnit?.value ?? 'unidad',
    unit: `/ ${selectedUnit?.name ?? 'unidad'}`,
    image: photo || baseProduct?.image || definition.product.image,
    price: `$${price}`,
    combination: { variety, unit, presentation, calibre, category },
  }
}
