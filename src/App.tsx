import { useDataset } from './hooks/useDataset'
import Dashboard from './components/Dashboard'

export default function App() {
  const data = useDataset()

  return (
    <div className="app">
      {data.status === 'loading' && <p className="status">Loading the snapshot…</p>}
      {data.status === 'error' && <p className="status">Could not load the data snapshot: {data.message}</p>}
      {data.status === 'ready' && <Dashboard datasets={data.datasets} provenance={data.provenance} />}
    </div>
  )
}
