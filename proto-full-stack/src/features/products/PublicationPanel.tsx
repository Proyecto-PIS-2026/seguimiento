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
import { productWebserviceCatalog, getProductCombination, buildPricedProduct } from '../../shared'
import DrawerShell from '../../shared/layout/DrawerShell'
import ProductPriceFields from './ProductPriceFields'
import useConfirmationTransition from '../../shared/forms/useConfirmationTransition'

type PublicationPanelProps = {
  items?: any
  initialProduct?: any
  initialVariant?: any
  onClose?: any
  onSave?: any
}

const optionCollator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' })
const compareText = (a, b) => optionCollator.compare(String(a ?? ''), String(b ?? ''))

export default function PublicationPanel({ items, initialProduct, initialVariant, onClose, onSave }: PublicationPanelProps) {
  const initialDefinition = initialProduct ? productWebserviceCatalog.find((entry) => entry.id === (initialProduct.sourceProductId ?? initialProduct.id)) : null
  const initialCombination = initialVariant ?? (initialProduct ? getProductCombination(initialProduct) : null)
  const loadedProductId = useRef(null)
  const [productId, setProductId] = useState<any>(initialDefinition ? String(initialDefinition.id) : '')
  const [variety, setVariety] = useState<any>(initialVariant?.variety ?? (initialProduct ? '' : initialCombination?.variety ?? initialDefinition?.varieties[0] ?? ''))
  const [unit, setUnit] = useState<any>(initialCombination?.unit ?? initialDefinition?.units[0].code ?? '')
  const [presentation, setPresentation] = useState<any>(initialCombination?.presentation ?? initialDefinition?.presentations[0] ?? '')
  const [calibre, setCalibre] = useState<any>(initialCombination?.calibre ?? initialDefinition?.calibres[0].code ?? '')
  const [category, setCategory] = useState<any>(initialCombination?.category ?? initialDefinition?.categories[0].code ?? '')
  const [photo, setPhoto] = useState<any>(initialVariant?.photo ?? '')
  const [price, setPrice] = useState<any>(initialVariant?.price?.match(/\d+(?:\.\d+)?/)?.[0] ?? '')
  const [noPrice, setNoPrice] = useState<any>(Boolean(initialVariant?.price && !initialVariant.price.match(/\d+/)))
  const [formError, setFormError] = useState<any>('')
  const { confirm, isSubmitting } = useConfirmationTransition()

  const selectedDefinition = productWebserviceCatalog.find((definition) => definition.id === Number(productId))
  const matchedProduct = items.find((item) => {
    const combination = getProductCombination(item)
    return (item.sourceProductId ?? item.id) === Number(productId) && combination?.variety === variety && combination?.unit === unit && combination?.presentation === presentation && combination?.calibre === calibre && combination?.category === category
  })

  useEffect(() => {
    if (initialVariant || !matchedProduct || loadedProductId.current === matchedProduct.id) return
    loadedProductId.current = matchedProduct.id
    const matchedPrice = matchedProduct.price.match(/\d+(?:\.\d+)?/)?.[0] ?? ''
    setPrice(matchedPrice)
    setNoPrice(!matchedPrice)
    setPhoto(matchedProduct.image ?? '')
  }, [initialVariant, matchedProduct])

  const selectProduct = (nextProductId) => {
    const definition = productWebserviceCatalog.find((entry) => entry.id === Number(nextProductId))
    setProductId(nextProductId)
    setVariety(definition?.varieties.slice().sort(compareText)[0] ?? '')
    setUnit(definition?.units.slice().sort((a, b) => compareText(a.name, b.name) || compareText(a.code, b.code))[0]?.code ?? '')
    setPresentation(definition?.presentations.slice().sort(compareText)[0] ?? '')
    setCalibre(definition?.calibres.slice().sort((a, b) => compareText(a.name, b.name) || compareText(a.code, b.code))[0]?.code ?? '')
    setCategory(definition?.categories.find((entry) => entry.code === 'I')?.code ?? definition?.categories[0].code ?? '')
    setPhoto('')
    setPrice('')
    setNoPrice(false)
    setFormError('')
    loadedProductId.current = null
  }
  const changeCombination = (setter, value) => {
    setter(value)
    setFormError('')
    loadedProductId.current = null
  }
  const draftProduct = buildPricedProduct({ definition: selectedDefinition, baseProduct: matchedProduct ?? (initialVariant ? initialProduct : undefined), variety, unit, presentation, calibre, category, photo, price, noPrice })
  const submitPublication = () => {
    if (!draftProduct || !Number.isFinite(Number(price)) || Number(price) <= 0) {
      setFormError('Completá la combinación y un precio mayor que cero.')
      return
    }
    setFormError('')
    confirm(() => onSave(matchedProduct, draftProduct), { success: `${initialVariant || matchedProduct ? 'Combinación actualizada' : 'Combinación publicada'} correctamente.` })
  }

  return (
    <DrawerShell onClose={onClose} labelledBy="publication-panel-title" className="publication-panel">
      {(swipeProps) => <>
        <header className="publication-panel-header" {...swipeProps}>
          <i className="actor-panel-handle" aria-hidden="true" />
          <p>{initialVariant ? 'Editar combinación' : initialProduct ? 'Nueva combinación' : 'Nueva publicación'}</p>
          <h2 id="publication-panel-title">{initialVariant ? `Editar combinación de ${initialProduct.name}` : initialProduct ? `Agregar combinación de ${initialProduct.name}` : 'Agregar publicación'}</h2>
          <span>Seleccioná las características de la mercadería.</span>
        </header>
        <form className="publication-panel-content" noValidate onSubmit={(event) => { event.preventDefault(); submitPublication() }}>
          <ProductPriceFields productId={productId} onProductChange={selectProduct} lockProduct={Boolean(initialProduct)} variety={variety} setVariety={(value) => changeCombination(setVariety, value)} unit={unit} setUnit={(value) => changeCombination(setUnit, value)} presentation={presentation} setPresentation={(value) => changeCombination(setPresentation, value)} calibre={calibre} setCalibre={(value) => changeCombination(setCalibre, value)} category={category} setCategory={(value) => changeCombination(setCategory, value)} photo={photo} setPhoto={(value) => { setPhoto(value); setFormError('') }} price={price} setPrice={(value) => { setPrice(value); setFormError('') }} noPrice={noPrice} setNoPrice={(value) => { setNoPrice(value); if (value) setPrice(''); setFormError('') }} />
          {matchedProduct && <div className="existing-publication"><Check size={18} /><span><strong>Combinación ya publicada</strong><small>Cargamos sus datos actuales para que puedas editarlos.</small></span></div>}
          {formError && <p className="field-error" role="alert">{formError}</p>}
          <button className="primary-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Confirmando…' : initialVariant || matchedProduct ? 'Guardar cambios' : 'Publicar combinación'} <ArrowRight size={20} /></button>
        </form>
      </>}
    </DrawerShell>
  )
}
