import { describe, expect, it } from 'vitest'
import { buildDetectionTrace } from './detectionPipeline'

describe('buildDetectionTrace', () => {
  it('builds a transparent trace for a critical county alert', () => {
    const run = buildDetectionTrace({ severity: 'critical', location: 'Marion County, Indiana', confidence: 94 })

    expect(run.stages.map((stage) => stage.label)).toEqual(['Frame', 'Text', 'Classify', 'Guide'])
    expect(run.evidence).toContainEqual({ name: 'Alert symbol', result: 'Matched', confidence: '94%' })
    expect(run.evidence.find((row) => row.name === 'Location match')?.confidence).toBe('91%')
  })

  it('uses classification language and regional matching for a watch', () => {
    const run = buildDetectionTrace({ severity: 'watch', location: 'Central Indiana', confidence: 89 })

    expect(run.evidence).toContainEqual({ name: 'Alert symbol', result: 'Classified', confidence: '89%' })
    expect(run.evidence.find((row) => row.name === 'Location match')?.result).toBe('Regional match')
    expect(run.explanation).toContain('Central Indiana')
  })
})
