import PrimaryProductFilters from '../../shared/filters/PrimaryProductFilters'
import { matchesPriceBounds } from '../../shared/filters/priceRange'
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
import { products, usePageTransition, productMatchesFilters } from '../../shared'
import Pagination from '../../shared/navigation/Pagination'
import ProductFilterFields from '../../shared/filters/ProductFilterFields'
import SortField from '../../shared/filters/SortField'
import ListFilterToolbar from '../../shared/filters/ListFilterToolbar'
import SmartListLink from './SmartListLink'
import BoardProductCard from '../../shared/cards/BoardProductCard'

type BoardProps = {
  onOpenProduct?: any
  producerMode?: any
  items?: any[]
  smartItems?: any[]
}

export default function Board({ onOpenProduct, producerMode = false, items = products }: BoardProps) {
  const [query, setQuery] = useState<any>('')
  const [favorites, setFavorites] = useState<any>([])
  useEffect(() => { try { const value=JSON.parse(localStorage.getItem('uam-favorites') ?? '[]'); if(Array.isArray(value))setFavorites(value) } catch {} }, [])
  const [activeFilter, setActiveFilter] = useState<any>('Todos')
  const [currentPage, setCurrentPage] = useState<any>(1)
  const [groupFilter, setGroupFilter] = useState<any>('all')
  const [speciesFilter, setSpeciesFilter] = useState<any>('all')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [priceFilter, setPriceFilter] = useState<any>('all')
  const [varietyFilter, setVarietyFilter] = useState<any>('all')
  const [presentationFilter, setPresentationFilter] = useState<any>('all')
  const [calibreFilter, setCalibreFilter] = useState<any>('all')
  const [categoryFilter, setCategoryFilter] = useState<any>('all')
  const [naveFilter, setNaveFilter] = useState<any>('all')
  const [unitFilter, setUnitFilter] = useState<any>('all')
  const [sortBy, setSortBy] = useState<any>('name')
  const productListRef = useRef(null)
  const { changePage, isPageChanging } = usePageTransition(setCurrentPage, productListRef)

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('es')
    let result = term ? items.filter((product) => product.name.toLocaleLowerCase('es').includes(term)) : items
    if (activeFilter === 'Favoritos') result = result.filter((product) => favorites.includes(product.id))
    return result.filter((product) => matchesPriceBounds(product.price, priceMin, priceMax) && productMatchesFilters(product, { groupFilter, speciesFilter, priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter })).sort((a, b) => {
      const favoriteDifference = Number(favorites.includes(b.id)) - Number(favorites.includes(a.id))
      if (favoriteDifference) return favoriteDifference
      if (sortBy === 'priceAsc') return (Number(a.price.match(/\d+/)?.[0]) || Number.POSITIVE_INFINITY) - (Number(b.price.match(/\d+/)?.[0]) || Number.POSITIVE_INFINITY)
      if (sortBy === 'priceDesc') return (Number(b.price.match(/\d+/)?.[0]) || -1) - (Number(a.price.match(/\d+/)?.[0]) || -1)
      return a.name.localeCompare(b.name, 'es')
    })
  }, [items, activeFilter, calibreFilter, categoryFilter, favorites, groupFilter, naveFilter, presentationFilter, priceFilter, priceMin, priceMax, query, sortBy, speciesFilter, unitFilter, varietyFilter])

  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize))
  const paginatedProducts = visibleProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => setCurrentPage(1), [activeFilter, calibreFilter, categoryFilter, favorites, groupFilter, naveFilter, presentationFilter, priceFilter, priceMin, priceMax, query, sortBy, speciesFilter, unitFilter, varietyFilter])

  const activeFilterCount = [groupFilter, speciesFilter, priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter].filter((value) => value !== 'all').length + Number(Boolean(priceMin)) + Number(Boolean(priceMax))

  const toggleFavorite = (id) => {
    setFavorites((current) => { const next=current.includes(id)?current.filter((item)=>item!==id):[...current,id]; try{localStorage.setItem('uam-favorites',JSON.stringify(next))}catch{} return next })
  }

  return (
    <main id="top">
      <section className="board-section" id="market-products">
        <div className="board-intro">
          <p className="board-kicker">{producerMode ? 'Pizarrón de productores' : 'Pizarrón de hoy'}</p>
          <h2>{query ? `Resultados para “${query}”` : 'Fresco en el mercado'} <span className="count-pill">{visibleProducts.length}</span></h2>
          <p>{query ? `${visibleProducts.length} ${visibleProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}` : producerMode ? 'Oferta publicada para operadores.' : 'Explorá precios, compará opciones y guardá tus favoritos.'}</p>
        </div>

        <div className="board-controls">
          <div className="control-tabs-row">
            <div className="quick-filters" aria-label="Filtros rápidos">
              {['Todos', 'Favoritos'].map((filter) => (
                <button className={activeFilter === filter ? 'active' : ''} type="button" key={filter} onClick={() => setActiveFilter(filter)}>{filter}</button>
              ))}
            </div>
            <span className="market-count">{items.length} productos publicados</span>
          </div>

          <ListFilterToolbar primaryFilters={<PrimaryProductFilters groupFilter={groupFilter} setGroupFilter={setGroupFilter} speciesFilter={speciesFilter} setSpeciesFilter={setSpeciesFilter} setVarietyFilter={setVarietyFilter} priceMin={priceMin} setPriceMin={setPriceMin} priceMax={priceMax} setPriceMax={setPriceMax} />} query={query} setQuery={setQuery} placeholder="Buscar fruta u hortaliza" searchLabel="Buscar un producto" activeFilterCount={activeFilterCount} onClear={() => { setGroupFilter('all'); setSpeciesFilter('all'); setPriceFilter('all'); setPriceMin(''); setPriceMax(''); setVarietyFilter('all'); setPresentationFilter('all'); setCalibreFilter('all'); setCategoryFilter('all'); setNaveFilter('all'); setUnitFilter('all'); setSortBy('name') }}>
            <SortField value={sortBy} onChange={setSortBy} options={[{ value: 'name', label: 'Nombre' }, { value: 'priceAsc', label: 'Menor precio' }, { value: 'priceDesc', label: 'Mayor precio' }]} />
            <ProductFilterFields groupFilter={groupFilter} setGroupFilter={setGroupFilter} speciesFilter={speciesFilter} setSpeciesFilter={setSpeciesFilter} priceFilter={priceFilter} setPriceFilter={setPriceFilter} varietyFilter={varietyFilter} setVarietyFilter={setVarietyFilter} presentationFilter={presentationFilter} setPresentationFilter={setPresentationFilter} calibreFilter={calibreFilter} setCalibreFilter={setCalibreFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} naveFilter={naveFilter} setNaveFilter={setNaveFilter} unitFilter={unitFilter} setUnitFilter={setUnitFilter} />
          </ListFilterToolbar>
        </div>

        <div className={isPageChanging ? 'product-grid board-product-grid page-changing' : 'product-grid board-product-grid'} ref={productListRef}>
          {paginatedProducts.map((product) => (
            <BoardProductCard key={product.id} product={product} status={`${product.sellers} ${producerMode ? 'productores' : 'operadores'}`} favorite={favorites.includes(product.id)} onToggleFavorite={() => toggleFavorite(product.id)} onOpen={() => onOpenProduct(product, producerMode ? 'producer' : 'operator')} />
          ))}
        </div>

        <Pagination currentPage={currentPage} pageCount={pageCount} onChange={changePage} label="Paginación del pizarrón" />

        {visibleProducts.length === 0 && (
          <div className="empty-state"><b>No encontramos “{query}”</b><span>Probá buscando manzana, tomate, palta o banana.</span></div>
        )}
      </section>

      {!producerMode && <section className="smart-list-link-section" id="inteligente"><SmartListLink /></section>}
    </main>
  )
}
