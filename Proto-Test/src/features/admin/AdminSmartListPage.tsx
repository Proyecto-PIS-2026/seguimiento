import { useState } from 'react'
import { Check } from 'lucide-react'
import { saveSmartListUrl, useSmartListUrl } from '../board/smartListSettings'
import { showOperationNotification } from '../../shared/feedback/operationNotifications'

export default function AdminSmartListPage() {
  const currentUrl = useSmartListUrl()
  const [draft, setDraft] = useState<string | null>(null)
  const [error, setError] = useState('')
  const save = (event: React.FormEvent) => {
    event.preventDefault()
    try {
      saveSmartListUrl(draft ?? currentUrl)
      setDraft(null); setError('')
      showOperationNotification('success', 'Enlace de la lista inteligente actualizado.')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No pudimos guardar el enlace.') }
  }
  return <main className="admin-page">
    <form className="smart-list-link-form" onSubmit={save} noValidate>
      <h1>Lista inteligente de la UAM</h1>
      <p>Actualizá el enlace al PDF para cambiar el documento que abre el botón.</p>
      <label className="field"><span>Enlace al PDF</span><input type="url" inputMode="url" autoComplete="off" value={draft ?? currentUrl} onChange={event => { setDraft(event.target.value); setError('') }} aria-invalid={Boolean(error)} aria-describedby={error ? 'smart-link-error' : undefined} /></label>
      {error && <p className="price-error" id="smart-link-error" role="alert">{error}</p>}
      <div className="smart-list-link-actions"><a href={currentUrl} target="_blank" rel="noopener noreferrer">Abrir PDF actual</a><button className="primary-button" type="submit"><Check size={18} />Guardar enlace</button></div>
    </form>
  </main>
}
