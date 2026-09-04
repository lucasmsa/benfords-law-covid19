export const formatInt = (value: number): string => value.toLocaleString('en-US')

export const formatPercent = (value: number, digits = 1): string => `${value.toFixed(digits)}%`

export const formatStat = (value: number): string => value.toFixed(2)

export const formatMad = (value: number): string => value.toFixed(4)

export const formatP = (value: number): string => (value < 0.001 ? '< 0.001' : value.toFixed(3))

export const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
