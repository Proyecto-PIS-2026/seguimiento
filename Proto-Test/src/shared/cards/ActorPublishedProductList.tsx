import { publishedPriceOptions } from '../catalog/publishedPriceOptions'
import { matchesPriceBounds } from '../filters/priceRange'
import { groupActorProducts } from '../catalog/groupActorProducts'
import { Image as ImageIcon, Pencil, Trash2, ChevronRight } from 'lucide-react'
import { fallbackProductImage, getActorPublishedProducts, productWebserviceCatalog } from '../../shared'
import PublicationPrice from '../../features/products/PublicationPrice'

type ActorPublishedProductListProps = {
  priceMin?: string
  priceMax?: string
  entry?: any
  role?: any
  items?: any
  displayItems?: any[]
  containerRef?: any
  emptyMessage?: string
  onOpenProduct?: any
  variantOverrides?: any
  removedVariantKeys?: any
  onEditPrice?: (product: any, option: any) => void
  onEditVariant?: any
  onAdjustPrice?: (product: any, option: any, delta: number) => Promise<void>
  onSlidePrice?: (product: any, option: any) => void
  onRemoveVariant?: any
  onAddVariant?: any
  onRemoveProduct?: any
  onOpenVariantMedia?: any
  usePublishedVariantPhotos?: any
}

export default function ActorPublishedProductList({ priceMin = '', priceMax = '', entry, role, items, displayItems, containerRef, emptyMessage, onOpenProduct, variantOverrides = {}, removedVariantKeys = [], onEditPrice, onEditVariant, onAdjustPrice, onSlidePrice, onRemoveVariant, onAddVariant, onRemoveProduct, onOpenVariantMedia, usePublishedVariantPhotos = false }: ActorPublishedProductListProps) {
  const allActorProducts = displayItems ? [] : getActorPublishedProducts(entry, role)
  const actorProducts = displayItems ? [] : groupActorProducts(items ?? allActorProducts)
  const normalizedItems = displayItems ?? actorProducts.map((product, index) => {
    const speciesName = productWebserviceCatalog.find(definition => definition.id === (product.sourceProductId ?? product.id))?.species ?? product.name
    const priceOptions = publishedPriceOptions(product, entry, role, variantOverrides, removedVariantKeys, usePublishedVariantPhotos, index).filter(option => matchesPriceBounds(option.price, priceMin, priceMax))

    return {
      key: product.id,
      image: product.image,
      title: product.name,
      ariaLabel: `Abrir ${product.name}`,
      onOpen: () => onOpenProduct?.(product, role),
      actions: (onAddVariant || onRemoveProduct) ? <>{onAddVariant && <button className="add-species-action" type="button" onClick={(event) => { event.stopPropagation(); onAddVariant(product) }}>Agregar {speciesName}</button>}{onRemoveProduct && <button className="remove" type="button" onClick={(event) => { event.stopPropagation(); onRemoveProduct(product) }} aria-label={`Eliminar ${product.name}`}><Trash2 size={14} /></button>}</> : null,
      rows: priceOptions.map((option) => ({
        key: option.key,
        label: `${option.variety} · ${option.presentation} · Cat. ${option.category} · ${option.calibre} · ${option.unit}`,
        price: option.price,
        onEdit: onEditPrice ? () => onEditPrice(product, option) : undefined,
        onAdjust: onAdjustPrice ? (delta: number) => onAdjustPrice(product, option, delta) : undefined,
        onSlide: onSlidePrice ? () => onSlidePrice(product, option) : undefined,
        photo: option.photo,
        photoLabel: `Ver foto de ${option.variety}`,
        onOpenPhoto: option.photo && onOpenVariantMedia ? () => onOpenVariantMedia({ src: option.photo, alt: `${option.variety} de ${entry.name}` }) : null,
        actions: (onEditVariant || onRemoveVariant) ? <>{onEditVariant && <button className="edit-price-action" type="button" title="Editar combinación" onClick={(event) => { event.stopPropagation(); onEditVariant(product, option) }} aria-label={`Editar combinación de ${option.variety}, ${option.presentation}, categoría ${option.category}, calibre ${option.calibre}, ${option.unit}`}><Pencil size={16} /></button>}{onRemoveVariant && <button className="remove" type="button" onClick={(event) => { event.stopPropagation(); onRemoveVariant(product, option) }} aria-label={`Eliminar combinación ${option.variety}`}><Trash2 size={16} /></button>}</> : null,
      })),
    }
  })

  return (
    <div className="actor-product-list" ref={containerRef}>
      {normalizedItems.map((item) => <article className="has-price-options" key={item.key}>
        {item.image ? (item.onImageClick ? <button className="actor-product-image-action" type="button" onClick={(event) => { event.stopPropagation(); item.onImageClick() }} aria-label={item.imageLabel}><img src={item.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} /></button> : <img src={item.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} />) : <span className="actor-product-image-placeholder">Sin imagen</span>}
        <span className="actor-product-copy">
          <span className={item.subtitle ? 'actor-product-heading' : 'actor-product-heading without-subtitle'}>
            <span className={item.subtitle ? 'actor-product-title' : 'actor-product-title without-subtitle'}><button className="product-title-link" type="button" onClick={item.onOpen} aria-label={item.ariaLabel}><strong>{item.title}</strong><ChevronRight size={16} /></button>{item.subtitle ? <small>{item.subtitle}</small> : <small>{item.rows.length} {item.rows.length === 1 ? 'combinación publicada' : 'combinaciones publicadas'}</small>}</span>
            {item.actions && <span className="actor-product-heading-actions">{item.actions}</span>}
          </span>
          <span className="actor-product-price-list">{item.rows.map((row) => <span key={row.key}>
            <small>{row.label}</small>
            <span className="actor-variant-price">
              <PublicationPrice price={row.price} label={row.label} onEdit={row.onEdit} onAdjust={row.onAdjust} onSlide={row.onSlide} />
              {row.photo && row.onOpenPhoto && <button className="variant-photo-action" type="button" onClick={(event) => { event.stopPropagation(); row.onOpenPhoto() }} aria-label={row.photoLabel}><ImageIcon size={13} /></button>}
              {row.actions && <span className="actor-variant-actions">{row.actions}</span>}
            </span>
          </span>)}</span>
        </span>
      </article>)}
      {normalizedItems.length === 0 && emptyMessage && <p className="operator-empty">{emptyMessage}</p>}
    </div>
  )
}
