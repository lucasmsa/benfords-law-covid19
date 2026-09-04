import { selectValues, sumRegions, type Dataset, type DateWindow, type Metric, type SeriesKind } from './series'

export type Sample = 'all' | 'pooled' | 'region' | 'snapshot'

export interface SamplingChoice {
  sample: Sample
  region: string
  metric: Metric
  kind: SeriesKind
  window: DateWindow
}

export function sampleValues(dataset: Dataset, choice: SamplingChoice): number[] {
  const { sample, region, metric, kind, window } = choice
  if (sample === 'all') {
    return Object.values(dataset.series).flatMap((series) => selectValues(series[metric], kind, window))
  }
  if (sample === 'pooled') return selectValues(sumRegions(dataset, metric), kind, window)
  if (sample === 'region') {
    const series = dataset.series[region]
    if (!series) return []
    return selectValues(series[metric], kind, window)
  }
  return Object.values(dataset.series).map((series) => {
    const values = selectValues(series[metric], kind, window)
    return values[values.length - 1]
  })
}

export function clampWindow(window: DateWindow, lastIndex: number): DateWindow {
  const start = Math.min(Math.max(0, window.start), lastIndex)
  const end = Math.min(Math.max(start, window.end), lastIndex)
  return { start, end }
}
