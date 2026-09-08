import { ArrowRight } from 'lucide-react'
export default function ResetPasswordPage({onComplete}:{onComplete?:()=>void}){
  return <main className="auth-flow-page"><section className="auth-flow-card recovery-card"><h1>Restablecer contraseña</h1><p>La administración puede definir una nueva contraseña desde la edición de tu cuenta. Solicitá ayuda para recuperar el acceso.</p><button className="primary-submit" onClick={onComplete}>Solicitar ayuda <ArrowRight size={20}/></button></section></main>
}
