import { useEffect, useId, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import DrawerShell from '../layout/DrawerShell'
import { normalizePrice } from '../../features/products/priceInput'

type Props = { title: string; inputLabel: string; initialValue: string; onClose: () => void; onSave: (value: string) => void | Promise<void> }

export default function AmountEditor({ title, inputLabel, initialValue, onClose, onSave }: Props) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const id = useId()
  useEffect(() => {
    const viewport = window.visualViewport
    const backdrop = formRef.current?.closest<HTMLElement>('.panel-backdrop')
    if (!viewport || !backdrop) return
    const resize = () => { backdrop.style.height = `${viewport.height}px`; backdrop.style.top = `${viewport.offsetTop}px` }
    resize()
    viewport.addEventListener('resize', resize); viewport.addEventListener('scroll', resize)
    return () => { viewport.removeEventListener('resize', resize); viewport.removeEventListener('scroll', resize) }
  }, [])
  const close = () => { if (!savingRef.current) onClose() }
  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    if (savingRef.current) return
    const normalized = normalizePrice(value)
    if (!normalized) { setError('Ingresá un importe entero mayor a 0.'); return }
    savingRef.current = true; setSaving(true); setError('')
    try { await onSave(normalized); onClose() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'No pudimos guardar. Intentá nuevamente.'); savingRef.current = false; setSaving(false) }
  }
  return <DrawerShell onClose={close} labelledBy={`${id}-title`} className="quick-price-panel">{() => <>
    <h2 id={`${id}-title`}>{title}</h2>
    <form ref={formRef} className="quick-price-form" onSubmit={save} noValidate>
      <div className={`quick-price-input ${error ? 'invalid' : ''}`}><span aria-hidden="true">$</span><input aria-label={inputLabel} data-autofocus autoFocus inputMode="numeric" autoComplete="off" enterKeyHint="done" value={value} onChange={event => { setValue(event.target.value); setError('') }} onFocus={event => event.target.select()} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} placeholder="0" disabled={saving} /></div>
      {error && <p className="price-error" id={`${id}-error`} role="alert">{error}</p>}
      <footer className="price-editor-footer"><button className="secondary-button" type="button" disabled={saving} onClick={close}>Cancelar</button><button className="primary-button" type="submit" disabled={saving}><Check size={19} />{saving ? 'Guardando…' : 'Confirmar'}</button></footer>
    </form>
  </>}</DrawerShell>
}
