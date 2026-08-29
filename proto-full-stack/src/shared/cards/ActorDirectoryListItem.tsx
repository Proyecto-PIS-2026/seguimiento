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

type ActorDirectoryListItemProps = {
  title?: any
  subtitle?: any
  meta?: any
  description?: any
  onOpen?: any
  actions?: any
  highlightSubtitle?: any
}

export default function ActorDirectoryListItem({ title, subtitle, meta, description, onOpen, actions, highlightSubtitle = false }: ActorDirectoryListItemProps) {
  const content = <span className={highlightSubtitle ? 'directory-name highlight-place' : 'directory-name'}><strong>{title}</strong>{subtitle && <small>{subtitle}</small>}{description && <p>{description}</p>}{meta && <em>{meta}</em>}</span>
  return (
    <article className="directory-list-item">
      {onOpen ? <button className="directory-main" type="button" onClick={onOpen}>{content}</button> : <div className="directory-main">{content}</div>}
      {actions && <div className="operator-actions directory-actions">{actions}</div>}
    </article>
  )
}
