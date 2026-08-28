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
import { fallbackProductImage } from '../shared'

type SmartListItemProps = {
  product?: any
  description?: any
  onOpen?: any
  actions?: any
}

export default function SmartListItem({ product, description, onOpen, actions }: SmartListItemProps) {
  return (
    <article className={actions ? 'smart-product-row has-actions' : 'smart-product-row'}>
      <img src={product.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} />
      <button type="button" onClick={onOpen}><strong>{product.name}</strong><small>{description}</small></button>
      <span><strong>{product.price}</strong></span>
      {actions && <div className="smart-row-actions">{actions}</div>}
    </article>
  )
}
