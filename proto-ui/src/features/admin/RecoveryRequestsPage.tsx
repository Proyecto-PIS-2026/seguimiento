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
import { usePageTransition } from '../../shared'
import Pagination from '../../shared/navigation/Pagination'
import SortField from '../../shared/filters/SortField'
import ListFilterToolbar from '../../shared/filters/ListFilterToolbar'
import ActorDirectoryListItem from '../../shared/cards/ActorDirectoryListItem'
import AdminHeader from './AdminHeader'

type RecoveryRequestsPageProps = {
  items?: any
  onResolve?: any
}

export default function RecoveryRequestsPage({ items, onResolve }: RecoveryRequestsPageProps) {
  const [query, setQuery] = useState<any>('')
  const [status, setStatus] = useState<any>('Pendiente')
  const [sortBy, setSortBy] = useState<any>('recent')
  const [currentPage, setCurrentPage] = useState<any>(1)
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
      <div className={isPageChanging ? 'directory-list admin-directory-list page-changing' : 'directory-list admin-directory-list'} ref={listRef}>{paginated.map((item) => <ActorDirectoryListItem key={item.id} title={item.name} subtitle={item.email || 'Sin email informado'} description={item.problem} meta={item.status} actions={item.status === 'Pendiente' ? <button type="button" onClick={() => onResolve(item.id)} aria-label={`Marcar resuelta la solicitud de ${item.name}`}><Check size={15} /></button> : null} />)}</div>
      <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label="Paginación de solicitudes" />
    </main>
  )
}
