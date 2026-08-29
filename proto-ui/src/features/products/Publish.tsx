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

type PublishProps = {
  onDone?: any
}

export default function Publish({ onDone }: PublishProps) {
  const [available, setAvailable] = useState<any>(true)
  const [photo, setPhoto] = useState<any>('')
  const [saved, setSaved] = useState<any>(false)

  const handlePhoto = (event) => {
    const file = event.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSaved(true)
  }

  if (saved) {
    return (
      <main className="success-page">
        <div className="success-mark"><Check size={38} strokeWidth={2.4} /></div>
        <p className="eyebrow"><span /> Publicado</p>
        <h1>Ya está en<br /><em>el pizarrón.</em></h1>
        <p>Tu precio de Manzana Fuji quedó visible para los compradores.</p>
        <div className="success-actions">
          <button type="button" onClick={() => setSaved(false)}>Publicar otro</button>
          <button className="secondary-action" type="button" onClick={onDone}>Volver al pizarrón</button>
        </div>
      </main>
    )
  }

  return (
    <main className="form-page">
      <aside className="form-aside">
        <p className="eyebrow light-eyebrow">Operadores</p>
        <h1>¿Qué tenés<br /><em>hoy?</em></h1>
        <p>Indicá la mercadería disponible, el precio y la ubicación.</p>
      </aside>
      <section className="form-content">
        <div className="form-title">
          <div><h2>Nueva publicación</h2><p>La información será visible solamente durante el día de hoy.</p></div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className={photo ? 'photo-control has-photo' : 'photo-control'}>
            {photo ? <img src={photo} alt="Vista previa de la mercadería" /> : <span className="camera-icon"><Camera size={26} /></span>}
            <span><b>{photo ? 'Cambiar foto' : 'Sacar una foto'}</b><small>Foto de la mercadería disponible</small></span>
            <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} />
          </label>

          <div className="field-grid">
            <label className="field wide"><span>Especie</span><select defaultValue="Manzana"><option>Manzana</option><option>Tomate</option><option>Palta</option><option>Banana</option></select></label>
            <label className="field"><span>Variedad</span><select defaultValue="Fuji"><option>Fuji</option><option>Granny Smith</option><option>Red Delicious</option></select></label>
            <label className="field"><span>Presentación</span><select defaultValue="Granel"><option>Granel</option><option>Cajón</option><option>Bandeja</option><option>Atado</option></select></label>
            <label className="field"><span>Unidad</span><select defaultValue="Kilogramo"><option>Kilogramo</option><option>Docena</option><option>Unidad</option></select></label>
            <label className="field"><span>Calibre</span><select defaultValue="Grande"><option>Grande</option><option>Mediano</option><option>Chico</option></select></label>
            <label className="field"><span>Categoría</span><select defaultValue="I"><option>E</option><option>I</option><option>II</option></select></label>
            <label className="field"><span>Precio</span><div className="money-input"><i>$</i><input type="number" defaultValue="58" aria-label="Precio" /><em>/ kg</em></div></label>
            <label className="field"><span>Ubicación</span><select defaultValue="Nave 2 · Puesto 18"><option>Nave 2 · Puesto 18</option><option>Nave 1 · Puesto 42</option></select></label>
          </div>

          <div className="availability-control">
            <div><b>Disponible hoy</b><span>Los compradores podrán encontrar esta mercadería.</span></div>
            <button className={available ? 'switch on' : 'switch'} type="button" onClick={() => setAvailable((value) => !value)} aria-pressed={available}><i /></button>
          </div>

          <button className="primary-submit" type="submit">Publicar precio <ArrowRight size={20} /></button>
        </form>
      </section>
    </main>
  )
}
