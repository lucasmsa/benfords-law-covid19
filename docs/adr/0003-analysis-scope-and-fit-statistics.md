# 3. Daily series, two digit tests, chi-square and MAD with conformity bands

Date: 2026-09-04

## Status

Accepted

## Decision

- Every analysis runs on a list of positive integers chosen by six controls:
  Area (World, Brazil), Sample (every region every day, regions summed per
  day, one region per day, one value per region on the last day of the window),
  Metric (cases, deaths),
  Series (daily new, cumulative), Digits (first, first two), and a date window.
- Cleaning: values `<= 0` are dropped and counted (source corrections show up
  as negative daily values). For the first-two-digits test, values below 10 are
  also dropped and counted separately. Both counts are printed under the
  sample size.
- Expected shares are `log10(1 + 1/d)` for `d` in 1..9 or 10..99.
- Chi-square with `df = 8` or `df = 89`. The 0.05 upper critical values are
  15.507 and 112.022, taken from the NIST/SEMATECH e-Handbook, section
  1.3.6.7.4. The p-value is computed from the regularized incomplete gamma
  function and unit-tested to hit 0.05 at the tabled critical values.
- Mean absolute deviation (MAD) of observed minus expected shares, with
  conformity bands:

  | Band | First digit | First two digits |
  |---|---|---|
  | Close conformity | 0 to 0.006 | 0 to 0.0012 |
  | Acceptable conformity | 0.006 to 0.012 | 0.0012 to 0.0018 |
  | Marginally acceptable | 0.012 to 0.015 | 0.0018 to 0.0022 |
  | Nonconformity | above 0.015 | above 0.0022 |

- A small-sample flag when fewer than 1,000 numbers are tested.
- The one-value-per-region sample is kept because it is what the 2021 app
  computed (first digit of about 190 country totals, or 27 state totals). It is
  the case that trips the flag.

## Context

Sources fetched and read on 2026-09-04:

- First-digit bands: Nigrini (2012), *Benford's Law*, as reprinted in Carmo,
  Caneppele and Nunes (2021), Rev. Bras. Biom. 39(4), Table 2,
  doi:10.28951/rbb.v39i4.535, and in Shen (2024), *Leading Digit Distributions
  of User Engagement Metrics of Trending Scratch Projects*, zenodo record
  10648437 ("0-0.006 for close conformity, 0.006-0.012 for acceptable
  conformity, 0.012-0.015 for marginally acceptable conformity, and > 0.015 for
  nonconformity").
- First-two-digit bands: Drake and Nigrini (2000), as reprinted in Nugroho
  (2022), JEMASI 18(1), Table 2, doi:10.35449/jemasi.v18i1.522 ("0.0000 to
  0.0012 Close, 0.0012 to 0.0018 Acceptable, 0.0018 to 0.0022 Marginally
  Acceptable, Above 0.0022 Nonconformity"). Carmo et al. (2021) print the same
  row as 0.012 / 0.018 / 0.022, ten times larger; with 90 bins the smaller
  thresholds are the ones consistent with the first-digit row, so the Nugroho
  reprint is used.
- Minimum records: Isakovič-Kaplan, Demirovič and Proho (2021), Croatian
  Economic Survey 23(1), doi:10.15179/ces.23.1.2, citing Nigrini: "The
  recommendation is a sample of a minimum of 1,000 records." The paper cites
  Nigrini (2011); the threshold is applied here to both digit tests as a rule
  of thumb.
- Chi-square critical values: NIST/SEMATECH e-Handbook of Statistical Methods,
  1.3.6.7.4, rows for 8 and 89 degrees of freedom at 0.95.

Why "every region, every day" on the daily series is the default: the 2021 app
tested about 190 cumulative country totals on one day, which is under the
1,000-record recommendation and uses bounded totals whose first digit changes
slowly. Daily new counts give 1,143 values for one country and 225,171
country-days for the world (80,967 of them zero or negative, dropped), and
span several orders of magnitude. Summing regions into one world series is
kept as its own mode because it answers a different question: one epidemic
curve, 1,143 numbers.

Why both statistics: chi-square scales with `n`, so at pooled-world sizes it
rejects on gaps of a fraction of a percentage point. MAD does not depend on
`n`, which is what the conformity bands are for. The panel shows both and says
so.

## Consequences

- `src/lib/benford.ts` exposes the bands, the minimum, and the critical values
  as named constants; the explainer renders from them, so no number is typed
  twice.
- The p-value implementation (Lanczos log-gamma, series and continued
  fraction) is about 60 lines and avoids a numeric dependency.
- The explainer states that a nonconformity label describes digits and is not
  evidence of fraud or misreporting.
