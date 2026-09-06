import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '../styles.css'

export const metadata: Metadata = {
  title: {
    default: 'Pizarrón | MFH - UAM',
    template: '%s | MFH - UAM',
  },
  description: 'Pizarrón de precios y mercadería disponible hoy en la UAM.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#006b2f',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
