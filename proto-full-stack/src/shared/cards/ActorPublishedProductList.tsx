import { groupActorProducts } from '../catalog/groupActorProducts'
import { Image as ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react'
import { fallbackProductImage, getActorPublishedProducts, getActorProductPriceOptions, compareProductsByCombination, sortProductCombinations } from '../../shared'

type ActorPublishedProductListProps = {
  entry?: any
  role?: any
  items?: any
  displayItems?: any[]
  containerRef?: any
  emptyMessage?: string
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

export default function ActorPublishedProductList({ entry, role, items, displayItems, containerRef, emptyMessage, onOpenProduct, variantOverrides = {}, removedVariantKeys = [], onEditVariant, onRemoveVariant, onAddVariant, onRemoveProduct, onOpenVariantMedia, usePublishedVariantPhotos = false }: ActorPublishedProductListProps) {
  const allActorProducts = displayItems ? [] : getActorPublishedProducts(entry, role)
  const actorProducts = displayItems ? [] : groupActorProducts(items ?? allActorProducts)
  const normalizedItems = displayItems ?? actorProducts.map((product, index) => {
    const publishedActor = product.operators?.find((operator) => operator.name === entry.name) ?? entry
    const stableProductIndex = allActorProducts.findIndex((actorProduct) => actorProduct.id === product.id)
    const priceOptions = sortProductCombinations(getActorProductPriceOptions(product, { ...publishedActor, available: true, price: publishedActor.price ?? entry.price ?? product.price }, stableProductIndex < 0 ? product.actorProductIndex ?? index : stableProductIndex)
      .filter((option) => !removedVariantKeys.includes(`${product.id}:${option.key}`))
      .map((option, optionIndex) => ({ ...option, photo: option.photo ?? (!product.persisted && usePublishedVariantPhotos && ((product.id * 7 + optionIndex * 3) % 5 < 2) ? product.image : null), ...(variantOverrides[`${product.id}:${option.key}`] ?? {}) })))

    return {
      key: product.id,
      image: product.image,
      title: product.name,
      ariaLabel: `Abrir ${product.name}`,
      onOpen: () => onOpenProduct?.(product, role),
      actions: (onAddVariant || onRemoveProduct) ? <>{onAddVariant && <button type="button" onClick={(event) => { event.stopPropagation(); onAddVariant(product) }} aria-label={`Agregar combinación de ${product.name}`}><Plus size={14} /></button>}{onRemoveProduct && <button className="remove" type="button" onClick={(event) => { event.stopPropagation(); onRemoveProduct(product) }} aria-label={`Eliminar ${product.name}`}><Trash2 size={14} /></button>}</> : null,
      rows: priceOptions.map((option) => ({
        key: option.key,
        label: `${option.variety} · Cat. ${option.category} · ${option.calibre} · ${option.unit}`,
        attributes: [option.variety, `Cat. ${option.category}`, option.presentation, option.calibre, option.unit],
        price: option.price,
        photo: option.photo,
        photoLabel: `Ver foto de ${option.variety}`,
        onOpenPhoto: option.photo && onOpenVariantMedia ? () => onOpenVariantMedia({ src: option.photo, alt: `${option.variety} de ${entry.name}` }) : null,
        actions: (onEditVariant || onRemoveVariant) ? <>{onEditVariant && <button type="button" onClick={(event) => { event.stopPropagation(); onEditVariant(product, option) }} aria-label={`Editar combinación ${option.variety}`}><Pencil size={14} /></button>}{onRemoveVariant && <button className="remove" type="button" onClick={(event) => { event.stopPropagation(); onRemoveVariant(product, option) }} aria-label={`Eliminar combinación ${option.variety}`}><Trash2 size={14} /></button>}</> : null,
      })),
    }
  })

  return (
    <div className="actor-product-list" ref={containerRef}>
      {normalizedItems.map((item) => <article className="has-price-options" role="button" tabIndex={0} key={item.key} aria-label={item.ariaLabel} onClick={item.onOpen} onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && item.onOpen) { event.preventDefault(); item.onOpen() } }}>
        {item.image ? (item.onImageClick ? <button className="actor-product-image-action" type="button" onClick={(event) => { event.stopPropagation(); item.onImageClick() }} aria-label={item.imageLabel}><img src={item.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} /></button> : <img src={item.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} />) : <span className="actor-product-image-placeholder">Sin imagen</span>}
        <span className="actor-product-copy">
          <span className={item.subtitle ? 'actor-product-heading' : 'actor-product-heading without-subtitle'}>
            <span className={item.subtitle ? 'actor-product-title' : 'actor-product-title without-subtitle'}><strong>{item.title}</strong>{item.subtitle && <small>{item.subtitle}</small>}</span>
            {item.actions && <span className="actor-product-heading-actions">{item.actions}</span>}
          </span>
          <span className="actor-product-price-list">{item.rows.map((row) => <span key={row.key}>
            <small className="actor-variant-attributes" aria-label={row.label}>{(row.attributes ?? [row.label]).map((attribute, attributeIndex) => <span key={`${attribute}-${attributeIndex}`}>{attribute}</span>)}</small>
            <span className="actor-variant-price">
              {row.photo && row.onOpenPhoto && <button className="variant-photo-action" type="button" onClick={(event) => { event.stopPropagation(); row.onOpenPhoto() }} aria-label={row.photoLabel}><ImageIcon size={13} /></button>}
              <b>{row.price}</b>
              {row.actions && <span className="actor-variant-actions">{row.actions}</span>}
            </span>
          </span>)}</span>
        </span>
      </article>)}
      {normalizedItems.length === 0 && emptyMessage && <p className="operator-empty">{emptyMessage}</p>}
    </div>
  )
}
