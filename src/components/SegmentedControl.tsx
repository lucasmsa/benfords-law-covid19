import type { Option } from '../config/options'

interface Props<T extends string> {
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  hint?: string
}

export default function SegmentedControl<T extends string>({ label, options, value, onChange, hint }: Props<T>) {
  return (
    <div className="control">
      <span className="control__label">{label}</span>
      <div className="segmented" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="segmented__option"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {hint && <p className="control__hint">{hint}</p>}
    </div>
  )
}
