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

type ConfirmModalProps = {
  heading?: any
  description?: any
  confirmLabel?: any
  onConfirm?: any
  onCancel?: any
}

export default function ConfirmModal({ heading, description, confirmLabel = 'Eliminar', onConfirm, onCancel }: ConfirmModalProps) {
  const [isClosing, setIsClosing] = useState<any>(false)
  const pendingAction = useRef(null)
  const closeWith = (action) => { pendingAction.current = action; setIsClosing(true) }
  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') closeWith(onCancel) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onCancel])

  return (
    <div className={isClosing ? 'input-modal-overlay closing' : 'input-modal-overlay'} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeWith(onCancel)}>
      <section className={isClosing ? 'input-modal confirm-modal closing' : 'input-modal confirm-modal'} role="dialog" aria-modal="true" aria-labelledby="confirm-modal-heading" onAnimationEnd={(event) => { if (isClosing && event.animationName === 'input-modal-out') pendingAction.current?.() }}>
        <div className="confirm-modal-icon"><Trash2 size={22} /></div>
        <h2 id="confirm-modal-heading">{heading}</h2>
        <p>{description}</p>
        <div className="input-modal-actions"><button type="button" onClick={() => closeWith(onCancel)}>Cancelar</button><button className="danger" type="button" onClick={() => closeWith(onConfirm)}>{confirmLabel}</button></div>
      </section>
    </div>
  )
}
