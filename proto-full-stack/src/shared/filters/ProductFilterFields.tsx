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
import { measureUnits, calibreCatalog, categoryCatalog, productWebserviceCatalog } from '../../shared'

type ProductFilterFieldsProps = {
  groupFilter?: any
  setGroupFilter?: any
  speciesFilter?: any
  setSpeciesFilter?: any
  priceFilter?: any
  setPriceFilter?: any
  varietyFilter?: any
  setVarietyFilter?: any
  presentationFilter?: any
  setPresentationFilter?: any
  calibreFilter?: any
  setCalibreFilter?: any
  categoryFilter?: any
  setCategoryFilter?: any
  naveFilter?: any
  setNaveFilter?: any
  unitFilter?: any
  setUnitFilter?: any
}

const optionCollator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' })
const compareText = (a, b) => optionCollator.compare(String(a ?? ''), String(b ?? ''))

export default function ProductFilterFields({ groupFilter, setGroupFilter, speciesFilter, setSpeciesFilter, priceFilter, setPriceFilter, varietyFilter, setVarietyFilter, presentationFilter, setPresentationFilter, calibreFilter, setCalibreFilter, categoryFilter, setCategoryFilter, naveFilter, setNaveFilter, unitFilter, setUnitFilter }: ProductFilterFieldsProps) {
  const groups = [...new Set<any>(productWebserviceCatalog.map((entry) => entry.group))].sort(compareText)
  const species = [...new Set<any>(productWebserviceCatalog.filter((entry) => groupFilter === 'all' || entry.group === groupFilter).map((entry) => entry.species))].sort(compareText)
  const varieties = speciesFilter === 'all'
    ? []
    : [...new Set<any>(productWebserviceCatalog.filter((entry) => entry.species === speciesFilter).flatMap((entry) => entry.varieties))].sort(compareText)
  const presentations = [...new Set<any>(productWebserviceCatalog.flatMap((entry) => entry.presentations))].sort(compareText)
  const calibres = calibreCatalog.slice().sort((a, b) => compareText(a.name, b.name) || compareText(a.code, b.code))
  const categories = categoryCatalog.slice().sort((a, b) => compareText(a.description, b.description) || compareText(a.code, b.code))
  const units = measureUnits.slice().sort((a, b) => compareText(a.name, b.name) || compareText(a.code, b.code))
  return (
    <>
      <label><span>Grupo</span><select value={groupFilter} onChange={(event) => { setGroupFilter(event.target.value); setSpeciesFilter('all'); setVarietyFilter('all') }}><option value="all">Todos</option>{groups.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Especie</span><select value={speciesFilter} onChange={(event) => { setSpeciesFilter(event.target.value); setVarietyFilter('all') }}><option value="all">Todas</option>{species.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Rango de precio</span><select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}><option value="all">Todos</option><option value="under50">Menos de $50</option><option value="50to100">De $50 a $100</option><option value="over100">Más de $100</option><option value="noPrice">Sin precio</option></select></label>
      <label><span>Variedad</span><select value={varietyFilter} onChange={(event) => setVarietyFilter(event.target.value)} disabled={speciesFilter === 'all'}><option value="all">{speciesFilter === 'all' ? 'Elegí una especie' : 'Todas'}</option>{varieties.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Presentación</span><select value={presentationFilter} onChange={(event) => setPresentationFilter(event.target.value)}><option value="all">Todas</option>{presentations.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Calibre</span><select value={calibreFilter} onChange={(event) => setCalibreFilter(event.target.value)}><option value="all">Todos</option>{calibres.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
      <label><span>Categoría</span><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">Todas</option>{categories.map((entry) => <option value={entry.code} key={entry.code}>{entry.description} · {entry.code}</option>)}</select></label>
      <label><span>Nave</span><select value={naveFilter} onChange={(event) => setNaveFilter(event.target.value)}><option value="all">Todas</option><option>Nave 1</option><option>Nave 2</option><option>Nave 3</option><option>Nave 4</option></select></label>
      <label><span>Unidad de medida</span><select value={unitFilter} onChange={(event) => setUnitFilter(event.target.value)}><option value="all">Todas</option>{units.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
    </>
  )
}
