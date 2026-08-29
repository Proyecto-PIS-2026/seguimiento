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
import { products, usePageTransition } from '../../shared'
import Pagination from '../../shared/navigation/Pagination'
import SortField from '../../shared/filters/SortField'
import ListFilterToolbar from '../../shared/filters/ListFilterToolbar'
import ActorDirectoryListItem from '../../shared/cards/ActorDirectoryListItem'

type ActorDirectoryProps = {
  eyebrow?: any
  title?: any
  description?: any
  entries?: any
  onOpen?: any
  filterLabel?: any
  getFilterValue?: any
  showLocationAction?: any
  showWhatsapp?: any
  highlightPlace?: any
}

export default function ActorDirectory({ eyebrow, title, description, entries, onOpen, filterLabel, getFilterValue, showLocationAction = false, showWhatsapp = false, highlightPlace = false }: ActorDirectoryProps) {
  const [query, setQuery] = useState<any>('')
  const [filterValue, setFilterValue] = useState<any>('all')
  const [sortBy, setSortBy] = useState<any>('name')
  const [currentPage, setCurrentPage] = useState<any>(1)
  const listRef = useRef(null)
  const { changePage, isPageChanging } = usePageTransition(setCurrentPage, listRef)
  const filterOptions = useMemo(() => [...new Set<any>(entries.map(getFilterValue))], [entries, getFilterValue])
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
          <ActorDirectoryListItem key={`${entry.name}-${entry.place}-${entry.product?.id ?? entry.productCount}`} title={entry.name} subtitle={entry.place} meta={`${entry.productCount} productos`} highlightSubtitle={highlightPlace} onOpen={() => onOpen(entry)} actions={(showLocationAction || showWhatsapp) ? <>{showLocationAction && <button type="button" aria-label={`Ver ubicación de ${entry.name}`}><MapPin size={15} /></button>}{showWhatsapp && <a href={`https://wa.me/?text=${encodeURIComponent(`Hola, consulto por el mercado de ${entry.name}`)}`} target="_blank" rel="noreferrer" aria-label={`Contactar a ${entry.name} por WhatsApp`}><MessageCircle size={15} /></a>}</> : null} />
        ))}
      </div>
      {visibleEntries.length === 0 && <div className="catalog-empty"><h2>No hay resultados</h2></div>}
      <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label={`Paginación de ${title.toLocaleLowerCase('es')}`} />
    </main>
  )
}
