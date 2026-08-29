import type { Metadata } from 'next'
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
  return <PrototypeApp initialPath={initialPath} />
}
