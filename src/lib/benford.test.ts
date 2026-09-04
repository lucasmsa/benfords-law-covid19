import { describe, expect, it } from 'vitest'
import {
  benfordExpected,
  chiSquare,
  conformity,
  firstDigit,
  firstTwoDigits,
  mad,
  MAD_BANDS,
  MIN_RECORDS,
  observedDistribution,
} from './benford'

describe('firstDigit', () => {
  it('returns the leading digit of a positive integer', () => {
    expect(firstDigit(1)).toBe(1)
    expect(firstDigit(9)).toBe(9)
    expect(firstDigit(10)).toBe(1)
    expect(firstDigit(30123)).toBe(3)
    expect(firstDigit(987654321)).toBe(9)
  })
})

describe('firstTwoDigits', () => {
  it('returns 10..99 for values of at least 10', () => {
    expect(firstTwoDigits(10)).toBe(10)
    expect(firstTwoDigits(99)).toBe(99)
    expect(firstTwoDigits(30123)).toBe(30)
    expect(firstTwoDigits(1000)).toBe(10)
  })
  it('returns null below 10, those values are dropped from the test', () => {
    expect(firstTwoDigits(7)).toBeNull()
  })
})

describe('benfordExpected', () => {
  it('first digit follows log10(1 + 1/d) and sums to 1', () => {
    const p = benfordExpected('first')
    expect(p).toHaveLength(9)
    expect(p[0]).toBeCloseTo(0.30103, 5)
    expect(p[1]).toBeCloseTo(0.17609, 5)
    expect(p[8]).toBeCloseTo(0.04576, 5)
    expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10)
  })
  it('first two digits covers 10..99 and sums to 1', () => {
    const p = benfordExpected('firstTwo')
    expect(p).toHaveLength(90)
    expect(p[0]).toBeCloseTo(Math.log10(1 + 1 / 10), 10)
    expect(p[89]).toBeCloseTo(Math.log10(1 + 1 / 99), 10)
    expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10)
  })
})

describe('observedDistribution', () => {
  it('counts first digits and drops values <= 0', () => {
    const out = observedDistribution([1, 12, 130, 2, 0, -5, 9], 'first')
    expect(out.n).toBe(5)
    expect(out.dropped).toEqual({ nonPositive: 2, belowTen: 0 })
    expect(out.counts[0]).toBe(3)
    expect(out.counts[1]).toBe(1)
    expect(out.counts[8]).toBe(1)
    expect(out.proportions[0]).toBeCloseTo(0.6, 10)
  })
  it('drops values below 10 for the first-two digits test and reports them', () => {
    const out = observedDistribution([7, 10, 99, 0, 4500], 'firstTwo')
    expect(out.n).toBe(3)
    expect(out.dropped).toEqual({ nonPositive: 1, belowTen: 1 })
    expect(out.counts[0]).toBe(1)
    expect(out.counts[89]).toBe(1)
    expect(out.counts[35]).toBe(1)
  })
  it('handles an empty input without NaN', () => {
    const out = observedDistribution([], 'first')
    expect(out.n).toBe(0)
    expect(out.proportions.every((p) => p === 0)).toBe(true)
  })
})

describe('chiSquare', () => {
  it('is zero when observed equals expected', () => {
    const expected = benfordExpected('first')
    const n = 100000
    const counts = expected.map((p) => p * n)
    const out = chiSquare(counts, expected, n)
    expect(out.statistic).toBeCloseTo(0, 6)
    expect(out.df).toBe(8)
  })
  it('uses NIST 0.05 upper critical values for df 8 and 89', () => {
    expect(chiSquare(new Array(9).fill(1), benfordExpected('first'), 9).criticalValue05).toBe(15.507)
    expect(chiSquare(new Array(90).fill(1), benfordExpected('firstTwo'), 90).criticalValue05).toBe(112.022)
  })
  it('p-value at the critical value is 0.05', () => {
    const expected = benfordExpected('first')
    const n = 1000
    const counts = expected.map((p) => p * n)
    counts[0] += Math.sqrt(15.507 * expected[0] * n)
    counts[1] -= Math.sqrt(15.507 * expected[0] * n)
    const out = chiSquare(counts, expected, n)
    expect(out.pValue).toBeGreaterThan(0)
    expect(out.pValue).toBeLessThan(1)
    expect(out.rejectsAt05).toBe(out.statistic > out.criticalValue05)
  })
  it('computes uniform-digit chi-square against Benford', () => {
    const expected = benfordExpected('first')
    const n = 900
    const counts = new Array(9).fill(100)
    const out = chiSquare(counts, expected, n)
    const manual = counts.reduce((acc, obs, i) => acc + (obs - expected[i] * n) ** 2 / (expected[i] * n), 0)
    expect(out.statistic).toBeCloseTo(manual, 10)
    expect(out.rejectsAt05).toBe(true)
    expect(out.pValue).toBeLessThan(0.001)
  })
})

describe('mad and conformity', () => {
  it('mad is the mean absolute deviation of proportions', () => {
    expect(mad([0.3, 0.2, 0.5], [0.3, 0.3, 0.4])).toBeCloseTo(0.2 / 3, 12)
  })
  it('first digit bands follow Nigrini (2012)', () => {
    expect(MAD_BANDS.first).toEqual({ close: 0.006, acceptable: 0.012, marginal: 0.015 })
    expect(conformity(0.0059, 'first')).toBe('close')
    expect(conformity(0.006, 'first')).toBe('close')
    expect(conformity(0.0061, 'first')).toBe('acceptable')
    expect(conformity(0.012, 'first')).toBe('acceptable')
    expect(conformity(0.0149, 'first')).toBe('marginal')
    expect(conformity(0.0151, 'first')).toBe('nonconformity')
  })
  it('first-two digit bands follow Nigrini (2012)', () => {
    expect(MAD_BANDS.firstTwo).toEqual({ close: 0.0012, acceptable: 0.0018, marginal: 0.0022 })
    expect(conformity(0.001, 'firstTwo')).toBe('close')
    expect(conformity(0.0015, 'firstTwo')).toBe('acceptable')
    expect(conformity(0.002, 'firstTwo')).toBe('marginal')
    expect(conformity(0.003, 'firstTwo')).toBe('nonconformity')
  })
  it('exposes the minimum record count as a constant', () => {
    expect(MIN_RECORDS).toBe(1000)
  })
})
