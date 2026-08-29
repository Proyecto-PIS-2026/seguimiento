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

export default function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.09-1.93 3.27-4.77 3.27-8.09Z" />
      <path fill="#34A853" d="M12 23c2.99 0 5.49-.99 7.32-2.66l-3.58-2.77c-.99.66-2.26 1.06-3.74 1.06-2.89 0-5.33-1.95-6.21-4.57H2.09v2.84C3.91 20.51 7.66 23 12 23Z" />
      <path fill="#FBBC05" d="M5.79 14.07A6.6 6.6 0 0 1 5.44 12c0-.71.13-1.41.35-2.07V7.09H2.09A11 11 0 0 0 .92 12c0 1.76.43 3.43 1.17 4.91l3.7-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.44 2.09 14.94 1 12 1 7.66 1 3.91 3.49 2.09 7.09l3.7 2.84c.88-2.62 3.32-4.55 6.21-4.55Z" />
    </svg>
  )
}
