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

type AdminHeaderProps = {
  eyebrow?: any
  title?: any
  description?: any
  count?: any
  onCreate?: any
}

export default function AdminHeader({ eyebrow, title, description, count, onCreate }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div>
      {(count !== undefined || onCreate) && <div className="admin-header-actions">{count !== undefined && <small>{count} registros</small>}{onCreate && <button type="button" onClick={onCreate} aria-label={`Agregar ${title.toLocaleLowerCase('es')}`}><Plus size={20} /></button>}</div>}
    </header>
  )
}
