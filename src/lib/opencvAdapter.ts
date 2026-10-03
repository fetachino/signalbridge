import { analyzeFrame, type FrameAnalysis } from './frameAnalysis'

type OpenCvMat = { delete: () => void }
type OpenCvRuntime = {
  COLOR_RGBA2GRAY: number
  Mat: new () => OpenCvMat
  Canny: (source: OpenCvMat, edges: OpenCvMat, threshold1: number, threshold2: number) => void
  countNonZero: (source: OpenCvMat) => number
  cvtColor: (source: OpenCvMat, destination: OpenCvMat, code: number) => void
  matFromImageData: (imageData: ImageData) => OpenCvMat
}

let runtimePromise: Promise<OpenCvRuntime> | null = null

/** Lazily initializes OpenCV.js so the initial TV screen stays lightweight. */
export async function loadOpenCv(): Promise<OpenCvRuntime> {
  if (!runtimePromise) {
    runtimePromise = import('@techstark/opencv-js').then(async (module) => {
      const candidate = module.default as unknown
      if (candidate && typeof candidate === 'object' && 'then' in candidate) {
        return candidate as Promise<OpenCvRuntime>
      }
      if (candidate && typeof candidate === 'object' && 'Mat' in candidate) {
        return candidate as OpenCvRuntime
      }

      return new Promise<OpenCvRuntime>((resolve) => {
        ;(candidate as { onRuntimeInitialized?: () => void }).onRuntimeInitialized = () => resolve(candidate as OpenCvRuntime)
      })
    }).then((runtime) => runtime)
  }

  return runtimePromise
}

export async function analyzeFrameWithOpenCv(imageData: ImageData): Promise<FrameAnalysis> {
  const cv = await loadOpenCv()
  const source = cv.matFromImageData(imageData)
  const gray = new cv.Mat()
  const edges = new cv.Mat()

  try {
    cv.cvtColor(source, gray, cv.COLOR_RGBA2GRAY)
    cv.Canny(gray, edges, 50, 150)
    const edgeDensity = Math.round((cv.countNonZero(edges) / (imageData.width * imageData.height)) * 100)
    const baseline = analyzeFrame(imageData.data, imageData.width, imageData.height)
    const signalScore = Math.min(99, Math.max(1, Math.round(edgeDensity * 2 + baseline.textContrast * 2 + 12)))
    return { ...baseline, edgeDensity, signalScore, engine: 'opencv', processingMs: 0 }
  } finally {
    source.delete()
    gray.delete()
    edges.delete()
  }
}
