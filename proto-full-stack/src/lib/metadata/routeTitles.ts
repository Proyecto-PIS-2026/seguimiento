import { producerDirectory, resolveRoute } from '../../shared'

export const TITLE_SUFFIX = 'MFH - UAM'

const viewTitles: Record<string, string> = {
  board: 'Pizarrón',
  producerBoard: 'Pizarrón de productores',
  publish: 'Publicar producto',
  login: 'Ingresar',
  twoFactorChallenge: 'Verificación en dos pasos',
  twoFactorSetup: 'Configurar verificación en dos pasos',
  recovery: 'Recuperar contraseña',
  resetPassword: 'Restablecer contraseña',
  operators: 'Operadores',
  producers: 'Productores',
  provider: 'Mi mercado',
  producerDetail: 'Detalle del productor',
  producerMarket: 'Mi mercado de productor',
  vacations: 'Programar vacaciones',
  absentProvider: 'Operador ausente',
  adminOperators: 'Administración de operadores',
  adminProducers: 'Administración de productores',
  adminSmartList: 'Administración de lista inteligente',
  adminRecovery: 'Recuperación de cuentas',
  adminRevaluation: 'Revalorización de precios',
}

export function getRoutePageTitle(pathname: string) {
  const route = resolveRoute(pathname)
  let pageTitle = viewTitles[route.view] ?? 'Pizarrón'

  if (pathname === '/lista-inteligente') pageTitle = 'Lista inteligente'
  if (route.view === 'productDetail' && route.productPage?.product?.name) pageTitle = route.productPage.product.name
  if (route.view === 'provider' && route.providerMarket?.operator?.name) pageTitle = route.providerMarket.operator.name
  if (route.view === 'producerDetail') pageTitle = route.providerMarket?.operator?.name ?? producerDirectory[0].name
  if (route.view === 'editPrice' && route.editingProduct?.name) pageTitle = `Editar precio de ${route.editingProduct.name}`

  return pageTitle
}

export function getRouteDocumentTitle(pathname: string) {
  return `${getRoutePageTitle(pathname)} | ${TITLE_SUFFIX}`
}
