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

type ResetPasswordPageProps = {
  onComplete?: any
}

export default function ResetPasswordPage({ onComplete }: ResetPasswordPageProps) {
  const [password, setPassword] = useState<any>('')
  const [confirmation, setConfirmation] = useState<any>('')
  const [saved, setSaved] = useState<any>(false)

  if (saved) return <main className="auth-flow-page"><section className="auth-flow-card auth-confirmation"><div className="success-mark"><Check size={38} /></div><h1>Contraseña<br /><em>actualizada.</em></h1><p>Ya podés ingresar con tu nueva contraseña.</p><button className="primary-submit" type="button" onClick={onComplete}>Ir al login <ArrowRight size={20} /></button></section></main>

  return (
    <main className="auth-flow-page">
      <section className="auth-flow-card recovery-card">
        <p className="eyebrow"><span /> Enlace de recuperación</p>
        <h1>Creá una nueva<br /><em>contraseña.</em></h1>
        <p className="auth-flow-intro">Este enlace identifica tu cuenta y se puede utilizar una sola vez.</p>
        <form onSubmit={(event) => { event.preventDefault(); if (password === confirmation) setSaved(true) }}>
          <label className="field"><span>Nueva contraseña</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} autoComplete="new-password" required /></label>
          <label className="field"><span>Repetir contraseña</span><input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength={8} autoComplete="new-password" required /></label>
          {confirmation && password !== confirmation && <p className="field-error">Las contraseñas no coinciden.</p>}
          <button className="primary-submit" type="submit" disabled={!password || password !== confirmation}>Guardar contraseña <Check size={20} /></button>
        </form>
      </section>
    </main>
  )
}
