export type DetectionInput = {
  severity: 'critical' | 'watch' | 'info'
  location: string
  confidence: number
}

export type DetectionStage = {
  label: string
  status: 'complete' | 'current' | 'pending'
}

export type DetectionEvidence = {
  name: string
  result: string
  confidence: string
}

export type DetectionRun = {
  stages: DetectionStage[]
  evidence: DetectionEvidence[]
  explanation: string
}

/**
 * Demo-safe pipeline boundary. The UI consumes this contract today, while
 * camera/frame capture, OCR, and an on-device classifier can replace the
 * implementation later without changing the TV interaction layer.
 */
export function buildDetectionTrace(input: DetectionInput): DetectionRun {
  const locationConfidence = input.location.includes('Marion') ? 91 : 86
  const symbolResult = input.severity === 'critical' ? 'Matched' : 'Classified'

  return {
    stages: [
      { label: 'Frame', status: 'complete' },
      { label: 'Text', status: 'complete' },
      { label: 'Classify', status: 'complete' },
      { label: 'Guide', status: 'current' },
    ],
    evidence: [
      { name: 'Text region', result: 'Detected', confidence: '98%' },
      { name: 'Alert symbol', result: symbolResult, confidence: `${input.confidence}%` },
      { name: 'Location match', result: input.location.includes('County') ? input.location.split(',')[0] : 'Regional match', confidence: `${locationConfidence}%` },
    ],
    explanation: `The alert was matched to the ${input.location} viewing area and translated into a recommended next step.`,
  }
}
