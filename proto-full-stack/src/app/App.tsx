'use client'

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
import { products, operatorDirectory, producerDirectory, slugify, staticViewRoutes, initialRecoveryRequests, resolveRoute, smartPicks } from '../shared'
import Header from '../shared/layout/Header'
import Board from '../features/board/Board'
import ConfirmModal from '../shared/feedback/ConfirmModal'
import ProductPanel from '../features/products/ProductPanel'
import ActorPanel from '../features/actors/ActorPanel'
import PublicationPanel from '../features/products/PublicationPanel'
import Publish from '../features/products/Publish'
import Login from '../features/auth/Login'
import TwoFactorChallenge from '../features/auth/TwoFactorChallenge'
import TwoFactorSetup from '../features/auth/TwoFactorSetup'
import PasswordRecovery from '../features/auth/PasswordRecovery'
import ResetPasswordPage from '../features/auth/ResetPasswordPage'
import ActorDirectory from '../features/actors/ActorDirectory'
import ProviderMarket from '../features/actors/ProviderMarket'
import EditPrice from '../features/products/EditPrice'
import VacationPage from '../features/actors/VacationPage'
import AbsentOperatorPage from '../features/actors/AbsentOperatorPage'
import AdminManagementPage from '../features/admin/AdminManagementPage'
import AdminEditorPanel from '../features/admin/AdminEditorPanel'
import AdminSmartListPage from '../features/admin/AdminSmartListPage'
import SmartRecommendationPanel from '../features/admin/SmartRecommendationPanel'
import RecoveryRequestsPage from '../features/admin/RecoveryRequestsPage'
import PriceRevaluationPage from '../features/admin/PriceRevaluationPage'
import AdminWorkspace from '../features/admin/AdminWorkspace'
import LinearNavigationLoader from '../shared/navigation/LinearNavigationLoader'
import { LINEAR_LOADER_EVENT } from '../shared/navigation/linearLoader'
import OperationNotification from '../shared/feedback/OperationNotification'
import { OPERATION_NOTIFICATION_EVENT, type OperationNotificationDetail } from '../shared/feedback/operationNotifications'
import { saveActorRecord } from '../lib/api/client'
import { getRouteDocumentTitle } from '../lib/metadata/routeTitles'
import { getAccessiblePath, getHomePath, type UserRole } from '../shared/auth/access'
import { login, logout, type AuthSession } from '../lib/api/session'

type AppProps = {
  initialPath: string
  initialRole: UserRole | null
  initialUsername: string | null
}

export default function App({ initialPath, initialRole, initialUsername }: AppProps) {
  const initialRoute = useMemo(() => resolveRoute(initialPath), [initialPath])
  const [view, setView] = useState<any>(initialRoute.view)
  const [currentPath, setCurrentPath] = useState(initialPath)
  const [entityDrawerStack, setEntityDrawerStack] = useState<any>([])
  const drawerSequence = useRef(0)
  const [productPage, setProductPage] = useState<any>(initialRoute.productPage ?? null)
  const [providerMarket, setProviderMarket] = useState<any>(initialRoute.providerMarket ?? null)
  const [publicationDrawer, setPublicationDrawer] = useState<any>(null)
  const [role, setRole] = useState<UserRole | null>(initialRole)
  const [username, setUsername] = useState(initialUsername)
  const roleRef = useRef(role)
  const [catalogProductIds, setCatalogProductIds] = useState<any>(products.map((product) => product.id))
  const [customCatalogItems, setCustomCatalogItems] = useState<any>([])
  const [catalogOverrides, setCatalogOverrides] = useState<any>({})
  const [editingProduct, setEditingProduct] = useState<any>(initialRoute.editingProduct ?? null)
  const [editReturnView, setEditReturnView] = useState<any>(initialRoute.editReturnView ?? 'provider')
  const [providerBackView, setProviderBackView] = useState<any>(initialRoute.providerBackView ?? 'board')
  const [vacation, setVacation] = useState<any>({ start: '2026-09-01', end: '2026-09-12', description: 'El puesto permanecerá cerrado durante este período.', substitute: null })
  const [adminOperators, setAdminOperators] = useState<any>(operatorDirectory.map((entry, index) => {
    const [nave = '', puesto = ''] = entry.place.split(' · ')
    return { ...entry, id: `operator-${index + 1}`, nave, puesto: puesto.replace('Puesto ', ''), email: `operador${index + 1}@mercado.uy`, responsible: ['Martín Silva', 'Laura Gómez', 'Diego Pérez'][index % 3], whatsapp: `099100${String(index + 1).padStart(3, '0')}`, legalName: `${entry.name} SRL`, address: `UAM, ${entry.place}`, active: true }
  }))
  const [adminProducers, setAdminProducers] = useState<any>(producerDirectory.map((entry, index) => ({ ...entry, id: `producer-${index + 1}`, email: `productor${index + 1}@mercado.uy`, responsible: ['Ana Rodríguez', 'José Martínez', 'Sofía Pereira'][index % 3], whatsapp: `098200${String(index + 1).padStart(3, '0')}`, legalName: `${entry.name} SAS`, address: entry.place, active: true })))
  const externalProducts = useMemo(() => products.map((product) => ({ ...product, active: true })), [])
  const [adminSmartItems, setAdminSmartItems] = useState<any>(smartPicks.map((pick, index) => ({ id: index + 1, product: products.find((product) => product.id === pick.productId), description: pick.description })))
  const [recoveryRequests, setRecoveryRequests] = useState<any>(initialRecoveryRequests)
  const [adminEditor, setAdminEditor] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [smartEditor, setSmartEditor] = useState<any>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const navigationLoaderTimer = useRef<number | null>(null)
  const notificationSequence = useRef(0)
  const [operationNotifications, setOperationNotifications] = useState<Array<OperationNotificationDetail & { id: number }>>([])

  useEffect(() => {
    document.title = getRouteDocumentTitle(currentPath)
  }, [currentPath])

  const showNavigationLoader = (duration = 420) => {
    if (navigationLoaderTimer.current !== null) window.clearTimeout(navigationLoaderTimer.current)
    setIsNavigating(true)
    navigationLoaderTimer.current = window.setTimeout(() => {
      setIsNavigating(false)
      navigationLoaderTimer.current = null
    }, duration)
  }

  const applyRoute = (route) => {
    const accessiblePath = getAccessiblePath(window.location.pathname, roleRef.current)
    if (accessiblePath !== window.location.pathname) {
      window.history.replaceState({}, '', accessiblePath)
      route = resolveRoute(accessiblePath)
    }
    showNavigationLoader()
    setCurrentPath(window.location.pathname)
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

  useEffect(() => {
    const handleOperationNotification = (event: Event) => {
      notificationSequence.current += 1
      const detail = (event as CustomEvent<OperationNotificationDetail>).detail
      setOperationNotifications((current) => [...current, { ...detail, id: notificationSequence.current }])
    }
    window.addEventListener(OPERATION_NOTIFICATION_EVENT, handleOperationNotification)
    return () => window.removeEventListener(OPERATION_NOTIFICATION_EVENT, handleOperationNotification)
  }, [])

  useEffect(() => () => {
    if (navigationLoaderTimer.current !== null) window.clearTimeout(navigationLoaderTimer.current)
  }, [])

  useEffect(() => {
    const handleLinearLoader = (event: Event) => {
      const duration = (event as CustomEvent<{ duration?: number }>).detail?.duration
      showNavigationLoader(duration)
    }
    window.addEventListener(LINEAR_LOADER_EVENT, handleLinearLoader)
    return () => window.removeEventListener(LINEAR_LOADER_EVENT, handleLinearLoader)
  }, [])

  const navigate = (nextView, path = staticViewRoutes[nextView] ?? '/') => {
    path = getAccessiblePath(path, roleRef.current)
    window.history.pushState({ view: nextView }, '', path)
    applyRoute(resolveRoute(path))
  }

  const changeSession = (nextSession: AuthSession | null) => {
    const nextRole = nextSession?.role ?? null
    roleRef.current = nextRole
    setRole(nextRole)
    setUsername(nextSession?.username ?? null)
    setCatalogProductIds(products.map((product) => product.id))
    setCustomCatalogItems([])
    setCatalogOverrides({})
    setAdminEditor(null)
    setDeleteTarget(null)
    setSmartEditor(null)
    setOperationNotifications([])
    const path = getHomePath(nextRole)
    window.history.replaceState({}, '', path)
    applyRoute(resolveRoute(path))
  }

  const handleLogin = async (username: string, password: string) => changeSession(await login(username, password))
  const handleLogout = async () => {
    try { await logout(); changeSession(null) }
    catch (cause) {
      notificationSequence.current += 1
      setOperationNotifications((current) => [...current, { id: notificationSequence.current, type: 'error', message: cause instanceof Error ? cause.message : 'No se pudo cerrar la sesión.' }])
    }
  }

  const usesDesktopPages = () => window.matchMedia('(min-width: 761px)').matches
  const openProductPage = (product, role = 'operator', backView = view) => {
    showNavigationLoader()
    setProductPage({ product, role, backView })
    setEntityDrawerStack([])
    setView('productDetail')
    const path = `/productos/${product.id}/${role === 'producer' ? 'productores' : 'operadores'}`
    window.history.pushState({ view: 'productDetail' }, '', path)
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const openProductDrawer = (product, role = 'operator') => {
    if (usesDesktopPages()) {
      openProductPage(product, role)
      return
    }
    drawerSequence.current += 1
    setEntityDrawerStack((current) => [...current, { drawerId: drawerSequence.current, type: 'product', product, role }])
  }

  const openActorFromProduct = (operator, product, role = 'operator') => {
    const entry = { ...operator, product, productCount: role === 'producer' ? operator.productCount ?? 1 : products.length }
    if (usesDesktopPages()) {
      openDirectoryMarket(entry, role === 'producer' ? 'producerDetail' : 'provider', view)
      return
    }
    drawerSequence.current += 1
    setEntityDrawerStack((current) => [...current, {
      drawerId: drawerSequence.current,
      type: 'actor',
      entry,
      role,
      backView: view,
    }])
  }

  const openDirectoryMarket = (entry, nextView, backView) => {
    showNavigationLoader()
    setEntityDrawerStack([])
    setProviderMarket({ operator: entry, product: entry.product })
    setProviderBackView(backView)
    setView(nextView)
    const path = nextView === 'producerDetail' ? `/productores/${slugify(entry.name)}` : `/operadores/${slugify(entry.name)}`
    window.history.pushState({ view: nextView }, '', path)
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const catalogItems = [...products.filter((product) => catalogProductIds.includes(product.id)), ...customCatalogItems].map((product) => ({ ...product, ...(catalogOverrides[product.id] ?? {}) }))
  const renderCatalog = (returnView, role = 'operator') => <ProviderMarket operator={role === 'producer' ? producerDirectory[0] : products[0].operators[0]} originProduct={role === 'producer' ? producerDirectory[0].product : products[0]} eyebrow={role === 'producer' ? 'Mi mercadería' : 'Mi mercado'} items={catalogItems} editable productRole={role} onCreate={(product) => setPublicationDrawer({ role, returnView, product })} onRemove={(productId) => { setCatalogProductIds((current) => current.filter((id) => id !== productId)); setCustomCatalogItems((current) => current.filter((product) => product.id !== productId)) }} onOpenProduct={(product) => openProductDrawer(product, role)} />
  const saveAdminItem = async (kind, item) => {
    const savedItem = await saveActorRecord(kind, item)
    const updateWithSavedItem = (current) => current.some((entry) => entry.id === savedItem.id) ? current.map((entry) => entry.id === savedItem.id ? savedItem : entry) : [...current, savedItem]
    if (kind === 'operator') setAdminOperators(updateWithSavedItem)
    else if (kind === 'producer') setAdminProducers(updateWithSavedItem)
    setAdminEditor(null)
  }
  const confirmAdminDelete = () => {
    if (deleteTarget.kind === 'operator') setAdminOperators((current) => current.filter((entry) => entry.id !== deleteTarget.item.id))
    if (deleteTarget.kind === 'producer') setAdminProducers((current) => current.filter((entry) => entry.id !== deleteTarget.item.id))
    if (deleteTarget.kind === 'smart') setAdminSmartItems((current) => current.filter((entry) => entry.id !== deleteTarget.item.id))
    setDeleteTarget(null)
  }

  return (
    <div className="app-shell">
      <Header key={role ?? 'public'} view={view} currentPath={currentPath} onNavigate={navigate} role={role} username={username} onLogout={handleLogout} />
      <LinearNavigationLoader active={isNavigating} />
      <div className="operation-notification-stack" aria-live="polite">
        {operationNotifications.map((notification) => <OperationNotification key={notification.id} type={notification.type} message={notification.message} onDismiss={() => setOperationNotifications((current) => current.filter((item) => item.id !== notification.id))} />)}
      </div>
      {view === 'board' && <Board onOpenProduct={openProductDrawer} />}
      {view === 'producerBoard' && <Board producerMode onOpenProduct={openProductDrawer} />}
      {view === 'publish' && <Publish onDone={() => navigate('board')} />}
      {view === 'login' && <Login onLogin={handleLogin} onRecover={() => navigate('recovery')} />}
      {view === 'twoFactorChallenge' && <TwoFactorChallenge onComplete={() => navigate('login')} onBack={() => navigate('login')} />}
      {view === 'twoFactorSetup' && <TwoFactorSetup onComplete={() => navigate('board')} />}
      {view === 'recovery' && <PasswordRecovery onBack={() => navigate('login')} />}
      {view === 'resetPassword' && <ResetPasswordPage onComplete={() => navigate('login')} />}
      {view === 'operators' && <ActorDirectory eyebrow="Mercado de hoy" title="Operadores" description="Puestos de la UAM con mercadería y precios publicados." entries={operatorDirectory} filterLabel="Nave" getFilterValue={(entry) => entry.place.split(' · ')[0]} showLocationAction showWhatsapp highlightPlace onOpen={(entry) => openActorFromProduct(entry, entry.product, 'operator')} />}
      {view === 'producers' && <ActorDirectory eyebrow="Oferta de origen" title="Productores" description="Producción disponible para los operadores de la UAM." entries={producerDirectory} filterLabel="Departamento" getFilterValue={(entry) => entry.place.split(' · ')[0]} showWhatsapp onOpen={(entry) => openActorFromProduct(entry, entry.product, 'producer')} />}
      {view === 'productDetail' && <ProductPanel asPage product={productPage?.product ?? products[0]} actorRole={productPage?.role ?? 'operator'} onOpenProvider={openActorFromProduct} />}
      {view === 'provider' && (providerMarket ? <ProviderMarket operator={providerMarket.operator} originProduct={providerMarket.product} eyebrow="Mercado del operador" onOpenProduct={(product) => openProductDrawer(product, 'operator')} productRole="operator" useActorProducts /> : renderCatalog('provider', 'operator'))}
      {view === 'producerDetail' && <ProviderMarket operator={providerMarket?.operator ?? producerDirectory[0]} originProduct={providerMarket?.product ?? producerDirectory[0].product} eyebrow="Detalle del productor" onOpenProduct={(product) => openProductDrawer(product, 'producer')} productRole="producer" useActorProducts />}
      {view === 'producerMarket' && renderCatalog('producerMarket', 'producer')}
      {view === 'vacations' && <VacationPage value={vacation} onSave={(nextVacation) => { setVacation(nextVacation); navigate('absentProvider') }} />}
      {view === 'absentProvider' && <AbsentOperatorPage operator={operatorDirectory[0]} vacation={vacation} onOpenSubstitute={() => vacation.substitute && openDirectoryMarket(vacation.substitute, 'provider', 'absentProvider')} />}
      {String(view).startsWith('admin') && <AdminWorkspace activeView={view} onNavigate={navigate}>
        {view === 'adminOperators' && <AdminManagementPage kind="operator" items={adminOperators} onCreate={() => setAdminEditor({ kind: 'operator', item: null })} onEdit={(item) => setAdminEditor({ kind: 'operator', item })} onDelete={(item) => setDeleteTarget({ kind: 'operator', item })} />}
        {view === 'adminProducers' && <AdminManagementPage kind="producer" items={adminProducers} onCreate={() => setAdminEditor({ kind: 'producer', item: null })} onEdit={(item) => setAdminEditor({ kind: 'producer', item })} onDelete={(item) => setDeleteTarget({ kind: 'producer', item })} />}
        {view === 'adminSmartList' && <AdminSmartListPage items={adminSmartItems} onCreate={() => setSmartEditor({ item: null })} onEdit={(item) => setSmartEditor({ item })} onDelete={(item) => setDeleteTarget({ kind: 'smart', item })} />}
        {view === 'adminRecovery' && <RecoveryRequestsPage items={recoveryRequests} onResolve={(id) => setRecoveryRequests((current) => current.map((item) => item.id === id ? { ...item, status: 'Resuelta' } : item))} />}
        {view === 'adminRevaluation' && <PriceRevaluationPage />}
      </AdminWorkspace>}
      {view === 'editPrice' && <EditPrice product={editingProduct ?? { ...products[0], ...(catalogOverrides[products[0].id] ?? {}) }} onSave={(nextProduct) => { setCatalogOverrides((current) => ({ ...current, [nextProduct.id]: nextProduct })); navigate(editReturnView) }} onCancel={() => navigate(editReturnView)} />}
      {entityDrawerStack.map((drawer) => drawer.type === 'product'
        ? <ProductPanel key={drawer.drawerId} product={drawer.product} actorRole={drawer.role} onClose={() => setEntityDrawerStack((current) => current.filter((entry) => entry.drawerId !== drawer.drawerId))} onOpenProvider={openActorFromProduct} onOpenPage={(product, role) => openProductPage(product, role)} />
        : <ActorPanel key={drawer.drawerId} entry={drawer.entry} role={drawer.role} onClose={() => setEntityDrawerStack((current) => current.filter((entry) => entry.drawerId !== drawer.drawerId))} onOpenPage={() => openDirectoryMarket(drawer.entry, drawer.role === 'producer' ? 'producerDetail' : 'provider', drawer.backView)} onOpenProduct={(product, role) => openProductDrawer(product, role)} />)}
      {publicationDrawer && <PublicationPanel items={catalogItems} initialProduct={publicationDrawer.product} onClose={() => setPublicationDrawer(null)} onSave={(matchedProduct, draftProduct) => { if (matchedProduct && draftProduct) { setCatalogProductIds((current) => current.includes(matchedProduct.id) ? current : [...current, matchedProduct.id]); setCatalogOverrides((current) => ({ ...current, [matchedProduct.id]: draftProduct })) } else if (draftProduct) setCustomCatalogItems((current) => [...current, draftProduct]); setPublicationDrawer(null) }} />}
      {adminEditor && <AdminEditorPanel kind={adminEditor.kind} item={adminEditor.item} onClose={() => setAdminEditor(null)} onSave={(item) => saveAdminItem(adminEditor.kind, item)} />}
      {deleteTarget && <ConfirmModal heading={`Eliminar ${deleteTarget.kind === 'smart' ? deleteTarget.item.product.name : deleteTarget.item.name}`} description={deleteTarget.kind === 'smart' ? 'El producto dejará de aparecer en la lista inteligente.' : `Se eliminará el registro de este ${deleteTarget.kind === 'operator' ? 'operador' : 'productor'} del sistema.`} confirmLabel={deleteTarget.kind === 'smart' ? 'Eliminar recomendación' : `Eliminar ${deleteTarget.kind === 'operator' ? 'operador' : 'productor'}`} onCancel={() => setDeleteTarget(null)} onConfirm={confirmAdminDelete} />}
      {smartEditor && <SmartRecommendationPanel item={smartEditor.item} availableProducts={externalProducts} onClose={() => setSmartEditor(null)} onSave={(item) => { setAdminSmartItems((current) => current.some((entry) => entry.id === item.id) ? current.map((entry) => entry.id === item.id ? item : entry) : [...current, item]); setSmartEditor(null) }} />}
    </div>
  )
}
