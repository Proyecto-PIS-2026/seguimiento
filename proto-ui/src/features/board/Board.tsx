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
import SmartProductList from './SmartProductList'
import BoardProductCard from '../../shared/cards/BoardProductCard'

type BoardProps = {
  onOpenProduct?: any
  producerMode?: any
}

export default function Board({ onOpenProduct, producerMode = false }: BoardProps) {
  const [query, setQuery] = useState<any>('')
  const [favorites, setFavorites] = useState<any>([1, 2])
  const [activeFilter, setActiveFilter] = useState<any>('Todos')
  const [currentPage, setCurrentPage] = useState<any>(1)
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
  const productListRef = useRef(null)
  const { changePage, isPageChanging } = usePageTransition(setCurrentPage, productListRef)

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('es')
    let result = term ? products.filter((product) => product.name.toLocaleLowerCase('es').includes(term)) : products
    if (activeFilter === 'Favoritos') result = result.filter((product) => favorites.includes(product.id))
    return result.filter((product) => productMatchesFilters(product, { groupFilter, speciesFilter, priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter })).sort((a, b) => {
      const favoriteDifference = Number(favorites.includes(b.id)) - Number(favorites.includes(a.id))
      if (favoriteDifference) return favoriteDifference
      if (sortBy === 'priceAsc') return (Number(a.price.match(/\d+/)?.[0]) || Number.POSITIVE_INFINITY) - (Number(b.price.match(/\d+/)?.[0]) || Number.POSITIVE_INFINITY)
      if (sortBy === 'priceDesc') return (Number(b.price.match(/\d+/)?.[0]) || -1) - (Number(a.price.match(/\d+/)?.[0]) || -1)
      return a.name.localeCompare(b.name, 'es')
    })
  }, [activeFilter, calibreFilter, categoryFilter, favorites, groupFilter, naveFilter, presentationFilter, priceFilter, query, sortBy, speciesFilter, unitFilter, varietyFilter])

  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize))
  const paginatedProducts = visibleProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => setCurrentPage(1), [activeFilter, calibreFilter, categoryFilter, favorites, groupFilter, naveFilter, presentationFilter, priceFilter, query, sortBy, speciesFilter, unitFilter, varietyFilter])

  const activeFilterCount = [groupFilter, speciesFilter, priceFilter, varietyFilter, presentationFilter, calibreFilter, categoryFilter, naveFilter, unitFilter].filter((value) => value !== 'all').length

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  return (
    <main id="top">
      <section className="hero" id="pizarron">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Actualizado hoy, 08:45</p>
          <h1>{producerMode ? <>Oferta de<br /><em>productores.</em></> : <>El mercado,<br /><em>más claro.</em></>}</h1>
          <p className="hero-description">{producerMode ? 'Mercadería publicada por productores para los operadores de la UAM.' : 'Precios y mercadería disponible hoy en la Unidad Agroalimentaria Metropolitana.'}</p>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1619153422227-08d462800327?auto=format&fit=crop&w=1200&q=88" alt="" />
          <div className="hero-note"><b>147</b><span>productos con<br />precio hoy</span></div>
        </div>
      </section>

      <section className="board-section">
        <div className="board-intro">
          <p className="board-kicker">{producerMode ? 'Pizarrón de productores' : 'Pizarrón de hoy'}</p>
          <h2>{query ? `Resultados para “${query}”` : producerMode ? 'Mercadería disponible' : 'Tus productos frecuentes'}</h2>
          <p>{query ? `${visibleProducts.length} ${visibleProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}` : producerMode ? 'Oferta publicada para operadores.' : 'Productos recientes y favoritos.'}</p>
        </div>

        <div className="board-controls">
          <div className="control-tabs-row">
            <div className="quick-filters" aria-label="Filtros rápidos">
              {['Todos', 'Favoritos'].map((filter) => (
                <button className={activeFilter === filter ? 'active' : ''} type="button" key={filter} onClick={() => setActiveFilter(filter)}>{filter}</button>
              ))}
            </div>
            <span className="market-count">147 precios actualizados hoy</span>
          </div>

          <ListFilterToolbar query={query} setQuery={setQuery} placeholder="Buscar fruta u hortaliza" searchLabel="Buscar un producto" activeFilterCount={activeFilterCount} onClear={() => { setGroupFilter('all'); setSpeciesFilter('all'); setPriceFilter('all'); setVarietyFilter('all'); setPresentationFilter('all'); setCalibreFilter('all'); setCategoryFilter('all'); setNaveFilter('all'); setUnitFilter('all'); setSortBy('name') }}>
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

      {!producerMode && <section className="smart-section" id="inteligente">
        <div>
          <p className="eyebrow light-eyebrow">Elegí mejor esta semana</p>
          <h2>La lista<br /><em>inteligente.</em></h2>
          <p>Nueve frutas y hortalizas recomendadas por su abundancia, precio y calidad.</p>
          <a href="https://uam.com.uy/boletin-de-precios-mayoristas/#informes" target="_blank" rel="noreferrer">Ver informe semanal <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        <SmartProductList onOpenProduct={onOpenProduct} />
      </section>}
    </main>
  )
}
