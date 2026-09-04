import { describe, expect, it } from 'vitest'
import { clampWindow, sampleValues } from './sampling'
import type { Dataset } from './series'

const dataset: Dataset = {
  dates: ['2020-01-01', '2020-01-02', '2020-01-03'],
  series: {
    A: { cases: [1, 2, 3], deaths: [0, 1, 0] },
    B: { cases: [10, 0, -1], deaths: [0, 0, 2] },
  },
}
const full = { start: 0, end: 2 }

describe('sampleValues', () => {
  it('all concatenates every region over the window', () => {
    expect(sampleValues(dataset, { sample: 'all', region: '', metric: 'cases', kind: 'daily', window: { start: 1, end: 2 } })).toEqual([2, 3, 0, -1])
  })
  it('pooled sums regions per day', () => {
    expect(sampleValues(dataset, { sample: 'pooled', region: '', metric: 'cases', kind: 'daily', window: full })).toEqual([11, 2, 2])
  })
  it('region picks one series and honours the window', () => {
    expect(sampleValues(dataset, { sample: 'region', region: 'B', metric: 'cases', kind: 'daily', window: { start: 1, end: 2 } })).toEqual([0, -1])
  })
  it('region returns nothing for an unknown region', () => {
    expect(sampleValues(dataset, { sample: 'region', region: 'ZZ', metric: 'cases', kind: 'daily', window: full })).toEqual([])
  })
  it('snapshot takes one value per region on the last day of the window', () => {
    expect(sampleValues(dataset, { sample: 'snapshot', region: '', metric: 'cases', kind: 'cumulative', window: { start: 0, end: 1 } })).toEqual([3, 10])
    expect(sampleValues(dataset, { sample: 'snapshot', region: '', metric: 'deaths', kind: 'daily', window: full })).toEqual([0, 2])
  })
})

describe('clampWindow', () => {
  it('keeps start <= end inside the index range', () => {
    expect(clampWindow({ start: -3, end: 99 }, 10)).toEqual({ start: 0, end: 10 })
    expect(clampWindow({ start: 7, end: 4 }, 10)).toEqual({ start: 7, end: 7 })
  })
})
