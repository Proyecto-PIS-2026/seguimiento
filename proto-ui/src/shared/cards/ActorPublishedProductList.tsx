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
import { fallbackProductImage, getActorPublishedProducts, getActorProductPriceOptions } from '../../shared'

type ActorPublishedProductListProps = {
  entry?: any
  role?: any
  items?: any
  onOpenProduct?: any
  variantOverrides?: any
  removedVariantKeys?: any
  onEditVariant?: any
  onRemoveVariant?: any
  onAddVariant?: any
  onRemoveProduct?: any
  onOpenVariantMedia?: any
  usePublishedVariantPhotos?: any
}

export default function ActorPublishedProductList({ entry, role, items, onOpenProduct, variantOverrides = {}, removedVariantKeys = [], onEditVariant, onRemoveVariant, onAddVariant, onRemoveProduct, onOpenVariantMedia, usePublishedVariantPhotos = false }: ActorPublishedProductListProps) {
  const allActorProducts = getActorPublishedProducts(entry, role)
  const actorProducts = items ?? allActorProducts

  return (
    <div className="actor-product-list">
      {actorProducts.map((product, index) => {
        const publishedActor = product.operators?.find((operator) => operator.name === entry.name) ?? entry
        const stableProductIndex = allActorProducts.findIndex((entry) => entry.id === product.id)
        const priceOptions = getActorProductPriceOptions(product, { ...publishedActor, available: true, price: publishedActor.price ?? entry.price ?? product.price }, stableProductIndex < 0 ? product.actorProductIndex ?? index : stableProductIndex).filter((option) => !removedVariantKeys.includes(`${product.id}:${option.key}`)).map((option, optionIndex) => ({ ...option, photo: option.photo ?? (usePublishedVariantPhotos && ((product.id * 7 + optionIndex * 3) % 5 < 2) ? product.image : null), ...(variantOverrides[`${product.id}:${option.key}`] ?? {}) }))
        return <article className="has-price-options" role="button" tabIndex={0} key={product.id} onClick={() => onOpenProduct(product, role)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpenProduct(product, role) } }}>
          <img src={product.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} />
          <span className="actor-product-copy"><span className="actor-product-heading"><strong>{product.name}</strong>{(onAddVariant || onRemoveProduct) && <span className="actor-product-heading-actions">{onAddVariant && <button type="button" onClick={(event) => { event.stopPropagation(); onAddVariant(product) }} aria-label={`Agregar variedad de ${product.name}`}><Plus size={14} /></button>}{onRemoveProduct && <button className="remove" type="button" onClick={(event) => { event.stopPropagation(); onRemoveProduct(product) }} aria-label={`Eliminar ${product.name}`}><Trash2 size={14} /></button>}</span>}</span><span className="actor-product-price-list">{priceOptions.map((option) => {
            return <span key={option.key}><small>{option.variety} · Cat. {option.category} · {option.calibre} · {option.unit}</small><span className="actor-variant-price">{option.photo && onOpenVariantMedia && <button className="variant-photo-action" type="button" onClick={(event) => { event.stopPropagation(); onOpenVariantMedia({ src: option.photo, alt: `${option.variety} de ${entry.name}` }) }} aria-label={`Ver foto de ${option.variety}`}><ImageIcon size={13} /></button>}<b>{option.price}</b>{(onEditVariant || onRemoveVariant) && <span className="actor-variant-actions">{onEditVariant && <button type="button" onClick={(event) => { event.stopPropagation(); onEditVariant(product, option) }} aria-label={`Editar variante ${option.variety}`}><Pencil size={14} /></button>}{onRemoveVariant && <button className="remove" type="button" onClick={(event) => { event.stopPropagation(); onRemoveVariant(product, option) }} aria-label={`Eliminar variante ${option.variety}`}><Trash2 size={14} /></button>}</span>}</span></span>
          })}</span></span>
        </article>
      })}
    </div>
  )
}
