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

type PublicationPanelProps = {
  items?: any
  initialProduct?: any
  initialVariant?: any
  onClose?: any
  onSave?: any
}

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
  const [price, setPrice] = useState<any>(initialVariant?.price?.match(/\d+/)?.[0] ?? '')

  const selectedDefinition = productWebserviceCatalog.find((definition) => definition.id === Number(productId))
  const matchedProduct = items.find((item) => {
    const combination = getProductCombination(item)
    return (item.sourceProductId ?? item.id) === Number(productId) && combination?.variety === variety && combination?.unit === unit && combination?.presentation === presentation && combination?.calibre === calibre && combination?.category === category
  })

  useEffect(() => {
    if (initialVariant || !matchedProduct || loadedProductId.current === matchedProduct.id) return
    loadedProductId.current = matchedProduct.id
    setPrice(matchedProduct.price.match(/\d+/)?.[0] ?? '')
    setPhoto(matchedProduct.image ?? '')
  }, [initialVariant, matchedProduct])

  const selectProduct = (nextProductId) => {
    const definition = productWebserviceCatalog.find((entry) => entry.id === Number(nextProductId))
    setProductId(nextProductId)
    setVariety(definition?.varieties[0] ?? '')
    setUnit(definition?.units[0].code ?? '')
    setPresentation(definition?.presentations[0] ?? '')
    setCalibre(definition?.calibres[0].code ?? '')
    setCategory(definition?.categories.find((entry) => entry.code === 'I')?.code ?? definition?.categories[0].code ?? '')
    setPhoto('')
    setPrice('')
    loadedProductId.current = null
  }
  const changeCombination = (setter, value) => {
    setter(value)
    setPhoto('')
    setPrice('')
    loadedProductId.current = null
  }
  const draftProduct = buildPricedProduct({ definition: selectedDefinition, baseProduct: matchedProduct ?? undefined, variety, unit, presentation, calibre, category, photo, price })

  return (
    <DrawerShell onClose={onClose} labelledBy="publication-panel-title" className="publication-panel">
      {(swipeProps) => <>
        <header className="publication-panel-header" {...swipeProps}>
          <i className="actor-panel-handle" aria-hidden="true" />
          <p>{initialVariant ? 'Editar combinación' : initialProduct ? 'Nueva combinación' : 'Nueva publicación'}</p>
          <h2 id="publication-panel-title">{initialVariant ? `Editar variante de ${initialProduct.name}` : initialProduct ? `Agregar variedad de ${initialProduct.name}` : 'Agregar producto'}</h2>
          <span>Seleccioná las características de la mercadería.</span>
        </header>
        <form className="publication-panel-content" onSubmit={(event) => { event.preventDefault(); onSave(matchedProduct, draftProduct) }}>
          <ProductPriceFields productId={productId} onProductChange={selectProduct} lockProduct={Boolean(initialProduct)} variety={variety} setVariety={(value) => changeCombination(setVariety, value)} unit={unit} setUnit={(value) => changeCombination(setUnit, value)} presentation={presentation} setPresentation={(value) => changeCombination(setPresentation, value)} calibre={calibre} setCalibre={(value) => changeCombination(setCalibre, value)} category={category} setCategory={(value) => changeCombination(setCategory, value)} photo={photo} setPhoto={setPhoto} price={price} setPrice={setPrice} />
          {matchedProduct && <div className="existing-publication"><Check size={18} /><span><strong>Producto ya publicado</strong><small>Cargamos sus datos actuales para que puedas editarlos.</small></span></div>}
          <button className="primary-submit" type="submit" disabled={!draftProduct}>{initialVariant || matchedProduct ? 'Guardar cambios' : 'Publicar producto'} <ArrowRight size={20} /></button>
        </form>
      </>}
    </DrawerShell>
  )
}
