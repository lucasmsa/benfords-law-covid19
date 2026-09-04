import { describe, expect, it } from 'vitest'
import { aggregateJhu, aggregateWcota, dailyFromCumulative, dateRange, jhuDateToIso } from './reduce'

describe('jhuDateToIso', () => {
  it('converts m/d/yy to ISO', () => {
    expect(jhuDateToIso('1/22/20')).toBe('2020-01-22')
    expect(jhuDateToIso('12/5/22')).toBe('2022-12-05')
  })
})

describe('dailyFromCumulative', () => {
  it('diffs and keeps corrections negative', () => {
    expect(dailyFromCumulative([0, 3, 3, 10, 8])).toEqual([0, 3, 0, 7, -2])
  })
})

describe('aggregateJhu', () => {
  const header = ['Province/State', 'Country/Region', 'Lat', 'Long', '1/22/20', '1/23/20', '1/24/20']
  const confirmed = [
    header,
    ['Hubei', 'China', '0', '0', '1', '4', '9'],
    ['Beijing', 'China', '0', '0', '0', '1', '2'],
    ['', 'Brazil', '0', '0', '0', '0', '5'],
    ['', 'Diamond Princess', '0', '0', '1', '1', '1'],
  ]
  const deaths = [
    header,
    ['Hubei', 'China', '0', '0', '0', '1', '1'],
    ['Beijing', 'China', '0', '0', '0', '0', '1'],
    ['', 'Brazil', '0', '0', '0', '0', '0'],
    ['', 'Diamond Princess', '0', '0', '0', '0', '0'],
  ]

  it('sums provinces, drops excluded regions, emits daily new', () => {
    const out = aggregateJhu(confirmed, deaths)
    expect(out.dates).toEqual(['2020-01-22', '2020-01-23', '2020-01-24'])
    expect(Object.keys(out.series)).toEqual(['Brazil', 'China'])
    expect(out.series.China.cases).toEqual([1, 4, 6])
    expect(out.series.China.deaths).toEqual([0, 1, 1])
    expect(out.series.Brazil.cases).toEqual([0, 0, 5])
  })

  it('refuses mismatched date columns', () => {
    const badDeaths = [[...header.slice(0, 6)], ...deaths.slice(1).map((r) => r.slice(0, 6))]
    expect(() => aggregateJhu(confirmed, badDeaths)).toThrow(/date columns/)
  })
})

describe('dateRange', () => {
  it('is inclusive and daily', () => {
    expect(dateRange('2020-02-27', '2020-03-01')).toEqual([
      '2020-02-27',
      '2020-02-28',
      '2020-02-29',
      '2020-03-01',
    ])
  })
})

describe('aggregateWcota', () => {
  const header = ['epi_week', 'date', 'country', 'state', 'city', 'newDeaths', 'deaths', 'newCases', 'totalCases']
  const rows = [
    header,
    ['9', '2020-02-25', 'Brazil', 'SP', 'TOTAL', '0', '0', '1', '1'],
    ['9', '2020-02-25', 'Brazil', 'TOTAL', 'TOTAL', '0', '0', '1', '1'],
    ['9', '2020-02-27', 'Brazil', 'SP', 'TOTAL', '0', '0', '2', '3'],
    ['9', '2020-02-27', 'Brazil', 'RJ', 'TOTAL', '1', '1', '4', '4'],
    ['9', '2020-02-27', 'Brazil', 'SP', 'Sao Paulo/SP', '0', '0', '2', '3'],
  ]

  it('keeps state totals only, fills gaps, emits daily new from cumulative', () => {
    const out = aggregateWcota(rows)
    expect(out.dates).toEqual(['2020-02-25', '2020-02-26', '2020-02-27'])
    expect(Object.keys(out.series)).toEqual(['RJ', 'SP'])
    expect(out.series.SP.cases).toEqual([1, 0, 2])
    expect(out.series.RJ.cases).toEqual([0, 0, 4])
    expect(out.series.RJ.deaths).toEqual([0, 0, 1])
  })
})
