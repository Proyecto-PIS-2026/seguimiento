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
import Select from 'react-select'

type VacationPageProps = {
  value?: any
  onSave?: any
}

export default function VacationPage({ value, onSave }: VacationPageProps) {
  const [start, setStart] = useState<any>(value.start)
  const [end, setEnd] = useState<any>(value.end)
  const [description, setDescription] = useState<any>(value.description)
  const [substituteKey, setSubstituteKey] = useState<any>(value.substitute ? actorOptionKey(value.substitute) : '')
  const replacementOptions = useMemo(() => [
    { value: '', label: 'Sin reemplazo' },
    ...[...vacationReplacementOptions]
      .sort((a, b) => a.name.localeCompare(b.name, 'es'))
      .map((entry) => ({ value: actorOptionKey(entry), label: `${entry.name} · ${entry.place}` })),
  ], [])

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
          <label className="field wide"><span>Operador de reemplazo (opcional)</span><Select className="vacation-replacement-select" classNamePrefix="replacement-select" inputId="vacation-replacement" value={replacementOptions.find((option) => option.value === substituteKey)} options={replacementOptions} onChange={(option) => setSubstituteKey(option?.value ?? '')} isSearchable placeholder="Buscar operador" noOptionsMessage={() => 'No hay operadores que coincidan'} /></label>
        </div>
      )} actions={<button className="primary-submit" type="submit">Iniciar licencia <CalendarDays size={20} /></button>} />
    </main>
  )
}
