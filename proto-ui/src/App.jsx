import { useEffect, useMemo, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Eye,
  EyeOff,
  FileSpreadsheet,
  ImagePlus,
  KeyRound,
  MapPin,
  Menu,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

const featuredProducts = [
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

const createOperators = (price) => [
  { name: 'Mercado Central', place: 'Nave 1 · Puesto 14', price: `$${price}`, available: true },
  { name: 'Puesto del Prado', place: 'Nave 2 · Puesto 27', price: `$${price + 3}`, available: true },
  { name: 'La Cosecha', place: 'Nave 3 · Puesto 09', price: `$${price + 5}`, available: true },
]

const additionalProducts = [
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

const products = [
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

const fallbackProductImage = featuredProducts[0].image

const operatorDirectory = products.slice(0, 8).map((product) => ({
  ...product.operators[0],
  product,
  productCount: product.operators.length,
}))

const actorOptionKey = (entry) => `${entry.name}|${entry.place}`
const vacationReplacementOptions = Array.from(new Map(operatorDirectory.slice(1).map((entry) => [actorOptionKey(entry), entry])).values())

const producerDirectory = [
  { name: 'Granja Santa Rosa', place: 'Canelones · Ruta 5', price: '$48', available: true, product: products[12], productCount: 8 },
  { name: 'Finca La Esperanza', place: 'Montevideo · Melilla', price: '$65', available: true, product: products[4], productCount: 6 },
  { name: 'Productores del Este', place: 'San Carlos · Maldonado', price: '$72', available: true, product: products[15], productCount: 11 },
  { name: 'Quinta Los Tilos', place: 'Las Piedras · Canelones', price: '$42', available: true, product: products[10], productCount: 5 },
]

const slugify = (value) => value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const formatShortDate = (value) => new Intl.DateTimeFormat('es-UY', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`))

const allOperators = Array.from(new Map(products.flatMap((product) => product.operators.map((operator) => [operator.name, { ...operator, product, productCount: products.length }]))).values())

const staticViewRoutes = {
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
  variants: '/variantes',
}

const initialRecoveryRequests = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: ['María Silva', 'Jorge Pereira', 'Lucía Rodríguez', 'Carlos Méndez'][index % 4],
  email: `contacto${index + 1}@mercado.uy`,
  problem: index % 3 === 0 ? 'Perdí acceso al segundo factor.' : index % 3 === 1 ? 'No recuerdo mi contraseña.' : 'La cuenta quedó bloqueada.',
  status: index < 8 ? 'Pendiente' : 'Resuelta',
}))

function resolveRoute(pathname) {
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

const smartPicks = [
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

const calendarDays = [
  { id: 'mon', short: 'L', label: 'Lunes' },
  { id: 'tue', short: 'M', label: 'Martes' },
  { id: 'wed', short: 'X', label: 'Miércoles' },
  { id: 'thu', short: 'J', label: 'Jueves' },
  { id: 'fri', short: 'V', label: 'Viernes' },
  { id: 'sat', short: 'S', label: 'Sábado' },
  { id: 'sun', short: 'D', label: 'Domingo' },
]

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.09-1.93 3.27-4.77 3.27-8.09Z" />
      <path fill="#34A853" d="M12 23c2.99 0 5.49-.99 7.32-2.66l-3.58-2.77c-.99.66-2.26 1.06-3.74 1.06-2.89 0-5.33-1.95-6.21-4.57H2.09v2.84C3.91 20.51 7.66 23 12 23Z" />
      <path fill="#FBBC05" d="M5.79 14.07A6.6 6.6 0 0 1 5.44 12c0-.71.13-1.41.35-2.07V7.09H2.09A11 11 0 0 0 .92 12c0 1.76.43 3.43 1.17 4.91l3.7-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.44 2.09 14.94 1 12 1 7.66 1 3.91 3.49 2.09 7.09l3.7 2.84c.88-2.62 3.32-4.55 6.21-4.55Z" />
    </svg>
  )
}

function Header({ view, onNavigate, isAuthenticated, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return undefined
    const scrollPosition = window.scrollY
    const previousStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    }
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.width = '100%'
    return () => {
      Object.assign(document.body.style, previousStyles)
      const previousScrollBehavior = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, scrollPosition)
      document.documentElement.style.scrollBehavior = previousScrollBehavior
    }
  }, [menuOpen])

  const navigateFromMenu = (nextView, path) => {
    setMenuOpen(false)
    window.setTimeout(() => {
      onNavigate(nextView, path)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }, 0)
  }

  const openSmartList = () => {
    setMenuOpen(false)
    window.setTimeout(() => {
      onNavigate('board', '/lista-inteligente')
      window.setTimeout(() => document.getElementById('inteligente')?.scrollIntoView({ behavior: 'smooth' }), 0)
    }, 0)
  }

  const handleAccount = () => {
    setMenuOpen(false)
    if (isAuthenticated) onLogout()
    else onNavigate('login')
  }

  const prototypeGroups = [
    { title: 'Cliente', items: [{ label: 'Ver el pizarrón', view: 'board' }, { label: 'Ver la lista inteligente', view: 'board', smart: true }, { label: 'Ver la lista de operadores', view: 'operators' }] },
    { title: 'Operador', items: [{ label: 'Ver su mercado', view: 'provider' }, { label: 'Ver pizarrón de productores', view: 'producerBoard' }, { label: 'Ver lista de productores', view: 'producers' }, { label: 'Ver detalle de un productor', view: 'producerDetail' }, { label: 'Vacaciones', view: 'vacations' }, { label: 'Operador ausente', view: 'absentProvider' }] },
    { title: 'Productor', items: [{ label: 'Ver su mercado', view: 'producerMarket' }] },
    { title: 'Administrador', items: [{ label: 'Mantenimiento de operadores', view: 'adminOperators' }, { label: 'Mantenimiento de productores', view: 'adminProducers' }, { label: 'Mantenimiento de lista inteligente', view: 'adminSmartList' }, { label: 'Solicitudes de recuperación', view: 'adminRecovery' }, { label: 'Revalorización de precios', view: 'adminRevaluation' }] },
    { title: 'Seguridad', items: [{ label: 'Ingresar', view: 'login' }, { label: 'Ingresar con 2FA', view: 'twoFactorChallenge' }, { label: 'Configurar 2FA', view: 'twoFactorSetup' }, { label: 'Recuperar contraseña', view: 'recovery' }, { label: 'Restablecer contraseña', view: 'resetPassword' }] },
    { title: 'Prototipo', items: [{ label: 'Variantes', view: 'variants' }] },
  ]
  const openPrototypeItem = (item) => {
    setDesktopMenuOpen(false)
    if (item.smart) openSmartList()
    else navigateFromMenu(item.view)
  }

  return (
    <>
      <header className="site-header">
        <button className="brand brand-button" type="button" onClick={() => navigateFromMenu('board')} aria-label="Mercado Hoy, inicio">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span><strong>Mercado</strong><small>HOY · UAM</small></span>
        </button>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <button className={view === 'board' ? 'nav-link active' : 'nav-link'} type="button" onClick={() => onNavigate('board')}>Pizarrón</button>
          <a href="/lista-inteligente" onClick={(event) => { event.preventDefault(); onNavigate('board', '/lista-inteligente'); window.setTimeout(() => document.getElementById('inteligente')?.scrollIntoView({ behavior: 'smooth' }), 0) }}>Lista inteligente</a>
          <button type="button" onClick={() => onNavigate('publish')}>Publicar</button>
          <button className={desktopMenuOpen ? 'prototype-menu-trigger active' : 'prototype-menu-trigger'} type="button" onClick={() => setDesktopMenuOpen((value) => !value)} aria-expanded={desktopMenuOpen} aria-controls="desktop-prototype-menu" aria-label={desktopMenuOpen ? 'Cerrar menú de pantallas' : 'Abrir menú de pantallas'}><Menu size={20} /></button>
          <button className="quiet" type="button" onClick={handleAccount}>{isAuthenticated ? 'Salir' : 'Ingresar'}</button>
        </nav>
        <button className={menuOpen ? 'mobile-menu-toggle open' : 'mobile-menu-toggle'} type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>
          <span /><span /><span />
        </button>
      </header>
      <div className={desktopMenuOpen ? 'desktop-prototype-backdrop open' : 'desktop-prototype-backdrop'} onMouseDown={(event) => event.target === event.currentTarget && setDesktopMenuOpen(false)} aria-hidden={!desktopMenuOpen} inert={!desktopMenuOpen}>
        <nav className="desktop-prototype-menu" id="desktop-prototype-menu" aria-label="Pantallas del prototipo">
          {prototypeGroups.map((group) => <section key={group.title}><h2>{group.title}</h2><div>{group.items.map((item) => <button className={view === item.view ? 'active' : ''} type="button" key={`${group.title}-${item.label}`} onClick={() => openPrototypeItem(item)}>{item.label}</button>)}</div></section>)}
        </nav>
      </div>
      <div className={menuOpen ? 'mobile-menu-backdrop open' : 'mobile-menu-backdrop'} onMouseDown={(event) => event.target === event.currentTarget && setMenuOpen(false)} aria-hidden={!menuOpen} inert={!menuOpen}>
        <nav className="mobile-menu" id="mobile-menu" aria-label="Navegación móvil">
          <h2>Pantallas del prototipo</h2>
          {prototypeGroups.map((group) => <section key={group.title}><p className="mobile-menu-group-title">{group.title}</p><div className="mobile-menu-sections">{group.items.map((item) => <button className={view === item.view ? 'active' : ''} type="button" key={`${group.title}-${item.label}`} onClick={() => openPrototypeItem(item)}>{item.label}</button>)}</div></section>)}
          {isAuthenticated && <button className="mobile-menu-session" type="button" onClick={handleAccount}>Cerrar sesión</button>}
        </nav>
      </div>
    </>
  )
}

function ProductListItem({ product, price = product.price, status, onOpen, actions, actionLayout = 'current', showUnit = true }) {
  const displayedPrice = price || 'Sin precio'
  const showsUnit = showUnit && displayedPrice !== 'Sin precio'

  return (
    <article className={actions ? `product-list-item has-actions actions-${actionLayout}` : 'product-list-item'}>
      <button className="product-list-main" type="button" onClick={onOpen}>
        <img src={product.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} />
        <span className="product-list-copy"><strong>{product.name}</strong><small>{product.detail}</small></span>
        {status && <span className="product-list-status">{status}</span>}
        <span className="product-list-price"><strong>{displayedPrice}</strong>{showsUnit && <small>{product.unit}</small>}</span>
        <ChevronRight size={19} aria-hidden="true" />
      </button>
      {actions && <div className="product-list-actions">{actions}</div>}
    </article>
  )
}

const boardCardVariantStorageKey = 'mercado-hoy:board-card-actions'
const validBoardCardVariants = ['current', 'icons-top-right']

function readStoredBoardCardVariant() {
  const stored = window.localStorage.getItem(boardCardVariantStorageKey)
  return validBoardCardVariants.includes(stored) ? stored : 'icons-top-right'
}

function useBoardCardVariant() {
  const [variant, setVariantState] = useState(readStoredBoardCardVariant)
  useEffect(() => {
    const syncVariant = (event) => {
      const nextVariant = event.detail ?? readStoredBoardCardVariant()
      if (validBoardCardVariants.includes(nextVariant)) setVariantState(nextVariant)
    }
    window.addEventListener('storage', syncVariant)
    window.addEventListener('board-card-variant-change', syncVariant)
    return () => {
      window.removeEventListener('storage', syncVariant)
      window.removeEventListener('board-card-variant-change', syncVariant)
    }
  }, [])
  const setVariant = (nextVariant) => {
    if (!validBoardCardVariants.includes(nextVariant)) return
    window.localStorage.setItem(boardCardVariantStorageKey, nextVariant)
    setVariantState(nextVariant)
    window.dispatchEvent(new CustomEvent('board-card-variant-change', { detail: nextVariant }))
  }
  return [variant, setVariant]
}

function scrollToProductList(listRef) {
  window.requestAnimationFrame(() => {
    const list = listRef.current
    if (!list) return
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
    const top = list.getBoundingClientRect().top + window.scrollY - headerHeight - 12
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  })
}

function usePageTransition(setCurrentPage, listRef) {
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

function Pagination({ currentPage, pageCount, onChange, label, className = '' }) {
  if (pageCount <= 1) return null
  return (
    <nav className={`pagination ${className}`.trim()} aria-label={label}>
      <button type="button" disabled={currentPage === 1} onClick={() => onChange(Math.max(1, currentPage - 1))} aria-label="Página anterior"><ChevronLeft size={19} /></button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <button className={currentPage === page ? 'active' : ''} type="button" key={page} onClick={() => onChange(page)} aria-label={`Página ${page}`} aria-current={currentPage === page ? 'page' : undefined}>{page}</button>)}
      <button type="button" disabled={currentPage === pageCount} onClick={() => onChange(Math.min(pageCount, currentPage + 1))} aria-label="Página siguiente"><ChevronRight size={19} /></button>
    </nav>
  )
}

function productMatchesFilters(product, { priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter }) {
  const numericPrice = product.price.match(/\d+/)?.[0]
  const price = numericPrice ? Number(numericPrice) : null
  const definition = productWebserviceCatalog.find((entry) => entry.id === (product.sourceProductId ?? product.id))
  const combination = getProductCombination(product)
  const nave = product.filterNave ?? product.operators[0]?.place.split(' · ')[0] ?? ''
  const matchesPrice = priceFilter === 'all' || (priceFilter === 'noPrice' && price === null) || (price !== null && ((priceFilter === 'under50' && price < 50) || (priceFilter === '50to100' && price >= 50 && price <= 100) || (priceFilter === 'over100' && price > 100)))
  return matchesPrice
    && (varietyFilter === 'all' || combination?.variety === varietyFilter)
    && (presentationFilter === 'all' || combination?.presentation === presentationFilter)
    && (calibreFilter === 'all' || combination?.calibre === calibreFilter)
    && (categoryFilter === 'all' || combination?.category === categoryFilter)
    && (naveFilter === 'all' || nave === naveFilter)
    && (unitFilter === 'all' || combination?.unit === unitFilter)
}

function ProductFilterFields({ priceFilter, setPriceFilter, varietyFilter, setVarietyFilter, presentationFilter, setPresentationFilter, calibreFilter, setCalibreFilter, categoryFilter, setCategoryFilter, naveFilter, setNaveFilter, unitFilter, setUnitFilter }) {
  const varieties = [...new Set(productWebserviceCatalog.flatMap((entry) => entry.varieties))].sort((a, b) => a.localeCompare(b, 'es'))
  const presentations = [...new Set(productWebserviceCatalog.flatMap((entry) => entry.presentations))].sort((a, b) => a.localeCompare(b, 'es'))
  return (
    <>
      <label><span>Rango de precio</span><select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}><option value="all">Todos</option><option value="under50">Menos de $50</option><option value="50to100">De $50 a $100</option><option value="over100">Más de $100</option><option value="noPrice">Sin precio</option></select></label>
      <label><span>Variedad</span><select value={varietyFilter} onChange={(event) => setVarietyFilter(event.target.value)}><option value="all">Todas</option>{varieties.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Presentación</span><select value={presentationFilter} onChange={(event) => setPresentationFilter(event.target.value)}><option value="all">Todas</option>{presentations.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Calibre</span><select value={calibreFilter} onChange={(event) => setCalibreFilter(event.target.value)}><option value="all">Todos</option>{calibreCatalog.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
      <label><span>Categoría</span><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">Todas</option>{categoryCatalog.map((entry) => <option value={entry.code} key={entry.code}>{entry.description} · {entry.code}</option>)}</select></label>
      <label><span>Nave</span><select value={naveFilter} onChange={(event) => setNaveFilter(event.target.value)}><option value="all">Todas</option><option>Nave 1</option><option>Nave 2</option><option>Nave 3</option><option>Nave 4</option></select></label>
      <label><span>Unidad de medida</span><select value={unitFilter} onChange={(event) => setUnitFilter(event.target.value)}><option value="all">Todas</option>{measureUnits.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
    </>
  )
}

function SortField({ value, onChange, options }) {
  return <label><span>Ordenar por</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
}

function ListFilterToolbar({ query, setQuery, placeholder, searchLabel, activeFilterCount = 0, onClear, children, className = '' }) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className={`list-filter-toolbar ${className}`.trim()}>
      <div className="board-toolbar">
        <label className="search-box board-search">
          <span className="search-icon" aria-hidden="true"><Search size={20} strokeWidth={2.1} /></span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} aria-label={searchLabel ?? placeholder} />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpiar búsqueda"><X size={17} /></button>}
        </label>
        <button className={filtersOpen ? 'filter-button open' : 'filter-button'} type="button" onClick={() => setFiltersOpen((value) => !value)} aria-expanded={filtersOpen} aria-label={filtersOpen ? 'Cerrar filtros' : 'Abrir filtros'}>
          <SlidersHorizontal size={19} strokeWidth={2.1} aria-hidden="true" />
          <span>Filtros</span>
          {activeFilterCount > 0 && <b>{activeFilterCount}</b>}
        </button>
      </div>
      <div className={filtersOpen ? 'filters open' : 'filters'} aria-label="Filtros del listado" aria-hidden={!filtersOpen} inert={!filtersOpen}>
        {children}
        <button className="clear" type="button" onClick={onClear}>Limpiar filtros</button>
      </div>
    </div>
  )
}

function SmartProductList({ onOpenProduct }) {
  const [query, setQuery] = useState('')
  const recommendedProducts = smartPicks.map((pick) => ({ ...products.find((product) => product.id === pick.productId), description: pick.description }))
  const visibleProducts = recommendedProducts.filter((product) => !query.trim() || product.name.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es')))

  return (
    <div className="smart-list-area">
      <label className="smart-search"><Search size={18} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en la lista" aria-label="Buscar en la lista inteligente" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Limpiar búsqueda"><X size={16} /></button>}</label>
      <div className="smart-picks" aria-label="Productos recomendados">
        {visibleProducts.map((product) => (
          <article className="smart-product-row" key={product.id}>
            <img src={product.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} />
            <button type="button" onClick={() => onOpenProduct(product)}><strong>{product.name}</strong><small>{product.description}</small></button>
            <span><strong>{product.price}</strong></span>
          </article>
        ))}
      </div>
      {visibleProducts.length === 0 && <p className="smart-empty">No hay recomendaciones que coincidan.</p>}
    </div>
  )
}

function Board({ onOpenProduct, producerMode = false }) {
  const [boardCardVariant] = useBoardCardVariant()
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState([1, 2])
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)
  const [priceFilter, setPriceFilter] = useState('all')
  const [varietyFilter, setVarietyFilter] = useState('all')
  const [presentationFilter, setPresentationFilter] = useState('all')
  const [calibreFilter, setCalibreFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [naveFilter, setNaveFilter] = useState('all')
  const [unitFilter, setUnitFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const productListRef = useRef(null)
  const { changePage, isPageChanging } = usePageTransition(setCurrentPage, productListRef)

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('es')
    let result = term ? products.filter((product) => product.name.toLocaleLowerCase('es').includes(term)) : products
    if (activeFilter === 'Favoritos') result = result.filter((product) => favorites.includes(product.id))
    return result.filter((product) => productMatchesFilters(product, { priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter })).sort((a, b) => {
      const favoriteDifference = Number(favorites.includes(b.id)) - Number(favorites.includes(a.id))
      if (favoriteDifference) return favoriteDifference
      if (sortBy === 'priceAsc') return (Number(a.price.match(/\d+/)?.[0]) || Number.POSITIVE_INFINITY) - (Number(b.price.match(/\d+/)?.[0]) || Number.POSITIVE_INFINITY)
      if (sortBy === 'priceDesc') return (Number(b.price.match(/\d+/)?.[0]) || -1) - (Number(a.price.match(/\d+/)?.[0]) || -1)
      return a.name.localeCompare(b.name, 'es')
    })
  }, [activeFilter, calibreFilter, categoryFilter, favorites, naveFilter, presentationFilter, priceFilter, query, sortBy, unitFilter, varietyFilter])

  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize))
  const paginatedProducts = visibleProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => setCurrentPage(1), [activeFilter, calibreFilter, categoryFilter, favorites, naveFilter, presentationFilter, priceFilter, query, sortBy, unitFilter, varietyFilter])

  const activeFilterCount = [priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter].filter((value) => value !== 'all').length

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  return (
    <main id="top">
      <section className="hero" id="pizarron">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Actualizado hoy, 08:45</p>
          <h1>{producerMode ? <>Oferta de<br /><em>productores.</em></> : <>El mercado,<br /><em>más claro.</em></>}</h1>
          <p className="hero-description">{producerMode ? 'Mercadería publicada por productores para los operadores de la UAM.' : 'Precios y mercadería disponible hoy en la Unidad Agroalimentaria Metropolitana.'}</p>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1619153422227-08d462800327?auto=format&fit=crop&w=1200&q=88" alt="" />
          <div className="hero-note"><b>147</b><span>productos con<br />precio hoy</span></div>
        </div>
      </section>

      <section className="board-section">
        <div className="board-intro">
          <p className="board-kicker">{producerMode ? 'Pizarrón de productores' : 'Pizarrón de hoy'}</p>
          <h2>{query ? `Resultados para “${query}”` : producerMode ? 'Mercadería disponible' : 'Tus productos frecuentes'}</h2>
          <p>{query ? `${visibleProducts.length} ${visibleProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}` : producerMode ? 'Oferta publicada para operadores.' : 'Productos recientes y favoritos.'}</p>
        </div>

        <div className="board-controls">
          <div className="control-tabs-row">
            <div className="quick-filters" aria-label="Filtros rápidos">
              {['Todos', 'Favoritos'].map((filter) => (
                <button className={activeFilter === filter ? 'active' : ''} type="button" key={filter} onClick={() => setActiveFilter(filter)}>{filter}</button>
              ))}
            </div>
            <span className="market-count">147 precios actualizados hoy</span>
          </div>

          <ListFilterToolbar query={query} setQuery={setQuery} placeholder="Buscar fruta u hortaliza" searchLabel="Buscar un producto" activeFilterCount={activeFilterCount} onClear={() => { setPriceFilter('all'); setVarietyFilter('all'); setPresentationFilter('all'); setCalibreFilter('all'); setCategoryFilter('all'); setNaveFilter('all'); setUnitFilter('all'); setSortBy('name') }}>
              <SortField value={sortBy} onChange={setSortBy} options={[{ value: 'name', label: 'Nombre' }, { value: 'priceAsc', label: 'Menor precio' }, { value: 'priceDesc', label: 'Mayor precio' }]} />
              <ProductFilterFields priceFilter={priceFilter} setPriceFilter={setPriceFilter} varietyFilter={varietyFilter} setVarietyFilter={setVarietyFilter} presentationFilter={presentationFilter} setPresentationFilter={setPresentationFilter} calibreFilter={calibreFilter} setCalibreFilter={setCalibreFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} naveFilter={naveFilter} setNaveFilter={setNaveFilter} unitFilter={unitFilter} setUnitFilter={setUnitFilter} />
          </ListFilterToolbar>
        </div>

        <div className={isPageChanging ? 'product-grid page-changing' : 'product-grid'} ref={productListRef}>
          {paginatedProducts.map((product) => (
            <ProductListItem key={product.id} product={product} status={`${product.sellers} ${producerMode ? 'productores' : 'operadores'}`} onOpen={() => onOpenProduct(product, producerMode ? 'producer' : 'operator')} actionLayout={boardCardVariant} showUnit={false} actions={(
              <button className={favorites.includes(product.id) ? 'favorite selected' : 'favorite'} type="button" onClick={() => toggleFavorite(product.id)} aria-label={favorites.includes(product.id) ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}>
                <Star size={16} strokeWidth={2} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} aria-hidden="true" />
              </button>
            )} />
          ))}
        </div>

        <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label="Paginación del pizarrón" />

        {visibleProducts.length === 0 && (
          <div className="empty-state"><b>No encontramos “{query}”</b><span>Probá buscando manzana, tomate, palta o banana.</span></div>
        )}
      </section>

      {!producerMode && <section className="smart-section" id="inteligente">
        <div>
          <p className="eyebrow light-eyebrow">Elegí mejor esta semana</p>
          <h2>La lista<br /><em>inteligente.</em></h2>
          <p>Nueve frutas y hortalizas recomendadas por su abundancia, precio y calidad.</p>
          <a href="https://uam.com.uy/boletin-de-precios-mayoristas/#informes" target="_blank" rel="noreferrer">Ver informe semanal <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        <SmartProductList onOpenProduct={onOpenProduct} />
      </section>}
    </main>
  )
}

function DrawerShell({ onClose, labelledBy, className = '', onOpenPage, children }) {
  const swipeStartY = useRef(null)
  const [isClosing, setIsClosing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const requestClose = () => setIsClosing(true)
  const startSwipe = (event) => { swipeStartY.current = event.touches[0]?.clientY ?? null }
  const moveSwipe = (event) => {
    if (event.cancelable) event.preventDefault()
    const currentY = event.touches[0]?.clientY
    if (swipeStartY.current !== null && swipeStartY.current - currentY > 30) setIsExpanded(true)
  }
  const finishSwipe = (event) => {
    const endY = event.changedTouches[0]?.clientY
    if (swipeStartY.current !== null && endY - swipeStartY.current > 70) requestClose()
    swipeStartY.current = null
  }
  const swipeProps = {
    onTouchStart: startSwipe,
    onTouchMove: moveSwipe,
    onTouchEnd: finishSwipe,
    onTouchCancel: () => { swipeStartY.current = null },
  }

  return (
    <div className={isClosing ? 'panel-backdrop closing' : 'panel-backdrop'} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && requestClose()}>
      <section className={`product-panel${className ? ` ${className}` : ''}${isExpanded ? ' expanded' : ''}${isClosing ? ' closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy} onScroll={(event) => event.currentTarget.scrollTop > 4 && setIsExpanded(true)} onAnimationEnd={(event) => isClosing && event.animationName.includes('out') && onClose()}>
        <div className="panel-actions">
          {onOpenPage && <button className="panel-page-link" type="button" onClick={onOpenPage} aria-label="Abrir vista de página"><ArrowUpRight size={18} /></button>}
          <button className="panel-close" type="button" onClick={requestClose} aria-label="Cerrar"><X size={22} /></button>
        </div>
        {children(swipeProps)}
      </section>
    </div>
  )
}

function MediaModal({ src, alt, onClose }) {
  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className="media-modal" role="dialog" aria-modal="true" aria-label={alt} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <button type="button" onClick={onClose} aria-label="Cerrar imagen"><X size={22} /></button>
      <img src={src} alt={alt} />
    </div>
  )
}

const offerVariantStorageKey = 'mercado-hoy:provider-card-actions'
const validOfferVariants = ['stack', 'stack-centered', 'stack-horizontal', 'rail']

function readStoredOfferVariant() {
  const stored = window.localStorage.getItem(offerVariantStorageKey)
  return validOfferVariants.includes(stored) ? stored : 'stack-horizontal'
}

function useOfferVariant() {
  const [variant, setVariantState] = useState(readStoredOfferVariant)
  useEffect(() => {
    const syncVariant = (event) => {
      const nextVariant = event.detail ?? readStoredOfferVariant()
      if (validOfferVariants.includes(nextVariant)) setVariantState(nextVariant)
    }
    window.addEventListener('storage', syncVariant)
    window.addEventListener('offer-variant-change', syncVariant)
    return () => {
      window.removeEventListener('storage', syncVariant)
      window.removeEventListener('offer-variant-change', syncVariant)
    }
  }, [])
  const setVariant = (nextVariant) => {
    if (!validOfferVariants.includes(nextVariant)) return
    window.localStorage.setItem(offerVariantStorageKey, nextVariant)
    setVariantState(nextVariant)
    window.dispatchEvent(new CustomEvent('offer-variant-change', { detail: nextVariant }))
  }
  return [variant, setVariant]
}

function OperatorOfferCard({ operator, product, actionLayout = 'rail', onOpen = () => {}, onOpenMedia = () => {}, preview = false }) {
  return (
    <article className={`operator-row actions-${actionLayout}`} role="button" tabIndex="0" onClick={onOpen} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen() } }} aria-label={`Abrir mercado de ${operator.name}`}>
      {operator.offerPhoto ? <button className="operator-offer-photo" type="button" onClick={(event) => { event.stopPropagation(); onOpenMedia({ src: operator.offerPhoto, alt: `Mercadería aportada por ${operator.name}` }) }} aria-label={`Ampliar foto de ${operator.name}`}><img src={operator.offerPhoto} alt="" /></button> : <span className="operator-offer-photo empty" aria-label="Sin imagen">Sin imagen</span>}
      <div className="operator-identity"><h4>{operator.name}</h4><span>{operator.place}</span></div>
      <div className="operator-price-list">{operator.priceOptions.map((option) => <span key={option.key}><small>{option.label} · {option.unit}</small><strong><b>{option.price}</b></strong></span>)}</div>
      <div className={`offer-actions ${actionLayout}`}>
        <button type="button" onClick={(event) => event.stopPropagation()} aria-label={`Ver ubicación de ${operator.name}`}><MapPin size={15} /></button>
        <a href={`https://wa.me/?text=${encodeURIComponent(`Hola, consulto por ${product.name} en ${operator.name}`)}`} target="_blank" rel="noreferrer" onClick={(event) => { event.stopPropagation(); if (preview) event.preventDefault() }} aria-label={`Contactar a ${operator.name} por WhatsApp`}><MessageCircle size={15} /></a>
      </div>
    </article>
  )
}

function ProductPanel({ product, onClose, onOpenProvider, onOpenPage, actorRole = 'operator', asPage = false, onBack }) {
  const [offerVariant] = useOfferVariant()
  const [operatorQuery, setOperatorQuery] = useState('')
  const [operatorSort, setOperatorSort] = useState('price')
  const [selectedNave, setSelectedNave] = useState('Todas')
  const [selectedVariety, setSelectedVariety] = useState('all')
  const [selectedUnit, setSelectedUnit] = useState('all')
  const [selectedPresentation, setSelectedPresentation] = useState('all')
  const [selectedCalibre, setSelectedCalibre] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [mediaPreview, setMediaPreview] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const operatorListRef = useRef(null)

  const actors = (actorRole === 'producer' ? producerDirectory : product.operators).filter((operator) => operator.available !== false)
  const actorPlural = actorRole === 'producer' ? 'Productores' : 'Operadores'
  const actorSingular = actorRole === 'producer' ? 'productor' : 'operador'
  const naves = useMemo(() => [...new Set(actors.map((operator) => operator.place.split(' · ')[0]))], [actors])
  const visibleOperators = useMemo(() => {
    const term = operatorQuery.trim().toLocaleLowerCase('es')
    return actors.map((operator, index) => ({
      ...operator,
      offerPhoto: operator.photo !== undefined ? operator.photo : (index % 3 === 0 ? null : product.image),
      priceOptions: getOperatorPriceOptions(product, operator, index),
    }))
      .filter((operator) => !term || operator.name.toLocaleLowerCase('es').includes(term))
      .filter((operator) => selectedNave === 'Todas' || operator.place.startsWith(selectedNave))
      .filter((operator) => selectedVariety === 'all' || operator.priceOptions.some((option) => option.variety === selectedVariety))
      .filter((operator) => selectedUnit === 'all' || operator.priceOptions.some((option) => option.unit === selectedUnit))
      .filter((operator) => selectedPresentation === 'all' || operator.priceOptions.some((option) => option.presentation === selectedPresentation))
      .filter((operator) => selectedCalibre === 'all' || operator.priceOptions.some((option) => option.calibre === selectedCalibre))
      .filter((operator) => selectedCategory === 'all' || operator.priceOptions.some((option) => option.category === selectedCategory))
      .sort((a, b) => {
        if (a.available !== b.available) return a.available ? -1 : 1
        if (operatorSort === 'name') return a.name.localeCompare(b.name, 'es')
        const priceA = a.priceOptions[0]?.numericPrice ?? Number.POSITIVE_INFINITY
        const priceB = b.priceOptions[0]?.numericPrice ?? Number.POSITIVE_INFINITY
        return priceA - priceB
      })
  }, [actors, operatorQuery, operatorSort, product, selectedCalibre, selectedCategory, selectedNave, selectedPresentation, selectedUnit, selectedVariety])
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleOperators.length / pageSize))
  const paginatedOperators = visibleOperators.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => setCurrentPage(1), [operatorQuery, operatorSort, selectedCalibre, selectedCategory, selectedNave, selectedPresentation, selectedUnit, selectedVariety])

  const changePage = (page) => {
    setCurrentPage(page)
    window.requestAnimationFrame(() => operatorListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const offerContent = <>
    <ListFilterToolbar query={operatorQuery} setQuery={setOperatorQuery} placeholder={`Buscar ${actorSingular}`} searchLabel={`Buscar ${actorSingular} por nombre`} activeFilterCount={[selectedVariety, selectedUnit, selectedPresentation, selectedCalibre, selectedCategory].filter((value) => value !== 'all').length + (selectedNave === 'Todas' ? 0 : 1)} onClear={() => { setSelectedNave('Todas'); setSelectedVariety('all'); setSelectedUnit('all'); setSelectedPresentation('all'); setSelectedCalibre('all'); setSelectedCategory('all') }} className="drawer-filter-tools">
      <SortField value={operatorSort} onChange={setOperatorSort} options={[{ value: 'price', label: 'Mejor precio' }, { value: 'name', label: 'Nombre' }]} />
      <label><span>{actorRole === 'producer' ? 'Departamento' : 'Nave'}</span><select value={selectedNave} onChange={(event) => setSelectedNave(event.target.value)}><option>Todas</option>{naves.map((nave) => <option key={nave}>{nave}</option>)}</select></label>
      <label><span>Variedad</span><select value={selectedVariety} onChange={(event) => setSelectedVariety(event.target.value)}><option value="all">Todas</option>{[...new Set(productWebserviceCatalog.flatMap((entry) => entry.varieties))].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Unidad de medida</span><select value={selectedUnit} onChange={(event) => setSelectedUnit(event.target.value)}><option value="all">Todas</option>{measureUnits.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
      <label><span>Presentación</span><select value={selectedPresentation} onChange={(event) => setSelectedPresentation(event.target.value)}><option value="all">Todas</option>{[...new Set(productWebserviceCatalog.flatMap((entry) => entry.presentations))].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Calibre</span><select value={selectedCalibre} onChange={(event) => setSelectedCalibre(event.target.value)}><option value="all">Todos</option>{calibreCatalog.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
      <label><span>Categoría</span><select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}><option value="all">Todas</option>{categoryCatalog.map((entry) => <option value={entry.code} key={entry.code}>{entry.description} · {entry.code}</option>)}</select></label>
    </ListFilterToolbar>
    <div className="operator-list-heading"><h3>{actorPlural}</h3><span>{visibleOperators.length} de {actors.length}</span></div>
    <div className="operator-list" ref={operatorListRef}>
      {paginatedOperators.map((operator) => <OperatorOfferCard key={`${operator.name}-${operator.place}`} operator={operator} product={product} actionLayout={offerVariant} onOpen={() => onOpenProvider(operator, product, actorRole)} onOpenMedia={setMediaPreview} />)}
      {visibleOperators.length === 0 && <p className="operator-empty">No hay {actorPlural.toLocaleLowerCase('es')} que coincidan con la búsqueda.</p>}
    </div>
    <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label={`Paginación de ${actorPlural.toLocaleLowerCase('es')}`} className="drawer-pagination" />
  </>

  if (asPage) return <main className="product-details-page">
    <section className="product-details-hero">
      <button className="back-action" type="button" onClick={onBack}><ArrowLeft size={18} />Volver</button>
      <img src={product.image} alt={product.name} />
      <div><p>{actorPlural}</p><h1>{product.name}</h1><span>{product.detail}</span></div>
    </section>
    <section className="product-details-offers">{offerContent}</section>
    {mediaPreview && <MediaModal src={mediaPreview.src} alt={mediaPreview.alt} onClose={() => setMediaPreview(null)} />}
  </main>

  return (<>
    <DrawerShell onClose={onClose} labelledBy="product-panel-title" onOpenPage={onOpenPage ? () => onOpenPage(product, actorRole) : undefined}>
      {(swipeProps) => <>
        <div className="panel-swipe-header" {...swipeProps}>
          <span className="panel-swipe-handle" aria-hidden="true" />
          <img src={product.image} alt={product.name} />
        </div>
        <div className="panel-content">
          <div className="panel-product-heading" {...swipeProps}>
            <h2 id="product-panel-title">{product.name}</h2>
            <p className="panel-detail">{product.detail}</p>
          </div>

          {offerContent}
        </div>
      </>}
    </DrawerShell>
    {mediaPreview && <MediaModal src={mediaPreview.src} alt={mediaPreview.alt} onClose={() => setMediaPreview(null)} />}
  </>)
}

function VariantConcept({ number, title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const contentId = `variant-concept-${number}`
  return (
    <section className={open ? 'variant-concept open' : 'variant-concept'}>
      <button className="variant-concept-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={contentId}>
        <span className="variant-concept-heading"><p>Concepto {number}</p><h2>{title}</h2></span>
        <i><ChevronDown size={22} aria-hidden="true" /></i>
      </button>
      <div className="variant-concept-collapse" id={contentId} aria-hidden={!open} inert={!open}><div>{children}</div></div>
    </section>
  )
}

function VariantOption({ selected, title, onSelect, children }) {
  return (
    <article className={selected ? 'variant-option selected' : 'variant-option'}>
      <button className="variant-selector" type="button" onClick={onSelect} aria-pressed={selected}>
        <i>{selected && <Check size={15} />}</i>
        <span><strong>{title}</strong><small>{selected ? 'Seleccionada' : 'Seleccionar'}</small></span>
      </button>
      <div className="variant-preview">{children}</div>
    </article>
  )
}

function VariantsPage() {
  const [selectedVariant, setSelectedVariant] = useOfferVariant()
  const [selectedBoardVariant, setSelectedBoardVariant] = useBoardCardVariant()
  const [mediaPreview, setMediaPreview] = useState(null)
  const product = products[0]
  const sourceOperator = product.operators.find((entry) => entry.name === 'Los Aromos') ?? product.operators[0]
  const operator = { ...sourceOperator, offerPhoto: product.image, priceOptions: getOperatorPriceOptions(product, sourceOperator, 1) }
  const variants = [
    { id: 'stack-horizontal', title: 'Stack horizontal de icon buttons', actionLayout: 'stack-horizontal' },
    { id: 'stack', title: 'Stack de icon buttons', actionLayout: 'stack' },
    { id: 'stack-centered', title: 'Stack de icon buttons centrados', actionLayout: 'stack-centered' },
    { id: 'rail', title: 'Separación vertical', actionLayout: 'rail' },
  ]
  const boardVariants = [
    { id: 'icons-top-right', title: 'Icons top right' },
    { id: 'current', title: 'Actual' },
  ]
  const favoriteAction = <button className="favorite selected" type="button" aria-label={`Quitar ${product.name} de favoritos`}><Star size={16} strokeWidth={2} fill="currentColor" aria-hidden="true" /></button>

  return (
    <main className="variants-page">
      <header className="variants-heading"><p>Prototipo</p><h1>Variantes</h1><span>Comparación de componentes.</span></header>
      <div className="variant-concepts">
        <VariantConcept number="01" title="Listado de operadores en detalles del producto">
          <div className="variant-grid">
            {variants.map((variant) => <VariantOption selected={selectedVariant === variant.id} title={variant.title} onSelect={() => setSelectedVariant(variant.id)} key={variant.id}><OperatorOfferCard operator={operator} product={product} actionLayout={variant.actionLayout} onOpenMedia={setMediaPreview} preview /></VariantOption>)}
          </div>
        </VariantConcept>
        <VariantConcept number="02" title="Tarjetas del listado de pizarrón">
          <div className="variant-grid board-card-variant-grid">
            {boardVariants.map((variant) => <VariantOption selected={selectedBoardVariant === variant.id} title={variant.title} onSelect={() => setSelectedBoardVariant(variant.id)} key={variant.id}><ProductListItem product={product} status={`${product.sellers} operadores`} actionLayout={variant.id} showUnit={false} actions={favoriteAction} /></VariantOption>)}
          </div>
        </VariantConcept>
      </div>
      {mediaPreview && <MediaModal src={mediaPreview.src} alt={mediaPreview.alt} onClose={() => setMediaPreview(null)} />}
    </main>
  )
}

function ActorPanel({ entry, role, onClose, onOpenPage, onOpenProduct }) {
  const roleLabel = role === 'producer' ? 'Productor' : 'Operador'
  const directlyPublished = role === 'producer' ? [entry.product] : products.filter((product) => product.operators.some((operator) => operator.name === entry.name))
  const actorProducts = [...new Map([...directlyPublished, ...products].filter(Boolean).map((product) => [product.id, product])).values()].slice(0, Math.min(6, entry.productCount ?? 6))

  return (
    <DrawerShell onClose={onClose} labelledBy="actor-panel-title" className="actor-panel" onOpenPage={onOpenPage}>
      {(swipeProps) => <>
        <header className="actor-panel-header" {...swipeProps}>
          <i className="actor-panel-handle" aria-hidden="true" />
          <span>{roleLabel}</span>
          <h2 id="actor-panel-title">{entry.name}</h2>
          <p><MapPin size={16} />{entry.place}</p>
        </header>
        <div className="actor-panel-content">
          <div className="actor-panel-facts"><span><small>Mercadería publicada</small><strong>{entry.productCount} productos</strong></span><span><small>Horario</small><strong>04:00–13:00</strong></span></div>
          <div className="actor-panel-actions"><button type="button"><MapPin size={15} />Ubicación</button><a href={`https://wa.me/?text=${encodeURIComponent(`Hola, consulto por el mercado de ${entry.name}`)}`} target="_blank" rel="noreferrer"><MessageCircle size={15} />WhatsApp</a></div>
          <div className="actor-products-heading"><h3>Productos publicados</h3><span>{entry.productCount ?? actorProducts.length} productos</span></div>
          <div className="actor-product-list">
            {actorProducts.map((product, index) => {
              const publishedActor = product.operators?.find((operator) => operator.name === entry.name) ?? entry
              const priceOptions = getActorProductPriceOptions(product, { ...publishedActor, available: true, price: publishedActor.price ?? entry.price ?? product.price }, index)
              return <button className="has-price-options" type="button" key={product.id} onClick={() => onOpenProduct(product, role)}>
                <img src={product.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} />
                <span className="actor-product-copy"><strong>{product.name}</strong><span className="actor-product-price-list">{priceOptions.map((option) => <span key={option.key}><small>{option.variety} · Cat. {option.category} · {option.calibre} · {option.unit}</small><b>{option.price}</b></span>)}</span></span>
              </button>
            })}
          </div>
          <button className="actor-open-page" type="button" onClick={onOpenPage}>Ver página completa <ArrowUpRight size={17} /></button>
        </div>
      </>}
    </DrawerShell>
  )
}

const measureUnits = [
  { code: 'KG', name: 'Kilogramo', value: 'kg' },
  { code: 'CAJ', name: 'Cajón', value: 'cajón' },
  { code: 'BAN', name: 'Bandeja', value: 'bandeja' },
  { code: 'UN', name: 'Unidad', value: 'unidad' },
  { code: 'DOC', name: 'Docena', value: 'docena' },
]
const calibreCatalog = [{ code: 'G', name: 'Grande' }, { code: 'M', name: 'Mediano' }, { code: 'C', name: 'Chico' }, { code: 'EG', name: 'Extragrande' }]
const categoryCatalog = [{ code: 'E', description: 'Especial' }, { code: 'I', description: 'Primera' }, { code: 'II', description: 'Segunda' }]
const knownSpecies = {
  1: ['Frutas de hoja caduca', 'Manzana', 'Fuji'], 2: ['Frutos de huerta', 'Tomate', 'Redondo'], 3: ['Exóticos/importados', 'Palta', 'Hass'], 4: ['Exóticos/importados', 'Banana', 'Cavendish'],
  7: ['Frutas de hoja caduca', 'Pera', 'Williams'], 8: ['Frutas de hoja caduca', 'Durazno', 'Amarillo'], 14: ['Frutos de huerta', 'Morrón', 'Rojo'], 15: ['Frutos de huerta', 'Zapallito', 'Criollo'], 16: ['Frutos de huerta', 'Berenjena', 'Negra'],
}
const knownVarieties = {
  Manzana: ['Fuji', 'Granny Smith', 'Red Delicious'], Tomate: ['Redondo', 'Perita', 'Cherry'], Palta: ['Hass', 'Fuerte'], Banana: ['Cavendish', 'Williams'],
  Pera: ['Williams', 'Packham'], Durazno: ['Amarillo', 'Blanco'], Morrón: ['Rojo', 'Verde'], Zapallito: ['Criollo', 'Redondo'], Berenjena: ['Negra', 'Listada'],
}
const productWebserviceCatalog = products.map((product) => {
  const [group, species, variety] = knownSpecies[product.id] ?? ['Frutas y hortalizas', product.name, 'Estándar']
  const defaultUnit = measureUnits.find((unit) => unit.value === product.unitType) ?? measureUnits[0]
  const defaultCalibre = calibreCatalog.find((calibre) => product.detail.startsWith(calibre.name)) ?? calibreCatalog[1]
  const presentations = defaultUnit.code === 'CAJ' ? ['Cajón', 'Atado'] : defaultUnit.code === 'BAN' ? ['Bandeja', 'Caja'] : defaultUnit.code === 'UN' ? ['Unidad', 'Atado'] : ['Granel', 'Cajón']
  const varieties = [...new Set([variety, ...(knownVarieties[species] ?? (variety === 'Estándar' ? ['Común'] : []))])]
  return { id: product.id, product, group, species, variety, varieties, varietyCode: String(product.id).padStart(3, '0'), units: [defaultUnit, ...measureUnits.filter((unit) => unit.code !== defaultUnit.code)], presentations, calibres: [defaultCalibre, ...calibreCatalog.filter((calibre) => calibre.code !== defaultCalibre.code)], categories: categoryCatalog }
})

function getProductCombination(product) {
  const definition = productWebserviceCatalog.find((entry) => entry.id === (product.sourceProductId ?? product.id))
  if (!definition) return null
  return { variety: definition.variety, unit: definition.units[0].code, presentation: definition.presentations[0], calibre: definition.calibres[0].code, category: definition.categories.find((entry) => entry.code === 'I')?.code ?? definition.categories[0].code, ...(product.combination ?? {}) }
}

function getOperatorPriceOptions(product, operator, operatorIndex = 0) {
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

function getActorProductPriceOptions(product, actor, productIndex = 0) {
  const definition = productWebserviceCatalog.find((entry) => entry.id === (product.sourceProductId ?? product.id))
  if (!definition) return []
  const seed = [...`${actor.name ?? 'actor'}-${product.id}-${productIndex}`].reduce((total, character) => total + character.charCodeAt(0), 0)
  const optionCount = 2 + (seed % 6)
  const basePrice = Number(actor.price?.match(/\d+/)?.[0] ?? product.price.match(/\d+/)?.[0] ?? 0)
  return Array.from({ length: optionCount }, (_, index) => {
    const variety = definition.varieties[(seed + index) % definition.varieties.length]
    const unit = definition.units[(seed + index * 2) % definition.units.length]
    const calibre = definition.calibres[(seed + index * 3) % definition.calibres.length]
    const category = definition.categories[(seed + index) % definition.categories.length]
    return {
      key: `${product.id}-${variety}-${unit.code}-${category.code}-${calibre.code}-${index}`,
      variety,
      unit: unit.code,
      category: category.code,
      calibre: calibre.code,
      price: `$${basePrice + index * 4}`,
    }
  })
}

function ProductPriceFields({ productId, onProductChange, variety, setVariety, unit, setUnit, presentation, setPresentation, calibre, setCalibre, category, setCategory, photo, setPhoto, price, setPrice, lockProduct = false }) {
  const definition = productWebserviceCatalog.find((entry) => entry.id === Number(productId))
  const handlePhoto = (event) => { const file = event.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)) }
  return (
    <div className="field-grid product-price-fields">
      <label className="field wide"><span>Producto</span><select value={productId} onChange={(event) => onProductChange(event.target.value)} disabled={lockProduct} required><option value="">Seleccionar</option>{productWebserviceCatalog.map((entry) => <option key={entry.id} value={entry.id}>{entry.species}</option>)}</select></label>
      <label className="field wide"><span>Variedad</span><select value={variety} onChange={(event) => setVariety(event.target.value)} disabled={!definition} required><option value="">Seleccionar</option>{definition?.varieties.map((entry) => <option key={entry}>{entry}</option>)}</select></label>
      <label className="field"><span>Unidad de medida</span><select value={unit} onChange={(event) => setUnit(event.target.value)} disabled={!definition} required><option value="">Seleccionar</option>{definition?.units.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
      <label className="field"><span>Presentación</span><select value={presentation} onChange={(event) => setPresentation(event.target.value)} disabled={!definition} required><option value="">Seleccionar</option>{definition?.presentations.map((entry) => <option key={entry}>{entry}</option>)}</select></label>
      <label className="field"><span>Calibre</span><select value={calibre} onChange={(event) => setCalibre(event.target.value)} disabled={!definition} required><option value="">Seleccionar</option>{definition?.calibres.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
      <label className="field"><span>Categoría</span><select value={category} onChange={(event) => setCategory(event.target.value)} disabled={!definition} required><option value="">Seleccionar</option>{definition?.categories.map((entry) => <option value={entry.code} key={entry.code}>{entry.description} · {entry.code}</option>)}</select></label>
      <label className="default-photo optional-product-photo field wide">{photo ? <img src={photo} alt="Vista previa de la mercadería" /> : <ImagePlus size={24} />}<span><b>{photo ? 'Cambiar foto' : 'Agregar foto opcional'}</b><small>Foto de esta combinación comercial</small></span><input type="file" accept="image/*" onChange={handlePhoto} /></label>
      <label className="field wide"><span>Precio</span><div className="money-input"><i>$</i><input type="number" min="1" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Ingresar precio" required /><em>/ {measureUnits.find((entry) => entry.code === unit)?.name ?? 'unidad'}</em></div></label>
    </div>
  )
}

function buildPricedProduct({ definition, baseProduct, variety, unit, presentation, calibre, category, photo, price }) {
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

function PublicationPanel({ items, onClose, onSave }) {
  const loadedProductId = useRef(null)
  const [productId, setProductId] = useState('')
  const [variety, setVariety] = useState('')
  const [unit, setUnit] = useState('')
  const [presentation, setPresentation] = useState('')
  const [calibre, setCalibre] = useState('')
  const [category, setCategory] = useState('')
  const [photo, setPhoto] = useState('')
  const [price, setPrice] = useState('')

  const selectedDefinition = productWebserviceCatalog.find((definition) => definition.id === Number(productId))
  const matchedProduct = items.find((item) => {
    const combination = getProductCombination(item)
    return (item.sourceProductId ?? item.id) === Number(productId) && combination?.variety === variety && combination?.unit === unit && combination?.presentation === presentation && combination?.calibre === calibre && combination?.category === category
  })

  useEffect(() => {
    if (!matchedProduct || loadedProductId.current === matchedProduct.id) return
    loadedProductId.current = matchedProduct.id
    setPrice(matchedProduct.price.match(/\d+/)?.[0] ?? '')
    setPhoto(matchedProduct.image ?? '')
  }, [matchedProduct])

  const selectProduct = (nextProductId) => {
    const definition = productWebserviceCatalog.find((entry) => entry.id === Number(nextProductId))
    setProductId(nextProductId)
    setVariety(definition?.varieties[0] ?? '')
    setUnit(definition?.units[0].code ?? '')
    setPresentation(definition?.presentations[0] ?? '')
    setCalibre(definition?.calibres[0].code ?? '')
    setCategory(definition?.categories.find((entry) => entry.code === 'I')?.code ?? definition?.categories[0].code ?? '')
    setPhoto('')
    setPrice('')
    loadedProductId.current = null
  }
  const changeCombination = (setter, value) => {
    setter(value)
    setPhoto('')
    setPrice('')
    loadedProductId.current = null
  }
  const draftProduct = buildPricedProduct({ definition: selectedDefinition, baseProduct: matchedProduct ?? undefined, variety, unit, presentation, calibre, category, photo, price })

  return (
    <DrawerShell onClose={onClose} labelledBy="publication-panel-title" className="publication-panel">
      {(swipeProps) => <>
        <header className="publication-panel-header" {...swipeProps}>
          <i className="actor-panel-handle" aria-hidden="true" />
          <p>Nueva publicación</p>
          <h2 id="publication-panel-title">Agregar producto</h2>
          <span>Seleccioná las características de la mercadería.</span>
        </header>
        <form className="publication-panel-content" onSubmit={(event) => { event.preventDefault(); onSave(matchedProduct, draftProduct) }}>
          <ProductPriceFields productId={productId} onProductChange={selectProduct} variety={variety} setVariety={(value) => changeCombination(setVariety, value)} unit={unit} setUnit={(value) => changeCombination(setUnit, value)} presentation={presentation} setPresentation={(value) => changeCombination(setPresentation, value)} calibre={calibre} setCalibre={(value) => changeCombination(setCalibre, value)} category={category} setCategory={(value) => changeCombination(setCategory, value)} photo={photo} setPhoto={setPhoto} price={price} setPrice={setPrice} />
          {matchedProduct && <div className="existing-publication"><Check size={18} /><span><strong>Producto ya publicado</strong><small>Cargamos sus datos actuales para que puedas editarlos.</small></span></div>}
          <button className="primary-submit" type="submit" disabled={!draftProduct}>{matchedProduct ? 'Guardar cambios' : 'Publicar producto'} <ArrowRight size={20} /></button>
        </form>
      </>}
    </DrawerShell>
  )
}

function Publish({ onDone }) {
  const [available, setAvailable] = useState(true)
  const [photo, setPhoto] = useState('')
  const [saved, setSaved] = useState(false)

  const handlePhoto = (event) => {
    const file = event.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSaved(true)
  }

  if (saved) {
    return (
      <main className="success-page">
        <div className="success-mark"><Check size={38} strokeWidth={2.4} /></div>
        <p className="eyebrow"><span /> Publicado</p>
        <h1>Ya está en<br /><em>el pizarrón.</em></h1>
        <p>Tu precio de Manzana Fuji quedó visible para los compradores.</p>
        <div className="success-actions">
          <button type="button" onClick={() => setSaved(false)}>Publicar otro</button>
          <button className="secondary-action" type="button" onClick={onDone}>Volver al pizarrón</button>
        </div>
      </main>
    )
  }

  return (
    <main className="form-page">
      <aside className="form-aside">
        <p className="eyebrow light-eyebrow">Operadores</p>
        <h1>¿Qué tenés<br /><em>hoy?</em></h1>
        <p>Indicá la mercadería disponible, el precio y la ubicación.</p>
      </aside>
      <section className="form-content">
        <div className="form-title">
          <div><h2>Nueva publicación</h2><p>La información será visible solamente durante el día de hoy.</p></div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className={photo ? 'photo-control has-photo' : 'photo-control'}>
            {photo ? <img src={photo} alt="Vista previa de la mercadería" /> : <span className="camera-icon"><Camera size={26} /></span>}
            <span><b>{photo ? 'Cambiar foto' : 'Sacar una foto'}</b><small>Foto de la mercadería disponible</small></span>
            <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} />
          </label>

          <div className="field-grid">
            <label className="field wide"><span>Producto</span><select defaultValue="Manzana"><option>Manzana</option><option>Tomate</option><option>Palta</option><option>Banana</option></select></label>
            <label className="field"><span>Variedad</span><select defaultValue="Fuji"><option>Fuji</option><option>Granny Smith</option><option>Red Delicious</option></select></label>
            <label className="field"><span>Unidad</span><select defaultValue="Kilogramo"><option>Kilogramo</option><option>Docena</option><option>Unidad</option></select></label>
            <label className="field"><span>Calibre</span><select defaultValue="Grande"><option>Grande</option><option>Mediano</option><option>Chico</option></select></label>
            <label className="field"><span>Categoría</span><select defaultValue="I"><option>E</option><option>I</option><option>II</option></select></label>
            <label className="field"><span>Precio</span><div className="money-input"><i>$</i><input type="number" defaultValue="58" aria-label="Precio" /><em>/ kg</em></div></label>
            <label className="field"><span>Ubicación</span><select defaultValue="Nave 2 · Puesto 18"><option>Nave 2 · Puesto 18</option><option>Nave 1 · Puesto 42</option></select></label>
          </div>

          <div className="availability-control">
            <div><b>Disponible hoy</b><span>Los compradores podrán encontrar esta mercadería.</span></div>
            <button className={available ? 'switch on' : 'switch'} type="button" onClick={() => setAvailable((value) => !value)} aria-pressed={available}><i /></button>
          </div>

          <button className="primary-submit" type="submit">Publicar precio <ArrowRight size={20} /></button>
        </form>
      </section>
    </main>
  )
}

function Login({ onLogin, onRecover }) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-photo" />
      </section>
      <section className="login-content">
        <div className="login-box">
          <p className="eyebrow"><span /> Acceso para operadores</p>
          <h1>Bienvenido<br /><em>de nuevo.</em></h1>
          <p className="login-intro">Ingresá para publicar y actualizar tus precios de hoy.</p>
          <button className="google-signin" type="button" onClick={onLogin}><GoogleIcon />Iniciar con Google</button>
          <div className="login-separator"><span>o ingresá con usuario</span></div>
          <form onSubmit={(event) => { event.preventDefault(); onLogin() }}>
            <label className="field"><span>Usuario</span><input type="text" placeholder="Tu usuario" required /></label>
            <label className="field"><span>Contraseña</span><div className="password-input"><input type={showPassword ? 'text' : 'password'} placeholder="Tu contraseña" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}<span>{showPassword ? 'Ocultar' : 'Ver'}</span></button></div></label>
            <button className="help-link" type="button" onClick={onRecover}>¿Necesitás ayuda para ingresar?</button>
            <button className="primary-submit" type="submit">Ingresar <ArrowRight size={20} /></button>
          </form>
          <p className="privacy-note">El pizarrón es público. Solo necesitás ingresar para publicar.</p>
        </div>
      </section>
    </main>
  )
}

function TwoFactorChallenge({ onComplete, onBack }) {
  return (
    <main className="auth-flow-page">
      <section className="auth-flow-card">
        <p className="eyebrow"><span /> Verificación de identidad</p>
        <h1>Ingresá el<br /><em>código.</em></h1>
        <p className="auth-flow-intro">Abrí tu aplicación de autenticación e ingresá el código de seis dígitos.</p>
        <form onSubmit={(event) => { event.preventDefault(); onComplete() }}>
          <label className="field"><span>Código de autenticación</span><input className="verification-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength="6" placeholder="000000" required /></label>
          <button className="primary-submit" type="submit">Verificar código <ArrowRight size={20} /></button>
          <button className="text-action" type="button" onClick={onBack}>Volver al login</button>
        </form>
      </section>
    </main>
  )
}

function TwoFactorSetup({ onComplete }) {
  const setupSecret = 'JBSWY3DPEHPK3PXPGEZDGNBVGY3TQOJQ'
  const displaySecret = setupSecret.match(/.{1,4}/g).join(' ')
  const [copied, setCopied] = useState(false)
  const copySecret = async () => {
    await navigator.clipboard.writeText(setupSecret)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main className="auth-flow-page">
      <section className="auth-flow-card setup-card">
        <p className="eyebrow"><span /> Seguridad de la cuenta</p>
        <h1>Configurá<br /><em>2FA.</em></h1>
        <p className="auth-flow-intro">Escaneá este código con tu aplicación de autenticación y confirmá el primer código generado.</p>
        <div className="two-factor-setup">
          <div className="qr-code" aria-label="Código QR para configurar Mercado Hoy en una aplicación de autenticación">
            <QRCodeSVG value={`otpauth://totp/Mercado%20Hoy:operador@uam.com.uy?secret=${setupSecret}&issuer=Mercado%20Hoy&algorithm=SHA1&digits=6&period=30`} size={164} level="M" marginSize={2} />
          </div>
          <div className="setup-key"><span>Clave manual</span><button type="button" onClick={copySecret} aria-label="Copiar clave manual"><code>{displaySecret}</code><small>{copied ? 'Copiada' : 'Tocá para copiar'}</small></button></div>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); onComplete() }}>
          <label className="field"><span>Código de confirmación</span><input className="verification-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength="6" placeholder="000000" required /></label>
          <button className="primary-submit" type="submit">Activar 2FA <Check size={20} /></button>
        </form>
      </section>
    </main>
  )
}

function PasswordRecovery({ onBack }) {
  const [recoveryMode, setRecoveryMode] = useState('email')
  const [sent, setSent] = useState(false)
  const [formHeight, setFormHeight] = useState(0)
  const emailFormRef = useRef(null)
  const supportFormRef = useRef(null)

  useEffect(() => {
    const activeForm = recoveryMode === 'email' ? emailFormRef.current : supportFormRef.current
    const updateHeight = () => setFormHeight(activeForm?.scrollHeight ?? 0)
    window.requestAnimationFrame(updateHeight)
    const observer = new ResizeObserver(updateHeight)
    if (activeForm) observer.observe(activeForm)
    window.addEventListener('resize', updateHeight)
    return () => { observer.disconnect(); window.removeEventListener('resize', updateHeight) }
  }, [recoveryMode])

  if (sent) {
    return (
      <main className="auth-flow-page">
        <section className="auth-flow-card auth-confirmation">
          <div className="success-mark"><Check size={38} /></div>
          <h1>Solicitud<br /><em>recibida.</em></h1>
          <p>Te enviaremos los próximos pasos utilizando los datos ingresados.</p>
          <button className="primary-submit" type="button" onClick={onBack}>Volver al login <ArrowRight size={20} /></button>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-flow-page">
      <section className="auth-flow-card recovery-card">
        <p className="eyebrow"><span /> Recuperación de acceso</p>
        <h1>Recuperá tu<br /><em>cuenta.</em></h1>
        <div className="recovery-tabs" role="tablist" aria-label="Método de recuperación">
          <button className={recoveryMode === 'email' ? 'active' : ''} type="button" role="tab" aria-selected={recoveryMode === 'email'} onClick={() => setRecoveryMode('email')}>Por email</button>
          <button className={recoveryMode === 'support' ? 'active' : ''} type="button" role="tab" aria-selected={recoveryMode === 'support'} onClick={() => setRecoveryMode('support')}>Contactar soporte</button>
        </div>
        <div className="recovery-form-switch" style={{ height: formHeight || undefined }}>
          <form ref={emailFormRef} className={recoveryMode === 'email' ? 'active' : ''} aria-hidden={recoveryMode !== 'email'} inert={recoveryMode !== 'email'} onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
            <label className="field"><span>Email de la cuenta</span><input type="email" placeholder="nombre@empresa.com" required disabled={recoveryMode !== 'email'} /></label>
            <button className="primary-submit" type="submit" disabled={recoveryMode !== 'email'}>Enviar enlace <ArrowRight size={20} /></button>
          </form>
          <form ref={supportFormRef} className={recoveryMode === 'support' ? 'active' : ''} aria-hidden={recoveryMode !== 'support'} inert={recoveryMode !== 'support'} onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
            <label className="field"><span>Nombre y apellido</span><input type="text" placeholder="Tu nombre" required disabled={recoveryMode !== 'support'} /></label>
            <label className="field"><span>Email de la cuenta (opcional)</span><input type="text" placeholder="Si lo recordás" disabled={recoveryMode !== 'support'} /></label>
            <label className="field"><span>¿Qué problema tenés?</span><textarea placeholder="Contanos qué necesitás resolver" rows="5" required disabled={recoveryMode !== 'support'} /></label>
            <button className="primary-submit" type="submit" disabled={recoveryMode !== 'support'}>Enviar consulta <ArrowRight size={20} /></button>
          </form>
        </div>
      </section>
    </main>
  )
}

function ResetPasswordPage({ onComplete }) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [saved, setSaved] = useState(false)

  if (saved) return <main className="auth-flow-page"><section className="auth-flow-card auth-confirmation"><div className="success-mark"><Check size={38} /></div><h1>Contraseña<br /><em>actualizada.</em></h1><p>Ya podés ingresar con tu nueva contraseña.</p><button className="primary-submit" type="button" onClick={onComplete}>Ir al login <ArrowRight size={20} /></button></section></main>

  return (
    <main className="auth-flow-page">
      <section className="auth-flow-card recovery-card">
        <p className="eyebrow"><span /> Enlace de recuperación</p>
        <h1>Creá una nueva<br /><em>contraseña.</em></h1>
        <p className="auth-flow-intro">Este enlace identifica tu cuenta y se puede utilizar una sola vez.</p>
        <form onSubmit={(event) => { event.preventDefault(); if (password === confirmation) setSaved(true) }}>
          <label className="field"><span>Nueva contraseña</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="8" autoComplete="new-password" required /></label>
          <label className="field"><span>Repetir contraseña</span><input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength="8" autoComplete="new-password" required /></label>
          {confirmation && password !== confirmation && <p className="field-error">Las contraseñas no coinciden.</p>}
          <button className="primary-submit" type="submit" disabled={!password || password !== confirmation}>Guardar contraseña <Check size={20} /></button>
        </form>
      </section>
    </main>
  )
}

function ActorDirectory({ eyebrow, title, description, entries, onOpen, filterLabel, getFilterValue, showLocationAction = false, showWhatsapp = false, highlightPlace = false }) {
  const [query, setQuery] = useState('')
  const [filterValue, setFilterValue] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const listRef = useRef(null)
  const { changePage, isPageChanging } = usePageTransition(setCurrentPage, listRef)
  const filterOptions = useMemo(() => [...new Set(entries.map(getFilterValue))], [entries, getFilterValue])
  const visibleEntries = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('es')
    return entries.filter((entry) => (!term || `${entry.name} ${entry.place}`.toLocaleLowerCase('es').includes(term)) && (filterValue === 'all' || getFilterValue(entry) === filterValue)).sort((a, b) => sortBy === 'products' ? (b.productCount ?? 0) - (a.productCount ?? 0) : sortBy === 'location' ? a.place.localeCompare(b.place, 'es') : a.name.localeCompare(b.name, 'es'))
  }, [entries, filterValue, getFilterValue, query, sortBy])
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleEntries.length / pageSize))
  const paginatedEntries = visibleEntries.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => setCurrentPage(1), [filterValue, query, sortBy])

  return (
    <main className="directory-page">
      <header className="directory-heading">
        <div className="directory-heading-copy">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <span>{description}</span>
          <small className="directory-availability"><b>{visibleEntries.length}</b> disponibles</small>
        </div>
      </header>
      <ListFilterToolbar query={query} setQuery={setQuery} placeholder={`Buscar ${title.toLocaleLowerCase('es')}`} activeFilterCount={filterValue === 'all' ? 0 : 1} onClear={() => { setFilterValue('all'); setSortBy('name') }} className="directory-tools">
        <SortField value={sortBy} onChange={setSortBy} options={[{ value: 'name', label: 'Nombre' }, { value: 'location', label: filterLabel }, { value: 'products', label: 'Más productos' }]} />
        <label><span>{filterLabel}</span><select value={filterValue} onChange={(event) => setFilterValue(event.target.value)}><option value="all">Todos</option>{filterOptions.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
      </ListFilterToolbar>
      <div className={isPageChanging ? 'directory-list page-changing' : 'directory-list'} ref={listRef}>
        {paginatedEntries.map((entry) => (
          <article key={`${entry.name}-${entry.place}-${entry.product?.id ?? entry.productCount}`}>
            <button className="directory-main" type="button" onClick={() => onOpen(entry)}>
              <span className={highlightPlace ? 'directory-name highlight-place' : 'directory-name'}><strong>{entry.name}</strong><small>{!highlightPlace && <MapPin size={14} />}{entry.place}</small><em>{entry.productCount} productos</em></span>
            </button>
            {(showLocationAction || showWhatsapp) && (
              <div className="operator-actions directory-actions">
                {showLocationAction && <button type="button" aria-label={`Ver ubicación de ${entry.name}`}><MapPin size={15} /></button>}
                {showWhatsapp && <a href={`https://wa.me/?text=${encodeURIComponent(`Hola, consulto por el mercado de ${entry.name}`)}`} target="_blank" rel="noreferrer" aria-label={`Contactar a ${entry.name} por WhatsApp`}><MessageCircle size={15} /></a>}
              </div>
            )}
          </article>
        ))}
      </div>
      {visibleEntries.length === 0 && <div className="catalog-empty"><h2>No hay resultados</h2></div>}
      <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label={`Paginación de ${title.toLocaleLowerCase('es')}`} />
    </main>
  )
}

function ProviderMarket({ operator, originProduct, onBack, onOpenProduct, eyebrow = 'Mercado del operador', backLabel = 'Volver al pizarrón', items = products, editable = false, onEdit, onRemove, onCreate, vacation = null, onOpenSubstitute }) {
  const [query, setQuery] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const [varietyFilter, setVarietyFilter] = useState('all')
  const [presentationFilter, setPresentationFilter] = useState('all')
  const [calibreFilter, setCalibreFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [naveFilter, setNaveFilter] = useState('all')
  const [unitFilter, setUnitFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingHours, setEditingHours] = useState(false)
  const [selectedDays, setSelectedDays] = useState(calendarDays.slice(0, 6).map((day) => day.id))
  const [openingTime, setOpeningTime] = useState('04:00')
  const [closingTime, setClosingTime] = useState('13:00')
  const listRef = useRef(null)
  const { changePage, isPageChanging } = usePageTransition(setCurrentPage, listRef)
  const publishedProducts = items.map((product, index) => ({
    ...product,
    marketPrice: editable ? product.price : product.id !== 4 && product.id === originProduct?.id && operator.price !== '—' ? operator.price : product.price,
    stockLabel: index === 2 ? 'Pocas unidades' : 'Disponible',
    filterNave: operator.place.split(' · ')[0],
  }))
  const visibleProducts = publishedProducts.filter((product) => (!query.trim() || product.name.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))) && productMatchesFilters(product, { priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter })).sort((a, b) => sortBy === 'priceAsc' ? (Number(a.marketPrice.match(/\d+/)?.[0]) || Number.POSITIVE_INFINITY) - (Number(b.marketPrice.match(/\d+/)?.[0]) || Number.POSITIVE_INFINITY) : sortBy === 'priceDesc' ? (Number(b.marketPrice.match(/\d+/)?.[0]) || -1) - (Number(a.marketPrice.match(/\d+/)?.[0]) || -1) : a.name.localeCompare(b.name, 'es'))
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize))
  const paginatedProducts = visibleProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const activeFilterCount = [priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter].filter((value) => value !== 'all').length
  const scheduleDaysLabel = selectedDays.length === 6 && !selectedDays.includes('sun')
    ? 'Lunes a sábado'
    : selectedDays.length === 7
      ? 'Todos los días'
      : calendarDays.filter((day) => selectedDays.includes(day.id)).map((day) => day.label.slice(0, 3)).join(', ') || 'Sin días seleccionados'

  const toggleScheduleDay = (dayId) => {
    setSelectedDays((current) => current.includes(dayId) ? current.filter((id) => id !== dayId) : [...current, dayId])
  }

  useEffect(() => setCurrentPage(1), [calibreFilter, categoryFilter, naveFilter, presentationFilter, priceFilter, query, sortBy, unitFilter, varietyFilter])

  return (
    <main className="provider-market-page">
      <section className="provider-market-hero">
        <button className="back-action" type="button" onClick={onBack}><ArrowLeft size={18} />{backLabel}</button>
        <p className="eyebrow"><span /> {eyebrow}</p>
        <h1>{operator.name}</h1>
        <div className="provider-facts">
          <div><MapPin size={21} /><span><small>Ubicación</small><strong>{operator.place}</strong><em>Unidad Agroalimentaria Metropolitana</em></span></div>
          <div className={editingHours ? 'schedule-fact editing' : 'schedule-fact'}>
            <Clock size={21} />
            <span>
              <small>Horario</small>
              <strong>{scheduleDaysLabel}</strong>
              {editingHours ? (
                <span className="schedule-editor">
                  <span className="schedule-days" role="group" aria-label="Días de atención">
                    {calendarDays.map((day) => <button className={selectedDays.includes(day.id) ? 'active' : ''} type="button" key={day.id} onClick={() => toggleScheduleDay(day.id)} aria-pressed={selectedDays.includes(day.id)} aria-label={day.label}>{day.short}</button>)}
                  </span>
                  <span className="schedule-times">
                    <label><small>Apertura</small><input type="time" value={openingTime} onChange={(event) => setOpeningTime(event.target.value)} aria-label="Hora de apertura" /></label>
                    <label><small>Cierre</small><input type="time" value={closingTime} onChange={(event) => setClosingTime(event.target.value)} aria-label="Hora de cierre" /></label>
                  </span>
                </span>
              ) : <em>{openingTime}–{closingTime}</em>}
            </span>
            {editable && <button className="edit-schedule" type="button" onClick={() => setEditingHours((value) => !value)} aria-label={editingHours ? 'Guardar horario' : 'Editar horario'}>{editingHours ? <Check size={15} /> : <Pencil size={15} />}</button>}
          </div>
        </div>
        {vacation && <aside className="vacation-notice">
          <CalendarDays size={22} />
          <div><small>Operador ausente</small><strong>{formatShortDate(vacation.start)} — {formatShortDate(vacation.end)}</strong><p>{vacation.description}</p>{vacation.substitute && <button type="button" onClick={onOpenSubstitute}>Atiende {vacation.substitute.name} <ArrowUpRight size={16} /></button>}</div>
        </aside>}
        {!editable && <a className="provider-whatsapp" href={`https://wa.me/?text=${encodeURIComponent(`Hola, consulto por la mercadería de ${operator.name}`)}`} target="_blank" rel="noreferrer"><MessageCircle size={18} />Contactar por WhatsApp</a>}
      </section>

      <section className="provider-products">
        <div className="provider-products-heading"><div><p>Publicaciones de hoy</p><h2>Productos y precios</h2></div><span>{visibleProducts.length} productos</span>{editable && <button className="provider-add" type="button" onClick={onCreate} aria-label="Agregar producto"><Plus size={19} /></button>}</div>
        <ListFilterToolbar query={query} setQuery={setQuery} placeholder="Buscar producto" activeFilterCount={activeFilterCount} onClear={() => { setPriceFilter('all'); setVarietyFilter('all'); setPresentationFilter('all'); setCalibreFilter('all'); setCategoryFilter('all'); setNaveFilter('all'); setUnitFilter('all'); setSortBy('name') }} className="provider-product-tools">
          <SortField value={sortBy} onChange={setSortBy} options={[{ value: 'name', label: 'Nombre' }, { value: 'priceAsc', label: 'Menor precio' }, { value: 'priceDesc', label: 'Mayor precio' }]} />
          <ProductFilterFields priceFilter={priceFilter} setPriceFilter={setPriceFilter} varietyFilter={varietyFilter} setVarietyFilter={setVarietyFilter} presentationFilter={presentationFilter} setPresentationFilter={setPresentationFilter} calibreFilter={calibreFilter} setCalibreFilter={setCalibreFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} naveFilter={naveFilter} setNaveFilter={setNaveFilter} unitFilter={unitFilter} setUnitFilter={setUnitFilter} />
        </ListFilterToolbar>
        <div className={isPageChanging ? 'provider-product-list page-changing' : 'provider-product-list'} ref={listRef}>
          {paginatedProducts.map((product) => (
            <ProductListItem key={product.id} product={product} price={product.marketPrice} status={product.stockLabel} onOpen={() => onOpenProduct(product)} actions={editable ? (<><button className="catalog-edit" type="button" onClick={() => onEdit?.(product)} aria-label={`Editar precio de ${product.name}`}><Pencil size={15} /></button><button className="catalog-remove" type="button" onClick={() => onRemove?.(product.id)} aria-label={`Eliminar ${product.name}`}><Trash2 size={15} /></button></>) : null} />
          ))}
        </div>
        {visibleProducts.length === 0 && <div className="catalog-empty"><h2>No hay productos que coincidan</h2></div>}
        <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label="Paginación de productos" />
      </section>
    </main>
  )
}

function EditPrice({ product, onSave, onCancel }) {
  const definition = productWebserviceCatalog.find((entry) => entry.id === (product.sourceProductId ?? product.id)) ?? productWebserviceCatalog[0]
  const initialCombination = getProductCombination(product) ?? { variety: definition.varieties[0], unit: definition.units[0].code, presentation: definition.presentations[0], calibre: definition.calibres[0].code, category: definition.categories[0].code }
  const [variety, setVariety] = useState(initialCombination.variety)
  const [unit, setUnit] = useState(initialCombination.unit)
  const [presentation, setPresentation] = useState(initialCombination.presentation)
  const [calibre, setCalibre] = useState(initialCombination.calibre)
  const [category, setCategory] = useState(initialCombination.category)
  const [photo, setPhoto] = useState(product.image ?? '')
  const [price, setPrice] = useState(product.price.match(/\d+/)?.[0] ?? '')
  const [available, setAvailable] = useState(true)
  const updatedProduct = buildPricedProduct({ definition, baseProduct: product, variety, unit, presentation, calibre, category, photo, price })

  return (
    <main className="form-page edit-price-page">
      <aside className="form-aside">
        <p className="eyebrow light-eyebrow">Mi catálogo</p>
        <h1>Actualizá<br /><em>el precio.</em></h1>
        <p>{product.name}<br />{product.detail}</p>
      </aside>
      <section className="form-content">
        <div className="form-title"><div><h2>Editar precio</h2><p>La actualización se refleja en el catálogo de hoy.</p></div></div>
        <form onSubmit={(event) => { event.preventDefault(); if (updatedProduct) onSave(updatedProduct) }}>
          <div className="edit-product-summary"><img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} /><div><strong>{product.name}</strong><span>{product.detail}</span></div></div>
          <ProductPriceFields productId={String(definition.id)} onProductChange={() => {}} lockProduct variety={variety} setVariety={setVariety} unit={unit} setUnit={setUnit} presentation={presentation} setPresentation={setPresentation} calibre={calibre} setCalibre={setCalibre} category={category} setCategory={setCategory} photo={photo} setPhoto={setPhoto} price={price} setPrice={setPrice} />
          <div className="availability-control"><div><b>Publicado hoy</b><span>Define si el producto aparece en tu catálogo.</span></div><button className={available ? 'switch on' : 'switch'} type="button" onClick={() => setAvailable((value) => !value)} aria-pressed={available}><i /></button></div>
          <button className="primary-submit" type="submit" disabled={!updatedProduct}>Guardar precio <Check size={20} /></button>
          <button className="text-action" type="button" onClick={onCancel}>Cancelar</button>
        </form>
      </section>
    </main>
  )
}

function VacationPage({ value, onSave }) {
  const [start, setStart] = useState(value.start)
  const [end, setEnd] = useState(value.end)
  const [description, setDescription] = useState(value.description)
  const [substituteKey, setSubstituteKey] = useState(value.substitute ? actorOptionKey(value.substitute) : '')

  return (
    <main className="form-page vacation-page">
      <aside className="form-aside">
        <p className="eyebrow light-eyebrow">Mi mercado</p>
        <h1>Modo<br /><em>vacaciones.</em></h1>
        <p>Informá las fechas y quién atenderá tus pedidos durante la ausencia.</p>
      </aside>
      <section className="form-content">
        <div className="form-title"><div><h2>Programar vacaciones</h2><p>Esta información se mostrará públicamente en tu mercado.</p></div></div>
        <form onSubmit={(event) => { event.preventDefault(); onSave({ start, end, description, substitute: vacationReplacementOptions.find((entry) => actorOptionKey(entry) === substituteKey) ?? null }) }}>
          <div className="field-grid">
            <label className="field"><span>Fecha de inicio</span><input type="date" value={start} onChange={(event) => setStart(event.target.value)} required /></label>
            <label className="field"><span>Fecha de fin</span><input type="date" value={end} min={start} onChange={(event) => setEnd(event.target.value)} required /></label>
            <label className="field wide"><span>Descripción</span><textarea rows="5" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Información para tus clientes" required /></label>
            <label className="field wide"><span>Operador de reemplazo (opcional)</span><select value={substituteKey} onChange={(event) => setSubstituteKey(event.target.value)}><option value="">Sin reemplazo</option>{vacationReplacementOptions.map((entry) => <option value={actorOptionKey(entry)} key={actorOptionKey(entry)}>{entry.name} · {entry.place}</option>)}</select></label>
          </div>
          <button className="primary-submit" type="submit">Iniciar licencia <CalendarDays size={20} /></button>
        </form>
      </section>
    </main>
  )
}

function AdminHeader({ eyebrow, title, description, count, onCreate }) {
  return (
    <header className="admin-header">
      <div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div>
      {(count !== undefined || onCreate) && <div className="admin-header-actions">{count !== undefined && <small>{count} registros</small>}{onCreate && <button type="button" onClick={onCreate} aria-label={`Agregar ${title.toLocaleLowerCase('es')}`}><Plus size={20} /></button>}</div>}
    </header>
  )
}

function AdminManagementPage({ kind, items, onCreate, onEdit, onDelete }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [nave, setNave] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const listRef = useRef(null)
  const { changePage, isPageChanging } = usePageTransition(setCurrentPage, listRef)
  const labels = kind === 'producer' ? { eyebrow: 'Usuarios del sistema', title: 'Productores', description: 'Alta, modificación y baja de productores habilitados.' } : { eyebrow: 'Usuarios del sistema', title: 'Operadores', description: 'Alta, modificación y baja de puestos habilitados en la UAM.' }
  const naveOptions = [...new Set(items.map((item) => item.nave).filter(Boolean))].sort()
  const filteredItems = items
    .filter((item) => (!query.trim() || `${item.name} ${item.place ?? ''} ${item.email ?? ''} ${item.responsible ?? ''}`.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))) && (status === 'all' || (status === 'active') === (item.active !== false)) && (kind !== 'operator' || nave === 'all' || item.nave === nave))
    .sort((a, b) => sortBy === 'status' ? Number(b.active !== false) - Number(a.active !== false) : sortBy === 'location' ? (a.nave ?? a.place ?? '').localeCompare(b.nave ?? b.place ?? '', 'es') : a.name.localeCompare(b.name, 'es'))
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  useEffect(() => setCurrentPage(1), [nave, query, sortBy, status])
  return (
    <main className="admin-page">
      <AdminHeader {...labels} count={items.length} onCreate={onCreate} />
      <ListFilterToolbar query={query} setQuery={setQuery} placeholder={`Buscar ${labels.title.toLocaleLowerCase('es')}`} activeFilterCount={[status, nave].filter((value) => value !== 'all').length} onClear={() => { setStatus('all'); setNave('all'); setSortBy('name') }} className="admin-tools">
        <SortField value={sortBy} onChange={setSortBy} options={[{ value: 'name', label: 'Nombre' }, { value: 'status', label: 'Estado' }, ...(kind === 'operator' ? [{ value: 'location', label: 'Nave' }] : [])]} />
        <label><span>Estado</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Todos</option><option value="active">Activos</option><option value="inactive">Inactivos</option></select></label>
        {kind === 'operator' && <label><span>Nave</span><select value={nave} onChange={(event) => setNave(event.target.value)}><option value="all">Todas</option>{naveOptions.map((value) => <option key={value}>{value}</option>)}</select></label>}
      </ListFilterToolbar>
      <div className={isPageChanging ? 'admin-list page-changing' : 'admin-list'} ref={listRef}>
        {paginatedItems.map((item) => <article key={item.id ?? `${item.name}-${item.place}`}>
          <button className="admin-list-main" type="button" onClick={() => onEdit(item)}>
            <span><strong>{item.name}</strong><small>{kind === 'operator' ? `${item.nave} · Puesto ${item.puesto}` : item.place}</small><em>{item.active === false ? 'Inactivo' : 'Activo'}</em></span>
          </button>
          <div className="admin-row-actions"><button type="button" onClick={() => onEdit(item)} aria-label={`Editar ${item.name}`}><Pencil size={15} /></button><button type="button" onClick={() => onDelete(item)} aria-label={`Eliminar ${item.name}`}><Trash2 size={15} /></button></div>
        </article>)}
      </div>
      <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label={`Paginación de ${labels.title.toLocaleLowerCase('es')}`} />
    </main>
  )
}

function AdminEditorPanel({ kind, item, onClose, onSave }) {
  const [name, setName] = useState(item?.name ?? '')
  const [nave, setNave] = useState(item?.nave ?? 'Nave 1')
  const [puesto, setPuesto] = useState(item?.puesto ?? '')
  const [email, setEmail] = useState(item?.email ?? '')
  const [responsible, setResponsible] = useState(item?.responsible ?? '')
  const [whatsapp, setWhatsapp] = useState(item?.whatsapp ?? '')
  const [legalName, setLegalName] = useState(item?.legalName ?? '')
  const [address, setAddress] = useState(item?.address ?? item?.place ?? '')
  const [resetSent, setResetSent] = useState(false)
  const [active, setActive] = useState(item?.active !== false)
  const title = `${item ? 'Modificar' : 'Agregar'} ${kind === 'producer' ? 'productor' : 'operador'}`
  const submit = (event) => {
    event.preventDefault()
    const place = kind === 'operator' ? `${nave} · Puesto ${puesto}` : address
    onSave({ ...item, id: item?.id ?? Date.now(), name, place, nave, puesto, email, responsible, whatsapp, legalName, address, active })
  }
  return (
    <DrawerShell onClose={onClose} labelledBy="admin-editor-title" className="admin-editor-panel">
      {(swipeProps) => <>
        <header className="publication-panel-header" {...swipeProps}><i className="actor-panel-handle" aria-hidden="true" /><p>Administración</p><h2 id="admin-editor-title">{title}</h2><span>Gestioná los datos y el acceso al sistema.</span></header>
        <form className="publication-panel-content" onSubmit={submit}>
          <div className="field-grid">
            <label className="field wide"><span>Nombre</span><input value={name} onChange={(event) => setName(event.target.value)} required /></label>
            <>
              {kind === 'operator' && <><label className="field"><span>Nave</span><select value={nave} onChange={(event) => setNave(event.target.value)} required>{['Nave 1', 'Nave 2', 'Nave 3', 'Nave 4'].map((value) => <option key={value}>{value}</option>)}</select></label><label className="field"><span>Puesto</span><input value={puesto} onChange={(event) => setPuesto(event.target.value)} required /></label></>}
              <label className="field wide"><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
              <label className="field wide"><span>Persona responsable</span><input value={responsible} onChange={(event) => setResponsible(event.target.value)} required /></label>
              <label className="field"><span>WhatsApp de contacto</span><input type="tel" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} required /></label>
              <label className="field"><span>Razón social</span><input value={legalName} onChange={(event) => setLegalName(event.target.value)} required /></label>
              <label className="field wide"><span>Dirección física</span><input value={address} onChange={(event) => setAddress(event.target.value)} required /></label>
            </>
          </div>
          {item && <div className="password-reset-control"><div><b>Contraseña de acceso</b><span>{resetSent ? `Contraseña borrada. Enviamos un enlace a ${email}.` : 'El usuario recibirá por email un enlace de un solo uso.'}</span></div><button type="button" onClick={() => setResetSent(true)} disabled={resetSent}><KeyRound size={17} />{resetSent ? 'Email enviado' : 'Resetear contraseña'}</button></div>}
          <div className="availability-control"><div><b>Registro activo</b><span>Permite utilizar este registro en el sistema.</span></div><button className={active ? 'switch on' : 'switch'} type="button" onClick={() => setActive((value) => !value)} aria-pressed={active}><i /></button></div>
          <button className="primary-submit" type="submit">Guardar <Check size={20} /></button>
        </form>
      </>}
    </DrawerShell>
  )
}

function DeleteConfirmationPanel({ item, onClose, onConfirm }) {
  return (
    <DrawerShell onClose={onClose} labelledBy="delete-title" className="delete-panel">
      {(swipeProps) => <>
        <header className="delete-panel-header" {...swipeProps}><i className="actor-panel-handle" aria-hidden="true" /><p>Confirmar baja</p><h2 id="delete-title">Eliminar {item.name}</h2><span>Esta acción quitará el registro del sistema.</span></header>
        <div className="delete-panel-content">
          <button className="danger-submit" type="button" onClick={onConfirm}>Confirmar eliminación <Trash2 size={18} /></button><button className="text-action" type="button" onClick={onClose}>Cancelar</button>
        </div>
      </>}
    </DrawerShell>
  )
}

function AdminSmartListPage({ items, onEdit, onDelete, onCreate }) {
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const visibleItems = items.filter((item) => !query.trim() || item.product.name.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))).sort((a, b) => sortBy === 'recent' ? b.id - a.id : a.product.name.localeCompare(b.product.name, 'es'))
  return (
    <main className="admin-page">
      <AdminHeader eyebrow="Curaduría de mercado" title="Lista inteligente" description="Recomendaciones visibles para el público general." count={items.length} onCreate={onCreate} />
      <ListFilterToolbar query={query} setQuery={setQuery} placeholder="Buscar recomendación" activeFilterCount={0} onClear={() => setSortBy('name')} className="admin-tools">
        <SortField value={sortBy} onChange={setSortBy} options={[{ value: 'name', label: 'Producto' }, { value: 'recent', label: 'Más reciente' }]} />
        <label><span>Período</span><select defaultValue="current"><option value="current">Período actual</option></select></label>
      </ListFilterToolbar>
      <div className="admin-list smart-admin-list">{visibleItems.map((item) => <article key={item.id}><button className="admin-list-main" type="button" onClick={() => onEdit(item)}><img src={item.product.image} alt="" /><span><strong>{item.product.name}</strong><small>{item.description}</small><em>Recomendado</em></span></button><div className="admin-row-actions"><button type="button" onClick={() => onEdit(item)} aria-label={`Editar ${item.product.name}`}><Pencil size={15} /></button><button type="button" onClick={() => onDelete(item)} aria-label={`Eliminar ${item.product.name}`}><Trash2 size={15} /></button></div></article>)}</div>
    </main>
  )
}

function SmartRecommendationPanel({ item, availableProducts, onClose, onSave }) {
  const [productId, setProductId] = useState(String(item?.product.id ?? availableProducts[0]?.id ?? ''))
  const [description, setDescription] = useState(item?.description ?? '')
  return (
    <DrawerShell onClose={onClose} labelledBy="smart-editor-title" className="admin-editor-panel">
      {(swipeProps) => <>
        <header className="publication-panel-header" {...swipeProps}>
          <i className="actor-panel-handle" aria-hidden="true" />
          <p>Lista inteligente</p>
          <h2 id="smart-editor-title">{item ? 'Modificar' : 'Agregar'} recomendación</h2>
          <span>Explicá por qué conviene elegir este producto.</span>
        </header>
        <form className="publication-panel-content" onSubmit={(event) => { event.preventDefault(); onSave({ id: item?.id ?? Date.now(), product: availableProducts.find((product) => product.id === Number(productId)), description }) }}>
          <div className="field-grid">
            <label className="field wide"><span>Producto</span><select value={productId} onChange={(event) => setProductId(event.target.value)}>{availableProducts.map((product) => <option value={product.id} key={product.id}>{product.name}</option>)}</select></label>
            <label className="field wide"><span>Motivo de la recomendación</span><textarea rows="5" value={description} onChange={(event) => setDescription(event.target.value)} required /></label>
          </div>
          <button className="primary-submit" type="submit">Guardar <Check size={20} /></button>
        </form>
      </>}
    </DrawerShell>
  )
}

function RecoveryRequestsPage({ items, onResolve }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Pendiente')
  const [sortBy, setSortBy] = useState('recent')
  const [currentPage, setCurrentPage] = useState(1)
  const listRef = useRef(null)
  const { changePage, isPageChanging } = usePageTransition(setCurrentPage, listRef)
  const visibleItems = items.filter((item) => (!query.trim() || `${item.name} ${item.email} ${item.problem}`.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))) && (status === 'Todas' || item.status === status)).sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name, 'es') : b.id - a.id)
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleItems.length / pageSize))
  const paginated = visibleItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  useEffect(() => setCurrentPage(1), [query, sortBy, status])
  return (
    <main className="admin-page">
      <AdminHeader eyebrow="Seguridad" title="Recuperación de cuentas" description="Solicitudes enviadas por usuarios que no pueden ingresar." count={items.length} />
      <ListFilterToolbar query={query} setQuery={setQuery} placeholder="Buscar solicitud" activeFilterCount={status === 'Todas' ? 0 : 1} onClear={() => { setStatus('Todas'); setSortBy('recent') }} className="admin-tools">
        <SortField value={sortBy} onChange={setSortBy} options={[{ value: 'recent', label: 'Más reciente' }, { value: 'name', label: 'Nombre' }]} />
        <label><span>Estado</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>Todas</option><option>Pendiente</option><option>Resuelta</option></select></label>
      </ListFilterToolbar>
      <div className={isPageChanging ? 'recovery-request-list page-changing' : 'recovery-request-list'} ref={listRef}>{paginated.map((item) => <article key={item.id}><div><strong>{item.name}</strong><a href={`mailto:${item.email}`}>{item.email}</a><p>{item.problem}</p></div><span className={item.status === 'Pendiente' ? 'pending' : ''}>{item.status}</span>{item.status === 'Pendiente' && <button type="button" onClick={() => onResolve(item.id)}>Marcar resuelta <Check size={15} /></button>}</article>)}</div>
      <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label="Paginación de solicitudes" />
    </main>
  )
}

function PriceRevaluationPage() {
  const [file, setFile] = useState(null)
  return (
    <main className="admin-page">
      <AdminHeader eyebrow="Actualización masiva" title="Revalorización de precios" description="Carga de planillas para actualizar precios recomendados." />
      <section className="revaluation-card">
        <FileSpreadsheet size={38} aria-hidden="true" />
        <div><h2>Subir archivo Excel</h2><p>Seleccioná una planilla .xlsx o .xls para previsualizar la actualización.</p></div>
        <label className={file ? 'excel-upload has-file' : 'excel-upload'}><Upload size={19} /><span>{file ? file.name : 'Seleccionar archivo'}</span><input type="file" accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>
        {file && <div className="excel-file-summary"><Check size={17} /><span><strong>Archivo listo</strong><small>{file.name} · Prototipo sin procesamiento</small></span><button type="button" onClick={() => setFile(null)} aria-label="Quitar archivo"><X size={16} /></button></div>}
        <button className="primary-submit" type="button" disabled={!file}>Continuar <ArrowRight size={20} /></button>
      </section>
    </main>
  )
}

function App() {
  const initialRoute = useMemo(() => resolveRoute(window.location.pathname), [])
  const [view, setView] = useState(initialRoute.view)
  const [entityDrawerStack, setEntityDrawerStack] = useState([])
  const drawerSequence = useRef(0)
  const [productPage, setProductPage] = useState(initialRoute.productPage ?? null)
  const [providerMarket, setProviderMarket] = useState(initialRoute.providerMarket ?? null)
  const [publicationDrawer, setPublicationDrawer] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [catalogProductIds, setCatalogProductIds] = useState(products.map((product) => product.id))
  const [customCatalogItems, setCustomCatalogItems] = useState([])
  const [catalogOverrides, setCatalogOverrides] = useState({})
  const [editingProduct, setEditingProduct] = useState(initialRoute.editingProduct ?? null)
  const [editReturnView, setEditReturnView] = useState(initialRoute.editReturnView ?? 'provider')
  const [providerBackView, setProviderBackView] = useState(initialRoute.providerBackView ?? 'board')
  const [vacation, setVacation] = useState({ start: '2026-09-01', end: '2026-09-12', description: 'El puesto permanecerá cerrado durante este período.', substitute: operatorDirectory[1] })
  const [adminOperators, setAdminOperators] = useState(operatorDirectory.map((entry, index) => {
    const [nave = '', puesto = ''] = entry.place.split(' · ')
    return { ...entry, id: `operator-${index + 1}`, nave, puesto: puesto.replace('Puesto ', ''), email: `operador${index + 1}@mercado.uy`, responsible: ['Martín Silva', 'Laura Gómez', 'Diego Pérez'][index % 3], whatsapp: `099100${String(index + 1).padStart(3, '0')}`, legalName: `${entry.name} SRL`, address: `UAM, ${entry.place}`, active: true }
  }))
  const [adminProducers, setAdminProducers] = useState(producerDirectory.map((entry, index) => ({ ...entry, id: `producer-${index + 1}`, email: `productor${index + 1}@mercado.uy`, responsible: ['Ana Rodríguez', 'José Martínez', 'Sofía Pereira'][index % 3], whatsapp: `098200${String(index + 1).padStart(3, '0')}`, legalName: `${entry.name} SAS`, address: entry.place, active: true })))
  const externalProducts = useMemo(() => products.map((product) => ({ ...product, active: true })), [])
  const [adminSmartItems, setAdminSmartItems] = useState(smartPicks.map((pick, index) => ({ id: index + 1, product: products.find((product) => product.id === pick.productId), description: pick.description })))
  const [recoveryRequests, setRecoveryRequests] = useState(initialRecoveryRequests)
  const [adminEditor, setAdminEditor] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [smartEditor, setSmartEditor] = useState(null)

  const applyRoute = (route) => {
    setEntityDrawerStack([])
    setPublicationDrawer(null)
    setProviderMarket(route.providerMarket ?? null)
    setProductPage(route.productPage ?? null)
    setEditingProduct(route.editingProduct ?? null)
    setProviderBackView(route.providerBackView ?? 'board')
    if (route.editReturnView) setEditReturnView(route.editReturnView)
    setView(route.view)
    window.scrollTo({ top: 0, behavior: 'auto' })
    if (route.smartList) window.setTimeout(() => document.getElementById('inteligente')?.scrollIntoView({ behavior: 'smooth' }), 0)
  }

  useEffect(() => {
    const handlePopState = () => applyRoute(resolveRoute(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    if (initialRoute.smartList) window.setTimeout(() => document.getElementById('inteligente')?.scrollIntoView(), 0)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (nextView, path = staticViewRoutes[nextView] ?? '/') => {
    window.history.pushState({ view: nextView }, '', path)
    applyRoute({ view: nextView, smartList: path === '/lista-inteligente' })
  }

  const openProductDrawer = (product, role = 'operator') => {
    drawerSequence.current += 1
    setEntityDrawerStack((current) => [...current, { drawerId: drawerSequence.current, type: 'product', product, role }])
  }

  const openActorFromProduct = (operator, product, role = 'operator') => {
    drawerSequence.current += 1
    setEntityDrawerStack((current) => [...current, {
      drawerId: drawerSequence.current,
      type: 'actor',
      entry: { ...operator, product, productCount: role === 'producer' ? operator.productCount ?? 1 : products.length },
      role,
      backView: view,
    }])
  }

  const openDirectoryMarket = (entry, nextView, backView) => {
    setEntityDrawerStack([])
    setProviderMarket({ operator: entry, product: entry.product })
    setProviderBackView(backView)
    setView(nextView)
    const path = nextView === 'producerDetail' ? `/productores/${slugify(entry.name)}` : `/operadores/${slugify(entry.name)}`
    window.history.pushState({ view: nextView }, '', path)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const catalogItems = [...products.filter((product) => catalogProductIds.includes(product.id)), ...customCatalogItems].map((product) => ({ ...product, ...(catalogOverrides[product.id] ?? {}) }))
  const renderCatalog = (returnView, role = 'operator') => <ProviderMarket operator={role === 'producer' ? producerDirectory[0] : products[0].operators[0]} originProduct={role === 'producer' ? producerDirectory[0].product : products[0]} eyebrow={role === 'producer' ? 'Mi mercadería' : 'Mi mercado'} backLabel="Volver al pizarrón" onBack={() => navigate(role === 'producer' ? 'producerBoard' : 'board')} items={catalogItems} editable onCreate={() => setPublicationDrawer({ role, returnView })} onEdit={(product) => { setEditingProduct(product); setEditReturnView(returnView); setView('editPrice'); window.history.pushState({ view: 'editPrice' }, '', `/${role === 'producer' ? 'productor' : 'operador'}/mercado/${product.id}/editar`); window.scrollTo({ top: 0, behavior: 'auto' }) }} onRemove={(productId) => setCatalogProductIds((current) => current.filter((id) => id !== productId))} onOpenProduct={(product) => openProductDrawer(product, role)} />
  const saveAdminItem = (kind, item) => {
    const update = (current) => current.some((entry) => entry.id === item.id) ? current.map((entry) => entry.id === item.id ? item : entry) : [...current, item]
    if (kind === 'operator') setAdminOperators(update)
    else if (kind === 'producer') setAdminProducers(update)
    setAdminEditor(null)
  }
  const confirmAdminDelete = () => {
    if (deleteTarget.kind === 'operator') setAdminOperators((current) => current.filter((entry) => entry.id !== deleteTarget.item.id))
    if (deleteTarget.kind === 'producer') setAdminProducers((current) => current.filter((entry) => entry.id !== deleteTarget.item.id))
    setDeleteTarget(null)
  }

  return (
    <div className="app-shell">
      <Header view={view} onNavigate={navigate} isAuthenticated={isAuthenticated} onLogout={() => { setIsAuthenticated(false); navigate('board') }} />
      {view === 'board' && <Board onOpenProduct={openProductDrawer} />}
      {view === 'producerBoard' && <Board producerMode onOpenProduct={openProductDrawer} />}
      {view === 'publish' && <Publish onDone={() => navigate('board')} />}
      {view === 'login' && <Login onLogin={() => { setIsAuthenticated(true); navigate('publish') }} onRecover={() => navigate('recovery')} />}
      {view === 'twoFactorChallenge' && <TwoFactorChallenge onComplete={() => { setIsAuthenticated(true); navigate('publish') }} onBack={() => navigate('login')} />}
      {view === 'twoFactorSetup' && <TwoFactorSetup onComplete={() => navigate('board')} />}
      {view === 'recovery' && <PasswordRecovery onBack={() => navigate('login')} />}
      {view === 'resetPassword' && <ResetPasswordPage onComplete={() => navigate('login')} />}
      {view === 'operators' && <ActorDirectory eyebrow="Mercado de hoy" title="Operadores" description="Puestos de la UAM con mercadería y precios publicados." entries={operatorDirectory} filterLabel="Nave" getFilterValue={(entry) => entry.place.split(' · ')[0]} showLocationAction showWhatsapp highlightPlace onOpen={(entry) => openActorFromProduct(entry, entry.product, 'operator')} />}
      {view === 'producers' && <ActorDirectory eyebrow="Oferta de origen" title="Productores" description="Producción disponible para los operadores de la UAM." entries={producerDirectory} filterLabel="Departamento" getFilterValue={(entry) => entry.place.split(' · ')[0]} showWhatsapp onOpen={(entry) => openActorFromProduct(entry, entry.product, 'producer')} />}
      {view === 'productDetail' && <ProductPanel asPage product={productPage?.product ?? products[0]} actorRole={productPage?.role ?? 'operator'} onBack={() => navigate(productPage?.backView ?? (productPage?.role === 'producer' ? 'producerBoard' : 'board'))} onOpenProvider={openActorFromProduct} />}
      {view === 'provider' && (providerMarket ? <ProviderMarket operator={providerMarket.operator} originProduct={providerMarket.product} eyebrow="Mercado del operador" onBack={() => navigate(providerBackView)} onOpenProduct={(product) => openProductDrawer(product, 'operator')} /> : renderCatalog('provider', 'operator'))}
      {view === 'producerDetail' && <ProviderMarket operator={providerMarket?.operator ?? producerDirectory[0]} originProduct={providerMarket?.product ?? producerDirectory[0].product} eyebrow="Detalle del productor" backLabel="Volver a productores" onBack={() => navigate(providerBackView === 'producers' ? 'producers' : 'producerBoard')} onOpenProduct={(product) => openProductDrawer(product, 'producer')} />}
      {view === 'producerMarket' && renderCatalog('producerMarket', 'producer')}
      {view === 'vacations' && <VacationPage value={vacation} onSave={(nextVacation) => { setVacation(nextVacation); navigate('absentProvider') }} />}
      {view === 'absentProvider' && <ProviderMarket operator={operatorDirectory[0]} originProduct={operatorDirectory[0].product} eyebrow="Operador ausente" backLabel="Volver a operadores" onBack={() => navigate('operators')} onOpenProduct={(product) => openProductDrawer(product, 'operator')} vacation={vacation} onOpenSubstitute={() => openDirectoryMarket(vacation.substitute, 'provider', 'absentProvider')} />}
      {view === 'adminOperators' && <AdminManagementPage kind="operator" items={adminOperators} onCreate={() => setAdminEditor({ kind: 'operator', item: null })} onEdit={(item) => setAdminEditor({ kind: 'operator', item })} onDelete={(item) => setDeleteTarget({ kind: 'operator', item })} />}
      {view === 'adminProducers' && <AdminManagementPage kind="producer" items={adminProducers} onCreate={() => setAdminEditor({ kind: 'producer', item: null })} onEdit={(item) => setAdminEditor({ kind: 'producer', item })} onDelete={(item) => setDeleteTarget({ kind: 'producer', item })} />}
      {view === 'adminSmartList' && <AdminSmartListPage items={adminSmartItems} onCreate={() => setSmartEditor({ item: null })} onEdit={(item) => setSmartEditor({ item })} onDelete={(item) => setAdminSmartItems((current) => current.filter((entry) => entry.id !== item.id))} />}
      {view === 'adminRecovery' && <RecoveryRequestsPage items={recoveryRequests} onResolve={(id) => setRecoveryRequests((current) => current.map((item) => item.id === id ? { ...item, status: 'Resuelta' } : item))} />}
      {view === 'adminRevaluation' && <PriceRevaluationPage />}
      {view === 'variants' && <VariantsPage />}
      {view === 'editPrice' && <EditPrice product={editingProduct ?? { ...products[0], ...(catalogOverrides[products[0].id] ?? {}) }} onSave={(nextProduct) => { setCatalogOverrides((current) => ({ ...current, [nextProduct.id]: nextProduct })); navigate(editReturnView) }} onCancel={() => navigate(editReturnView)} />}
      {entityDrawerStack.map((drawer) => drawer.type === 'product'
        ? <ProductPanel key={drawer.drawerId} product={drawer.product} actorRole={drawer.role} onClose={() => setEntityDrawerStack((current) => current.filter((entry) => entry.drawerId !== drawer.drawerId))} onOpenProvider={openActorFromProduct} onOpenPage={(product, role) => { setProductPage({ product, role, backView: view }); setEntityDrawerStack([]); setView('productDetail'); window.history.pushState({ view: 'productDetail' }, '', `${role === 'producer' ? '/operador' : ''}/productos/${product.id}/${role === 'producer' ? 'productores' : 'operadores'}`); window.scrollTo({ top: 0, behavior: 'auto' }) }} />
        : <ActorPanel key={drawer.drawerId} entry={drawer.entry} role={drawer.role} onClose={() => setEntityDrawerStack((current) => current.filter((entry) => entry.drawerId !== drawer.drawerId))} onOpenPage={() => openDirectoryMarket(drawer.entry, drawer.role === 'producer' ? 'producerDetail' : 'provider', drawer.backView)} onOpenProduct={(product, role) => openProductDrawer(product, role)} />)}
      {publicationDrawer && <PublicationPanel items={catalogItems} onClose={() => setPublicationDrawer(null)} onSave={(matchedProduct, draftProduct) => { if (matchedProduct && draftProduct) { setCatalogProductIds((current) => current.includes(matchedProduct.id) ? current : [...current, matchedProduct.id]); setCatalogOverrides((current) => ({ ...current, [matchedProduct.id]: draftProduct })) } else if (draftProduct) setCustomCatalogItems((current) => [...current, draftProduct]); setPublicationDrawer(null) }} />}
      {adminEditor && <AdminEditorPanel kind={adminEditor.kind} item={adminEditor.item} onClose={() => setAdminEditor(null)} onSave={(item) => saveAdminItem(adminEditor.kind, item)} />}
      {deleteTarget && <DeleteConfirmationPanel item={deleteTarget.item} onClose={() => setDeleteTarget(null)} onConfirm={confirmAdminDelete} />}
      {smartEditor && <SmartRecommendationPanel item={smartEditor.item} availableProducts={externalProducts} onClose={() => setSmartEditor(null)} onSave={(item) => { setAdminSmartItems((current) => current.some((entry) => entry.id === item.id) ? current.map((entry) => entry.id === item.id ? item : entry) : [...current, item]); setSmartEditor(null) }} />}
    </div>
  )
}

export default App
