import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { ArrowDown, ArrowUp, Check, MoveVertical } from 'lucide-react'
import DrawerShell from '../../shared/layout/DrawerShell'
import { measureUnits, productWebserviceCatalog } from '../../shared'
import { showOperationNotification } from '../../shared/feedback/operationNotifications'
import { draggedPrice, MIN_SLIDER_PRICE } from './sliderPrice'

type Props = { product: any; option: any; onClose: () => void; onSave: (price: string) => Promise<void> }
type Gesture = { id: number; x: number; y: number; price: number; moved: boolean }
const format = (value: number) => new Intl.NumberFormat('es-UY', { maximumFractionDigits: 0 }).format(value)

export default function SliderPriceEditor({ product, option, onClose, onSave }: Props) {
  const initial = Math.max(MIN_SLIDER_PRICE, Math.round(Number(String(option.price).replace('$', '').replace(',', '.')) || MIN_SLIDER_PRICE))
  const maximum = Math.max(1000, Math.ceil(initial * 3 / 100) * 100)
  const [price, setPrice] = useState(initial)
  const [dragging, setDragging] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const gesture = useRef<Gesture | null>(null)
  const lastTap = useRef<{ time: number; x: number; y: number } | null>(null)
  const priceRef = useRef(initial)
  const savingRef = useRef(false)
  const definition = productWebserviceCatalog.find(entry => entry.id === (product.sourceProductId ?? product.id))
  const unit = measureUnits.find(entry => entry.code === option.unit)?.name ?? option.unit
  const updatePrice = (next: number) => { priceRef.current = next; setPrice(next); setError('') }
  const close = () => { if (!savingRef.current) onClose() }
  const confirm = async () => {
    if (savingRef.current || gesture.current) return
    savingRef.current = true; setSaving(true); setError(''); lastTap.current = null
    try {
      await onSave(String(priceRef.current))
      showOperationNotification('success', `Precio de ${definition?.species ?? product.name} actualizado a $${format(priceRef.current)}.`)
      onClose()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No pudimos guardar el precio. Intentá nuevamente.')
      savingRef.current = false; setSaving(false)
    }
  }
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || savingRef.current) return
    event.preventDefault()
    event.currentTarget.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, price: priceRef.current, moved: false }
  }
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current
    if (!current || current.id !== event.pointerId) return
    if (Math.hypot(event.clientX - current.x, event.clientY - current.y) > 8) current.moved = true
    if (!current.moved) return
    lastTap.current = null; setDragging(true)
    updatePrice(draggedPrice(current.price, current.y, event.clientY, maximum))
  }
  const pointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current
    if (!current || current.id !== event.pointerId) return
    gesture.current = null; setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (current.moved) { lastTap.current = null; return }
    const now = performance.now(), previous = lastTap.current
    if (previous && now - previous.time < 350 && Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < 32) { lastTap.current = null; void confirm() }
    else lastTap.current = { time: now, x: event.clientX, y: event.clientY }
  }
  const cancelGesture = () => { gesture.current = null; lastTap.current = null; setDragging(false) }
  return <DrawerShell onClose={close} labelledBy="slider-price-title" className="slider-price-panel">{() => <>
    <header className="slider-editor-heading"><h2 id="slider-price-title">Ajustar precio</h2><p>{definition?.species ?? product.name} <span>· {option.variety}</span></p><small>{option.presentation} · Cat. {option.category} · {option.calibre} · {option.unit}</small></header>
    <div className={`vertical-price-slider${dragging ? ' dragging' : ''}`} role="slider" tabIndex={0} data-autofocus aria-label="Ajustar precio deslizando" aria-orientation="vertical" aria-valuemin={MIN_SLIDER_PRICE} aria-valuemax={maximum} aria-valuenow={price} aria-valuetext={`${format(price)} pesos por ${unit}`} aria-describedby="slider-gesture-help" aria-disabled={saving}
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={cancelGesture} onLostPointerCapture={() => { gesture.current = null; setDragging(false) }} onDoubleClick={event => event.preventDefault()}
      onKeyDown={event => {
        if (saving) return
        const delta = event.key === 'ArrowUp' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowDown' || event.key === 'ArrowLeft' ? -1 : event.key === 'PageUp' ? 10 : event.key === 'PageDown' ? -10 : 0
        if (delta) { event.preventDefault(); updatePrice(Math.max(MIN_SLIDER_PRICE, Math.min(maximum, priceRef.current + delta))) }
        else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); updatePrice(event.key === 'Home' ? MIN_SLIDER_PRICE : maximum) }
        else if (event.key === 'Enter') { event.preventDefault(); void confirm() }
      }}>
      <span className="slider-direction up"><ArrowUp size={17} />Aumentar</span>
      <div className="price-ruler" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i} className={i % 4 === 0 ? 'major' : ''} style={{ '--tick': i } as CSSProperties} />)}</div>
      <div className="slider-current-price"><span className="slider-currency">UYU · por {unit.toLocaleLowerCase('es')}</span><strong><small>$</small>{format(price)}</strong></div>
      <span className="slider-focus-line" aria-hidden="true"><span><MoveVertical size={24} /></span></span>
      <span className="slider-direction down"><ArrowDown size={17} />Reducir</span>
    </div>
    <footer className="slider-editor-footer"><p id="slider-gesture-help">Deslizá hacia arriba o abajo para ajustar de a $1.</p>
      {error && <p className="price-error" role="alert">{error}</p>}
      <div className="slider-footer-actions"><button className="secondary-button" type="button" disabled={saving} onClick={close}>Cancelar</button><button className="primary-button" type="button" disabled={saving} onClick={() => void confirm()}><Check size={18} />{saving ? 'Guardando…' : 'Confirmar precio'}</button></div>
    </footer>
  </>}</DrawerShell>
}
