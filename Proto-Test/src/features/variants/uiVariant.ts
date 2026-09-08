import { createContext, useContext } from 'react'

export type UiVariant = 'V1' | 'V2' | 'V3'
export const uiVariants: { id: UiVariant; name: string; description: string }[] = [
  { id: 'V1', name: 'Original', description: 'Precio: cambiar importe. Lápiz: editar combinación.' },
  { id: 'V2', name: 'Ajuste rápido', description: 'Sumá o restá $10 junto al precio.' },
  { id: 'V3', name: 'Deslizar', description: 'Escribí tocando el precio o ajustá con las flechas.' },
]
export const UiVariantContext = createContext<{ variant: UiVariant; setVariant: (value: UiVariant) => void }>({ variant: 'V1', setVariant: () => {} })
export const useUiVariant = () => useContext(UiVariantContext)
