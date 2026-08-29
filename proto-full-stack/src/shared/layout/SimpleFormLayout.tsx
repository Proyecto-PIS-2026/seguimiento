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

type SimpleFormLayoutProps = {
  heading?: any
  description?: any
  onSubmit?: any
  fields?: any
  actions?: any
}

export default function SimpleFormLayout({ heading, description, onSubmit, fields, actions }: SimpleFormLayoutProps) {
  return (
    <section className="form-content simple-form-layout">
      <div className="form-title"><div><h2>{heading}</h2>{description && <p>{description}</p>}</div></div>
      <form onSubmit={onSubmit}>
        <div className="simple-form-fields">{fields}</div>
        <div className="simple-form-actions">{actions}</div>
      </form>
    </section>
  )
}
