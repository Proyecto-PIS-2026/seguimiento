import { groupActorProducts } from '../../shared/catalog/groupActorProducts'
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
import { products, calendarDays, usePageTransition, productMatchesFilters, getActorPublishedProducts } from '../../shared'
import Pagination from '../../shared/navigation/Pagination'
import ProductFilterFields from '../../shared/filters/ProductFilterFields'
import SortField from '../../shared/filters/SortField'
import ListFilterToolbar from '../../shared/filters/ListFilterToolbar'
import MediaModal from '../../shared/feedback/MediaModal'
import ConfirmModal from '../../shared/feedback/ConfirmModal'
import ActorPublishedProductList from '../../shared/cards/ActorPublishedProductList'
import DetailSplitLayout from '../../shared/layout/DetailSplitLayout'
import { showOperationNotification } from '../../shared/feedback/operationNotifications'
import PublicationPanel from '../products/PublicationPanel'

type ProviderMarketProps = {
  operator?: any
  originProduct?: any
  onOpenProduct?: any
  eyebrow?: any
  items?: any
  editable?: any
  onCreate?: any
  onRemove?: any
  productRole?: any
  useActorProducts?: any
  schedule?: any
  vacation?: any
  onSaveSchedule?: any
  onSavePublication?: any
}

export default function ProviderMarket({ operator, originProduct, onOpenProduct, eyebrow = 'Mercado del operador', items = products, editable = false, onCreate, onRemove, productRole = 'operator', useActorProducts = false, schedule, vacation, onSaveSchedule, onSavePublication }: ProviderMarketProps) {
  const [query, setQuery] = useState<any>('')
  const [groupFilter, setGroupFilter] = useState<any>('all')
  const [speciesFilter, setSpeciesFilter] = useState<any>('all')
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
  const [savingHours, setSavingHours] = useState(false)
  useEffect(() => {
    if (schedule) { setSelectedDays(schedule.days); setOpeningTime(schedule.opening); setClosingTime(schedule.closing) }
  }, [schedule])
  const saveHours = async () => {
    if (!editingHours) { setEditingHours(true); return }
    setSavingHours(true)
    try {
      if (!selectedDays.length || !openingTime || !closingTime || openingTime >= closingTime) throw new Error('Revisá los días y el horario de atención.')
      await onSaveSchedule?.({ days: selectedDays, opening: openingTime, closing: closingTime })
      setEditingHours(false)
      showOperationNotification('success', 'Horario guardado correctamente.')
    } catch (error) { showOperationNotification('error', error instanceof Error ? error.message : 'No se pudo guardar el horario.') }
    finally { setSavingHours(false) }
  }
  const [editingVariant, setEditingVariant] = useState<any>(null)
  const [variantOverrides, setVariantOverrides] = useState<any>({})
  const [removedVariantKeys, setRemovedVariantKeys] = useState<any>([])
  const [pendingDeletion, setPendingDeletion] = useState<any>(null)
  const [mediaPreview, setMediaPreview] = useState<any>(null)
  const listRef = useRef(null)
  const { changePage, isPageChanging } = usePageTransition(setCurrentPage, listRef)
  const sourceProducts = useActorProducts ? getActorPublishedProducts(operator, productRole) : items
  const publishedProducts = sourceProducts.map((product, index) => {
    const marketPrice = editable || product.persisted ? product.price : product.id !== 4 && product.id === originProduct?.id && operator.price !== '—' ? operator.price : product.price
    return { ...product, price: marketPrice, marketPrice, actorProductIndex: index, stockLabel: index === 2 ? 'Pocas unidades' : 'Disponible', filterNave: operator.place.split(' · ')[0] }
  })
  const visibleProducts = groupActorProducts(publishedProducts.filter((product) => (!query.trim() || product.name.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))) && productMatchesFilters(product, { groupFilter, speciesFilter, priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter }))).sort((a, b) => sortBy === 'priceAsc' ? (Number(a.marketPrice.match(/\d+(?:\.\d+)?/)?.[0]) || Number.POSITIVE_INFINITY) - (Number(b.marketPrice.match(/\d+(?:\.\d+)?/)?.[0]) || Number.POSITIVE_INFINITY) : sortBy === 'priceDesc' ? (Number(b.marketPrice.match(/\d+(?:\.\d+)?/)?.[0]) || -1) - (Number(a.marketPrice.match(/\d+(?:\.\d+)?/)?.[0]) || -1) : a.name.localeCompare(b.name, 'es'))
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize))
  useEffect(() => setCurrentPage((page) => Math.min(page, pageCount)), [pageCount])
  const paginatedProducts = visibleProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const activeFilterCount = [groupFilter, speciesFilter, priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter].filter((value) => value !== 'all').length
  const scheduleDaysLabel = selectedDays.length === 6 && !selectedDays.includes('sun')
    ? 'Lunes a sábado'
    : selectedDays.length === 7
      ? 'Todos los días'
      : calendarDays.filter((day) => selectedDays.includes(day.id)).map((day) => day.label.slice(0, 3)).join(', ') || 'Sin días seleccionados'

  const toggleScheduleDay = (dayId) => {
    setSelectedDays((current) => current.includes(dayId) ? current.filter((id) => id !== dayId) : [...current, dayId])
  }

  useEffect(() => setCurrentPage(1), [calibreFilter, categoryFilter, groupFilter, naveFilter, presentationFilter, priceFilter, query, sortBy, speciesFilter, unitFilter, varietyFilter])

  const marketSummary = (
    <>
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
              {editable && <button className="edit-schedule" type="button" disabled={savingHours} onClick={saveHours} aria-label={editingHours ? 'Guardar horario' : 'Editar horario'}>{editingHours ? <Check size={15} /> : <Pencil size={15} />}</button>}
            </div>
          </div>
          {vacation?.start && <p>Vacaciones: {vacation.start} al {vacation.end}. {vacation.description}</p>}
          {!editable && operator.whatsapp && <a className="provider-whatsapp" href={`https://wa.me/${operator.whatsapp?.replace(/\D/g, '').replace(/^0/, '598') ?? ''}?text=${encodeURIComponent(`Hola, consulto por la mercadería de ${operator.name}`)}`} target="_blank" rel="noreferrer"><MessageCircle size={18} />Contactar por WhatsApp</a>}
    </>
  )

  return (
    <DetailSplitLayout className="provider-market-page" aside={marketSummary} asideClassName="provider-market-hero" asideContentClassName="provider-market-hero-content" contentClassName="provider-products">
        <div className="provider-products-heading"><div><p>Publicaciones de hoy</p><h2>Productos y precios</h2></div><span>{visibleProducts.length} productos</span>{editable && <button className="provider-add" type="button" onClick={() => onCreate()} aria-label="Agregar publicación"><Plus size={19} /></button>}</div>
        <ListFilterToolbar query={query} setQuery={setQuery} placeholder="Buscar producto" activeFilterCount={activeFilterCount} onClear={() => { setGroupFilter('all'); setSpeciesFilter('all'); setPriceFilter('all'); setVarietyFilter('all'); setPresentationFilter('all'); setCalibreFilter('all'); setCategoryFilter('all'); setNaveFilter('all'); setUnitFilter('all'); setSortBy('name') }} className="provider-product-tools">
          <SortField value={sortBy} onChange={setSortBy} options={[{ value: 'name', label: 'Nombre' }, { value: 'priceAsc', label: 'Menor precio' }, { value: 'priceDesc', label: 'Mayor precio' }]} />
          <ProductFilterFields groupFilter={groupFilter} setGroupFilter={setGroupFilter} speciesFilter={speciesFilter} setSpeciesFilter={setSpeciesFilter} priceFilter={priceFilter} setPriceFilter={setPriceFilter} varietyFilter={varietyFilter} setVarietyFilter={setVarietyFilter} presentationFilter={presentationFilter} setPresentationFilter={setPresentationFilter} calibreFilter={calibreFilter} setCalibreFilter={setCalibreFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} naveFilter={naveFilter} setNaveFilter={setNaveFilter} unitFilter={unitFilter} setUnitFilter={setUnitFilter} />
        </ListFilterToolbar>
        <div className={isPageChanging ? 'published-products-region page-changing' : 'published-products-region'} ref={listRef}>
          <ActorPublishedProductList entry={operator} role={productRole} items={paginatedProducts} onOpenProduct={onOpenProduct} variantOverrides={variantOverrides} removedVariantKeys={removedVariantKeys} onEditVariant={editable ? (product, option) => setEditingVariant({ product: product.publicationItems?.find(item => item.id === option.publicationId) ?? product, option }) : null} onRemoveVariant={editable ? (product, option) => setPendingDeletion({ kind: 'variant', product, option }) : null} onAddVariant={editable ? onCreate : null} onRemoveProduct={editable ? (product) => setPendingDeletion({ kind: 'product', product }) : null} onOpenVariantMedia={setMediaPreview} usePublishedVariantPhotos={editable} />
        </div>
        {visibleProducts.length === 0 && <div className="catalog-empty"><h2>No hay productos que coincidan</h2></div>}
        <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label="Paginación de productos" />
      {editingVariant && <PublicationPanel items={items} initialProduct={editingVariant.product} initialVariant={editingVariant.option} onClose={() => setEditingVariant(null)} onSave={async (_, draftProduct) => {
        if (onSavePublication) await onSavePublication(draftProduct, editingVariant.option.publicationId ?? editingVariant.product.id)
        else if (draftProduct) {
          const overrideKey = `${editingVariant.product.id}:${editingVariant.option.key}`
          setVariantOverrides((current) => ({ ...current, [overrideKey]: { ...draftProduct.combination, price: draftProduct.price, photo: draftProduct.photo } }))
        }
        setEditingVariant(null)
      }} />}
      {pendingDeletion && <ConfirmModal heading={pendingDeletion.kind === 'product' ? `Eliminar ${pendingDeletion.product.name}` : 'Eliminar combinación'} description={pendingDeletion.kind === 'product' ? 'Se eliminará el producto junto con todas sus combinaciones publicadas en tu mercado.' : `${pendingDeletion.option.variety} · Cat. ${pendingDeletion.option.category} · ${pendingDeletion.option.calibre} · ${pendingDeletion.option.unit} dejará de estar publicada.`} confirmLabel={pendingDeletion.kind === 'product' ? 'Eliminar producto' : 'Eliminar combinación'} onCancel={() => setPendingDeletion(null)} onConfirm={async () => { if (pendingDeletion.kind === 'product') await onRemove?.(pendingDeletion.product.id, pendingDeletion.product.publicationItems ? pendingDeletion.product.sourceProductId : undefined); else if (pendingDeletion.product.persisted) await onRemove?.(pendingDeletion.option.publicationId ?? pendingDeletion.product.id); else setRemovedVariantKeys((current) => [...current, `${pendingDeletion.product.id}:${pendingDeletion.option.key}`]); setPendingDeletion(null) }} />}
      {mediaPreview && <MediaModal src={mediaPreview.src} alt={mediaPreview.alt} onClose={() => setMediaPreview(null)} />}
    </DetailSplitLayout>
  )
}
