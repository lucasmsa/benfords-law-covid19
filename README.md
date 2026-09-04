# Benford's law × Covid-19 🦩

> Does the first digit of coronavirus counts follow Benford's law? A static page over a committed snapshot of the pandemic: 197 countries and 27 Brazilian states, daily and cumulative series, first and first-two digit tests, chi-square and MAD with Nigrini's conformity bands, and a plain-language explainer next to the chart.

<p align="center">
  <img width="80%" src="docs/screenshot.png" alt="Sage green page with a large condensed headline, controls, a bar chart of observed first-digit shares against Benford's dashed curve, and a fit panel">
</p>

## What it does 🗿

Pick six things and the page recomputes in the browser:

| Control | Options |
|---|---|
| Area | World, Brazil |
| Sample | every region every day, regions summed per day, one region per day, one value per region on the last day |
| Metric | cases, deaths |
| Series | daily new, cumulative |
| Digits | first, first two |
| Window | any date range inside the snapshot |

The fit panel shows the number of values tested, how many were dropped (zero or negative, and below 10 for the first-two test), chi-square against the 0.05 critical value with its p-value, and the mean absolute deviation with its conformity band. Below 1,000 values it says so.

Some readings from the committed snapshot, full window, daily cases, first digit:

| Sample | n | MAD | Band | Share of 1s (Benford: 30.1%) |
|---|---|---|---|---|
| World, every country every day | 144,204 | 0.0018 | close conformity | 30.8% |
| Brazil, every state every day | 26,749 | 0.0022 | close conformity | 31.0% |
| World, one cumulative total per country (the 2021 method) | 197 | 0.0081 | acceptable | 30.5% |
| Brazil, one cumulative total per state (the 2021 method) | 27 | 0.0417 | nonconformity | 33.3% |

Chi-square rejects the first row (44.5 against 15.507) while MAD calls it close conformity. That gap is the point of showing both: chi-square scales with the sample size, MAD does not.

## Data and provenance 🚝

No runtime API. `pnpm data:fetch` downloads the sources, reduces them and writes `public/data/`:

| File | Source | Coverage | Gzipped |
|---|---|---|---|
| `world.json` | [Johns Hopkins CSSE](https://github.com/CSSEGISandData/COVID-19), confirmed and deaths global CSVs, commit `4360e50` | 197 countries, 2020-01-22 to 2023-03-09 | 392,600 bytes |
| `brazil.json` | [wcota/covid19br](https://github.com/wcota/covid19br), `cases-brazil-states.csv`, commit `3fc4c21` | 27 states, 2020-02-25 to 2023-03-18 | 77,712 bytes |
| `PROVENANCE.json` | written by the script | URLs, commit SHAs, row counts, ranges, sizes | |

Files store daily new values as integer arrays over a shared date index; cumulative totals are prefix sums rebuilt in the browser. JHU provinces are summed into their country and the four cruise-ship and Olympics rows are excluded. Corrections in the sources appear as negative daily values; they stay in the files and are dropped, and counted, at analysis time.

The 2021 version called `api.covid19api.com` (gone) and `covid19-brazil-api.now.sh` (frozen at 2023-08-11). Details in [ADR 0001](docs/adr/0001-static-snapshot-over-live-fetch.md).

## Method ⚒

- Expected share of leading digit `d`: `log10(1 + 1/d)`, for 1..9 or 10..99.
- Chi-square with 8 or 89 degrees of freedom; 0.05 critical values 15.507 and 112.022 from the [NIST e-Handbook](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3674.htm); p-value from the regularized incomplete gamma function.
- MAD bands: first digit 0.006 / 0.012 / 0.015 (Nigrini 2012, as reprinted in [Carmo, Caneppele and Nunes 2021](https://doi.org/10.28951/rbb.v39i4.535) and Shen 2024); first two digits 0.0012 / 0.0018 / 0.0022 (Drake and Nigrini 2000, as reprinted in [Nugroho 2022](https://doi.org/10.35449/jemasi.v18i1.522)).
- Minimum of 1,000 records before reading the bands, Nigrini's recommendation as reprinted in [Isakovič-Kaplan, Demirovič and Proho 2021](https://doi.org/10.15179/ces.23.1.2).

The statistics live in `src/lib/benford.ts` with unit tests; the on-screen explainer renders every threshold from the same constants. [ADR 0003](docs/adr/0003-analysis-scope-and-fit-statistics.md) has the sources and the reasoning.

## Run it 🧩

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm test         # vitest, lib and reduce script
pnpm test:e2e     # playwright, builds and serves the bundle first
pnpm data:fetch   # refresh public/data from the sources
```

Stack: Vite 7, React 19, TypeScript 5.9, Recharts 2.15, Vitest 3, Playwright 1.62, pnpm. Components render only; state lives in `src/hooks`, math in `src/lib`, copy and options in `src/config`. See [ADR 0002](docs/adr/0002-vite-react19-recharts2.md) and [ADR 0004](docs/adr/0004-visual-identity-and-type-scale.md).

## Deploy 🎨

Static build, no server, no environment variables.

```sh
pnpm build        # dist/
```

Vercel from the personal account: import the repo, framework preset Vite, build command `pnpm build`, output `dist`. Proposed domain: `benford.lucasmsa.com`, added under the project's Domains tab with a CNAME on `lucasmsa.com`. No rewrites are needed because the page has a single route.
