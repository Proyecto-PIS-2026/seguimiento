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
  onLogin?: any
  onRecover?: any
}

export default function Login({ onLogin, onRecover }: LoginProps) {
  const [showPassword, setShowPassword] = useState<any>(false)
  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-photo" />
      </section>
      <section className="login-content">
        <div className="login-box">
          <p className="eyebrow"><span /> Acceso para operadores</p>
          <h1>Bienvenido<br /><em>de nuevo.</em></h1>
          <p className="login-intro">Ingresá para publicar y actualizar tus precios de hoy.</p>
          <p className="privacy-note">El acceso con Google todavía no está habilitado.</p>
          <div className="login-separator"><span>o ingresá con usuario</span></div>
          <form onSubmit={(event) => { event.preventDefault(); onLogin() }}>
            <label className="field"><span>Email o usuario</span><input type="text" placeholder="Email de tu cuenta" required /></label>
            <label className="field"><span>Contraseña</span><div className="password-input"><input type={showPassword ? 'text' : 'password'} placeholder="Tu contraseña" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}<span>{showPassword ? 'Ocultar' : 'Ver'}</span></button></div></label>
            <button className="help-link" type="button" onClick={onRecover}>¿Necesitás ayuda para ingresar?</button>
            <button className="primary-submit" type="submit">Ingresar <ArrowRight size={20} /></button>
          </form>
          <p className="privacy-note">El pizarrón es público. Solo necesitás ingresar para publicar.</p>
        </div>
      </section>
    </main>
  )
}
