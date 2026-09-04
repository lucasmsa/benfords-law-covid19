import { useCallback, type ChangeEvent } from 'react'
import type { DateWindow } from '../lib/series'

export function useDateRange(window: DateWindow, setWindow: (window: DateWindow) => void) {
  const onStartChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const start = Number(event.target.value)
      setWindow({ start, end: Math.max(start, window.end) })
    },
    [setWindow, window.end],
  )

  const onEndChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const end = Number(event.target.value)
      setWindow({ start: Math.min(window.start, end), end })
    },
    [setWindow, window.start],
  )

  return { onStartChange, onEndChange }
}
