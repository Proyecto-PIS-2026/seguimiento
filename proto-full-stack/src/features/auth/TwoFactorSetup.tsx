import { ArrowRight } from 'lucide-react'
export default function TwoFactorSetup({onComplete}:{onComplete?:()=>void}){
  return <main className="auth-flow-page"><section className="auth-flow-card setup-card"><h1>Verificación en dos pasos</h1><p>La verificación en dos pasos todavía no está habilitada. Tu acceso utiliza el email y la contraseña de tu cuenta.</p><button className="primary-submit" onClick={onComplete}>Volver <ArrowRight size={20}/></button></section></main>
}
