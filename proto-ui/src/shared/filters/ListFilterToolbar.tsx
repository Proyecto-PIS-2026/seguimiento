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

type ListFilterToolbarProps = {
  query?: any
  setQuery?: any
  placeholder?: any
  searchLabel?: any
  activeFilterCount?: any
  onClear?: any
  children?: any
  className?: any
}

export default function ListFilterToolbar({ query, setQuery, placeholder, searchLabel, activeFilterCount = 0, onClear, children, className = '' }: ListFilterToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState<any>(false)

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
