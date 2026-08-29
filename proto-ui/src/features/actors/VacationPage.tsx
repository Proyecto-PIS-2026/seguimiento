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
import { actorOptionKey, vacationReplacementOptions } from '../../shared'
import SimpleFormLayout from '../../shared/layout/SimpleFormLayout'

type VacationPageProps = {
  value?: any
  onSave?: any
}

export default function VacationPage({ value, onSave }: VacationPageProps) {
  const [start, setStart] = useState<any>(value.start)
  const [end, setEnd] = useState<any>(value.end)
  const [description, setDescription] = useState<any>(value.description)
  const [substituteKey, setSubstituteKey] = useState<any>(value.substitute ? actorOptionKey(value.substitute) : '')

  return (
    <main className="form-page vacation-page">
      <aside className="form-aside">
        <p className="eyebrow light-eyebrow">Mi mercado</p>
        <h1>Modo<br /><em>vacaciones.</em></h1>
        <p>Informá las fechas y quién atenderá tus pedidos durante la ausencia.</p>
      </aside>
      <SimpleFormLayout heading="Programar vacaciones" description="Esta información se mostrará públicamente en tu mercado." onSubmit={(event) => { event.preventDefault(); onSave({ start, end, description, substitute: vacationReplacementOptions.find((entry) => actorOptionKey(entry) === substituteKey) ?? null }) }} fields={(
        <div className="field-grid">
          <label className="field"><span>Fecha de inicio</span><input type="date" value={start} onChange={(event) => setStart(event.target.value)} required /></label>
          <label className="field"><span>Fecha de fin</span><input type="date" value={end} min={start} onChange={(event) => setEnd(event.target.value)} required /></label>
          <label className="field wide"><span>Descripción</span><textarea rows={5} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Información para tus clientes" required /></label>
          <label className="field wide"><span>Operador de reemplazo (opcional)</span><select value={substituteKey} onChange={(event) => setSubstituteKey(event.target.value)}><option value="">Sin reemplazo</option>{vacationReplacementOptions.map((entry) => <option value={actorOptionKey(entry)} key={actorOptionKey(entry)}>{entry.name} · {entry.place}</option>)}</select></label>
        </div>
      )} actions={<button className="primary-submit" type="submit">Iniciar licencia <CalendarDays size={20} /></button>} />
    </main>
  )
}
