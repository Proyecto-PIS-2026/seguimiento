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

type DrawerShellProps = {
  onClose?: any
  labelledBy?: any
  className?: any
  onOpenPage?: any
  children?: any
}

export default function DrawerShell({ onClose, labelledBy, className = '', onOpenPage, children }: DrawerShellProps) {
  const swipeStartY = useRef(null)
  const [isClosing, setIsClosing] = useState<any>(false)
  const [isExpanded, setIsExpanded] = useState<any>(false)
  const requestClose = () => setIsClosing(true)
  const startSwipe = (event) => { swipeStartY.current = event.touches[0]?.clientY ?? null }
  const moveSwipe = (event) => {
    if (event.cancelable) event.preventDefault()
    const currentY = event.touches[0]?.clientY
    if (swipeStartY.current !== null && swipeStartY.current - currentY > 30) setIsExpanded(true)
  }
  const finishSwipe = (event) => {
    const endY = event.changedTouches[0]?.clientY
    if (swipeStartY.current !== null && endY - swipeStartY.current > 70) requestClose()
    swipeStartY.current = null
  }
  const swipeProps = {
    onTouchStart: startSwipe,
    onTouchMove: moveSwipe,
    onTouchEnd: finishSwipe,
    onTouchCancel: () => { swipeStartY.current = null },
  }

  return (
    <div className={isClosing ? 'panel-backdrop closing' : 'panel-backdrop'} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && requestClose()}>
      <section className={`product-panel${className ? ` ${className}` : ''}${isExpanded ? ' expanded' : ''}${isClosing ? ' closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy} onScroll={(event) => event.currentTarget.scrollTop > 4 && setIsExpanded(true)} onAnimationEnd={(event) => isClosing && event.animationName.includes('out') && onClose()}>
        <div className="panel-actions">
          {onOpenPage && <button className="panel-page-link" type="button" onClick={onOpenPage} aria-label="Abrir vista de página"><ArrowUpRight size={18} /></button>}
          <button className="panel-close" type="button" onClick={requestClose} aria-label="Cerrar"><X size={22} /></button>
        </div>
        {children(swipeProps)}
      </section>
    </div>
  )
}
