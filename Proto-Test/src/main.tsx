import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import UiVariantProvider from './features/variants/UiVariantProvider'
import './styles.css'
import './features/variants/variants.css'
import './features/products/quick-price-editor.css'
import './catalog-controls.css'

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el elemento raíz de la aplicación')

createRoot(root).render(
  <StrictMode>
    <UiVariantProvider><App /></UiVariantProvider>
  </StrictMode>,
)
