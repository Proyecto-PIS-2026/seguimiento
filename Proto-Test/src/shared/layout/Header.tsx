import { useEffect, useState } from 'react'
import { ArrowUpRight, CalendarDays, ChevronDown, LayoutGrid, Leaf, LogOut, Menu, Sparkles, Sprout, Store, Users } from 'lucide-react'
import DrawerShell from './DrawerShell'
import VariantSelector from '../../features/variants/VariantSelector'
import { useSmartListUrl } from '../../features/board/smartListSettings'

type Props = { view?: string; onNavigate?: any; isAuthenticated?: boolean; onLogout?: () => void }

export default function Header({ view = 'board', onNavigate, isAuthenticated, onLogout }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [role, setRole] = useState(window.location.pathname.startsWith('/productor/') ? 'producer' : window.location.pathname.startsWith('/operador/') ? 'operator' : 'public')
  useEffect(() => {
    if (view === 'producerMarket') setRole('producer')
    else if (['provider', 'producerBoard', 'producers', 'vacations'].includes(view) && window.location.pathname.startsWith('/operador/')) setRole('operator')
    else if (view.startsWith('admin')) setRole('admin')
  }, [view])
  const navigate = (next: string, path?: string) => { setMenuOpen(false); onNavigate(next, path) }
  const smartListUrl = useSmartListUrl()
  const smart = () => { window.open(smartListUrl, '_blank', 'noopener,noreferrer') }
  const marketView = role === 'producer' ? 'producerMarket' : 'provider'
  const links = [
    { label: 'Pizarrón', icon: LayoutGrid, view: 'board' },
    { label: 'Lista inteligente', icon: Sparkles, view: 'smart' },
    { label: 'Operadores', icon: Users, view: 'operators' },
    ...(role === 'operator' ? [{ label: 'Productores', icon: Sprout, view: 'producers' }, { label: 'Oferta de productores', icon: Leaf, view: 'producerBoard' }] : []),
  ]
  const groups = [
    { title: 'Mercado', items: [{ label: 'Directorio de operadores', view: 'operators' }, { label: 'Mi mercado · Operador', view: 'provider' }, { label: 'Mi mercado · Productor', view: 'producerMarket' }, { label: 'Oferta de productores', view: 'producerBoard' }, { label: 'Directorio de productores', view: 'producers' }, { label: 'Programar vacaciones', view: 'vacations' }, { label: 'Operador ausente', view: 'absentProvider' }] },
    { title: 'Administración', items: [{ label: 'Operadores', view: 'adminOperators' }, { label: 'Productores', view: 'adminProducers' }, { label: 'Lista inteligente', view: 'adminSmartList' }, { label: 'Recuperación de cuentas', view: 'adminRecovery' }, { label: 'Revalorización de precios', view: 'adminRevaluation' }] },
    { title: 'Cuenta y seguridad', items: [{ label: 'Ingresar', view: 'login' }, { label: 'Verificar en dos pasos', view: 'twoFactorChallenge' }, { label: 'Configurar verificación', view: 'twoFactorSetup' }, { label: 'Recuperar contraseña', view: 'recovery' }, { label: 'Restablecer contraseña', view: 'resetPassword' }] },
  ]
  const titles: Record<string, string> = { board: 'Pizarrón del mercado', provider: 'Mi mercado', producerMarket: 'Mi mercado', producerBoard: 'Oferta de productores', operators: 'Operadores', producers: 'Productores' }
  const isSmart = window.location.pathname === '/lista-inteligente'
  return <>
    <a className="skip-link" href="#main-content">Saltar al contenido</a>
    <aside className="workspace-sidebar">
      <button className="mh-brand" onClick={() => navigate('board')} aria-label="Mercado Hoy, inicio"><span className="mh-brand-icon"><Sprout size={27} strokeWidth={1.7} /></span><span>mercado<span className="mh-brand-hoy">hoy<span className="brand-dot">.</span></span></span></button>
      <p className="sidebar-label">TU CONEXIÓN CON LA UAM</p>
      <nav className="workspace-navigation" aria-label="Navegación principal">
        {links.map(link => <button key={link.view} className={(link.view === 'smart' ? isSmart : view === link.view && !isSmart) ? 'selected' : ''} onClick={() => link.view === 'smart' ? smart() : navigate(link.view)}><link.icon size={20} /><span>{link.label}</span></button>)}
        <span className="sidebar-divider" /><p className="sidebar-label">MI ESPACIO</p>
        <button className={view === marketView && window.location.pathname.includes('/mercado') ? 'selected' : ''} onClick={() => navigate(marketView)}><Store size={20} />Mi mercado</button>
        {role === 'operator' && <button className={view === 'vacations' ? 'selected' : ''} onClick={() => navigate('vacations')}><CalendarDays size={20} />Mis vacaciones</button>}
        <button onClick={() => setMenuOpen(true)}><Menu size={20} />Todas las pantallas</button>
      </nav>
      <VariantSelector />
      <div className="sidebar-bottom"><div className="sidebar-note"><Leaf size={22} /><strong>Del campo a tu día.</strong><p>Un mercado más conectado empieza por acá.</p><button onClick={smart}>Qué está de estación <ArrowUpRight size={16} /></button></div><span className="uam-signature">UAM <span>Unidad Agroalimentaria<br />Metropolitana</span></span></div>
    </aside>
    <header className="site-header workspace-topbar">
      <button className="mobile-brand" onClick={() => navigate('board')} aria-label="Mercado Hoy, inicio"><Sprout size={25} /><strong>mercado hoy.</strong></button>
      <span className="topbar-location">Mercado Hoy <span>/</span> <strong>{isSmart ? 'Lista inteligente' : titles[view] ?? (view.startsWith('admin') ? 'Administración' : 'Mi cuenta')}</strong></span>
      <div className="topbar-account"><label className="role-picker"><span className="role-avatar">{role === 'producer' ? 'PR' : role === 'operator' ? 'OP' : role === 'admin' ? 'AD' : 'VI'}</span><select aria-label="Vista del prototipo" value={role} onChange={event => { const value = event.target.value; setRole(value); navigate(value === 'producer' ? 'producerMarket' : value === 'operator' ? 'provider' : value === 'admin' ? 'adminOperators' : 'board') }}><option value="public">Visitante</option><option value="operator">Operador</option><option value="producer">Productor</option><option value="admin">Administrador</option></select><ChevronDown size={14} /></label><button className="account-button" onClick={() => isAuthenticated ? onLogout?.() : navigate('login')}>{isAuthenticated ? <LogOut size={18} /> : 'Ingresar'}</button></div>
    </header>
    <div className="mobile-variant-selector"><VariantSelector /></div>
    <nav className="mobile-bottom-nav" aria-label="Navegación móvil">
      <button className={view === 'board' && !isSmart ? 'selected' : ''} onClick={() => navigate('board')}><LayoutGrid size={21} /><span>Pizarrón</span></button>
      <button className={isSmart ? 'selected' : ''} onClick={smart}><Sparkles size={21} /><span>De estación</span></button>
      <button className={view === marketView ? 'selected' : ''} onClick={() => navigate(marketView)}><Store size={21} /><span>Mi mercado</span></button>
      <button aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={21} /><span>Más</span></button>
    </nav>
    {menuOpen && <DrawerShell onClose={() => setMenuOpen(false)} labelledBy="navigation-title" className="navigation-sheet">{() => <><header className="sheet-heading"><span className="section-kicker">MERCADO HOY</span><h2 id="navigation-title">Todo a mano</h2><p>Explorá las pantallas del prototipo.</p></header><div className="navigation-groups">{groups.map(group => <section key={group.title}><h3>{group.title}</h3>{group.items.map(item => <button key={item.view} onClick={() => navigate(item.view)}>{item.label}<ArrowUpRight size={17} /></button>)}</section>)}</div></>}</DrawerShell>}
  </>
}
