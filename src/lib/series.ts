export interface RegionSeries {
  cases: number[]
  deaths: number[]
}

export interface Dataset {
  dates: string[]
  series: Record<string, RegionSeries>
}

export type Metric = keyof RegionSeries
export type SeriesKind = 'daily' | 'cumulative'

export function sumRegions(dataset: Dataset, metric: Metric): number[] {
  const total = new Array<number>(dataset.dates.length).fill(0)
  for (const region of Object.values(dataset.series)) {
    const values = region[metric]
    for (let i = 0; i < values.length; i++) total[i] += values[i]
  }
  return total
}

export function cumulativeFromDaily(daily: readonly number[]): number[] {
  let running = 0
  return daily.map((value) => (running += value))
}

export interface DateWindow {
  start: number
  end: number
}

export function selectValues(daily: readonly number[], kind: SeriesKind, window: DateWindow): number[] {
  const source = kind === 'cumulative' ? cumulativeFromDaily(daily) : daily
  return source.slice(window.start, window.end + 1)
}
