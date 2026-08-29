type LinearNavigationLoaderProps = {
  active: boolean
}

export default function LinearNavigationLoader({ active }: LinearNavigationLoaderProps) {
  return (
    <div
      className={active ? 'linear-navigation-loader active' : 'linear-navigation-loader'}
      role="progressbar"
      aria-label="Cargando página"
      aria-hidden={!active}
    >
      <span />
    </div>
  )
}
