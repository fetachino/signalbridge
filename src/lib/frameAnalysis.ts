export type FrameAnalysis = {
  width: number
  height: number
  edgeDensity: number
  textContrast: number
  signalScore: number
  processingMs: number
  engine: 'canvas' | 'opencv'
}

/**
 * Lightweight local preprocessing seam for the browser and Fire TV web path.
 * A future OpenCV.js or native OpenCV adapter can consume the same frame shape.
 */
export function analyzeFrame(pixels: Uint8ClampedArray, width: number, height: number): FrameAnalysis {
  if (pixels.length !== width * height * 4) throw new Error('Frame buffer does not match its dimensions')

  let edgePixels = 0
  let totalContrast = 0
  const pixelCount = width * height

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4
      const luminance = toLuminance(pixels[index], pixels[index + 1], pixels[index + 2])

      if (x > 0) {
        const leftIndex = index - 4
        const leftLuminance = toLuminance(pixels[leftIndex], pixels[leftIndex + 1], pixels[leftIndex + 2])
        const contrast = Math.abs(luminance - leftLuminance)
        totalContrast += contrast
        if (contrast > 36) edgePixels += 1
      }
    }
  }

  const comparedPixels = Math.max(1, (width - 1) * height)
  const averageContrast = totalContrast / comparedPixels
  const edgeDensity = Math.round((edgePixels / comparedPixels) * 100)
  const textContrast = Math.min(100, Math.round((averageContrast / 64) * 100))
  const signalScore = Math.min(99, Math.max(1, Math.round(edgeDensity * 0.6 + textContrast * 1.8)))

  return { width, height, edgeDensity, textContrast, signalScore, processingMs: 0, engine: 'canvas' }
}

export function createSyntheticAlertFrame(label: string, width = 640, height = 360): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas frame context is unavailable')

  const background = context.createLinearGradient(0, 0, width, height)
  background.addColorStop(0, '#132e4c')
  background.addColorStop(0.45, '#0e536c')
  background.addColorStop(1, '#431e3d')
  context.fillStyle = background
  context.fillRect(0, 0, width, height)

  context.fillStyle = 'rgba(2, 13, 25, 0.86)'
  context.fillRect(0, height - 66, width, 66)
  context.fillStyle = '#d9efff'
  context.font = '700 23px sans-serif'
  context.fillText(label, 24, height - 28)
  context.strokeStyle = '#ff756a'
  context.lineWidth = 3
  context.strokeRect(width * 0.56, height * 0.22, width * 0.32, height * 0.28)

  return context.getImageData(0, 0, width, height)
}

function toLuminance(red: number, green: number, blue: number) {
  return red * 0.2126 + green * 0.7152 + blue * 0.0722
}
