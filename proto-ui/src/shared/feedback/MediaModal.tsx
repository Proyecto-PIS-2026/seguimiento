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

type MediaModalProps = {
  src?: any
  alt?: any
  onClose?: any
}

export default function MediaModal({ src, alt, onClose }: MediaModalProps) {
  const [isClosing, setIsClosing] = useState<any>(false)
  const requestClose = () => setIsClosing(true)
  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') requestClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <div className={isClosing ? 'media-modal closing' : 'media-modal'} role="dialog" aria-modal="true" aria-label={alt} onMouseDown={(event) => event.target === event.currentTarget && requestClose()} onAnimationEnd={(event) => { if (isClosing && event.target === event.currentTarget && event.animationName === 'media-overlay-out') onClose() }}>
      <button type="button" onClick={requestClose} aria-label="Cerrar imagen"><X size={22} /></button>
      <img src={src} alt={alt} />
    </div>
  )
}
