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
import DrawerShell from '../../shared/layout/DrawerShell'

type AdminEditorPanelProps = {
  kind?: any
  item?: any
  onClose?: any
  onSave?: any
}

export default function AdminEditorPanel({ kind, item, onClose, onSave }: AdminEditorPanelProps) {
  const [name, setName] = useState<any>(item?.name ?? '')
  const [nave, setNave] = useState<any>(item?.nave ?? 'Nave 1')
  const [puesto, setPuesto] = useState<any>(item?.puesto ?? '')
  const [email, setEmail] = useState<any>(item?.email ?? '')
  const [responsible, setResponsible] = useState<any>(item?.responsible ?? '')
  const [whatsapp, setWhatsapp] = useState<any>(item?.whatsapp ?? '')
  const [legalName, setLegalName] = useState<any>(item?.legalName ?? '')
  const [address, setAddress] = useState<any>(item?.address ?? item?.place ?? '')
  const [resetSent, setResetSent] = useState<any>(false)
  const [active, setActive] = useState<any>(item?.active !== false)
  const title = `${item ? 'Modificar' : 'Agregar'} ${kind === 'producer' ? 'productor' : 'operador'}`
  const submit = (event) => {
    event.preventDefault()
    const place = kind === 'operator' ? `${nave} · Puesto ${puesto}` : address
    onSave({ ...item, id: item?.id ?? Date.now(), name, place, nave, puesto, email, responsible, whatsapp, legalName, address, active })
  }
  return (
    <DrawerShell onClose={onClose} labelledBy="admin-editor-title" className="admin-editor-panel">
      {(swipeProps) => <>
        <header className="publication-panel-header" {...swipeProps}><i className="actor-panel-handle" aria-hidden="true" /><p>Administración</p><h2 id="admin-editor-title">{title}</h2><span>Gestioná los datos y el acceso al sistema.</span></header>
        <form className="publication-panel-content" onSubmit={submit}>
          <div className="field-grid">
            <label className="field wide"><span>Nombre</span><input value={name} onChange={(event) => setName(event.target.value)} required /></label>
            <>
              {kind === 'operator' && <><label className="field"><span>Nave</span><select value={nave} onChange={(event) => setNave(event.target.value)} required>{['Nave 1', 'Nave 2', 'Nave 3', 'Nave 4'].map((value) => <option key={value}>{value}</option>)}</select></label><label className="field"><span>Puesto</span><input value={puesto} onChange={(event) => setPuesto(event.target.value)} required /></label></>}
              <label className="field wide"><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
              <label className="field wide"><span>Persona responsable</span><input value={responsible} onChange={(event) => setResponsible(event.target.value)} required /></label>
              <label className="field"><span>WhatsApp de contacto</span><input type="tel" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} required /></label>
              <label className="field"><span>Razón social</span><input value={legalName} onChange={(event) => setLegalName(event.target.value)} required /></label>
              <label className="field wide"><span>Dirección física</span><input value={address} onChange={(event) => setAddress(event.target.value)} required /></label>
            </>
          </div>
          {item && <div className="password-reset-control"><div><b>Contraseña de acceso</b><span>{resetSent ? `Contraseña borrada. Enviamos un enlace a ${email}.` : 'El usuario recibirá por email un enlace de un solo uso.'}</span></div><button type="button" onClick={() => setResetSent(true)} disabled={resetSent}><KeyRound size={17} />{resetSent ? 'Email enviado' : 'Resetear contraseña'}</button></div>}
          <div className="availability-control"><div><b>Registro activo</b><span>Permite utilizar este registro en el sistema.</span></div><button className={active ? 'switch on' : 'switch'} type="button" onClick={() => setActive((value) => !value)} aria-pressed={active}><i /></button></div>
          <button className="primary-submit" type="submit">Guardar <Check size={20} /></button>
        </form>
      </>}
    </DrawerShell>
  )
}
