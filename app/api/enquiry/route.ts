import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Receives a contact / booking enquiry and stores it in Supabase.
 *
 * Security posture:
 *  · The browser never touches Supabase — it POSTs here, and this server
 *    route inserts using the service_role key. So no DB key ships to the client.
 *  · Every field is validated and length-capped here (layer 1), and again by
 *    the table's CHECK constraints + RLS WITH CHECK (layer 2).
 *  · If Supabase isn't configured, we return `stored: false` rather than an
 *    error, so the form's WhatsApp path still works end-to-end.
 */

const LIMITS = {
  name: 120,
  phone: 32,
  interest: 80,
  message: 2000,
  look: 80,
} as const

type Body = {
  name?: unknown
  phone?: unknown
  interest?: unknown
  message?: unknown
  look?: unknown
  source?: unknown
  // Honeypot — real users never fill this; bots do.
  company?: unknown
}

function str(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  if (!t) return null
  return t.slice(0, max)
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: silently accept so bots don't learn they were caught, but skip
  // the write entirely.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ stored: false, ok: true })
  }

  const name = str(body.name, LIMITS.name)
  const phone = str(body.phone, LIMITS.phone)

  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 422 })
  if (!phone || phone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: 'A valid phone number is required.' }, { status: 422 })
  }

  const supabase = getSupabase()
  if (!supabase) {
    // Not configured — not an error from the user's point of view.
    return NextResponse.json({ stored: false, ok: true })
  }

  const { error } = await supabase.from('enquiries').insert({
    name,
    phone,
    interest: str(body.interest, LIMITS.interest),
    message: str(body.message, LIMITS.message),
    look: str(body.look, LIMITS.look),
    source: str(body.source, 40) ?? 'contact-form',
    user_agent: req.headers.get('user-agent')?.slice(0, 400) ?? null,
  })

  if (error) {
    // Log server-side only; never leak DB details to the client.
    console.error('[enquiry] insert failed:', error.message)
    return NextResponse.json({ error: 'Could not save your enquiry.' }, { status: 502 })
  }

  return NextResponse.json({ stored: true, ok: true })
}
