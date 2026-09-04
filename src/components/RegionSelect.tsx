interface Props {
  label: string
  regions: string[]
  value: string
  onChange: (region: string) => void
}

export default function RegionSelect({ label, regions, value, onChange }: Props) {
  return (
    <div className="control">
      <label className="control__label" htmlFor="region-select">
        {label}
      </label>
      <select id="region-select" className="select" value={value} onChange={(event) => onChange(event.target.value)}>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  )
}
