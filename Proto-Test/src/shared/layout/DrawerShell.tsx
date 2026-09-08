import { useEffect, useRef, type ReactNode } from 'react'
import { ArrowUpRight, X } from 'lucide-react'

type Props = { onClose?: () => void; labelledBy?: string; className?: string; onOpenPage?: () => void; children?: (swipeProps: Record<string, never>) => ReactNode }
let openCount = 0
let previousOverflow = ''

export default function DrawerShell({ onClose, labelledBy, className = '', onOpenPage, children }: Props) {
  const panelRef = useRef<HTMLElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    if (openCount++ === 0) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden' }
    const panel = panelRef.current!
    const frame = requestAnimationFrame(() => { const target = panel.querySelector<HTMLElement>('[data-autofocus]'); (target ?? panel).focus() })
    const keydown = (event: KeyboardEvent) => {
      const panels = document.querySelectorAll('.product-panel[role="dialog"]')
      if (panels[panels.length - 1] !== panel) return
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current?.() }
      if (event.key === 'Tab') {
        const focusable = Array.from(panel.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')).filter(el => el.getClientRects().length > 0)
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (!first) { event.preventDefault(); panel.focus() }
        else if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', keydown)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('keydown', keydown); if (--openCount === 0) document.body.style.overflow = previousOverflow; if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true }) }
  }, [])
  return <div className="panel-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose?.() }}><section ref={panelRef} tabIndex={-1} className={`product-panel ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}><div className="panel-actions">{onOpenPage && <button className="panel-page-link" onClick={onOpenPage} aria-label="Abrir vista de página"><ArrowUpRight size={20} /></button>}<button className="panel-close" onClick={onClose} aria-label="Cerrar"><X size={22} /></button></div>{children?.({})}</section></div>
}
