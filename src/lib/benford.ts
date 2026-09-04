export type DigitTest = 'first' | 'firstTwo'

export type Conformity = 'close' | 'acceptable' | 'marginal' | 'nonconformity'

export interface DroppedCounts {
  nonPositive: number
  belowTen: number
}

export interface ObservedDistribution {
  test: DigitTest
  n: number
  counts: number[]
  proportions: number[]
  dropped: DroppedCounts
}

export interface ChiSquareResult {
  statistic: number
  df: number
  criticalValue05: number
  pValue: number
  rejectsAt05: boolean
}

export interface MadBands {
  close: number
  acceptable: number
  marginal: number
}

/**
 * First digit: Nigrini (2012) as reprinted by Carmo et al. (2021) and Shen (2024).
 * First two digits: Drake and Nigrini (2000) as reprinted by Nugroho (2022).
 */
export const MAD_BANDS: Record<DigitTest, MadBands> = {
  first: { close: 0.006, acceptable: 0.012, marginal: 0.015 },
  firstTwo: { close: 0.0012, acceptable: 0.0018, marginal: 0.0022 },
}

/** Nigrini's recommended minimum record count for the first-two digits test. */
export const MIN_RECORDS = 1000

/** NIST/SEMATECH e-Handbook, section 1.3.6.7.4, upper 0.05 critical values. */
export const CHI_SQUARE_CRITICAL_05: Record<number, number> = {
  8: 15.507,
  89: 112.022,
}

const BIN_COUNT: Record<DigitTest, number> = { first: 9, firstTwo: 90 }
const FIRST_BIN: Record<DigitTest, number> = { first: 1, firstTwo: 10 }

export function firstDigit(value: number): number {
  return Number(String(Math.trunc(Math.abs(value)))[0])
}

export function firstTwoDigits(value: number): number | null {
  const magnitude = Math.trunc(Math.abs(value))
  if (magnitude < 10) return null
  return Number(String(magnitude).slice(0, 2))
}

export function benfordExpected(test: DigitTest): number[] {
  const first = FIRST_BIN[test]
  return Array.from({ length: BIN_COUNT[test] }, (_, i) => Math.log10(1 + 1 / (first + i)))
}

function digitBin(value: number, test: DigitTest): number | null {
  if (test === 'first') return firstDigit(value) - 1
  const digits = firstTwoDigits(value)
  return digits === null ? null : digits - 10
}

export function observedDistribution(values: readonly number[], test: DigitTest): ObservedDistribution {
  const counts = new Array<number>(BIN_COUNT[test]).fill(0)
  const dropped: DroppedCounts = { nonPositive: 0, belowTen: 0 }
  let n = 0
  for (const value of values) {
    if (!(value > 0)) {
      dropped.nonPositive++
      continue
    }
    const bin = digitBin(value, test)
    if (bin === null) {
      dropped.belowTen++
      continue
    }
    counts[bin]++
    n++
  }
  const proportions = counts.map((c) => (n === 0 ? 0 : c / n))
  return { test, n, counts, proportions, dropped }
}

export function chiSquare(counts: readonly number[], expected: readonly number[], n: number): ChiSquareResult {
  const df = counts.length - 1
  let statistic = 0
  for (let i = 0; i < counts.length; i++) {
    const expectedCount = expected[i] * n
    if (expectedCount > 0) statistic += (counts[i] - expectedCount) ** 2 / expectedCount
  }
  const criticalValue05 = CHI_SQUARE_CRITICAL_05[df]
  if (criticalValue05 === undefined) throw new Error(`no tabled critical value for df ${df}`)
  return {
    statistic,
    df,
    criticalValue05,
    pValue: chiSquareUpperTail(statistic, df),
    rejectsAt05: statistic > criticalValue05,
  }
}

export function mad(observed: readonly number[], expected: readonly number[]): number {
  let total = 0
  for (let i = 0; i < observed.length; i++) total += Math.abs(observed[i] - expected[i])
  return total / observed.length
}

export function conformity(madValue: number, test: DigitTest): Conformity {
  const bands = MAD_BANDS[test]
  if (madValue <= bands.close) return 'close'
  if (madValue <= bands.acceptable) return 'acceptable'
  if (madValue <= bands.marginal) return 'marginal'
  return 'nonconformity'
}

/** Upper tail of the chi-square distribution: Q(df/2, x/2) via the regularized incomplete gamma function. */
export function chiSquareUpperTail(x: number, df: number): number {
  if (x <= 0) return 1
  return regularizedGammaQ(df / 2, x / 2)
}

const LANCZOS = [
  76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2,
  -0.5395239384953e-5,
]

function logGamma(z: number): number {
  let x = z
  let y = z
  let tmp = x + 5.5
  tmp -= (x + 0.5) * Math.log(tmp)
  let series = 1.000000000190015
  for (const coefficient of LANCZOS) {
    y += 1
    series += coefficient / y
  }
  return -tmp + Math.log((2.5066282746310005 * series) / x)
}

function gammaSeriesP(a: number, x: number): number {
  let ap = a
  let sum = 1 / a
  let term = sum
  for (let i = 0; i < 1000; i++) {
    ap += 1
    term *= x / ap
    sum += term
    if (Math.abs(term) < Math.abs(sum) * 1e-15) break
  }
  return sum * Math.exp(-x + a * Math.log(x) - logGamma(a))
}

function gammaContinuedFractionQ(a: number, x: number): number {
  const tiny = 1e-300
  let b = x + 1 - a
  let c = 1 / tiny
  let d = 1 / b
  let h = d
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a)
    b += 2
    d = an * d + b
    if (Math.abs(d) < tiny) d = tiny
    c = b + an / c
    if (Math.abs(c) < tiny) c = tiny
    d = 1 / d
    const delta = d * c
    h *= delta
    if (Math.abs(delta - 1) < 1e-15) break
  }
  return Math.exp(-x + a * Math.log(x) - logGamma(a)) * h
}

function regularizedGammaQ(a: number, x: number): number {
  if (x < a + 1) return 1 - gammaSeriesP(a, x)
  return gammaContinuedFractionQ(a, x)
}
