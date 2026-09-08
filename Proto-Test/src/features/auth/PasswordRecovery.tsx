import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
type Props = { onBack?:any; onSubmit?:(data:{name:string;email:string;problem:string})=>Promise<unknown> }
export default function PasswordRecovery({onBack,onSubmit}:Props){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [problem,setProblem]=useState('No puedo ingresar a mi cuenta.')
  const [sent,setSent]=useState(false)
  const [pending,setPending]=useState(false)
  const [error,setError]=useState('')
  return <main className="auth-flow-page"><section className="auth-flow-card recovery-card">
    {sent?<><div className="success-mark"><Check size={38}/></div><h1>Solicitud recibida.</h1><p>La administración recibió tu solicitud. Revisará los datos de tu cuenta para ayudarte a recuperar el acceso.</p><button className="primary-submit" onClick={onBack}>Volver al login <ArrowRight size={20}/></button></>:<>
      <p className="eyebrow">Recuperación de acceso</p><h1>Recuperá tu <em>cuenta.</em></h1><p>Enviá una solicitud a la administración para restablecer tu contraseña.</p>
      <form onSubmit={async event=>{event.preventDefault();setPending(true);setError('');try{if(!onSubmit)throw new Error('La recuperación no está conectada en esta versión.');await onSubmit({name,email,problem});setSent(true)}catch(error){setError(error instanceof Error?error.message:'No se pudo enviar la solicitud.')}finally{setPending(false)}}}>
        <label className="field"><span>Nombre y apellido</span><input value={name} onChange={event=>setName(event.target.value)} required maxLength={255}/></label>
        <label className="field"><span>Email de contacto</span><input type="email" value={email} onChange={event=>setEmail(event.target.value)} required maxLength={255}/></label>
        <label className="field"><span>¿Qué problema tenés?</span><textarea value={problem} onChange={event=>setProblem(event.target.value)} required maxLength={2000}/></label>
        {error&&<p className="field-error" role="alert">{error}</p>}
        <button className="primary-submit" disabled={pending}>{pending?'Enviando…':'Enviar solicitud'} <ArrowRight size={20}/></button>
        <button type="button" className="help-link" onClick={onBack}>Volver al login</button>
      </form>
    </>}
  </section></main>
}
