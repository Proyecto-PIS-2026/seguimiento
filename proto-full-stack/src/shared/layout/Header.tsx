import { useEffect, useRef, useState } from 'react'
import { roleNavigation, type MenuItem, type UserRole } from '../auth/access'

type HeaderProps = {
  view: string
  currentPath: string
  onNavigate: (view: string, path?: string) => void
  role: UserRole | null
  onLogout: () => void
}

export default function Header({ view, currentPath, onNavigate, role, onLogout }: HeaderProps) {
  const isAuthenticated = role !== null
  const menuGroup = roleNavigation[role ?? 'public']
  const [menuOpen, setMenuOpen] = useState(false)
  const mobileMenuTrigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const scrollPosition = window.scrollY
    const previousStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      mobileMenuTrigger.current?.focus()
    }
    const desktopViewport = window.matchMedia('(min-width: 721px)')
    const closeOnDesktop = () => { if (desktopViewport.matches) setMenuOpen(false) }
    desktopViewport.addEventListener('change', closeOnDesktop)
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.width = '100%'
    return () => {
      desktopViewport.removeEventListener('change', closeOnDesktop)
      window.removeEventListener('keydown', handleKeyDown)
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

  const openMenuItem = (item: MenuItem) => navigateFromMenu(item.view, item.path)
  const isActive = (item: MenuItem) => item.view === 'board'
    ? currentPath === (item.path ?? '/')
    : view === item.view

  const handleAccount = () => {
    setMenuOpen(false)
    if (isAuthenticated) onLogout()
    else navigateFromMenu('login')
  }

  return (
    <>
      <header className="site-header">
        <button className="brand brand-button" type="button" onClick={() => openMenuItem(menuGroup.items[0])} aria-label="Mercado Hoy, inicio">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span><strong>Mercado</strong><small>HOY · UAM</small></span>
        </button>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {menuGroup.items.map((item) => <button className={isActive(item) ? 'nav-link active' : 'nav-link'} type="button" key={item.label} aria-current={isActive(item) ? 'page' : undefined} onClick={() => openMenuItem(item)}>{item.label}</button>)}
          <button className={view === 'login' ? 'nav-link active' : 'nav-link'} type="button" aria-current={view === 'login' ? 'page' : undefined} onClick={handleAccount}>{isAuthenticated ? 'Salir' : 'Ingresar'}</button>
        </nav>
        <button ref={mobileMenuTrigger} className={menuOpen ? 'mobile-menu-toggle open' : 'mobile-menu-toggle'} type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>
          <span /><span /><span />
        </button>
      </header>
      <div className={menuOpen ? 'mobile-menu-backdrop open' : 'mobile-menu-backdrop'} onMouseDown={(event) => event.target === event.currentTarget && setMenuOpen(false)} aria-hidden={!menuOpen} inert={!menuOpen}>
        <nav className="mobile-menu" id="mobile-menu" aria-label="Navegación móvil">
          <h2>Menú principal</h2>
          <section><p className="mobile-menu-group-title">{menuGroup.title}</p><div className="mobile-menu-sections">
            {menuGroup.items.map((item) => <button className={isActive(item) ? 'active' : ''} type="button" key={item.label} aria-current={isActive(item) ? 'page' : undefined} onClick={() => openMenuItem(item)}>{item.label}</button>)}
          </div></section>
          <button className="mobile-menu-session" type="button" onClick={handleAccount}>{isAuthenticated ? 'Cerrar sesión' : 'Ingresar'}</button>
        </nav>
      </div>
    </>
  )
}
