import PrototypeApp from '../App'

type PrototypePageProps = {
  params: Promise<{ slug?: string[] }>
}

export default async function PrototypePage({ params }: PrototypePageProps) {
  const { slug = [] } = await params
  const initialPath = slug.length ? `/${slug.join('/')}` : '/'
  return <PrototypeApp initialPath={initialPath} />
}
