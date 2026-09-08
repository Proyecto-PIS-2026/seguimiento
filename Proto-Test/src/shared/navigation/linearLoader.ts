export const LINEAR_LOADER_EVENT = 'mercado-hoy:linear-loader'

export function showLinearLoader(duration = 420) {
  window.dispatchEvent(new CustomEvent(LINEAR_LOADER_EVENT, { detail: { duration } }))
}
