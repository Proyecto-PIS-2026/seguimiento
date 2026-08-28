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

type OperatorOfferCardProps = {
  operator?: any
  product?: any
  onOpen?: any
  onOpenMedia?: any
}

export default function OperatorOfferCard({ operator, product, onOpen = () => { }, onOpenMedia = () => { } }: OperatorOfferCardProps) {
  const actions = (
    <>
      <button type="button" onClick={(event) => event.stopPropagation()} aria-label={`Ver ubicación de ${operator.name}`}><MapPin size={15} /></button>
      <a href={`https://wa.me/?text=${encodeURIComponent(`Hola, consulto por ${product.name} en ${operator.name}`)}`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} aria-label={`Contactar a ${operator.name} por WhatsApp`}><MessageCircle size={15} /></a>
    </>
  )

  return (
    <MarketListingCard image={operator.offerPhoto} onImageClick={operator.offerPhoto ? () => onOpenMedia({ src: operator.offerPhoto, alt: `Mercadería aportada por ${operator.name}` }) : undefined} title={operator.name} subtitle={operator.place} rows={operator.priceOptions.map((option) => ({ key: option.key, label: `${option.label} · ${option.unit}`, price: option.price, onViewImage: option.photo ? () => onOpenMedia({ src: option.photo, alt: `${option.label} de ${operator.name}` }) : undefined }))} actions={actions} onOpen={onOpen} ariaLabel={`Abrir mercado de ${operator.name}`} />
  )
}
