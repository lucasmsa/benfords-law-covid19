import { conformityLabel, conformityTone } from '../config/labels'
import type { Analysis } from '../lib/analysis'
import { MAD_BANDS, MIN_RECORDS, type DigitTest } from '../lib/benford'
import { formatInt, formatMad, formatP, formatStat } from '../lib/format'

interface Props {
  analysis: Analysis
  test: DigitTest
}

export default function FitPanel({ analysis, test }: Props) {
  const { distribution, chi, mad, conformity, smallSample } = analysis
  const bands = MAD_BANDS[test]
  const tone = conformityTone[conformity]

  return (
    <aside className="card" aria-label="Fit statistics">
      <h2 className="card__title">How close is it?</h2>
      <p className="card__subtitle">Two ways to measure the gap between the bars and the dashed line.</p>
      <div className="fit">
        <div className="fit__row">
          <span className="fit__label">Numbers tested</span>
          <span className="fit__value" data-testid="fit-n">
            {formatInt(distribution.n)}
          </span>
          <p className="fit__note" data-testid="fit-dropped">
            {formatInt(distribution.dropped.nonPositive)} dropped for being zero or negative
            {test === 'firstTwo' && <>, {formatInt(distribution.dropped.belowTen)} dropped for being below 10</>}.
          </p>
        </div>

        <div className="fit__row">
          <span className="fit__label">Chi-square, {chi.df} degrees of freedom</span>
          <span className="fit__value">
            <span data-testid="fit-chi">{formatStat(chi.statistic)}</span>
            <small>
              vs <span data-testid="fit-critical">{chi.criticalValue05}</span> at 5%
            </small>
          </span>
          <p className="fit__note">
            p-value <span data-testid="fit-p">{formatP(chi.pValue)}</span>.{' '}
            {chi.rejectsAt05
              ? 'Above the critical value, so the digits differ from Benford more than chance alone would explain.'
              : 'Below the critical value, so chance alone could explain the gap.'}{' '}
            This statistic grows with the number of values, so with hundreds of thousands of numbers even a small
            percentage gap crosses the line.
          </p>
        </div>

        <div className="fit__row">
          <span className="fit__label">Mean absolute deviation</span>
          <span className="fit__value" data-testid="fit-mad">
            {formatMad(mad)}
          </span>
          <span className={`fit__verdict fit__verdict--${tone}`} data-testid="fit-band">
            {conformityLabel[conformity]}
          </span>
          <p className="fit__note">
            Average gap between observed and expected shares, as a fraction. Does not grow with sample size. Nigrini's
            bands for this test: close up to {bands.close}, acceptable up to {bands.acceptable}, marginal up to{' '}
            {bands.marginal}, nonconformity above that.
          </p>
        </div>

        {smallSample && (
          <p className="fit__flag" data-testid="fit-small-sample">
            Only {formatInt(distribution.n)} numbers. Nigrini recommends at least {formatInt(MIN_RECORDS)} records
            before reading conformity bands, so treat both statistics as a sketch, not a verdict.
          </p>
        )}
      </div>
    </aside>
  )
}
