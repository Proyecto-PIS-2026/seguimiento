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
import SortField from './SortField'
import ListFilterToolbar from './ListFilterToolbar'
import BoardProductCard from './BoardProductCard'
import AdminHeader from './AdminHeader'

type AdminSmartListPageProps = {
  items?: any
  onEdit?: any
  onDelete?: any
  onCreate?: any
}

export default function AdminSmartListPage({ items, onEdit, onDelete, onCreate }: AdminSmartListPageProps) {
  const [query, setQuery] = useState<any>('')
  const [sortBy, setSortBy] = useState<any>('name')
  const visibleItems = items.filter((item) => !query.trim() || item.product.name.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))).sort((a, b) => sortBy === 'recent' ? b.id - a.id : a.product.name.localeCompare(b.product.name, 'es'))
  return (
    <main className="admin-page">
      <AdminHeader eyebrow="Curaduría de mercado" title="Lista inteligente" description="Recomendaciones visibles para el público general." count={items.length} onCreate={onCreate} />
      <ListFilterToolbar query={query} setQuery={setQuery} placeholder="Buscar recomendación" activeFilterCount={0} onClear={() => setSortBy('name')} className="admin-tools">
        <SortField value={sortBy} onChange={setSortBy} options={[{ value: 'name', label: 'Producto' }, { value: 'recent', label: 'Más reciente' }]} />
        <label><span>Período</span><select defaultValue="current"><option value="current">Período actual</option></select></label>
      </ListFilterToolbar>
      <div className="product-grid admin-board-list">{visibleItems.map((item) => <BoardProductCard key={item.id} product={{ ...item.product, detail: item.description }} status="" onOpen={() => onEdit(item)} actions={<><button type="button" onClick={(event) => { event.stopPropagation(); onEdit(item) }} aria-label={`Editar ${item.product.name}`}><Pencil size={15} /></button><button type="button" onClick={(event) => { event.stopPropagation(); onDelete(item) }} aria-label={`Eliminar ${item.product.name}`}><Trash2 size={15} /></button></>} />)}</div>
    </main>
  )
}
