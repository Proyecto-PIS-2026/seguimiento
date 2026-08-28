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

type MarketListingCardProps = {
  className?: any
  image?: any
  imageAlt?: any
  emptyImageLabel?: any
  onImageClick?: any
  title?: any
  subtitle?: any
  rows?: any
  actions?: any
  onOpen?: any
  ariaLabel?: any
}

export default function MarketListingCard({
  className = '',
  image,
  imageAlt = '',
  emptyImageLabel = 'Sin imagen',
  onImageClick,
  title,
  subtitle,
  rows = [],
  actions,
  onOpen = () => { },
  ariaLabel,
}: MarketListingCardProps) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen()
    }
  }

  return (
    <article className={`operator-row market-listing-card${actions ? ' has-card-actions' : ''}${className ? ` ${className}` : ''}`} role="button" tabIndex={0} onClick={onOpen} onKeyDown={handleKeyDown} aria-label={ariaLabel}>
      {image ? (
        onImageClick ? (
          <button className="operator-offer-photo" type="button" onClick={(event) => { event.stopPropagation(); onImageClick() }} aria-label={`Ampliar foto de ${title}`}>
            <img src={image} alt={imageAlt} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} />
          </button>
        ) : (
          <span className="operator-offer-photo static"><img src={image} alt={imageAlt} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} /></span>
        )
      ) : <span className="operator-offer-photo empty" aria-label={emptyImageLabel}>{emptyImageLabel}</span>}
      <div className="operator-identity"><h4>{title}</h4>{subtitle && <span>{subtitle}</span>}</div>
      <div className="operator-price-list">
        {rows.map((row) => <span key={row.key}>{row.label && <small>{row.label}</small>}<strong>{row.onViewImage && <button className="variant-photo-action" type="button" onClick={(event) => { event.stopPropagation(); row.onViewImage() }} aria-label={`Ver foto de ${row.label}`}><ImageIcon size={13} /></button>}<b>{row.price}</b>{row.priceMeta && <small>{row.priceMeta}</small>}</strong></span>)}
      </div>
      {actions && <div className="offer-actions">{actions}</div>}
    </article>
  )
}
