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
import { products, calendarDays, usePageTransition, productMatchesFilters, getActorPublishedProducts } from '../shared'
import Pagination from './Pagination'
import ProductFilterFields from './ProductFilterFields'
import SortField from './SortField'
import ListFilterToolbar from './ListFilterToolbar'
import MediaModal from './MediaModal'
import ConfirmModal from './ConfirmModal'
import ActorPublishedProductList from './ActorPublishedProductList'
import PublicationPanel from './PublicationPanel'

type ProviderMarketProps = {
  operator?: any
  originProduct?: any
  onBack?: any
  onOpenProduct?: any
  eyebrow?: any
  backLabel?: any
  items?: any
  editable?: any
  onCreate?: any
  onRemove?: any
  productRole?: any
  useActorProducts?: any
}

export default function ProviderMarket({ operator, originProduct, onBack, onOpenProduct, eyebrow = 'Mercado del operador', backLabel = 'Volver al pizarrón', items = products, editable = false, onCreate, onRemove, productRole = 'operator', useActorProducts = false }: ProviderMarketProps) {
  const [query, setQuery] = useState<any>('')
  const [priceFilter, setPriceFilter] = useState<any>('all')
  const [varietyFilter, setVarietyFilter] = useState<any>('all')
  const [presentationFilter, setPresentationFilter] = useState<any>('all')
  const [calibreFilter, setCalibreFilter] = useState<any>('all')
  const [categoryFilter, setCategoryFilter] = useState<any>('all')
  const [naveFilter, setNaveFilter] = useState<any>('all')
  const [unitFilter, setUnitFilter] = useState<any>('all')
  const [sortBy, setSortBy] = useState<any>('name')
  const [currentPage, setCurrentPage] = useState<any>(1)
  const [editingHours, setEditingHours] = useState<any>(false)
  const [selectedDays, setSelectedDays] = useState<any>(calendarDays.slice(0, 6).map((day) => day.id))
  const [openingTime, setOpeningTime] = useState<any>('04:00')
  const [closingTime, setClosingTime] = useState<any>('13:00')
  const [editingVariant, setEditingVariant] = useState<any>(null)
  const [variantOverrides, setVariantOverrides] = useState<any>({})
  const [removedVariantKeys, setRemovedVariantKeys] = useState<any>([])
  const [pendingDeletion, setPendingDeletion] = useState<any>(null)
  const [mediaPreview, setMediaPreview] = useState<any>(null)
  const listRef = useRef(null)
  const { changePage, isPageChanging } = usePageTransition(setCurrentPage, listRef)
  const sourceProducts = useActorProducts ? getActorPublishedProducts(operator, productRole) : items
  const publishedProducts = sourceProducts.map((product, index) => {
    const marketPrice = editable ? product.price : product.id !== 4 && product.id === originProduct?.id && operator.price !== '—' ? operator.price : product.price
    return { ...product, price: marketPrice, marketPrice, actorProductIndex: index, stockLabel: index === 2 ? 'Pocas unidades' : 'Disponible', filterNave: operator.place.split(' · ')[0] }
  })
  const visibleProducts = publishedProducts.filter((product) => (!query.trim() || product.name.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))) && productMatchesFilters(product, { priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter })).sort((a, b) => sortBy === 'priceAsc' ? (Number(a.marketPrice.match(/\d+/)?.[0]) || Number.POSITIVE_INFINITY) - (Number(b.marketPrice.match(/\d+/)?.[0]) || Number.POSITIVE_INFINITY) : sortBy === 'priceDesc' ? (Number(b.marketPrice.match(/\d+/)?.[0]) || -1) - (Number(a.marketPrice.match(/\d+/)?.[0]) || -1) : a.name.localeCompare(b.name, 'es'))
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize))
  const paginatedProducts = visibleProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const activeFilterCount = [priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter].filter((value) => value !== 'all').length
  const scheduleDaysLabel = selectedDays.length === 6 && !selectedDays.includes('sun')
    ? 'Lunes a sábado'
    : selectedDays.length === 7
      ? 'Todos los días'
      : calendarDays.filter((day) => selectedDays.includes(day.id)).map((day) => day.label.slice(0, 3)).join(', ') || 'Sin días seleccionados'

  const toggleScheduleDay = (dayId) => {
    setSelectedDays((current) => current.includes(dayId) ? current.filter((id) => id !== dayId) : [...current, dayId])
  }

  useEffect(() => setCurrentPage(1), [calibreFilter, categoryFilter, naveFilter, presentationFilter, priceFilter, query, sortBy, unitFilter, varietyFilter])

  return (
    <main className="provider-market-page">
      <section className="provider-market-hero">
        <button className="back-action" type="button" onClick={onBack}><ArrowLeft size={18} />{backLabel}</button>
        <p className="eyebrow"><span /> {eyebrow}</p>
        <h1>{operator.name}</h1>
        <div className="provider-facts">
          <div><MapPin size={21} /><span><small>Ubicación</small><strong>{operator.place}</strong><em>Unidad Agroalimentaria Metropolitana</em></span></div>
          <div className={editingHours ? 'schedule-fact editing' : 'schedule-fact'}>
            <Clock size={21} />
            <span>
              <small>Horario</small>
              <strong>{scheduleDaysLabel}</strong>
              {editingHours ? (
                <span className="schedule-editor">
                  <span className="schedule-days" role="group" aria-label="Días de atención">
                    {calendarDays.map((day) => <button className={selectedDays.includes(day.id) ? 'active' : ''} type="button" key={day.id} onClick={() => toggleScheduleDay(day.id)} aria-pressed={selectedDays.includes(day.id)} aria-label={day.label}>{day.short}</button>)}
                  </span>
                  <span className="schedule-times">
                    <label><small>Apertura</small><input type="time" value={openingTime} onChange={(event) => setOpeningTime(event.target.value)} aria-label="Hora de apertura" /></label>
                    <label><small>Cierre</small><input type="time" value={closingTime} onChange={(event) => setClosingTime(event.target.value)} aria-label="Hora de cierre" /></label>
                  </span>
                </span>
              ) : <em>{openingTime}–{closingTime}</em>}
            </span>
            {editable && <button className="edit-schedule" type="button" onClick={() => setEditingHours((value) => !value)} aria-label={editingHours ? 'Guardar horario' : 'Editar horario'}>{editingHours ? <Check size={15} /> : <Pencil size={15} />}</button>}
          </div>
        </div>
        {!editable && <a className="provider-whatsapp" href={`https://wa.me/?text=${encodeURIComponent(`Hola, consulto por la mercadería de ${operator.name}`)}`} target="_blank" rel="noreferrer"><MessageCircle size={18} />Contactar por WhatsApp</a>}
      </section>

      <section className="provider-products">
        <div className="provider-products-heading"><div><p>Publicaciones de hoy</p><h2>Productos y precios</h2></div><span>{visibleProducts.length} productos</span>{editable && <button className="provider-add" type="button" onClick={() => onCreate()} aria-label="Agregar producto"><Plus size={19} /></button>}</div>
        <ListFilterToolbar query={query} setQuery={setQuery} placeholder="Buscar producto" activeFilterCount={activeFilterCount} onClear={() => { setPriceFilter('all'); setVarietyFilter('all'); setPresentationFilter('all'); setCalibreFilter('all'); setCategoryFilter('all'); setNaveFilter('all'); setUnitFilter('all'); setSortBy('name') }} className="provider-product-tools">
          <SortField value={sortBy} onChange={setSortBy} options={[{ value: 'name', label: 'Nombre' }, { value: 'priceAsc', label: 'Menor precio' }, { value: 'priceDesc', label: 'Mayor precio' }]} />
          <ProductFilterFields priceFilter={priceFilter} setPriceFilter={setPriceFilter} varietyFilter={varietyFilter} setVarietyFilter={setVarietyFilter} presentationFilter={presentationFilter} setPresentationFilter={setPresentationFilter} calibreFilter={calibreFilter} setCalibreFilter={setCalibreFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} naveFilter={naveFilter} setNaveFilter={setNaveFilter} unitFilter={unitFilter} setUnitFilter={setUnitFilter} />
        </ListFilterToolbar>
        <div className={isPageChanging ? 'published-products-region page-changing' : 'published-products-region'} ref={listRef}>
          <ActorPublishedProductList entry={operator} role={productRole} items={paginatedProducts} onOpenProduct={onOpenProduct} variantOverrides={variantOverrides} removedVariantKeys={removedVariantKeys} onEditVariant={editable ? (product, option) => setEditingVariant({ product, option }) : null} onRemoveVariant={editable ? (product, option) => setPendingDeletion({ kind: 'variant', product, option }) : null} onAddVariant={editable ? onCreate : null} onRemoveProduct={editable ? (product) => setPendingDeletion({ kind: 'product', product }) : null} onOpenVariantMedia={setMediaPreview} usePublishedVariantPhotos={editable} />
        </div>
        {visibleProducts.length === 0 && <div className="catalog-empty"><h2>No hay productos que coincidan</h2></div>}
        <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label="Paginación de productos" />
      </section>
      {editingVariant && <PublicationPanel items={items} initialProduct={editingVariant.product} initialVariant={editingVariant.option} onClose={() => setEditingVariant(null)} onSave={(_, draftProduct) => { if (draftProduct) { const overrideKey = `${editingVariant.product.id}:${editingVariant.option.key}`; setVariantOverrides((current) => ({ ...current, [overrideKey]: { ...draftProduct.combination, price: draftProduct.price, photo: editingVariant.option.photo || draftProduct.image !== editingVariant.product.image ? draftProduct.image : null } })) } setEditingVariant(null) }} />}
      {pendingDeletion && <ConfirmModal heading={pendingDeletion.kind === 'product' ? `Eliminar ${pendingDeletion.product.name}` : 'Eliminar variante'} description={pendingDeletion.kind === 'product' ? 'Se eliminará el producto junto con todas sus variantes publicadas en tu mercado.' : `${pendingDeletion.option.variety} · Cat. ${pendingDeletion.option.category} · ${pendingDeletion.option.calibre} · ${pendingDeletion.option.unit} dejará de estar publicada.`} confirmLabel={pendingDeletion.kind === 'product' ? 'Eliminar producto' : 'Eliminar variante'} onCancel={() => setPendingDeletion(null)} onConfirm={() => { if (pendingDeletion.kind === 'product') onRemove?.(pendingDeletion.product.id); else setRemovedVariantKeys((current) => [...current, `${pendingDeletion.product.id}:${pendingDeletion.option.key}`]); setPendingDeletion(null) }} />}
      {mediaPreview && <MediaModal src={mediaPreview.src} alt={mediaPreview.alt} onClose={() => setMediaPreview(null)} />}
    </main>
  )
}
