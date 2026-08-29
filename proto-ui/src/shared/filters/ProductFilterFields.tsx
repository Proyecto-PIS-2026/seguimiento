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

export default function ProductFilterFields({ priceFilter, setPriceFilter, varietyFilter, setVarietyFilter, presentationFilter, setPresentationFilter, calibreFilter, setCalibreFilter, categoryFilter, setCategoryFilter, naveFilter, setNaveFilter, unitFilter, setUnitFilter }: ProductFilterFieldsProps) {
  const varieties = [...new Set<any>(productWebserviceCatalog.flatMap((entry) => entry.varieties))].sort((a, b) => a.localeCompare(b, 'es'))
  const presentations = [...new Set<any>(productWebserviceCatalog.flatMap((entry) => entry.presentations))].sort((a, b) => a.localeCompare(b, 'es'))
  return (
    <>
      <label><span>Rango de precio</span><select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}><option value="all">Todos</option><option value="under50">Menos de $50</option><option value="50to100">De $50 a $100</option><option value="over100">Más de $100</option><option value="noPrice">Sin precio</option></select></label>
      <label><span>Variedad</span><select value={varietyFilter} onChange={(event) => setVarietyFilter(event.target.value)}><option value="all">Todas</option>{varieties.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Presentación</span><select value={presentationFilter} onChange={(event) => setPresentationFilter(event.target.value)}><option value="all">Todas</option>{presentations.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Calibre</span><select value={calibreFilter} onChange={(event) => setCalibreFilter(event.target.value)}><option value="all">Todos</option>{calibreCatalog.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
      <label><span>Categoría</span><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">Todas</option>{categoryCatalog.map((entry) => <option value={entry.code} key={entry.code}>{entry.description} · {entry.code}</option>)}</select></label>
      <label><span>Nave</span><select value={naveFilter} onChange={(event) => setNaveFilter(event.target.value)}><option value="all">Todas</option><option>Nave 1</option><option>Nave 2</option><option>Nave 3</option><option>Nave 4</option></select></label>
      <label><span>Unidad de medida</span><select value={unitFilter} onChange={(event) => setUnitFilter(event.target.value)}><option value="all">Todas</option>{measureUnits.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
    </>
  )
}
