import { NextResponse } from 'next/server'
import { SYSTEM_PROMPT, ruleBasedReply, type ChatMessage } from '@/lib/chat/knowledge'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Chatbot backend.
 *
 * With GEMINI_API_KEY set: answers via Gemini, grounded on the studio's real
 * information and constrained by SYSTEM_PROMPT (no prices, no invented facts,
 * on-topic only).
 *
 * Without a key, or if the API errors/times out: falls back to the
 * deterministic rule-based reply. The client can't tell the difference in
 * shape, so the widget always works.
 */

const MAX_MESSAGE = 1000
const MAX_HISTORY = 10

function reply(text: string, source: 'ai' | 'fallback') {
  return NextResponse.json({ reply: text, source })
}

export async function POST(req: Request) {
  let body: { message?: unknown; history?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const message = typeof body.message === 'string' ? body.message.trim().slice(0, MAX_MESSAGE) : ''
  if (!message) return NextResponse.json({ error: 'Empty message.' }, { status: 422 })

  const history: ChatMessage[] = Array.isArray(body.history)
    ? body.history
        .filter(
          (m): m is ChatMessage =>
            !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
        )
        .slice(-MAX_HISTORY)
    : []

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return reply(ruleBasedReply(message), 'fallback')

  try {
    const contents = [
      ...history.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ]

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 320 },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
        signal: AbortSignal.timeout(20_000),
      },
    )

    if (!res.ok) return reply(ruleBasedReply(message), 'fallback')

    const json = await res.json()
    const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text || !text.trim()) return reply(ruleBasedReply(message), 'fallback')

    return reply(text.trim(), 'ai')
  } catch {
    // Timeout or network error — never fail the user; use the grounded fallback.
    return reply(ruleBasedReply(message), 'fallback')
  }
}
