-- ============================================================================
-- Surbhi Makeup Studio — enquiries table
--
-- Security model (this is what "secure queries" actually means in Supabase):
--   · Row Level Security is ENABLED, so by default NOBODY can do anything.
--   · The public (anon) role gets exactly ONE capability: INSERT a new row.
--   · The public CANNOT SELECT, UPDATE or DELETE — so no visitor can read
--     other people's phone numbers or tamper with the table.
--   · Reading enquiries happens only in the Supabase dashboard (Table Editor)
--     or with the secret/service_role key. The publishable key the site uses
--     CANNOT read, because no SELECT policy is granted to it.
--
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  phone       text not null check (char_length(phone) between 4 and 32),
  interest    text        check (interest is null or char_length(interest) <= 80),
  message     text        check (message is null or char_length(message) <= 2000),
  look        text        check (look is null or char_length(look) <= 80),
  source      text not null default 'contact-form'
                          check (char_length(source) <= 40),
  -- Light metadata for spam triage. No IP or precise location is stored.
  user_agent  text        check (user_agent is null or char_length(user_agent) <= 400)
);

comment on table public.enquiries is
  'Contact/booking enquiries. Insert-only for the public; readable only via service role.';

-- Newest-first listing in the dashboard.
create index if not exists enquiries_created_at_idx
  on public.enquiries (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.enquiries enable row level security;

-- Re-runnable: drop the policy if it already exists.
drop policy if exists "public can submit an enquiry" on public.enquiries;

-- The ONLY thing anon/authenticated may do is insert. The WITH CHECK clause
-- re-validates lengths at the row level as defence in depth.
create policy "public can submit an enquiry"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (
    char_length(name) between 1 and 120
    and char_length(phone) between 4 and 32
    and (message is null or char_length(message) <= 2000)
  );

-- No SELECT/UPDATE/DELETE policies exist, so those are denied for anon and
-- authenticated. service_role bypasses RLS entirely and is used server-side
-- only. This is intentional — do not add a public SELECT policy.
