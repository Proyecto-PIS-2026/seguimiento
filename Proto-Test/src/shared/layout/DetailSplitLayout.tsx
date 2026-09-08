import type { ReactNode } from 'react'

type DetailSplitLayoutProps = {
  aside: ReactNode
  children: ReactNode
  className?: string
  asideClassName?: string
  asideContentClassName?: string
  contentClassName?: string
}

export default function DetailSplitLayout({ aside, children, className = '', asideClassName = '', asideContentClassName = '', contentClassName = '' }: DetailSplitLayoutProps) {
  return (
    <main className={`detail-split-layout ${className}`.trim()}>
      {aside && <section className={`detail-split-aside ${asideClassName}`.trim()}>
        <div className={`detail-split-aside-content ${asideContentClassName}`.trim()}>{aside}</div>
      </section>}
      <section className={`detail-split-main ${contentClassName}`.trim()}>{children}</section>
    </main>
  )
}
