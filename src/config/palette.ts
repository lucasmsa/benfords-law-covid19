export const palette = {
  sage: '#588166',
  sageLight: '#a5bbad',
  sageDeep: '#37515a',
  plum: '#5e2a41',
  cream: '#fbf3e7',
  ink: '#1b2a22',
  inkMuted: '#4a5a50',
} as const

export const cssVariables: Record<string, string> = Object.fromEntries(
  Object.entries(palette).map(([name, value]) => [`--${name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`, value]),
)
