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
import { measureUnits, productWebserviceCatalog } from '../../shared'

type ProductPriceFieldsProps = {
  productId?: any
  onProductChange?: any
  variety?: any
  setVariety?: any
  unit?: any
  setUnit?: any
  presentation?: any
  setPresentation?: any
  calibre?: any
  setCalibre?: any
  category?: any
  setCategory?: any
  photo?: any
  setPhoto?: any
  price?: any
  setPrice?: any
  noPrice?: any
  setNoPrice?: any
  lockProduct?: any
}

const optionCollator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' })
const compareText = (a, b) => optionCollator.compare(String(a ?? ''), String(b ?? ''))

export default function ProductPriceFields({ productId, onProductChange, variety, setVariety, unit, setUnit, presentation, setPresentation, calibre, setCalibre, category, setCategory, photo, setPhoto, price, setPrice, noPrice = false, setNoPrice, lockProduct = false }: ProductPriceFieldsProps) {
  const definition = productWebserviceCatalog.find((entry) => entry.id === Number(productId))
  const [photoError, setPhotoError] = useState('')
  const handlePhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { setPhotoError('Elegí una imagen JPG, PNG o WebP de hasta 2 MB.'); event.target.value = ''; return }
    const reader = new FileReader()
    reader.onload = () => { setPhoto(String(reader.result)); setPhotoError('') }
    reader.onerror = () => setPhotoError('No se pudo leer la imagen.')
    reader.readAsDataURL(file)
  }
  const catalogOptions = productWebserviceCatalog.slice().sort((a, b) => compareText(a.species, b.species))
  const varietyOptions = definition?.varieties.slice().sort(compareText) ?? []
  const unitOptions = definition?.units.slice().sort((a, b) => compareText(a.name, b.name) || compareText(a.code, b.code)) ?? []
  const presentationOptions = definition?.presentations.slice().sort(compareText) ?? []
  const calibreOptions = definition?.calibres.slice().sort((a, b) => compareText(a.name, b.name) || compareText(a.code, b.code)) ?? []
  const categoryOptions = definition?.categories.slice().sort((a, b) => compareText(a.description, b.description) || compareText(a.code, b.code)) ?? []
  return (
    <div className="field-grid product-price-fields">
      <label className="field wide"><span>Especie</span><select aria-label="Especie" value={productId} onChange={(event) => onProductChange(event.target.value)} disabled={lockProduct} required><option value="">Seleccionar</option>{catalogOptions.map((entry) => <option key={entry.id} value={entry.id}>{entry.species}</option>)}</select></label>
      <label className="field wide"><span>Variedad</span><select aria-label="Variedad" value={variety} onChange={(event) => setVariety(event.target.value)} disabled={!definition} required><option value="">Seleccionar</option>{varietyOptions.map((entry) => <option key={entry}>{entry}</option>)}</select></label>
      <label className="field"><span>Unidad de medida</span><select aria-label="Unidad de medida" value={unit} onChange={(event) => setUnit(event.target.value)} disabled={!definition} required><option value="">Seleccionar</option>{unitOptions.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
      <label className="field"><span>Presentación</span><select aria-label="Presentación" value={presentation} onChange={(event) => setPresentation(event.target.value)} disabled={!definition} required><option value="">Seleccionar</option>{presentationOptions.map((entry) => <option key={entry}>{entry}</option>)}</select></label>
      <label className="field"><span>Calibre</span><select aria-label="Calibre" value={calibre} onChange={(event) => setCalibre(event.target.value)} disabled={!definition} required><option value="">Seleccionar</option>{calibreOptions.map((entry) => <option value={entry.code} key={entry.code}>{entry.name} · {entry.code}</option>)}</select></label>
      <label className="field"><span>Categoría</span><select aria-label="Categoría" value={category} onChange={(event) => setCategory(event.target.value)} disabled={!definition} required><option value="">Seleccionar</option>{categoryOptions.map((entry) => <option value={entry.code} key={entry.code}>{entry.description} · {entry.code}</option>)}</select></label>
      <label className="default-photo optional-product-photo field wide">{photo ? <img src={photo} alt="Vista previa de la mercadería" /> : <ImagePlus size={24} />}<span><b>{photo ? 'Cambiar foto' : 'Agregar foto opcional'}</b><small>Foto de esta combinación comercial</small></span><input aria-label="Foto de la publicación" type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} /></label>
      <label className="field wide"><span>Precio</span><div className={noPrice ? 'money-input disabled' : 'money-input'}><i>$</i><input aria-label="Precio" type="number" min="0.01" step="0.01" value={price} onChange={(event) => { setPrice(event.target.value); setNoPrice?.(false) }} placeholder="Ingresar precio" required /><em>/ {measureUnits.find((entry) => entry.code === unit)?.name ?? 'unidad'}</em></div></label>
      {photoError && <p role="alert" className="field-error">{photoError}</p>}
    </div>
  )
}
