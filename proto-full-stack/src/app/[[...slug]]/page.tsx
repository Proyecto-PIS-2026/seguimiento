import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '../../server/auth'
import { getAccessiblePath } from '../../shared/auth/access'
import PrototypeApp from '../App'
import { getRoutePageTitle } from '../../lib/metadata/routeTitles'

type PrototypePageProps = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: PrototypePageProps): Promise<Metadata> {
  const { slug = [] } = await params
  const pathname = slug.length ? `/${slug.join('/')}` : '/'
  return { title: getRoutePageTitle(pathname) }
}

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function getSearchParamsWithoutSessionControls(searchParams: Record<string, string | string[] | undefined>) {
  const cleanedParams = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'loggedout' || key === 'user' || key === 'pass' || value === undefined) continue
    if (Array.isArray(value)) value.forEach((entry) => cleanedParams.append(key, entry))
    else cleanedParams.set(key, value)
  }
  const query = cleanedParams.toString()
  return query ? `?${query}` : ''
}

export default async function PrototypePage({ params, searchParams }: PrototypePageProps) {
  const { slug = [] } = await params
  const query = await searchParams
  const initialPath = slug.length ? `/${slug.join('/')}` : '/'
  const nextPath = `${initialPath}${getSearchParamsWithoutSessionControls(query)}`
  if (Object.hasOwn(query, 'loggedout')) {
    const logoutParams = new URLSearchParams({ next: nextPath })
    redirect(`/api/auth/session/logout?${logoutParams}`)
  }
  const username = getFirstParam(query.user)
  const password = getFirstParam(query.pass)
  if (username !== undefined && password !== undefined) {
    const autoLoginParams = new URLSearchParams({ user: username, pass: password, next: nextPath })
    redirect(`/api/auth/session/auto?${autoLoginParams}`)
  }
  const initialSession = await getSession()
  const initialRole = initialSession?.role ?? null
  const accessiblePath = getAccessiblePath(initialPath, initialRole)
  if (accessiblePath !== initialPath) redirect(accessiblePath)
  return <PrototypeApp initialPath={initialPath} initialRole={initialRole} initialUsername={initialSession?.username ?? null} />
}
