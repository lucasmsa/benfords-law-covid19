import {
  benfordExpected,
  chiSquare,
  conformity,
  mad,
  MIN_RECORDS,
  observedDistribution,
  type ChiSquareResult,
  type Conformity,
  type DigitTest,
  type ObservedDistribution,
} from './benford'

export interface ChartRow {
  digit: string
  observed: number
  expected: number
}

export interface Analysis {
  distribution: ObservedDistribution
  expected: number[]
  chi: ChiSquareResult
  mad: number
  conformity: Conformity
  smallSample: boolean
  rows: ChartRow[]
}

export function analyze(values: readonly number[], test: DigitTest): Analysis {
  const distribution = observedDistribution(values, test)
  const expected = benfordExpected(test)
  const chi = chiSquare(distribution.counts, expected, distribution.n)
  const madValue = mad(distribution.proportions, expected)
  const firstBin = test === 'first' ? 1 : 10
  const rows = expected.map((p, i) => ({
    digit: String(firstBin + i),
    observed: distribution.proportions[i] * 100,
    expected: p * 100,
  }))
  return {
    distribution,
    expected,
    chi,
    mad: madValue,
    conformity: conformity(madValue, test),
    smallSample: distribution.n < MIN_RECORDS,
    rows,
  }
}
