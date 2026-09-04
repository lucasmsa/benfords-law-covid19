import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { parseCsv } from './csv'
import {
  aggregateJhu,
  aggregateWcota,
  JHU_EXCLUDED_REGIONS,
  type DailySeries,
} from './reduce'

const JHU_REPO = 'CSSEGISandData/COVID-19'
const WCOTA_REPO = 'wcota/covid19br'
const JHU_BASE = `https://raw.githubusercontent.com/${JHU_REPO}/master/csse_covid_19_data/csse_covid_19_time_series`

const SOURCES = {
  jhuConfirmed: `${JHU_BASE}/time_series_covid19_confirmed_global.csv`,
  jhuDeaths: `${JHU_BASE}/time_series_covid19_deaths_global.csv`,
  wcotaStates: `https://raw.githubusercontent.com/${WCOTA_REPO}/master/cases-brazil-states.csv`,
}

const OUT_DIR = 'public/data'

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`)
  return res.text()
}

async function headSha(repo: string): Promise<{ sha: string; date: string }> {
  const res = await fetch(`https://api.github.com/repos/${repo}/commits/master`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) throw new Error(`github api ${repo} -> HTTP ${res.status}`)
  const json = (await res.json()) as { sha: string; commit: { committer: { date: string } } }
  return { sha: json.sha, date: json.commit.committer.date }
}

function writeJson(path: string, value: unknown): number {
  const text = JSON.stringify(value)
  writeFileSync(path, text)
  return gzipSync(text).length
}

function summarize(series: DailySeries) {
  return {
    dates: series.dates.length,
    firstDate: series.dates[0],
    lastDate: series.dates[series.dates.length - 1],
    regions: Object.keys(series.series).length,
  }
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

  const [confirmedCsv, deathsCsv, wcotaCsv, jhuHead, wcotaHead] = await Promise.all([
    fetchText(SOURCES.jhuConfirmed),
    fetchText(SOURCES.jhuDeaths),
    fetchText(SOURCES.wcotaStates),
    headSha(JHU_REPO),
    headSha(WCOTA_REPO),
  ])

  const confirmedRows = parseCsv(confirmedCsv)
  const deathsRows = parseCsv(deathsCsv)
  const wcotaRows = parseCsv(wcotaCsv)

  const world = aggregateJhu(confirmedRows, deathsRows)
  const brazil = aggregateWcota(wcotaRows)

  const worldGz = writeJson(`${OUT_DIR}/world.json`, world)
  const brazilGz = writeJson(`${OUT_DIR}/brazil.json`, brazil)

  const provenance = {
    fetchedAt: new Date().toISOString(),
    world: {
      source: 'Johns Hopkins CSSE COVID-19 Data Repository',
      repo: `https://github.com/${JHU_REPO}`,
      files: [SOURCES.jhuConfirmed, SOURCES.jhuDeaths],
      commit: jhuHead.sha,
      commitDate: jhuHead.date,
      rawRows: { confirmed: confirmedRows.length - 1, deaths: deathsRows.length - 1 },
      excludedRegions: JHU_EXCLUDED_REGIONS,
      aggregation: 'Province/State rows summed into Country/Region; daily new = diff of cumulative',
      ...summarize(world),
      gzipBytes: worldGz,
    },
    brazil: {
      source: 'wcota/covid19br, cases-brazil-states.csv',
      repo: `https://github.com/${WCOTA_REPO}`,
      files: [SOURCES.wcotaStates],
      commit: wcotaHead.sha,
      commitDate: wcotaHead.date,
      rawRows: wcotaRows.length - 1,
      aggregation: 'rows with city == TOTAL and state != TOTAL; totalCases and deaths columns carried forward over missing dates; daily new = diff of cumulative',
      ...summarize(brazil),
      gzipBytes: brazilGz,
    },
  }
  writeFileSync(`${OUT_DIR}/PROVENANCE.json`, JSON.stringify(provenance, null, 2) + '\n')
  console.log(JSON.stringify(provenance, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
