export type UserRole = 'operator' | 'producer' | 'admin'

export type MenuItem = { label: string; view: string; path?: string; smart?: boolean }

export const roleNavigation: Record<UserRole | 'public', { title: string; items: MenuItem[] }> = {
  public: { title: 'Cliente', items: [
    { label: 'Pizarrón', view: 'board' },
    { label: 'Lista inteligente', view: 'board', path: '/lista-inteligente', smart: true },
    { label: 'Operadores', view: 'operators' },
  ] },
  operator: { title: 'Operador', items: [
    { label: 'Mi mercado', view: 'provider' },
    { label: 'Pizarrón de productores', view: 'producerBoard' },
    { label: 'Lista de productores', view: 'producers' },
    { label: 'Programar vacaciones', view: 'vacations' },
  ] },
  producer: { title: 'Productor', items: [{ label: 'Mi mercado', view: 'producerMarket' }] },
  admin: { title: 'Administrador', items: [
    { label: 'Operadores', view: 'adminOperators' },
    { label: 'Productores', view: 'adminProducers' },
    { label: 'Lista inteligente', view: 'adminSmartList' },
    { label: 'Recuperación de cuentas', view: 'adminRecovery' },
    { label: 'Revalorización de precios', view: 'adminRevaluation' },
  ] },
}

export function getHomePath(role: UserRole | null): string {
  return role === 'admin' ? '/administracion/operadores'
    : role === 'operator' ? '/operador/mercado'
      : role === 'producer' ? '/productor/mercado' : '/'
}

// Details remain addressable, but never appear as root menu entries.
export function getAccessiblePath(path: string, role: UserRole | null): string {
  const pathname = path.replace(/\/+$/, '') || '/'
  if (role && (pathname === '/' || pathname === '/ingresar' || pathname === '/ingresar/2fa')) return getHomePath(role)
  // The prototype has no second-factor session: it cannot grant access on its own.
  if (pathname === '/ingresar/2fa') return '/ingresar'
  const requiredRole = /^\/administracion(?:\/|$)/.test(pathname) ? 'admin'
    : /^\/operador(?:\/|$)/.test(pathname) || /^\/productores(?:\/|$)/.test(pathname) ? 'operator'
      : /^\/productor(?:\/|$)/.test(pathname) ? 'producer' : null
  if (requiredRole && role !== requiredRole) return role ? getHomePath(role) : '/ingresar'
  if (/^\/productos\/\d+\/productores$/.test(pathname) && role !== 'operator' && role !== 'producer') return role ? getHomePath(role) : '/ingresar'
  if (pathname.startsWith('/seguridad/') && !role) return '/ingresar'
  return pathname
}
