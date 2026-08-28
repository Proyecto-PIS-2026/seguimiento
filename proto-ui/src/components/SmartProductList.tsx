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
import { products, smartPicks } from '../shared'
import SmartListItem from './SmartListItem'

type SmartProductListProps = {
  onOpenProduct?: any
}

export default function SmartProductList({ onOpenProduct }: SmartProductListProps) {
  const [query, setQuery] = useState<any>('')
  const recommendedProducts = smartPicks.map((pick) => ({ ...products.find((product) => product.id === pick.productId), description: pick.description }))
  const visibleProducts = recommendedProducts.filter((product) => !query.trim() || product.name.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es')))

  return (
    <div className="smart-list-area">
      <label className="smart-search"><Search size={18} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en la lista" aria-label="Buscar en la lista inteligente" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Limpiar búsqueda"><X size={16} /></button>}</label>
      <div className="smart-picks" aria-label="Productos recomendados">
        {visibleProducts.map((product) => <SmartListItem key={product.id} product={product} description={product.description} onOpen={() => onOpenProduct(product)} />)}
      </div>
      {visibleProducts.length === 0 && <p className="smart-empty">No hay recomendaciones que coincidan.</p>}
    </div>
  )
}
