import { describe, expect, it } from 'vitest'
import { cumulativeFromDaily, selectValues, sumRegions, type Dataset } from './series'

const dataset: Dataset = {
  dates: ['2020-01-01', '2020-01-02', '2020-01-03'],
  series: {
    A: { cases: [1, 2, 3], deaths: [0, 1, 0] },
    B: { cases: [10, 0, -1], deaths: [0, 0, 2] },
  },
}

describe('sumRegions', () => {
  it('adds regions elementwise per metric', () => {
    expect(sumRegions(dataset, 'cases')).toEqual([11, 2, 2])
    expect(sumRegions(dataset, 'deaths')).toEqual([0, 1, 2])
  })
})

describe('cumulativeFromDaily', () => {
  it('is the prefix sum, so it reverses dailyFromCumulative', () => {
    expect(cumulativeFromDaily([1, 2, 3, -1])).toEqual([1, 3, 6, 5])
  })
})

describe('selectValues', () => {
  it('slices daily values inclusively', () => {
    expect(selectValues([1, 2, 3, 4], 'daily', { start: 1, end: 2 })).toEqual([2, 3])
  })
  it('accumulates from the series start before slicing', () => {
    expect(selectValues([1, 2, 3, 4], 'cumulative', { start: 2, end: 3 })).toEqual([6, 10])
  })
})
