import { useState } from 'react'
import { Trash2 } from 'lucide-react'
type Props = { heading?:any;description?:any;confirmLabel?:any;onConfirm?:any;onCancel?:any }
export default function ConfirmModal({heading,description,confirmLabel='Eliminar',onConfirm,onCancel}:Props){
  const [pending,setPending]=useState(false)
  const [error,setError]=useState('')
  return <div className="input-modal-overlay" onMouseDown={event=>{if(!pending&&event.target===event.currentTarget)onCancel()}}>
    <section className="input-modal confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-heading" onKeyDown={event=>{if(event.key==='Escape'&&!pending)onCancel()}}>
      <div className="confirm-modal-icon"><Trash2 size={22}/></div><h2 id="confirm-modal-heading">{heading}</h2><p>{description}</p>
      {error&&<p role="alert" className="field-error">{error}</p>}
      <div className="input-modal-actions"><button type="button" disabled={pending} onClick={onCancel}>Cancelar</button><button className="danger" type="button" disabled={pending} onClick={async()=>{setPending(true);setError('');try{await onConfirm()}catch(error){setError(error instanceof Error?error.message:'No se pudo completar la operación.')}finally{setPending(false)}}}>{pending?'Guardando…':confirmLabel}</button></div>
    </section>
  </div>
}
