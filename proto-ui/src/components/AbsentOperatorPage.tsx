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
import { formatShortDate } from '../shared'

type AbsentOperatorPageProps = {
  operator?: any
  vacation?: any
  onBack?: any
  onOpenSubstitute?: any
}

export default function AbsentOperatorPage({ operator, vacation, onBack, onOpenSubstitute }: AbsentOperatorPageProps) {
  return (
    <main className="directory-page absent-operator-page">
      <header className="directory-heading">
        <div className="directory-heading-copy"><p>Proveedor ausente</p><h1>{operator.name}</h1><span>Información vigente durante la licencia del operador.</span></div>
      </header>
      <section className="absence-details" aria-label="Datos de la ausencia">
        <button className="back-action" type="button" onClick={onBack}><ArrowLeft size={18} />Volver a operadores</button>
        <div className="absence-date"><CalendarDays size={22} /><span><small>Período de ausencia</small><strong>{formatShortDate(vacation.start)} — {formatShortDate(vacation.end)}</strong></span></div>
        <div className="absence-description"><small>Descripción</small><p>{vacation.description}</p></div>
        <div className="absence-substitute"><small>Puesto alternativo</small>{vacation.substitute ? <button type="button" onClick={onOpenSubstitute}><span><strong>{vacation.substitute.name}</strong><em>{vacation.substitute.place}</em></span><ArrowUpRight size={18} /></button> : <p>No se asignó un operador alternativo.</p>}</div>
      </section>
    </main>
  )
}
