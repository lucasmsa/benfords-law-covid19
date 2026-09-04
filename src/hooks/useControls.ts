import { useCallback, useState } from 'react'
import { defaultRegion, type Area, type Sample } from '../config/options'
import type { DigitTest } from '../lib/benford'
import { clampWindow } from '../lib/sampling'
import type { DateWindow, Metric, SeriesKind } from '../lib/series'

export interface Controls {
  area: Area
  sample: Sample
  region: string
  metric: Metric
  kind: SeriesKind
  test: DigitTest
  window: DateWindow
}

export interface ControlActions {
  setArea: (area: Area) => void
  setSample: (sample: Sample) => void
  setRegion: (region: string) => void
  setMetric: (metric: Metric) => void
  setKind: (kind: SeriesKind) => void
  setTest: (test: DigitTest) => void
  setWindow: (window: DateWindow) => void
}

export function useControls(dateCounts: Record<Area, number>): [Controls, ControlActions] {
  const [controls, setControls] = useState<Controls>({
    area: 'world',
    sample: 'all',
    region: defaultRegion.world,
    metric: 'cases',
    kind: 'daily',
    test: 'first',
    window: { start: 0, end: dateCounts.world - 1 },
  })

  const setArea = useCallback(
    (area: Area) =>
      setControls((current) =>
        current.area === area
          ? current
          : { ...current, area, region: defaultRegion[area], window: { start: 0, end: dateCounts[area] - 1 } },
      ),
    [dateCounts],
  )

  const setWindow = useCallback(
    (window: DateWindow) =>
      setControls((current) => ({ ...current, window: clampWindow(window, dateCounts[current.area] - 1) })),
    [dateCounts],
  )

  const patch = useCallback(
    <K extends keyof Controls>(key: K) =>
      (value: Controls[K]) =>
        setControls((current) => ({ ...current, [key]: value })),
    [],
  )

  return [
    controls,
    {
      setArea,
      setSample: patch('sample'),
      setRegion: patch('region'),
      setMetric: patch('metric'),
      setKind: patch('kind'),
      setTest: patch('test'),
      setWindow,
    },
  ]
}
