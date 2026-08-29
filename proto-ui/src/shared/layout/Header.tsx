import { useEffect, useMemo, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Image as ImageIcon,
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

type HeaderProps = {
  view?: any
  onNavigate?: any
  isAuthenticated?: any
  onLogout?: any
}

export default function Header({ view, onNavigate, isAuthenticated, onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState<any>(false)
  const [desktopMenuOpen, setDesktopMenuOpen] = useState<any>(false)

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

  const navigateFromMenu = (nextView: string, path?: string) => {
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
    { title: 'Cliente', items: [{ label: 'Ver el pizarrón', view: 'board' }, { label: 'Ver la lista inteligente', view: 'board', smart: true }, { label: 'Ver la lista de operadores', view: 'operators' }, { label: 'Ver detalles de un operador', view: 'provider', path: '/operadores/granja-san-jose' }] },
    { title: 'Operador', items: [{ label: 'Ver su mercado', view: 'provider' }, { label: 'Ver pizarrón de productores', view: 'producerBoard' }, { label: 'Ver lista de productores', view: 'producers' }, { label: 'Ver detalle de un productor', view: 'producerDetail' }, { label: 'Vacaciones', view: 'vacations' }, { label: 'Operador ausente', view: 'absentProvider' }] },
    { title: 'Productor', items: [{ label: 'Ver su mercado', view: 'producerMarket' }] },
    { title: 'Administrador', items: [{ label: 'Mantenimiento de operadores', view: 'adminOperators' }, { label: 'Mantenimiento de productores', view: 'adminProducers' }, { label: 'Mantenimiento de lista inteligente', view: 'adminSmartList' }, { label: 'Solicitudes de recuperación', view: 'adminRecovery' }, { label: 'Revalorización de precios', view: 'adminRevaluation' }] },
    { title: 'Seguridad', items: [{ label: 'Ingresar', view: 'login' }, { label: 'Ingresar con 2FA', view: 'twoFactorChallenge' }, { label: 'Configurar 2FA', view: 'twoFactorSetup' }, { label: 'Recuperar contraseña', view: 'recovery' }, { label: 'Restablecer contraseña', view: 'resetPassword' }] },
  ]
  const openPrototypeItem = (item) => {
    setDesktopMenuOpen(false)
    if (item.smart) openSmartList()
    else navigateFromMenu(item.view, item.path)
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
