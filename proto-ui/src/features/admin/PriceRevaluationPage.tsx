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
import AdminHeader from './AdminHeader'

export default function PriceRevaluationPage() {
  const [file, setFile] = useState<any>(null)
  return (
    <main className="admin-page">
      <AdminHeader eyebrow="Actualización masiva" title="Revalorización de precios" description="Carga de planillas para actualizar precios recomendados." />
      <section className="revaluation-card">
        <FileSpreadsheet size={38} aria-hidden="true" />
        <div><h2>Subir archivo Excel</h2><p>Seleccioná una planilla .xlsx o .xls para previsualizar la actualización.</p></div>
        <label className={file ? 'excel-upload has-file' : 'excel-upload'}><Upload size={19} /><span>{file ? file.name : 'Seleccionar archivo'}</span><input type="file" accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>
        {file && <div className="excel-file-summary"><Check size={17} /><span><strong>Archivo listo</strong><small>{file.name} · Prototipo sin procesamiento</small></span><button type="button" onClick={() => setFile(null)} aria-label="Quitar archivo"><X size={16} /></button></div>}
        <button className="primary-submit" type="button" disabled={!file}>Continuar <ArrowRight size={20} /></button>
      </section>
    </main>
  )
}
