import virus from '../assets/virus_corona_coronavirus_icon_140419.png'
import { benfordExpected } from '../lib/benford'
import { formatPercent } from '../lib/format'

export default function Header() {
  const expected = benfordExpected('first')

  return (
    <header className="header">
      <h1 className="header__title">
        Benford's law
        <br />
        <em>× Covid-19</em>
      </h1>
      <img className="header__virus" src={virus} alt="" width={512} height={512} />
      <p className="header__lede">
        Benford's law says that in many real-world lists of numbers the first digit is a{' '}
        <strong>1</strong> about {formatPercent(expected[0] * 100)} of the time and a <strong>9</strong> only{' '}
        {formatPercent(expected[8] * 100)}. So, does this pattern show up in coronavirus cases and deaths?
        Pick a slice of the pandemic below and check.
      </p>
    </header>
  )
}
