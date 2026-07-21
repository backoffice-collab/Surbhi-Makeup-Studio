import type { BeautyProfile, SkinTone, Undertone, FaceShape, EyeShape, LipShape, BrowStyle, HairColor } from './types'

/**
 * On-device fallback analysis, used when no GEMINI_API_KEY is configured.
 *
 * Skin tone and undertone are measured from actual image pixels (a centre
 * sample, skinlike-pixel filtered). The remaining traits cannot be derived
 * without a real vision model, so they are chosen deterministically from an
 * image fingerprint — stable for the same photo, but explicitly flagged as
 * low confidence and labelled in the UI as an estimate.
 */

const FACE_SHAPES: FaceShape[] = ['Oval', 'Round', 'Square', 'Heart', 'Oblong', 'Diamond']
const EYE_SHAPES: EyeShape[] = ['Almond', 'Round', 'Hooded', 'Monolid', 'Upturned', 'Downturned']
const LIP_SHAPES: LipShape[] = ['Full', 'Bow-shaped', 'Wide', 'Round', 'Thin', 'Heart-shaped']
const BROWS: BrowStyle[] = ['Soft Arch', 'High Arch', 'Straight', 'Rounded', 'Tapered']

function toneFromLuminance(l: number): SkinTone {
  if (l > 218) return 'Fair'
  if (l > 196) return 'Light'
  if (l > 172) return 'Light Medium'
  if (l > 145) return 'Medium'
  if (l > 116) return 'Medium Deep'
  if (l > 88) return 'Deep'
  return 'Rich Deep'
}

function undertoneFrom(r: number, g: number, b: number): Undertone {
  const warmth = r - b            // red vs blue dominance
  const green = g - (r + b) / 2   // olive indicator
  if (green > 4) return 'Olive'
  if (warmth > 38) return 'Warm'
  if (warmth < 22) return 'Cool'
  return 'Neutral'
}

/** Cheap deterministic hash so the same photo always yields the same result. */
function hash(data: Uint8ClampedArray): number {
  let h = 2166136261
  for (let i = 0; i < data.length; i += 997) {
    h ^= data[i]
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

export async function analyzeLocally(file: Blob): Promise<BeautyProfile> {
  const bitmap = await createImageBitmap(file)
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas unavailable')

  ctx.drawImage(bitmap, 0, 0, size, size)
  bitmap.close()

  // Sample the central region, where a face most likely sits in a selfie.
  const inset = Math.floor(size * 0.25)
  const { data } = ctx.getImageData(inset, inset, size - inset * 2, size - inset * 2)

  let r = 0, g = 0, b = 0, n = 0
  for (let i = 0; i < data.length; i += 4) {
    const R = data[i], G = data[i + 1], B = data[i + 2]
    // Standard skin-pixel heuristic — filters out background and clothing.
    const max = Math.max(R, G, B), min = Math.min(R, G, B)
    const isSkinLike =
      R > 60 && G > 30 && B > 15 &&
      max - min > 12 &&
      R > G && R > B &&
      Math.abs(R - G) > 8
    if (isSkinLike) { r += R; g += G; b += B; n++ }
  }

  const enough = n > 40
  if (enough) { r /= n; g /= n; b /= n }
  else {
    // No skin-like pixels found — fall back to the overall average.
    let tr = 0, tg = 0, tb = 0, tn = 0
    for (let i = 0; i < data.length; i += 4) { tr += data[i]; tg += data[i + 1]; tb += data[i + 2]; tn++ }
    r = tr / tn; g = tg / tn; b = tb / tn
  }

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  const h = hash(data)

  const notes = [
    'These are visual estimates from your photo, not measurements.',
    'Lighting, camera and filters strongly affect how skin tone reads.',
  ]
  if (!enough) notes.push('We could not clearly detect a face — try a well-lit, front-facing photo for a better result.')

  return {
    skinTone: toneFromLuminance(luminance),
    undertone: undertoneFrom(r, g, b),
    faceShape: FACE_SHAPES[h % FACE_SHAPES.length],
    eyeShape: EYE_SHAPES[(h >> 3) % EYE_SHAPES.length],
    lipShape: LIP_SHAPES[(h >> 6) % LIP_SHAPES.length],
    browStyle: BROWS[(h >> 9) % BROWS.length],
    hairColor: (luminance < 120 ? 'Black' : 'Dark Brown') as HairColor,
    confidence: enough ? 52 : 34,
    notes,
    isFallback: true,
  }
}
