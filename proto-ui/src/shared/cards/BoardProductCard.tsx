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
import MarketListingCard from './MarketListingCard'

type BoardProductCardProps = {
  product?: any
  status?: any
  favorite?: any
  onToggleFavorite?: any
  onOpen?: any
  actions?: any
}

export default function BoardProductCard({ product, status, favorite = false, onToggleFavorite = () => { }, onOpen = () => { }, actions: providedActions }: BoardProductCardProps) {
  const favoriteAction = (
    <button className={favorite ? 'favorite selected' : 'favorite'} type="button" onClick={(event) => { event.stopPropagation(); onToggleFavorite() }} aria-label={favorite ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}>
      <Star size={16} strokeWidth={2} fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" />
    </button>
  )

  return (
    <MarketListingCard className="board-product-card" image={product.image} title={product.name} subtitle={product.detail} rows={[{ key: 'market-summary', label: status, price: product.price || 'Sin precio' }]} actions={providedActions ?? favoriteAction} onOpen={onOpen} ariaLabel={`Abrir ${product.name}`} />
  )
}
