# 1. A committed data snapshot replaces the two dead APIs

Date: 2026-09-04

## Status

Accepted

## Decision

- `scripts/fetch-data.ts` downloads the Johns Hopkins CSSE global confirmed and
  deaths time series and the `wcota/covid19br` state series, reduces them, and
  writes `public/data/world.json`, `public/data/brazil.json` and
  `public/data/PROVENANCE.json`. The three files are committed.
- Storage format: one shared ISO date index per file plus, per country or
  state, integer arrays of daily new cases and daily new deaths. Cumulative
  totals are rebuilt in the browser by prefix sum, which reproduces the source
  cumulative columns exactly. Daily values compress better than cumulative ones
  and carry the same information.
- JHU provinces are summed into their `Country/Region`. Four non-country rows
  are excluded: Diamond Princess, MS Zaandam, Summer Olympics 2020, Winter
  Olympics 2022. Brazil keeps the 27 `city == TOTAL` state rows and drops the
  national `TOTAL` row; dates a state has no row for carry the previous
  cumulative forward.
- Negative daily values (source corrections) are kept in the files and dropped
  at analysis time, where the count of dropped values is shown on screen.
- `PROVENANCE.json` records source URLs, the upstream commit SHA and date, raw
  row counts, date ranges, region counts and gzipped sizes.

## Context

The 2021 app fetched `https://api.covid19api.com/summary` (DNS no longer
resolves) and `https://covid19-brazil-api.now.sh/api/report/v1` (answers, but
frozen at 2023-08-11). Both were checked on 2026-09-04. The deployed Netlify
build still requests the first one, so its World page renders an empty chart.

Sources checked the same day:

| Source | Status | Coverage |
|---|---|---|
| JHU CSSE global CSVs (raw.githubusercontent.com) | 200, 289 data rows each | 2020-01-22 to 2023-03-09, repo archived, last commit 2023-03-10 |
| wcota/covid19br `cases-brazil-states.csv` | 200, 30,842 rows | 2020-02-25 to 2023-03-18 |
| Our World in Data compact CSV | 200, 179 MB | per country daily, still updated |
| WHO global daily CSV | 200, 26 MB, slow | per country daily |
| disease.sh `/countries` | 200 | current totals only, no history |

The pandemic series these tests care about ended when the sources stopped
publishing. A runtime fetch adds a failure mode (the one that broke the app) and
buys no fresher data. OWID would add 179 MB of input for the same window and no
Brazilian states.

## Consequences

- Snapshot sizes: `world.json` 392,600 bytes gzipped (197 countries, 1,143
  days), `brazil.json` 77,712 bytes gzipped (27 states, 1,118 days). Total
  under 0.5 MB gzipped.
- No network call at runtime except the three static JSON files.
- Refreshing the data is `pnpm data:fetch` and a commit. Reproducibility is
  pinned by the commit SHAs in `PROVENANCE.json`.
- The reduce step has its own unit tests (`scripts/reduce.test.ts`).
