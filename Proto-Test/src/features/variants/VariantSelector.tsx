import { Layers } from 'lucide-react'
import { uiVariants, useUiVariant } from './uiVariant'

export default function VariantSelector() {
  const { variant, setVariant } = useUiVariant()
  return <section className="ui-variant-section" aria-label="Variantes">
    <div className="ui-variant-title"><Layers size={15} /><strong>Variantes</strong></div>
    <div className="ui-variant-options" role="group" aria-label="Versión de la interfaz">
      {uiVariants.map(option => <button key={option.id} type="button" aria-pressed={variant === option.id} title={`${option.name}: ${option.description}`} onClick={() => setVariant(option.id)}>{option.id}</button>)}
    </div>
    <p>{uiVariants.find(option => option.id === variant)?.description}</p>
  </section>
}
