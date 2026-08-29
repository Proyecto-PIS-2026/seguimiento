import type { ReactNode } from 'react'
import { FileSpreadsheet, KeyRound, ListChecks, UserRound, UsersRound } from 'lucide-react'
import { staticViewRoutes } from '../../shared'

type AdminWorkspaceProps = {
  activeView: string
  children: ReactNode
  onNavigate: (view: string, path?: string) => void
}

const maintenanceItems = [
  { view: 'adminOperators', label: 'Operadores', icon: UsersRound },
  { view: 'adminProducers', label: 'Productores', icon: UserRound },
  { view: 'adminSmartList', label: 'Lista inteligente', icon: ListChecks },
  { view: 'adminRecovery', label: 'Recuperación de cuentas', icon: KeyRound },
  { view: 'adminRevaluation', label: 'Revalorización de precios', icon: FileSpreadsheet },
]

export default function AdminWorkspace({ activeView, children, onNavigate }: AdminWorkspaceProps) {
  return (
    <div className="admin-workspace">
      <aside className="admin-sidebar" aria-label="Navegación de mantenimientos">
        <div className="admin-sidebar-heading"><span>Administración</span><strong>Mantenimientos</strong></div>
        <nav>
          {maintenanceItems.map(({ view, label, icon: Icon }) => <a className={activeView === view ? 'active' : ''} href={staticViewRoutes[view]} key={view} aria-current={activeView === view ? 'page' : undefined} onClick={(event) => { event.preventDefault(); onNavigate(view, staticViewRoutes[view]) }}><Icon size={18} /><span>{label}</span></a>)}
        </nav>
      </aside>
      <div className="admin-workspace-content">{children}</div>
    </div>
  )
}
