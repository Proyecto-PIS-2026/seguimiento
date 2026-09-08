import { useRef, useState } from 'react'
import { Minus, Plus, MoveVertical } from 'lucide-react'
import { useUiVariant } from '../variants/uiVariant'
import { showOperationNotification } from '../../shared/feedback/operationNotifications'
import { formatPrice } from './priceInput'
import { usePriceAdjustment } from './priceAdjustmentSettings'

type Props = { price: string; label: string; onEdit?: () => void; onAdjust?: (delta: number) => Promise<void>; onSlide?: () => void }

export default function PublicationPrice({ price, label, onEdit, onAdjust, onSlide }: Props) {
  const { variant } = useUiVariant()
  const increment = usePriceAdjustment()
  const [pending, setPending] = useState(false)
  const saving = useRef(false)
  const displayPrice = formatPrice(price)
  const numericPrice = Number(displayPrice.replace('$', ''))
  const amount = onEdit ? <button className="price-manual-trigger" type="button" disabled={pending} onClick={onEdit} aria-label={`Cambiar precio de ${label}: ${displayPrice}`} title="Escribir precio" aria-haspopup="dialog"><b aria-live="polite" aria-atomic="true">{displayPrice}</b></button> : <b>{displayPrice}</b>
  const adjust = async (delta: number) => {
    if (saving.current || !onAdjust) return
    saving.current = true; setPending(true)
    try { await onAdjust(delta) }
    catch (error) { showOperationNotification('error', error instanceof Error ? error.message : 'No pudimos actualizar este precio.') }
    finally { saving.current = false; setPending(false) }
  }
  if (variant === 'V2' && onAdjust) return <span className="price-stepper" aria-label={`Precio de ${label}`} aria-busy={pending}>
    <button className="price-step-button" type="button" disabled={pending || !Number.isFinite(numericPrice) || numericPrice <= increment} aria-label={`Restar $${increment}: ${label}`} onClick={() => adjust(-increment)}><Minus size={19} /></button>
    {amount}
    <button className="price-step-button" type="button" disabled={pending || !Number.isFinite(numericPrice) || !Number.isSafeInteger(numericPrice + increment)} aria-label={`Aumentar $${increment}: ${label}`} onClick={() => adjust(increment)}><Plus size={19} /></button>
  </span>
  if (variant === 'V3' && onSlide) return <span className="price-slider-control">{amount}<button className="price-slider-trigger" type="button" onClick={onSlide} aria-label={`Deslizar precio de ${label}: ${displayPrice}`} title="Ajustar deslizando" aria-haspopup="dialog"><MoveVertical size={16} /></button></span>
  return amount
}
