import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { buildPricedProduct, productWebserviceCatalog } from '../../shared'
import DrawerShell from '../../shared/layout/DrawerShell'
import { showOperationNotification } from '../../shared/feedback/operationNotifications'
import { normalizePrice, formatPrice } from './priceInput'

type Props = { product: any; option: any; onSave: (draft: any) => void | Promise<void>; onClose: () => void }

export default function QuickPriceEditor({ product, option, onSave, onClose }: Props) {
  const initialPrice = formatPrice(option.price ?? '').match(/\d+(?:[.,]\d+)?/)?.[0] ?? ''
  const [price, setPrice] = useState(initialPrice)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const definition = productWebserviceCatalog.find(entry => entry.id === (product.sourceProductId ?? product.id))
  const formRef = useRef<HTMLFormElement>(null)
  // Keep the compact dialog centered above the mobile software keyboard.
  useEffect(() => {
    const viewport = window.visualViewport
    const backdrop = formRef.current?.closest<HTMLElement>('.panel-backdrop')
    if (!viewport || !backdrop) return
    const resize = () => { backdrop.style.height = `${viewport.height}px`; backdrop.style.top = `${viewport.offsetTop}px` }
    resize()
    viewport.addEventListener('resize', resize)
    viewport.addEventListener('scroll', resize)
    return () => { viewport.removeEventListener('resize', resize); viewport.removeEventListener('scroll', resize) }
  }, [])
  const normalized = normalizePrice(price)
  const requestClose = () => { if (!saving) onClose() }
  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    if (saving) return
    if (!normalized) { setError('Ingresá un precio entero mayor a 0.'); return }
    const draft = buildPricedProduct({ definition, baseProduct: product, ...option, photo: option.photo ?? '', price: normalized })
    if (!draft) { setError('Revisá los datos de esta combinación.'); return }
    setSaving(true); setError('')
    try { await onSave(draft); showOperationNotification('success', `Precio de ${definition?.species ?? product.name} actualizado a $${normalized.replace('.', ',')}.`); onClose() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'No pudimos guardar. Tu precio sigue acá; intentá otra vez.'); setSaving(false) }
  }
  return <DrawerShell onClose={requestClose} labelledBy="quick-price-title" className="quick-price-panel">{() => <>
    <h2 id="quick-price-title">Cambiar precio</h2>
    <form ref={formRef} className="quick-price-form" onSubmit={save} noValidate>
      <div className={`quick-price-input ${error ? 'invalid' : ''}`}><span aria-hidden="true">$</span><input id="quick-price" aria-label="Nuevo precio" data-autofocus autoFocus inputMode="numeric" autoComplete="off" enterKeyHint="done" value={price} onChange={event => { setPrice(event.target.value); setError('') }} onFocus={event => event.target.select()} aria-invalid={Boolean(error)} aria-describedby={error ? 'price-error' : undefined} placeholder="0" disabled={saving} /></div>
      {error && <p className="price-error" id="price-error" role="alert">{error}</p>}
      <footer className="price-editor-footer"><button className="secondary-button" type="button" disabled={saving} onClick={requestClose}>Cancelar</button><button className="primary-button" type="submit" disabled={saving}><Check size={19} />{saving ? 'Guardando…' : 'Confirmar'}</button></footer>
    </form>
  </>}</DrawerShell>
}
