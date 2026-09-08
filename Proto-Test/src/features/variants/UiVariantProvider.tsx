import { useEffect, useState, type ReactNode } from 'react'
import { UiVariantContext, type UiVariant } from './uiVariant'

export default function UiVariantProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<UiVariant>(() => {
    try { const saved = localStorage.getItem('proto-test-ui-variant'); if (saved === 'V2' || saved === 'V3') return saved } catch {}
    return 'V1'
  })
  useEffect(() => {
    document.documentElement.dataset.uiVariant = variant
    try { localStorage.setItem('proto-test-ui-variant', variant) } catch {}
  }, [variant])
  return <UiVariantContext.Provider value={{ variant, setVariant }}>{children}</UiVariantContext.Provider>
}
