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

type TwoFactorChallengeProps = {
  onComplete?: any
  onBack?: any
}

export default function TwoFactorChallenge({ onComplete, onBack }: TwoFactorChallengeProps) {
  return (
    <main className="auth-flow-page">
      <section className="auth-flow-card">
        <p className="eyebrow"><span /> Verificación de identidad</p>
        <h1>Ingresá el<br /><em>código.</em></h1>
        <p className="auth-flow-intro">Abrí tu aplicación de autenticación e ingresá el código de seis dígitos.</p>
        <form onSubmit={(event) => { event.preventDefault(); onComplete() }}>
          <label className="field"><span>Código de autenticación</span><input className="verification-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" required /></label>
          <button className="primary-submit" type="submit">Verificar código <ArrowRight size={20} /></button>
          <button className="text-action" type="button" onClick={onBack}>Volver al login</button>
        </form>
      </section>
    </main>
  )
}
