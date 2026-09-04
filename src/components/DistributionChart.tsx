import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { regionNoun, sampleOptions } from '../config/options'
import { palette } from '../config/palette'
import type { Controls } from '../hooks/useControls'
import type { Analysis } from '../lib/analysis'
import { formatDate, formatPercent } from '../lib/format'

interface Props {
  analysis: Analysis
  controls: Controls
  dates: string[]
}

function describe(controls: Controls, dates: string[]): string {
  const sample = sampleOptions.find((option) => option.value === controls.sample)?.label ?? ''
  const where =
    controls.sample === 'region'
      ? controls.region
      : controls.area === 'world'
        ? `all ${regionNoun.world.plural}`
        : `all Brazilian ${regionNoun.brazil.plural}`
  const range = `${formatDate(dates[controls.window.start])} to ${formatDate(dates[controls.window.end])}`
  return `${sample.toLowerCase()}, ${where}, ${controls.kind} ${controls.metric}, ${range}`
}

export default function DistributionChart({ analysis, controls, dates }: Props) {
  const isFirstTwo = controls.test === 'firstTwo'

  return (
    <article className="card">
      <h2 className="card__title">{isFirstTwo ? 'First two digits' : 'First digit'}</h2>
      <p className="card__subtitle">{describe(controls, dates)}</p>
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={analysis.rows} margin={{ top: 12, right: 8, bottom: 8, left: -8 }}>
            <CartesianGrid vertical={false} stroke="rgba(27, 42, 34, 0.12)" />
            <XAxis
              dataKey="digit"
              interval={isFirstTwo ? 9 : 0}
              tick={{ fill: palette.ink, fontSize: 14 }}
              axisLine={{ stroke: palette.inkMuted }}
              tickLine={false}
            />
            <YAxis
              unit="%"
              tick={{ fill: palette.inkMuted, fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip
              formatter={(value: number, name: string) => [formatPercent(value, 2), name === 'observed' ? 'Observed' : 'Benford']}
              labelFormatter={(digit) => `Leading ${isFirstTwo ? 'digits' : 'digit'} ${digit}`}
              contentStyle={{ background: palette.cream, border: `1px solid ${palette.sageLight}`, borderRadius: 10, color: palette.ink }}
              cursor={{ fill: 'rgba(94, 42, 65, 0.08)' }}
            />
            <Bar dataKey="observed" fill={palette.plum} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            <Line
              type="monotone"
              dataKey="expected"
              stroke={palette.sageDeep}
              strokeWidth={3}
              strokeDasharray="7 5"
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="chart__legend">
        <span style={{ '--swatch': palette.plum } as React.CSSProperties}>Observed share of numbers</span>
        <span style={{ '--swatch': palette.sageDeep } as React.CSSProperties}>Benford's expected share</span>
      </div>
    </article>
  )
}
