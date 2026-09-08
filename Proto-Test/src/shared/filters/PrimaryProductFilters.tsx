import { productWebserviceCatalog } from '../../shared'

type Props = {
  groupFilter: string; setGroupFilter: (value: string) => void
  speciesFilter: string; setSpeciesFilter: (value: string) => void
  setVarietyFilter: (value: string) => void
  priceMin: string; setPriceMin: (value: string) => void
  priceMax: string; setPriceMax: (value: string) => void
}

export default function PrimaryProductFilters({ groupFilter, setGroupFilter, speciesFilter, setSpeciesFilter, setVarietyFilter, priceMin, setPriceMin, priceMax, setPriceMax }: Props) {
  const groups = [...new Set(productWebserviceCatalog.map(entry => entry.group))].sort((a, b) => a.localeCompare(b, 'es'))
  const species = [...new Set(productWebserviceCatalog.filter(entry => groupFilter === 'all' || entry.group === groupFilter).map(entry => entry.species))].sort((a, b) => a.localeCompare(b, 'es'))
  const invalidRange = Boolean(priceMin && priceMax && Number(priceMin) > Number(priceMax))
  return <div className="primary-product-filters">
    <label><span>Grupo</span><select value={groupFilter} onChange={event => { setGroupFilter(event.target.value); setSpeciesFilter('all'); setVarietyFilter('all') }}><option value="all">Todos</option>{groups.map(value => <option key={value}>{value}</option>)}</select></label>
    <label><span>Especie</span><select value={speciesFilter} onChange={event => { setSpeciesFilter(event.target.value); setVarietyFilter('all') }}><option value="all">Todas</option>{species.map(value => <option key={value}>{value}</option>)}</select></label>
    <label><span>Precio mínimo</span><input type="number" inputMode="numeric" min="0" step="1" placeholder="$ Mín." value={priceMin} onChange={event => setPriceMin(event.target.value)} aria-invalid={invalidRange} /></label>
    <label><span>Precio máximo</span><input type="number" inputMode="numeric" min="0" step="1" placeholder="$ Máx." value={priceMax} onChange={event => setPriceMax(event.target.value)} aria-invalid={invalidRange} /></label>
    {invalidRange && <p role="alert">El mínimo no puede superar el máximo.</p>}
  </div>
}
