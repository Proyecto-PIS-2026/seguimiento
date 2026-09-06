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
import { producerDirectory, measureUnits, calibreCatalog, categoryCatalog, productWebserviceCatalog, getOperatorPriceOptions, getProductCombination, compareProductCombinations } from '../../shared'
import Pagination from '../../shared/navigation/Pagination'
import SortField from '../../shared/filters/SortField'
import ListFilterToolbar from '../../shared/filters/ListFilterToolbar'
import DrawerShell from '../../shared/layout/DrawerShell'
import DetailSplitLayout from '../../shared/layout/DetailSplitLayout'
import MediaModal from '../../shared/feedback/MediaModal'
import ActorPublishedProductList from '../../shared/cards/ActorPublishedProductList'

type ProductPanelProps = {
  product?: any
  onClose?: any
  onOpenProvider?: any
  onOpenPage?: any
  actorRole?: any
  asPage?: any
}

const optionCollator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' })
const compareText = (a, b) => optionCollator.compare(String(a ?? ''), String(b ?? ''))

export default function ProductPanel({ product, onClose, onOpenProvider, onOpenPage, actorRole = 'operator', asPage = false }: ProductPanelProps) {
  const [operatorQuery, setOperatorQuery] = useState<any>('')
  const [operatorSort, setOperatorSort] = useState<any>('price')
  const [selectedNave, setSelectedNave] = useState<any>('Todas')
  const [selectedVariety, setSelectedVariety] = useState<any>('all')
  const [selectedUnit, setSelectedUnit] = useState<any>('all')
  const [selectedPresentation, setSelectedPresentation] = useState<any>('all')
  const [selectedCalibre, setSelectedCalibre] = useState<any>('all')
  const [selectedCategory, setSelectedCategory] = useState<any>('all')
  const [mediaPreview, setMediaPreview] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState<any>(1)
  const operatorListRef = useRef(null)

  const actors = (product.persisted ? product.operators : actorRole === 'producer' ? producerDirectory : product.operators).filter((operator) => operator.available !== false)
  const actorPlural = actorRole === 'producer' ? 'Productores' : 'Operadores'
  const actorSingular = actorRole === 'producer' ? 'productor' : 'operador'
  const naves = useMemo(() => [...new Set<any>(actors.map((operator) => operator.place.split(' · ')[0]))].sort(compareText), [actors])
  const productCombination = getProductCombination(product)
  const productVariety = productCombination?.variety && !['Estándar', 'Común'].includes(productCombination.variety) ? productCombination.variety : ''
  const productVarieties = [...new Set<any>(productWebserviceCatalog.flatMap((entry) => entry.varieties))].sort(compareText)
  const productPresentations = [...new Set<any>(productWebserviceCatalog.flatMap((entry) => entry.presentations))].sort(compareText)
  const unitOptions = measureUnits.slice().sort((a, b) => compareText(a.name, b.name) || compareText(a.code, b.code))
  const calibreOptions = calibreCatalog.slice().sort((a, b) => compareText(a.name, b.name) || compareText(a.code, b.code))
  const categoryOptions = categoryCatalog.slice().sort((a, b) => compareText(a.description, b.description) || compareText(a.code, b.code))
  const visibleOperators = useMemo(() => {
    const term = operatorQuery.trim().toLocaleLowerCase('es')
    return actors.map((operator, index) => {
      const offerPhoto = product.persisted ? operator.priceOptions?.find(option => option.photo)?.photo ?? null : operator.photo !== undefined ? operator.photo : (index % 3 === 0 ? null : product.image)
      return {
        ...operator,
        offerPhoto,
        priceOptions: getOperatorPriceOptions(product, operator, index).map((option, optionIndex) => ({ ...option, photo: product.persisted ? option.photo : offerPhoto && ((index * 2 + optionIndex) % 3 === 1) ? offerPhoto : null })),
      }
    })
      .filter((operator) => !term || operator.name.toLocaleLowerCase('es').includes(term))
      .filter((operator) => selectedNave === 'Todas' || operator.place.startsWith(selectedNave))
      .filter((operator) => selectedVariety === 'all' || operator.priceOptions.some((option) => option.variety === selectedVariety))
      .filter((operator) => selectedUnit === 'all' || operator.priceOptions.some((option) => option.unit === selectedUnit))
      .filter((operator) => selectedPresentation === 'all' || operator.priceOptions.some((option) => option.presentation === selectedPresentation))
      .filter((operator) => selectedCalibre === 'all' || operator.priceOptions.some((option) => option.calibre === selectedCalibre))
      .filter((operator) => selectedCategory === 'all' || operator.priceOptions.some((option) => option.category === selectedCategory))
      .sort((a, b) => {
        if (a.available !== b.available) return a.available ? -1 : 1
        if (operatorSort === 'name') return a.name.localeCompare(b.name, 'es') || compareProductCombinations(a.priceOptions[0], b.priceOptions[0])
        const priceA = a.priceOptions[0]?.numericPrice ?? Number.POSITIVE_INFINITY
        const priceB = b.priceOptions[0]?.numericPrice ?? Number.POSITIVE_INFINITY
        return priceA - priceB || compareProductCombinations(a.priceOptions[0], b.priceOptions[0]) || a.name.localeCompare(b.name, 'es')
      })
  }, [actors, operatorQuery, operatorSort, product, selectedCalibre, selectedCategory, selectedNave, selectedPresentation, selectedUnit, selectedVariety])
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleOperators.length / pageSize))
  useEffect(() => setCurrentPage((page) => Math.min(page, pageCount)), [pageCount])
  const paginatedOperators = visibleOperators.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => setCurrentPage(1), [operatorQuery, operatorSort, selectedCalibre, selectedCategory, selectedNave, selectedPresentation, selectedUnit, selectedVariety])

  const changePage = (page) => {
    setCurrentPage(page)
    window.requestAnimationFrame(() => operatorListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const offerContent = <>
    <ListFilterToolbar query={operatorQuery} setQuery={setOperatorQuery} placeholder={`Buscar ${actorSingular}`} searchLabel={`Buscar ${actorSingular} por nombre`} activeFilterCount={[selectedVariety, selectedUnit, selectedPresentation, selectedCalibre, selectedCategory].filter((value) => value !== 'all').length + (selectedNave === 'Todas' ? 0 : 1)} onClear={() => { setSelectedNave('Todas'); setSelectedVariety('all'); setSelectedUnit('all'); setSelectedPresentation('all'); setSelectedCalibre('all'); setSelectedCategory('all') }} className="drawer-filter-tools">
      <label><span>{actorRole === 'producer' ? 'Departamento' : 'Nave'}</span><select value={selectedNave} onChange={(event) => setSelectedNave(event.target.value)}><option>Todas</option>{naves.map((nave) => <option key={nave}>{nave}</option>)}</select></label>
      <label><span>Variedad</span><select value={selectedVariety} onChange={(event) => setSelectedVariety(event.target.value)}><option value="all">Todas</option>{productVarieties.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Unidad de medida</span><select value={selectedUnit} onChange={(event) => setSelectedUnit(event.target.value)}><option value="all">Todas</option>{unitOptions.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
      <label><span>Presentación</span><select value={selectedPresentation} onChange={(event) => setSelectedPresentation(event.target.value)}><option value="all">Todas</option>{productPresentations.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Calibre</span><select value={selectedCalibre} onChange={(event) => setSelectedCalibre(event.target.value)}><option value="all">Todos</option>{calibreOptions.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
      <label><span>Categoría</span><select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}><option value="all">Todas</option>{categoryOptions.map((entry) => <option value={entry.code} key={entry.code}>{entry.description} · {entry.code}</option>)}</select></label>
    </ListFilterToolbar>
    <div className="list-sort-row">
      <SortField className="inline-sort-field" value={operatorSort} onChange={setOperatorSort} options={[{ value: 'price', label: 'Menor precio' }, { value: 'name', label: 'Alfabéticamente' }]} />
    </div>
    <div className="operator-list-heading"><h3>{actorPlural}</h3><span>{visibleOperators.length} de {actors.length}</span></div>
    <ActorPublishedProductList
      containerRef={operatorListRef}
      emptyMessage={`No hay ${actorPlural.toLocaleLowerCase('es')} que coincidan con la búsqueda.`}
      displayItems={paginatedOperators.map((operator) => ({
        key: `${operator.name}-${operator.place}`,
        image: operator.offerPhoto,
        imageLabel: `Ampliar foto de ${operator.name}`,
        onImageClick: operator.offerPhoto ? () => setMediaPreview({ src: operator.offerPhoto, alt: `Mercadería aportada por ${operator.name}` }) : null,
        title: operator.name,
        subtitle: operator.place,
        ariaLabel: `Abrir mercado de ${operator.name}`,
        onOpen: () => onOpenProvider(operator, product, actorRole),
        actions: <><button type="button" onClick={(event) => { event.stopPropagation(); window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${operator.place}, UAM, Uruguay`)}`, '_blank', 'noopener,noreferrer') }} aria-label={`Ver ubicación de ${operator.name}`}><MapPin size={15} /></button><a href={`https://wa.me/${operator.whatsapp?.replace(/\D/g, '').replace(/^0/, '598') ?? ''}?text=${encodeURIComponent(`Hola, consulto por ${product.name} en ${operator.name}`)}`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} aria-label={`Contactar a ${operator.name} por WhatsApp`}><MessageCircle size={15} /></a></>,
        rows: operator.priceOptions.map((option) => ({ key: option.key, label: `${option.label} · ${option.unit}`, attributes: [option.variety, `Cat. ${option.category}`, option.presentation, calibreCatalog.find((entry) => entry.code === option.calibre)?.name ?? option.calibre, option.unit], price: option.price, photo: option.photo, photoLabel: `Ver foto de ${option.label}`, onOpenPhoto: option.photo ? () => setMediaPreview({ src: option.photo, alt: `${option.label} de ${operator.name}` }) : null })),
      }))}
    />
    <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label={`Paginación de ${actorPlural.toLocaleLowerCase('es')}`} className="drawer-pagination" />
  </>

  if (asPage) return <DetailSplitLayout
    className="product-details-page"
    asideClassName="product-details-hero"
    asideContentClassName="product-details-hero-content"
    contentClassName="product-details-offers"
    aside={<>
      <img src={product.image} alt={product.name} />
      <div><p>{actorPlural}</p><h1>{product.name}</h1>{productVariety && <span>{productVariety}</span>}</div>
    </>}
  >
    <div className="provider-products-heading"><div><p>Mercado de hoy</p><h2>{actorPlural} disponibles</h2></div><span>{visibleOperators.length} {actorPlural.toLocaleLowerCase('es')}</span></div>
    {offerContent}
    {mediaPreview && <MediaModal src={mediaPreview.src} alt={mediaPreview.alt} onClose={() => setMediaPreview(null)} />}
  </DetailSplitLayout>

  return (<>
    <DrawerShell onClose={onClose} labelledBy="product-panel-title" onOpenPage={onOpenPage ? () => onOpenPage(product, actorRole) : undefined}>
      {(swipeProps) => <>
        <div className="panel-swipe-header" {...swipeProps}>
          <span className="panel-swipe-handle" aria-hidden="true" />
          <img src={product.image} alt={product.name} />
        </div>
        <div className="panel-content">
          <div className="panel-product-heading" {...swipeProps}>
            <h2 id="product-panel-title">{product.name}</h2>
            {productVariety && <p className="panel-detail">{productVariety}</p>}
          </div>

          {offerContent}
        </div>
      </>}
    </DrawerShell>
    {mediaPreview && <MediaModal src={mediaPreview.src} alt={mediaPreview.alt} onClose={() => setMediaPreview(null)} />}
  </>)
}
