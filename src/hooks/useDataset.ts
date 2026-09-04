import { useEffect, useState } from 'react'
import type { Dataset } from '../lib/series'
import type { Area } from '../config/options'

export interface SourceProvenance {
  source: string
  repo: string
  commit: string
  commitDate: string
  dates: number
  firstDate: string
  lastDate: string
  regions: number
  excludedRegions?: string[]
}

export interface Provenance {
  fetchedAt: string
  world: SourceProvenance
  brazil: SourceProvenance
}

export type DatasetState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; datasets: Record<Area, Dataset>; provenance: Provenance }

async function loadJson<T>(name: string): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${name}.json`)
  if (!response.ok) throw new Error(`${name}.json returned HTTP ${response.status}`)
  return response.json() as Promise<T>
}

export function useDataset(): DatasetState {
  const [state, setState] = useState<DatasetState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    Promise.all([loadJson<Dataset>('world'), loadJson<Dataset>('brazil'), loadJson<Provenance>('PROVENANCE')])
      .then(([world, brazil, provenance]) => {
        if (!cancelled) setState({ status: 'ready', datasets: { world, brazil }, provenance })
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ status: 'error', message: error instanceof Error ? error.message : String(error) })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
