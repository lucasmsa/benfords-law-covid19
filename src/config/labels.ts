import type { Conformity } from '../lib/benford'

export const conformityLabel: Record<Conformity, string> = {
  close: 'Close conformity',
  acceptable: 'Acceptable conformity',
  marginal: 'Marginally acceptable',
  nonconformity: 'Nonconformity',
}

export const conformityTone: Record<Conformity, 'deep' | 'light' | 'plum'> = {
  close: 'deep',
  acceptable: 'deep',
  marginal: 'light',
  nonconformity: 'plum',
}

export const sampleHint = {
  all: 'One number per region per day in the window. The largest sample, and the one Benford is meant for.',
  pooled: 'Every region summed into one number per day in the window.',
  region: 'One region, one number per day in the window.',
  snapshot: 'One number per region, taken on the last day of the window. This is what the 2021 version tested.',
} as const

export const kindHint = {
  daily: 'New counts reported each day.',
  cumulative: 'Running totals. Bounded and slow to change leading digit, so a weaker Benford candidate.',
} as const
