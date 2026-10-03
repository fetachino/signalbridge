export type ExtractedAlert = {
  label: string
  severity: 'critical' | 'watch' | 'info'
  category: 'weather' | 'community'
  actionCue: string
  matchConfidence: number
}

/** Normalizes OCR text into the small alert vocabulary used by the guidance layer. */
export function extractAlertSignal(text: string): ExtractedAlert {
  const normalized = text.toUpperCase().replace(/[^A-Z ]/g, ' ')

  if (normalized.includes('TORNADO')) {
    return { label: 'TORNADO WARNING', severity: 'critical', category: 'weather', actionCue: 'TAKE SHELTER', matchConfidence: 98 }
  }

  if (normalized.includes('FLOOD')) {
    return { label: 'FLASH FLOOD WATCH', severity: 'watch', category: 'weather', actionCue: 'AVOID FLOODED ROADS', matchConfidence: 93 }
  }

  if (normalized.includes('COOLING') || normalized.includes('CENTER')) {
    return { label: 'COMMUNITY NOTICE', severity: 'info', category: 'community', actionCue: 'REVIEW LOCAL GUIDANCE', matchConfidence: 88 }
  }

  return { label: 'UNCLASSIFIED NOTICE', severity: 'info', category: 'community', actionCue: 'REVIEW THE SOURCE', matchConfidence: 42 }
}
