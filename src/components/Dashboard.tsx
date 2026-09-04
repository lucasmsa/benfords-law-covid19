import type { Area } from '../config/options'
import { useAnalysis } from '../hooks/useAnalysis'
import { useControls } from '../hooks/useControls'
import type { Provenance } from '../hooks/useDataset'
import type { Dataset } from '../lib/series'
import ControlPanel from './ControlPanel'
import DistributionChart from './DistributionChart'
import Explainer from './Explainer'
import FitPanel from './FitPanel'
import Footer from './Footer'
import Header from './Header'

interface Props {
  datasets: Record<Area, Dataset>
  provenance: Provenance
}

export default function Dashboard({ datasets, provenance }: Props) {
  const [controls, actions] = useControls({
    world: datasets.world.dates.length,
    brazil: datasets.brazil.dates.length,
  })
  const { analysis, dates, regions } = useAnalysis(datasets, controls)

  return (
    <>
      <Header />
      <ControlPanel controls={controls} actions={actions} dates={dates} regions={regions} />
      <section className="results" aria-label="Results">
        <DistributionChart analysis={analysis} controls={controls} dates={dates} />
        <FitPanel analysis={analysis} test={controls.test} />
      </section>
      <Explainer provenance={provenance} />
      <Footer provenance={provenance} />
    </>
  )
}
