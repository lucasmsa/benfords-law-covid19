import { kindHint, sampleHint } from '../config/labels'
import { areaOptions, kindOptions, metricOptions, regionNoun, sampleOptions, testOptions } from '../config/options'
import type { ControlActions, Controls } from '../hooks/useControls'
import DateRange from './DateRange'
import RegionSelect from './RegionSelect'
import SegmentedControl from './SegmentedControl'

interface Props {
  controls: Controls
  actions: ControlActions
  dates: string[]
  regions: string[]
}

export default function ControlPanel({ controls, actions, dates, regions }: Props) {
  const noun = regionNoun[controls.area]

  return (
    <section className="controls" aria-label="Analysis controls">
      <SegmentedControl label="Area" options={areaOptions} value={controls.area} onChange={actions.setArea} />
      <SegmentedControl
        label="Sample"
        options={sampleOptions}
        value={controls.sample}
        onChange={actions.setSample}
        hint={sampleHint[controls.sample]}
      />
      {controls.sample === 'region' && (
        <RegionSelect
          label={noun.singular}
          regions={regions}
          value={controls.region}
          onChange={actions.setRegion}
        />
      )}
      <SegmentedControl label="Metric" options={metricOptions} value={controls.metric} onChange={actions.setMetric} />
      <SegmentedControl
        label="Series"
        options={kindOptions}
        value={controls.kind}
        onChange={actions.setKind}
        hint={kindHint[controls.kind]}
      />
      <SegmentedControl label="Digits" options={testOptions} value={controls.test} onChange={actions.setTest} />
      <DateRange dates={dates} window={controls.window} onChange={actions.setWindow} />
    </section>
  )
}
