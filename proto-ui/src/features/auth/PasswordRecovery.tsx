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

type PasswordRecoveryProps = {
  onBack?: any
}

export default function PasswordRecovery({ onBack }: PasswordRecoveryProps) {
  const [recoveryMode, setRecoveryMode] = useState<any>('email')
  const [sent, setSent] = useState<any>(false)
  const [formHeight, setFormHeight] = useState<any>(0)
  const emailFormRef = useRef(null)
  const supportFormRef = useRef(null)

  useEffect(() => {
    const activeForm = recoveryMode === 'email' ? emailFormRef.current : supportFormRef.current
    const updateHeight = () => setFormHeight(activeForm?.scrollHeight ?? 0)
    window.requestAnimationFrame(updateHeight)
    const observer = new ResizeObserver(updateHeight)
    if (activeForm) observer.observe(activeForm)
    window.addEventListener('resize', updateHeight)
    return () => { observer.disconnect(); window.removeEventListener('resize', updateHeight) }
  }, [recoveryMode])

  if (sent) {
    return (
      <main className="auth-flow-page">
        <section className="auth-flow-card auth-confirmation">
          <div className="success-mark"><Check size={38} /></div>
          <h1>Solicitud<br /><em>recibida.</em></h1>
          <p>Te enviaremos los próximos pasos utilizando los datos ingresados.</p>
          <button className="primary-submit" type="button" onClick={onBack}>Volver al login <ArrowRight size={20} /></button>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-flow-page">
      <section className="auth-flow-card recovery-card">
        <p className="eyebrow"><span /> Recuperación de acceso</p>
        <h1>Recuperá tu<br /><em>cuenta.</em></h1>
        <div className="recovery-tabs" role="tablist" aria-label="Método de recuperación">
          <button className={recoveryMode === 'email' ? 'active' : ''} type="button" role="tab" aria-selected={recoveryMode === 'email'} onClick={() => setRecoveryMode('email')}>Por email</button>
          <button className={recoveryMode === 'support' ? 'active' : ''} type="button" role="tab" aria-selected={recoveryMode === 'support'} onClick={() => setRecoveryMode('support')}>Contactar soporte</button>
        </div>
        <div className="recovery-form-switch" style={{ height: formHeight || undefined }}>
          <form ref={emailFormRef} className={recoveryMode === 'email' ? 'active' : ''} aria-hidden={recoveryMode !== 'email'} inert={recoveryMode !== 'email'} onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
            <label className="field"><span>Email de la cuenta</span><input type="email" placeholder="nombre@empresa.com" required disabled={recoveryMode !== 'email'} /></label>
            <button className="primary-submit" type="submit" disabled={recoveryMode !== 'email'}>Enviar enlace <ArrowRight size={20} /></button>
          </form>
          <form ref={supportFormRef} className={recoveryMode === 'support' ? 'active' : ''} aria-hidden={recoveryMode !== 'support'} inert={recoveryMode !== 'support'} onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
            <label className="field"><span>Nombre y apellido</span><input type="text" placeholder="Tu nombre" required disabled={recoveryMode !== 'support'} /></label>
            <label className="field"><span>Email de la cuenta (opcional)</span><input type="text" placeholder="Si lo recordás" disabled={recoveryMode !== 'support'} /></label>
            <label className="field"><span>¿Qué problema tenés?</span><textarea placeholder="Contanos qué necesitás resolver" rows={5} required disabled={recoveryMode !== 'support'} /></label>
            <button className="primary-submit" type="submit" disabled={recoveryMode !== 'support'}>Enviar consulta <ArrowRight size={20} /></button>
          </form>
        </div>
      </section>
    </main>
  )
}
