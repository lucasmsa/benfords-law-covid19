import { useDateRange } from '../hooks/useDateRange'
import { formatDate } from '../lib/format'
import type { DateWindow } from '../lib/series'

interface Props {
  dates: string[]
  window: DateWindow
  onChange: (window: DateWindow) => void
}

export default function DateRange({ dates, window, onChange }: Props) {
  const { onStartChange, onEndChange } = useDateRange(window, onChange)
  const lastIndex = dates.length - 1
  const days = window.end - window.start + 1

  return (
    <div className="control">
      <span className="control__label">Window</span>
      <div className="range-group">
        <label className="range-group__row">
          <span>From</span>
          <input className="range" type="range" min={0} max={lastIndex} value={window.start} onChange={onStartChange} />
          <span className="range-group__value">{formatDate(dates[window.start])}</span>
        </label>
        <label className="range-group__row">
          <span>To</span>
          <input className="range" type="range" min={0} max={lastIndex} value={window.end} onChange={onEndChange} />
          <span className="range-group__value">{formatDate(dates[window.end])}</span>
        </label>
      </div>
      <p className="control__hint">
        {days.toLocaleString('en-US')} days selected out of {dates.length.toLocaleString('en-US')}.
      </p>
    </div>
  )
}
