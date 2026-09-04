import { useMemo } from 'react'
import type { Area } from '../config/options'
import { analyze, type Analysis } from '../lib/analysis'
import { sampleValues } from '../lib/sampling'
import type { Dataset } from '../lib/series'
import type { Controls } from './useControls'

export interface AnalysisView {
  analysis: Analysis
  dates: string[]
  regions: string[]
}

export function useAnalysis(datasets: Record<Area, Dataset>, controls: Controls): AnalysisView {
  return useMemo(() => {
    const dataset = datasets[controls.area]
    const values = sampleValues(dataset, controls)
    return {
      analysis: analyze(values, controls.test),
      dates: dataset.dates,
      regions: Object.keys(dataset.series),
    }
  }, [datasets, controls])
}
