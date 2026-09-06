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
import { products, getActorPublishedProducts } from '../../shared'
import DrawerShell from '../../shared/layout/DrawerShell'
import MediaModal from '../../shared/feedback/MediaModal'
import ActorPublishedProductList from '../../shared/cards/ActorPublishedProductList'

type ActorPanelProps = {
  entry?: any
  role?: any
  onClose?: any
  onOpenPage?: any
  onOpenProduct?: any
}

export default function ActorPanel({ entry, role, onClose, onOpenPage, onOpenProduct }: ActorPanelProps) {
  const roleLabel = role === 'producer' ? 'Productor' : 'Operador'
  const actorProducts = getActorPublishedProducts(entry, role)
  const [mediaPreview, setMediaPreview] = useState<any>(null)

  return (<>
    <DrawerShell onClose={onClose} labelledBy="actor-panel-title" className="actor-panel" onOpenPage={onOpenPage}>
      {(swipeProps) => <>
        <header className="actor-panel-header" {...swipeProps}>
          <i className="actor-panel-handle" aria-hidden="true" />
          <span>{roleLabel}</span>
          <h2 id="actor-panel-title">{entry.name}</h2>
          <p><MapPin size={16} />{entry.place}</p>
        </header>
        <div className="actor-panel-content">
          <div className="actor-panel-facts"><span><small>Mercadería publicada</small><strong>{entry.productCount} productos</strong></span><span><small>Horario</small><strong>{entry.schedule?.opening ?? '04:00'}–{entry.schedule?.closing ?? '13:00'}</strong></span></div>
          {entry.available === false && <p>Operador de vacaciones: {entry.vacation?.start} al {entry.vacation?.end}.</p>}
          <div className="actor-panel-actions"><button type="button" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${entry.place}, UAM, Uruguay`)}`, '_blank', 'noopener,noreferrer')}><MapPin size={15} />Ubicación</button><a href={`https://wa.me/${entry.whatsapp?.replace(/\D/g, '').replace(/^0/, '598') ?? ''}?text=${encodeURIComponent(`Hola, consulto por el mercado de ${entry.name}`)}`} target="_blank" rel="noreferrer"><MessageCircle size={15} />WhatsApp</a></div>
          <div className="actor-products-heading"><h3>Productos publicados</h3><span>{entry.productCount ?? actorProducts.length} productos</span></div>
          <ActorPublishedProductList entry={entry} role={role} items={entry.available === false ? [] : actorProducts} onOpenProduct={onOpenProduct} onOpenVariantMedia={setMediaPreview} />
          <button className="actor-open-page" type="button" onClick={onOpenPage}>Ver página completa <ArrowUpRight size={17} /></button>
        </div>
      </>}
    </DrawerShell>
    {mediaPreview && <MediaModal src={mediaPreview.src} alt={mediaPreview.alt} onClose={() => setMediaPreview(null)} />}
  </>)
}
