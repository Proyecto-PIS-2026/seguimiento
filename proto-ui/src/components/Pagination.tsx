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

type PaginationProps = {
  currentPage?: any
  pageCount?: any
  onChange?: any
  label?: any
  className?: any
}

export default function Pagination({ currentPage, pageCount, onChange, label, className = '' }: PaginationProps) {
  if (pageCount <= 1) return null
  return (
    <nav className={`pagination ${className}`.trim()} aria-label={label}>
      <button type="button" disabled={currentPage === 1} onClick={() => onChange(Math.max(1, currentPage - 1))} aria-label="Página anterior"><ChevronLeft size={19} /></button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <button className={currentPage === page ? 'active' : ''} type="button" key={page} onClick={() => onChange(page)} aria-label={`Página ${page}`} aria-current={currentPage === page ? 'page' : undefined}>{page}</button>)}
      <button type="button" disabled={currentPage === pageCount} onClick={() => onChange(Math.min(pageCount, currentPage + 1))} aria-label="Página siguiente"><ChevronRight size={19} /></button>
    </nav>
  )
}
