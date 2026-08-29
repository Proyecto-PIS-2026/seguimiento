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

type InputModalProps = {
  heading?: any
  label?: any
  value?: any
  prefix?: any
  confirmLabel?: any
  onConfirm?: any
  onCancel?: any
}

export default function InputModal({ heading, label, value, prefix, confirmLabel = 'Confirmar', onConfirm, onCancel }: InputModalProps) {
  const [inputValue, setInputValue] = useState<any>(String(value ?? ''))
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
      <form className={isClosing ? 'input-modal closing' : 'input-modal'} role="dialog" aria-modal="true" aria-labelledby="input-modal-heading" onSubmit={(event) => { event.preventDefault(); if (inputValue !== '') closeWith(() => onConfirm(inputValue)) }} onAnimationEnd={(event) => { if (isClosing && event.animationName === 'input-modal-out') pendingAction.current?.() }}>
        <h2 id="input-modal-heading">{heading}</h2>
        <label><span>{label}</span><div className="input-modal-control">{prefix && <i>{prefix}</i>}<input type="number" min="0" step="1" value={inputValue} onChange={(event) => setInputValue(event.target.value)} autoFocus required /></div></label>
        <div className="input-modal-actions"><button type="button" onClick={() => closeWith(onCancel)}>Cancelar</button><button type="submit" disabled={inputValue === ''}>{confirmLabel}</button></div>
      </form>
    </div>
  )
}
