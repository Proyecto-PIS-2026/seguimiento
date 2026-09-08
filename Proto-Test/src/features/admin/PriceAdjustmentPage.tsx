import { useState } from 'react'
import AmountEditor from '../../shared/forms/AmountEditor'
import { savePriceAdjustment, usePriceAdjustment } from '../products/priceAdjustmentSettings'
import { showOperationNotification } from '../../shared/feedback/operationNotifications'

export default function PriceAdjustmentPage() {
  const amount = usePriceAdjustment()
  const [editing, setEditing] = useState(false)
  return <main className="admin-page">
    <section className="smart-list-link-form">
      <h1>Ajuste de precios</h1>
      <p>Importe que suman y restan los botones + y − de las publicaciones.</p>
      <button className="adjustment-amount" type="button" aria-label={`Cambiar incremento: $${amount}`} aria-haspopup="dialog" onClick={() => setEditing(true)}><strong>${amount}</strong><span>Cambiar importe</span></button>
    </section>
    {editing && <AmountEditor title="Cambiar incremento" inputLabel="Importe del ajuste" initialValue={String(amount)} onClose={() => setEditing(false)} onSave={value => { savePriceAdjustment(value); showOperationNotification('success', `Los botones + y − ahora ajustan de a $${value}.`) }} />}
  </main>
}
