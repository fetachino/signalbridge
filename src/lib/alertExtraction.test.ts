import { describe, expect, it } from 'vitest'
import { extractAlertSignal } from './alertExtraction'

describe('extractAlertSignal', () => {
  it('normalizes tornado OCR into critical guidance metadata', () => {
    expect(extractAlertSignal('tornado warning')).toMatchObject({ severity: 'critical', category: 'weather', actionCue: 'TAKE SHELTER' })
  })

  it('recognizes flood and community notices', () => {
    expect(extractAlertSignal('FLASH FLOOD WATCH')).toMatchObject({ label: 'FLASH FLOOD WATCH', severity: 'watch' })
    expect(extractAlertSignal('Cooling center open')).toMatchObject({ label: 'COMMUNITY NOTICE', category: 'community' })
  })

  it('keeps unknown text safe and explicitly unclassified', () => {
    expect(extractAlertSignal('high temperatures expected')).toMatchObject({ label: 'UNCLASSIFIED NOTICE', matchConfidence: 42 })
  })
})
