import type { DigitTest } from '../lib/benford'
import type { Metric, SeriesKind } from '../lib/series'

export type Area = 'world' | 'brazil'
export type Sample = 'all' | 'pooled' | 'region' | 'snapshot'

export interface Option<T extends string> {
  value: T
  label: string
}

export const areaOptions: Option<Area>[] = [
  { value: 'world', label: 'World 🌍' },
  { value: 'brazil', label: 'Brazil 🇧🇷' },
]

export const sampleOptions: Option<Sample>[] = [
  { value: 'all', label: 'Every region, every day' },
  { value: 'pooled', label: 'Regions summed, per day' },
  { value: 'region', label: 'One region, per day' },
  { value: 'snapshot', label: 'One value per region' },
]

export const metricOptions: Option<Metric>[] = [
  { value: 'cases', label: 'Cases 🦠' },
  { value: 'deaths', label: 'Deaths 💀' },
]

export const kindOptions: Option<SeriesKind>[] = [
  { value: 'daily', label: 'Daily new' },
  { value: 'cumulative', label: 'Cumulative' },
]

export const testOptions: Option<DigitTest>[] = [
  { value: 'first', label: 'First digit' },
  { value: 'firstTwo', label: 'First two digits' },
]

export const regionNoun: Record<Area, { singular: string; plural: string }> = {
  world: { singular: 'country', plural: 'countries' },
  brazil: { singular: 'state', plural: 'states' },
}

export const defaultRegion: Record<Area, string> = {
  world: 'Brazil',
  brazil: 'SP',
}
