export interface RegionSeries {
  cases: number[]
  deaths: number[]
}

export interface DailySeries {
  dates: string[]
  series: Record<string, RegionSeries>
}

export const JHU_EXCLUDED_REGIONS = [
  'Diamond Princess',
  'MS Zaandam',
  'Summer Olympics 2020',
  'Winter Olympics 2022',
]

const JHU_FIRST_DATE_COLUMN = 4
const JHU_COUNTRY_COLUMN = 1

export function jhuDateToIso(mdy: string): string {
  const [m, d, yy] = mdy.split('/')
  return `20${yy.padStart(2, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

export function dailyFromCumulative(cumulative: number[]): number[] {
  return cumulative.map((value, i) => (i === 0 ? value : value - cumulative[i - 1]))
}

function sumJhuByCountry(rows: string[][]): Map<string, number[]> {
  const [header, ...body] = rows
  const dateCount = header.length - JHU_FIRST_DATE_COLUMN
  const totals = new Map<string, number[]>()
  for (const row of body) {
    const country = row[JHU_COUNTRY_COLUMN]
    if (JHU_EXCLUDED_REGIONS.includes(country)) continue
    const acc = totals.get(country) ?? new Array<number>(dateCount).fill(0)
    for (let i = 0; i < dateCount; i++) {
      acc[i] += Number(row[JHU_FIRST_DATE_COLUMN + i])
    }
    totals.set(country, acc)
  }
  return totals
}

export function aggregateJhu(confirmedRows: string[][], deathsRows: string[][]): DailySeries {
  const confirmedDates = confirmedRows[0].slice(JHU_FIRST_DATE_COLUMN)
  const deathDates = deathsRows[0].slice(JHU_FIRST_DATE_COLUMN)
  if (confirmedDates.join() !== deathDates.join()) {
    throw new Error('JHU confirmed and deaths files have different date columns')
  }
  const confirmed = sumJhuByCountry(confirmedRows)
  const deaths = sumJhuByCountry(deathsRows)
  const series: Record<string, RegionSeries> = {}
  for (const country of [...confirmed.keys()].sort()) {
    const deathTotals = deaths.get(country)
    if (!deathTotals) throw new Error(`no deaths row for ${country}`)
    series[country] = {
      cases: dailyFromCumulative(confirmed.get(country)!),
      deaths: dailyFromCumulative(deathTotals),
    }
  }
  return { dates: confirmedDates.map(jhuDateToIso), series }
}

export function dateRange(firstIso: string, lastIso: string): string[] {
  const dates: string[] = []
  const cursor = new Date(`${firstIso}T00:00:00Z`)
  const last = new Date(`${lastIso}T00:00:00Z`)
  while (cursor <= last) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return dates
}

function carryForward(byDate: Map<string, number>, dates: string[]): number[] {
  let last = 0
  return dates.map((date) => {
    const value = byDate.get(date)
    if (value !== undefined) last = value
    return last
  })
}

export function aggregateWcota(rows: string[][]): DailySeries {
  const [header, ...body] = rows
  const col = (name: string) => {
    const index = header.indexOf(name)
    if (index < 0) throw new Error(`wcota column missing: ${name}`)
    return index
  }
  const dateCol = col('date')
  const stateCol = col('state')
  const cityCol = col('city')
  const totalCasesCol = col('totalCases')
  const deathsCol = col('deaths')

  const cumulativeCases = new Map<string, Map<string, number>>()
  const cumulativeDeaths = new Map<string, Map<string, number>>()
  let firstDate = '9999-12-31'
  let lastDate = '0000-01-01'

  for (const row of body) {
    if (row[cityCol] !== 'TOTAL' || row[stateCol] === 'TOTAL') continue
    const state = row[stateCol]
    const date = row[dateCol]
    if (date < firstDate) firstDate = date
    if (date > lastDate) lastDate = date
    if (!cumulativeCases.has(state)) {
      cumulativeCases.set(state, new Map())
      cumulativeDeaths.set(state, new Map())
    }
    cumulativeCases.get(state)!.set(date, Number(row[totalCasesCol]))
    cumulativeDeaths.get(state)!.set(date, Number(row[deathsCol]))
  }

  const dates = dateRange(firstDate, lastDate)
  const series: Record<string, RegionSeries> = {}
  for (const state of [...cumulativeCases.keys()].sort()) {
    series[state] = {
      cases: dailyFromCumulative(carryForward(cumulativeCases.get(state)!, dates)),
      deaths: dailyFromCumulative(carryForward(cumulativeDeaths.get(state)!, dates)),
    }
  }
  return { dates, series }
}
