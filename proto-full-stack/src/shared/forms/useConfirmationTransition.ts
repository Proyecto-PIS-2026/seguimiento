import { useEffect, useRef, useState } from 'react'
import { showLinearLoader } from '../navigation/linearLoader'
import { showOperationNotification } from '../feedback/operationNotifications'

type ConfirmationFeedback = {
  success?: string
  error?: string
}

export default function useConfirmationTransition(delay = 650) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const confirmationTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (confirmationTimer.current !== null) window.clearTimeout(confirmationTimer.current)
  }, [])

  const confirm = (action: () => void | Promise<void>, feedback: ConfirmationFeedback = {}) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    showLinearLoader(delay)
    confirmationTimer.current = window.setTimeout(() => {
      confirmationTimer.current = null
      Promise.resolve()
        .then(action)
        .then(() => showOperationNotification('success', feedback.success ?? 'Los cambios se guardaron correctamente.'))
        .catch(() => showOperationNotification('error', feedback.error ?? 'Ocurrió un error al guardar los cambios. Intentá nuevamente.'))
        .finally(() => setIsSubmitting(false))
    }, delay)
  }

  return { confirm, isSubmitting }
}
