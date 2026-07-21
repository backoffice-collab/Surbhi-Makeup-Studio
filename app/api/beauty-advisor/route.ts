import { NextResponse } from 'next/server'
import type { BeautyProfile } from '@/lib/advisor/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Server-side vision analysis.
 *
 * Privacy contract:
 *  · The image is held in memory for the duration of the request only.
 *  · Nothing is written to disk, logged, or persisted anywhere.
 *  · GEMINI_API_KEY never reaches the browser.
 *  · If no key is configured we return 501 and the client falls back to
 *    on-device analysis, so no image leaves the user's machine at all.
 */

const MAX_BYTES = 6 * 1024 * 1024 // 6 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

const SYSTEM_PROMPT = `You are assisting a professional bridal makeup studio.

Look at the supplied photo and describe ONLY visible cosmetic characteristics that a makeup artist would note during a consultation.

Return STRICT JSON, no markdown fences, matching exactly:
{
  "skinTone": "Fair|Light|Light Medium|Medium|Medium Deep|Deep|Rich Deep",
  "undertone": "Cool|Neutral|Warm|Olive",
  "faceShape": "Oval|Round|Square|Heart|Oblong|Diamond",
  "eyeShape": "Almond|Round|Hooded|Monolid|Upturned|Downturned",
  "lipShape": "Full|Bow-shaped|Wide|Round|Thin|Heart-shaped",
  "browStyle": "Soft Arch|High Arch|Straight|Rounded|Tapered",
  "hairColor": "Black|Dark Brown|Brown|Light Brown|Auburn|Grey",
  "confidence": <integer 0-100>,
  "notes": [<up to 3 short strings about photo quality or lighting limits>]
}

Rules:
- These are ESTIMATES for cosmetic styling only. Lower "confidence" when lighting is poor, the face is turned, filters are present, or the face is small in frame.
- Do NOT infer or mention age, ethnicity, race, nationality, gender, attractiveness, health, weight, or any medical condition.
- Do NOT identify the person or speculate about who they are.
- If no human face is clearly visible, return confidence 0 and note "No clear face detected".
- Output raw JSON only.`

function bad(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'not_configured', message: 'No vision model configured; use on-device analysis.' },
      { status: 501 },
    )
  }

  let file: File | null = null
  try {
    const form = await req.formData()
    const f = form.get('photo')
    if (f instanceof File) file = f
  } catch {
    return bad('Invalid request body.', 400)
  }

  if (!file) return bad('No photo supplied.', 400)
  if (!ALLOWED.includes(file.type)) return bad('Please upload a JPEG, PNG or WebP image.', 415)
  if (file.size > MAX_BYTES) return bad('Image must be under 6 MB.', 413)

  const base64 = Buffer.from(await file.arrayBuffer()).toString('base64')

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: SYSTEM_PROMPT },
              { inline_data: { mime_type: file.type, data: base64 } },
            ],
          }],
          generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
        signal: AbortSignal.timeout(25_000),
      },
    )

    if (!res.ok) {
      // Never surface the upstream body — it can echo the API key.
      return bad(`Vision service returned ${res.status}.`, 502)
    }

    const json = await res.json()
    const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return bad('Vision service returned no result.', 502)

    let parsed: Partial<BeautyProfile>
    try {
      parsed = JSON.parse(text.replace(/^```json\s*|\s*```$/g, ''))
    } catch {
      return bad('Could not parse the analysis result.', 502)
    }

    if (typeof parsed.confidence === 'number' && parsed.confidence === 0) {
      return bad('No clear face detected. Try a well-lit, front-facing photo.', 422)
    }

    const profile: BeautyProfile = {
      skinTone: parsed.skinTone ?? 'Medium',
      undertone: parsed.undertone ?? 'Neutral',
      faceShape: parsed.faceShape ?? 'Oval',
      eyeShape: parsed.eyeShape ?? 'Almond',
      lipShape: parsed.lipShape ?? 'Full',
      browStyle: parsed.browStyle ?? 'Soft Arch',
      hairColor: parsed.hairColor ?? 'Dark Brown',
      confidence: Math.min(95, Math.max(0, Math.round(parsed.confidence ?? 70))),
      notes: [
        'These are visual estimates for styling, not measurements.',
        ...(Array.isArray(parsed.notes) ? parsed.notes.slice(0, 3) : []),
      ],
      isFallback: false,
    }

    return NextResponse.json({ profile })
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'TimeoutError'
    return bad(timedOut ? 'Analysis timed out. Please try again.' : 'Analysis failed.', 504)
  }
}
