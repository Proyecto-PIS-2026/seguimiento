import { CheckCircle2, X, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { OperationNotificationType } from './operationNotifications'

type OperationNotificationProps = {
  type: OperationNotificationType
  message: string
  onDismiss: () => void
}

export default function OperationNotification({ type, message, onDismiss }: OperationNotificationProps) {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsClosing(true), 4200)
    return () => window.clearTimeout(timer)
  }, [])

  const Icon = type === 'success' ? CheckCircle2 : XCircle

  return (
    <aside
      className={`operation-notification ${type}${isClosing ? ' closing' : ''}`}
      role={type === 'error' ? 'alert' : 'status'}
      onAnimationEnd={(event) => isClosing && event.animationName === 'operation-notification-out' && onDismiss()}
    >
      <Icon size={22} aria-hidden="true" />
      <span><strong>{type === 'success' ? 'Operación exitosa' : 'No se pudo completar'}</strong><small>{message}</small></span>
      <button type="button" onClick={() => setIsClosing(true)} aria-label="Cerrar notificación"><X size={18} /></button>
    </aside>
  )
}
