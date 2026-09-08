export const OPERATION_NOTIFICATION_EVENT = 'mercado-hoy:operation-notification'

export type OperationNotificationType = 'success' | 'error'

export type OperationNotificationDetail = {
  type: OperationNotificationType
  message: string
}

export function showOperationNotification(type: OperationNotificationType, message: string) {
  window.dispatchEvent(new CustomEvent<OperationNotificationDetail>(OPERATION_NOTIFICATION_EVENT, { detail: { type, message } }))
}
