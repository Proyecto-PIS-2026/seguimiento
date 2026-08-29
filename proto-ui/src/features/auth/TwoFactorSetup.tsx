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

type TwoFactorSetupProps = {
  onComplete?: any
}

export default function TwoFactorSetup({ onComplete }: TwoFactorSetupProps) {
  const setupSecret = 'JBSWY3DPEHPK3PXPGEZDGNBVGY3TQOJQ'
  const displaySecret = setupSecret.match(/.{1,4}/g).join(' ')
  const [copied, setCopied] = useState<any>(false)
  const copySecret = async () => {
    await navigator.clipboard.writeText(setupSecret)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main className="auth-flow-page">
      <section className="auth-flow-card setup-card">
        <p className="eyebrow"><span /> Seguridad de la cuenta</p>
        <h1>Configurá<br /><em>2FA.</em></h1>
        <p className="auth-flow-intro">Escaneá este código con tu aplicación de autenticación y confirmá el primer código generado.</p>
        <div className="two-factor-setup">
          <div className="qr-code" aria-label="Código QR para configurar Mercado Hoy en una aplicación de autenticación">
            <QRCodeSVG value={`otpauth://totp/Mercado%20Hoy:operador@uam.com.uy?secret=${setupSecret}&issuer=Mercado%20Hoy&algorithm=SHA1&digits=6&period=30`} size={164} level="M" marginSize={2} />
          </div>
          <div className="setup-key"><span>Clave manual</span><button type="button" onClick={copySecret} aria-label="Copiar clave manual"><code>{displaySecret}</code><small>{copied ? 'Copiada' : 'Tocá para copiar'}</small></button></div>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); onComplete() }}>
          <label className="field"><span>Código de confirmación</span><input className="verification-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" required /></label>
          <button className="primary-submit" type="submit">Activar 2FA <Check size={20} /></button>
        </form>
      </section>
    </main>
  )
}
