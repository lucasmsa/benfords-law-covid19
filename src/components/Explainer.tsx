import { citations } from '../config/sources'
import type { Provenance } from '../hooks/useDataset'
import { benfordExpected, CHI_SQUARE_CRITICAL_05, MAD_BANDS, MIN_RECORDS } from '../lib/benford'
import { formatDate, formatInt, formatPercent } from '../lib/format'

interface Props {
  provenance: Provenance
}

export default function Explainer({ provenance }: Props) {
  const first = benfordExpected('first')
  const { world, brazil } = provenance

  return (
    <section className="card" aria-labelledby="explainer-title">
      <h2 id="explainer-title" className="card__title">
        What you are looking at
      </h2>
      <div className="explainer" style={{ marginTop: 20 }}>
        <div className="explainer__block">
          <h3>The law</h3>
          <p>
            Take a big list of numbers from the real world and look only at the first digit of each one. You might
            expect every digit from 1 to 9 to show up about equally, one ninth of the time. Benford's law says
            otherwise: the share of numbers starting with digit <code>d</code> is <code>log10(1 + 1/d)</code>. That
            gives {formatPercent(first[0] * 100)} for 1, {formatPercent(first[1] * 100)} for 2, down to{' '}
            {formatPercent(first[8] * 100)} for 9.
          </p>
          <p>
            The first-two-digits version does the same for the pairs 10 through 99, so it has 90 bars instead of 9
            and needs more numbers to fill them.
          </p>
        </div>

        <div className="explainer__block">
          <h3>Why counts like these should follow it</h3>
          <p>
            The law shows up in data that spreads across several orders of magnitude and that grows by multiplying
            rather than adding. Daily case counts fit both descriptions: within one country they ran from a handful to
            hundreds of thousands, and an epidemic grows roughly by a constant factor per day while it is unchecked.
            The first digit then spends longer on 1 than on 9 because getting from 1,000 to 2,000 takes a doubling
            and getting from 9,000 to 10,000 takes an 11% rise.
          </p>
        </div>

        <div className="explainer__block">
          <h3>What breaks it here</h3>
          <p>
            Cumulative totals are the weaker test. Once a total sits at, say, 34 million, its first digit stays a 3
            for months, so consecutive days are not independent draws and one digit piles up.
          </p>
          <p>
            The one-value-per-region sample is the 2021 version of this project: {formatInt(world.regions)} country
            totals or {formatInt(brazil.regions)} state totals on a single date. Below {formatInt(MIN_RECORDS)}{' '}
            numbers the bars are jumpy and the panel flags it.
          </p>
          <p>
            Reporting habits shape digits too. Weekend batching, backlog dumps and later corrections (which appear
            as negative daily values and are dropped) all leave marks that have nothing to do with the epidemic.
          </p>
        </div>

        <div className="explainer__block">
          <h3>Reading the fit panel</h3>
          <p>
            <strong>Chi-square</strong> compares the observed count in every bar with the count Benford predicts. Its
            0.05 critical values, {CHI_SQUARE_CRITICAL_05[8]} for 9 bars and {CHI_SQUARE_CRITICAL_05[89]} for 90, come from the NIST
            handbook. Because the statistic scales with the number of values, a huge sample
            fails the test on differences a human would call tiny.
          </p>
          <p>
            <strong>Mean absolute deviation</strong> (MAD) is the average gap between observed and expected shares.
            It does not depend on sample size, which is why Nigrini proposes fixed conformity bands for it:
          </p>
          <table className="explainer__bands">
            <thead>
              <tr>
                <th>Band</th>
                <th>First digit</th>
                <th>First two digits</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Close conformity</td>
                <td>0 to {MAD_BANDS.first.close}</td>
                <td>0 to {MAD_BANDS.firstTwo.close}</td>
              </tr>
              <tr>
                <td>Acceptable conformity</td>
                <td>
                  {MAD_BANDS.first.close} to {MAD_BANDS.first.acceptable}
                </td>
                <td>
                  {MAD_BANDS.firstTwo.close} to {MAD_BANDS.firstTwo.acceptable}
                </td>
              </tr>
              <tr>
                <td>Marginally acceptable</td>
                <td>
                  {MAD_BANDS.first.acceptable} to {MAD_BANDS.first.marginal}
                </td>
                <td>
                  {MAD_BANDS.firstTwo.acceptable} to {MAD_BANDS.firstTwo.marginal}
                </td>
              </tr>
              <tr>
                <td>Nonconformity</td>
                <td>above {MAD_BANDS.first.marginal}</td>
                <td>above {MAD_BANDS.firstTwo.marginal}</td>
              </tr>
            </tbody>
          </table>
          <p>
            A nonconformity label is a description of digits, not evidence of fraud or misreporting. Plenty of honest
            series fail Benford for the reasons in the previous block.
          </p>
        </div>

        <div className="explainer__block">
          <h3>The data</h3>
          <p>
            World: {formatInt(world.regions)} countries, {formatInt(world.dates)} days from{' '}
            {formatDate(world.firstDate)} to {formatDate(world.lastDate)}, from the{' '}
            <a href={citations.jhu.url}>Johns Hopkins CSSE repository</a>, which stopped updating in March 2023.
            Provinces are summed into their country; the four cruise-ship and Olympics rows are excluded.
          </p>
          <p>
            Brazil: {formatInt(brazil.regions)} states, {formatInt(brazil.dates)} days from{' '}
            {formatDate(brazil.firstDate)} to {formatDate(brazil.lastDate)}, from{' '}
            <a href={citations.wcota.url}>wcota/covid19br</a>. Both snapshots are committed in this repository, so
            the page keeps working after the sources go away.
          </p>
        </div>

        <div className="explainer__block">
          <h3>Sources</h3>
          <p>
            First-digit bands: {citations.nigrini2012.label}, as reprinted in{' '}
            <a href={citations.carmo2021.url}>Carmo, Caneppele and Nunes (2021)</a> and{' '}
            <a href={citations.shen2024.url}>Shen (2024)</a>. First-two-digit bands: {citations.drakeNigrini2000.label},
            as reprinted in <a href={citations.nugroho2022.url}>Nugroho (2022)</a>. Minimum record count:{' '}
            <a href={citations.isakovic2021.url}>Isakovič-Kaplan, Demirovič and Proho (2021)</a>, citing Nigrini.
            Chi-square critical values: <a href={citations.nist.url}>{citations.nist.label}</a>. Background:{' '}
            <a href={citations.wikipedia.url}>{citations.wikipedia.label}</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
