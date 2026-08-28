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
import DrawerShell from './DrawerShell'

type SmartRecommendationPanelProps = {
  item?: any
  availableProducts?: any
  onClose?: any
  onSave?: any
}

export default function SmartRecommendationPanel({ item, availableProducts, onClose, onSave }: SmartRecommendationPanelProps) {
  const [productId, setProductId] = useState<any>(String(item?.product.id ?? availableProducts[0]?.id ?? ''))
  const [description, setDescription] = useState<any>(item?.description ?? '')
  return (
    <DrawerShell onClose={onClose} labelledBy="smart-editor-title" className="admin-editor-panel">
      {(swipeProps) => <>
        <header className="publication-panel-header" {...swipeProps}>
          <i className="actor-panel-handle" aria-hidden="true" />
          <p>Lista inteligente</p>
          <h2 id="smart-editor-title">{item ? 'Modificar' : 'Agregar'} recomendación</h2>
          <span>Explicá por qué conviene elegir este producto.</span>
        </header>
        <form className="publication-panel-content" onSubmit={(event) => { event.preventDefault(); onSave({ id: item?.id ?? Date.now(), product: availableProducts.find((product) => product.id === Number(productId)), description }) }}>
          <div className="field-grid">
            <label className="field wide"><span>Producto</span><select value={productId} onChange={(event) => setProductId(event.target.value)}>{availableProducts.map((product) => <option value={product.id} key={product.id}>{product.name}</option>)}</select></label>
            <label className="field wide"><span>Motivo de la recomendación</span><textarea rows={5} value={description} onChange={(event) => setDescription(event.target.value)} required /></label>
          </div>
          <button className="primary-submit" type="submit">Guardar <Check size={20} /></button>
        </form>
      </>}
    </DrawerShell>
  )
}
