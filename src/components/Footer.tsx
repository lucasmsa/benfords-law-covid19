import { citations } from '../config/sources'
import type { Provenance } from '../hooks/useDataset'
import { formatDate } from '../lib/format'

interface Props {
  provenance: Provenance
}

export default function Footer({ provenance }: Props) {
  return (
    <footer className="footer">
      <span>
        Snapshot fetched {formatDate(provenance.fetchedAt.slice(0, 10))}. JHU commit{' '}
        {provenance.world.commit.slice(0, 7)}, wcota commit {provenance.brazil.commit.slice(0, 7)}.
      </span>
      <nav className="footer__links" aria-label="Links">
        <a href="https://lucasmsa.com" rel="author">by lucasmsa</a>
        <a href={citations.repo.url}>GitHub</a>
        <a href={citations.wikipedia.url}>Wikipedia</a>
      </nav>
    </footer>
  )
}
