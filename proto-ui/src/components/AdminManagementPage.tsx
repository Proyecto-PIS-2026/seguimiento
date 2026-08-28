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
import { usePageTransition } from '../shared'
import Pagination from './Pagination'
import SortField from './SortField'
import ListFilterToolbar from './ListFilterToolbar'
import ActorDirectoryListItem from './ActorDirectoryListItem'
import AdminHeader from './AdminHeader'

type AdminManagementPageProps = {
  kind?: any
  items?: any
  onCreate?: any
  onEdit?: any
  onDelete?: any
}

export default function AdminManagementPage({ kind, items, onCreate, onEdit, onDelete }: AdminManagementPageProps) {
  const [query, setQuery] = useState<any>('')
  const [status, setStatus] = useState<any>('all')
  const [nave, setNave] = useState<any>('all')
  const [sortBy, setSortBy] = useState<any>('name')
  const [currentPage, setCurrentPage] = useState<any>(1)
  const listRef = useRef(null)
  const { changePage, isPageChanging } = usePageTransition(setCurrentPage, listRef)
  const labels = kind === 'producer' ? { eyebrow: 'Usuarios del sistema', title: 'Productores', description: 'Alta, modificación y baja de productores habilitados.' } : { eyebrow: 'Usuarios del sistema', title: 'Operadores', description: 'Alta, modificación y baja de puestos habilitados en la UAM.' }
  const naveOptions = [...new Set<any>(items.map((item) => item.nave).filter(Boolean))].sort()
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
      <div className={isPageChanging ? 'directory-list admin-directory-list page-changing' : 'directory-list admin-directory-list'} ref={listRef}>
        {paginatedItems.map((item) => <ActorDirectoryListItem key={item.id ?? `${item.name}-${item.place}`} title={item.name} subtitle={kind === 'operator' ? `${item.nave} · Puesto ${item.puesto}` : item.place} meta={item.active === false ? 'Inactivo' : 'Activo'} onOpen={() => onEdit(item)} actions={<><button type="button" onClick={() => onEdit(item)} aria-label={`Editar ${item.name}`}><Pencil size={15} /></button><button type="button" onClick={() => onDelete(item)} aria-label={`Eliminar ${item.name}`}><Trash2 size={15} /></button></>} />)}
      </div>
      <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label={`Paginación de ${labels.title.toLocaleLowerCase('es')}`} />
    </main>
  )
}
