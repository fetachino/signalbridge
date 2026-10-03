import { describe, expect, it } from 'vitest'
import { analyzeFrame } from './frameAnalysis'

describe('analyzeFrame', () => {
  it('rejects a frame buffer with incorrect dimensions', () => {
    expect(() => analyzeFrame(new Uint8ClampedArray(3), 1, 1)).toThrow('Frame buffer does not match its dimensions')
  })

  it('detects stronger edges in a high-contrast frame', () => {
    const pixels = new Uint8ClampedArray([
      0, 0, 0, 255, 255, 255, 255, 255,
      0, 0, 0, 255, 255, 255, 255, 255,
    ])
    const result = analyzeFrame(pixels, 2, 2)

    expect(result.edgeDensity).toBeGreaterThan(0)
    expect(result.textContrast).toBeGreaterThan(0)
    expect(result.signalScore).toBeGreaterThan(0)
  })
})
