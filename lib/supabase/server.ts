import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client used by our API routes.
 *
 * It uses the PUBLISHABLE key, which — unlike the secret/service_role key —
 * fully respects Row Level Security. That is deliberate: security here rests
 * on the RLS policy in supabase/migrations/0001_enquiries.sql, which lets this
 * key do exactly one thing (INSERT an enquiry) and nothing else. It cannot
 * read, update or delete any row, so even though a publishable key is public
 * by design, the data behind it stays protected.
 *
 * We still route writes through our own server so we get server-side
 * validation and honeypot filtering before anything reaches the database.
 */

let cached: SupabaseClient | null = null

/** Normalises a project URL, tolerating a pasted `/rest/v1/` REST path. */
function normaliseUrl(raw: string): string {
  return raw.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
}

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY

  // Not configured — callers fall back gracefully (e.g. WhatsApp only).
  if (!url || !key) return null

  if (cached) return cached
  cached = createClient(normaliseUrl(url), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY)
}
