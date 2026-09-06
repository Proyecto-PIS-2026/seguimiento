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
import GoogleIcon from './GoogleIcon'

type LoginProps = {
  onLogin: (username: string, password: string) => Promise<void>
  onRecover?: any
}

export default function Login({ onLogin, onRecover }: LoginProps) {
  const [showPassword, setShowPassword] = useState<any>(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-photo" />
      </section>
      <section className="login-content">
        <div className="login-box">
          <p className="eyebrow"><span /> Acceso a Mercado Hoy</p>
          <h1>Bienvenido<br /><em>de nuevo.</em></h1>
          <p className="login-intro">Ingresá con tu cuenta de operador, productor o administrador.</p>
          <p className="privacy-note">El acceso con Google todavía no está habilitado.</p>
          <div className="login-separator"><span>o ingresá con usuario</span></div>
          <form onSubmit={async (event) => {
            event.preventDefault()
            if (isSubmitting) return
            setError('')
            setIsSubmitting(true)
            try { await onLogin(username.trim(), password) }
            catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo iniciar sesión. Intentá nuevamente.') }
            finally { setIsSubmitting(false) }
          }}>
            <label className="field"><span>Email o usuario</span><input type="text" name="username" autoComplete="username" autoFocus placeholder="Email de tu cuenta" value={username} onChange={(event) => setUsername(event.target.value)} required /></label>
            <label className="field"><span>Contraseña</span><div className="password-input"><input type={showPassword ? 'text' : 'password'} name="password" aria-label="Contraseña" autoComplete="current-password" placeholder="Tu contraseña" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}<span>{showPassword ? 'Ocultar' : 'Ver'}</span></button></div></label>
            {error && <p className="field-error" role="alert">{error}</p>}
            <button className="help-link" type="button" onClick={onRecover}>¿Necesitás ayuda para ingresar?</button>
            <button className="primary-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Ingresando…' : 'Ingresar'} <ArrowRight size={20} /></button>
          </form>
          <p className="privacy-note">El pizarrón es público. Ingresá para acceder a las opciones de tu rol.</p>
        </div>
      </section>
    </main>
  )
}
