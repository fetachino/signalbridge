export type OcrResult = {
  text: string
  confidence: number
  engine: 'tesseract' | 'fixture'
}

type OcrWorker = {
  recognize: (image: string) => Promise<{ data: { text: string; confidence: number } }>
  terminate: () => Promise<void>
}

let workerPromise: Promise<OcrWorker> | null = null

async function loadWorker() {
  if (!workerPromise) {
    workerPromise = import('tesseract.js').then(async ({ createWorker }) => {
      return createWorker('eng', 1, { logger: () => undefined }) as unknown as OcrWorker
    })
  }
  return workerPromise
}

/** Runs OCR when the worker/language data is available and stays usable offline otherwise. */
export async function recognizeAlertText(image: ImageData, fallbackText: string): Promise<OcrResult> {
  const fallback: OcrResult = { text: fallbackText, confidence: 100, engine: 'fixture' }

  try {
    const worker = await Promise.race([
      loadWorker(),
      new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 4500)),
    ])
    if (!worker) return fallback

    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    if (!context) return fallback
    context.putImageData(image, 0, 0)

    const result = await Promise.race([
      worker.recognize(canvas.toDataURL('image/png')), 
      new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 4500)),
    ])
    if (!result) return fallback
    const text = result.data.text.replace(/\s+/g, ' ').trim()
    return text ? { text, confidence: Math.round(result.data.confidence), engine: 'tesseract' } : fallback
  } catch {
    return fallback
  }
}
