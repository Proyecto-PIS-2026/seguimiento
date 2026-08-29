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
import { fallbackProductImage, productWebserviceCatalog, getProductCombination, buildPricedProduct } from '../../shared'
import ProductPriceFields from './ProductPriceFields'
import useConfirmationTransition from '../../shared/forms/useConfirmationTransition'

type EditPriceProps = {
  product?: any
  onSave?: any
  onCancel?: any
}

export default function EditPrice({ product, onSave, onCancel }: EditPriceProps) {
  const definition = productWebserviceCatalog.find((entry) => entry.id === (product.sourceProductId ?? product.id)) ?? productWebserviceCatalog[0]
  const initialCombination = getProductCombination(product) ?? { variety: definition.varieties[0], unit: definition.units[0].code, presentation: definition.presentations[0], calibre: definition.calibres[0].code, category: definition.categories[0].code }
  const [variety, setVariety] = useState<any>(initialCombination.variety)
  const [unit, setUnit] = useState<any>(initialCombination.unit)
  const [presentation, setPresentation] = useState<any>(initialCombination.presentation)
  const [calibre, setCalibre] = useState<any>(initialCombination.calibre)
  const [category, setCategory] = useState<any>(initialCombination.category)
  const [photo, setPhoto] = useState<any>(product.image ?? '')
  const [price, setPrice] = useState<any>(product.price.match(/\d+/)?.[0] ?? '')
  const [available, setAvailable] = useState<any>(true)
  const { confirm, isSubmitting } = useConfirmationTransition()
  const updatedProduct = buildPricedProduct({ definition, baseProduct: product, variety, unit, presentation, calibre, category, photo, price })

  return (
    <main className="form-page edit-price-page">
      <aside className="form-aside">
        <p className="eyebrow light-eyebrow">Mi catálogo</p>
        <h1>Actualizá<br /><em>el precio.</em></h1>
        <p>{product.name}<br />{product.detail}</p>
      </aside>
      <section className="form-content">
        <div className="form-title"><div><h2>Editar precio</h2><p>La actualización se refleja en el catálogo de hoy.</p></div></div>
        <form onSubmit={(event) => { event.preventDefault(); if (updatedProduct) confirm(() => onSave(updatedProduct), { success: 'Precio actualizado correctamente.' }) }}>
          <div className="edit-product-summary"><img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackProductImage }} /><div><strong>{product.name}</strong><span>{product.detail}</span></div></div>
          <ProductPriceFields productId={String(definition.id)} onProductChange={() => { }} lockProduct variety={variety} setVariety={setVariety} unit={unit} setUnit={setUnit} presentation={presentation} setPresentation={setPresentation} calibre={calibre} setCalibre={setCalibre} category={category} setCategory={setCategory} photo={photo} setPhoto={setPhoto} price={price} setPrice={setPrice} />
          <div className="availability-control"><div><b>Publicado hoy</b><span>Define si la publicación aparece en tu mercado.</span></div><button className={available ? 'switch on' : 'switch'} type="button" onClick={() => setAvailable((value) => !value)} aria-pressed={available}><i /></button></div>
          <button className="primary-submit" type="submit" disabled={!updatedProduct || isSubmitting}>{isSubmitting ? 'Guardando…' : 'Guardar precio'} <Check size={20} /></button>
          <button className="text-action" type="button" onClick={onCancel}>Cancelar</button>
        </form>
      </section>
    </main>
  )
}
