import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSessionRole } from '../../server/auth'
import { getAccessiblePath } from '../../shared/auth/access'
import PrototypeApp from '../App'
import { getRoutePageTitle } from '../../lib/metadata/routeTitles'

type PrototypePageProps = {
  params: Promise<{ slug?: string[] }>
}

export async function generateMetadata({ params }: PrototypePageProps): Promise<Metadata> {
  const { slug = [] } = await params
  const pathname = slug.length ? `/${slug.join('/')}` : '/'
  return { title: getRoutePageTitle(pathname) }
}

export default async function PrototypePage({ params }: PrototypePageProps) {
  const { slug = [] } = await params
  const initialPath = slug.length ? `/${slug.join('/')}` : '/'
  const initialRole = await getSessionRole()
  const accessiblePath = getAccessiblePath(initialPath, initialRole)
  if (accessiblePath !== initialPath) redirect(accessiblePath)
  return <PrototypeApp initialPath={initialPath} initialRole={initialRole} />
}
