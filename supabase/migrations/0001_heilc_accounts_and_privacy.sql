-- HEILC accounts, onboarding profile and DPDP Act 2023 records.
-- Run once in Supabase → SQL Editor. Safe to re-run (idempotent).
--
-- Design rules
--   * Row-level security on every table: a visitor can only ever read or
--     write their own rows (DPDP s.8(5) — reasonable security safeguards).
--   * Collect only what onboarding needs (s.6(1) — limited to necessary data).
--   * Deleting the auth user cascades to profile and requests (s.12(3) erasure);
--     consent and grievance records are unlinked, not kept against the person.

create extension if not exists pgcrypto;

-- ── Profiles ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                     uuid primary key references auth.users(id) on delete cascade,
  full_name              text not null check (char_length(full_name) between 1 and 80),
  persona                text not null check (persona in ('startup','enterprise','student')),
  segment                text check (char_length(segment) <= 40),
  interests              text[] not null default '{}',
  company                text check (char_length(company) <= 120),
  role                   text check (char_length(role) <= 80),
  stage                  text check (char_length(stage) <= 40),
  timeline               text check (char_length(timeline) <= 40),
  goal                   text check (char_length(goal) <= 500),
  phone                  text check (char_length(phone) <= 20),
  marketing_opt_in       boolean not null default false,
  nominee_name           text check (char_length(nominee_name) <= 80),
  nominee_contact        text check (char_length(nominee_contact) <= 120),
  notice_version         text not null,
  notice_language        text not null default 'en',
  consented_at           timestamptz not null,
  age_confirmed          boolean not null default false check (age_confirmed),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  last_active_at         timestamptz not null default now(),
  deletion_notice_sent_at timestamptz
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own"   on public.profiles;
drop policy if exists "profiles: insert own" on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: read own"   on public.profiles for select using (id = auth.uid());
create policy "profiles: insert own" on public.profiles for insert with check (id = auth.uid());
create policy "profiles: update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── Consent log (s.6(10): the fiduciary must be able to prove notice + consent)
create table if not exists public.consent_log (
  id              bigint generated always as identity primary key,
  user_id         uuid references auth.users(id) on delete set null,
  purpose         text not null check (purpose in ('account','personalisation','marketing')),
  action          text not null check (action in ('granted','withdrawn','account_deleted')),
  notice_version  text not null,
  notice_language text not null default 'en',
  source          text check (char_length(source) <= 40),
  created_at      timestamptz not null default now()
);

alter table public.consent_log enable row level security;
drop policy if exists "consent: read own"   on public.consent_log;
drop policy if exists "consent: insert own" on public.consent_log;
create policy "consent: read own"   on public.consent_log for select using (user_id = auth.uid());
create policy "consent: insert own" on public.consent_log for insert with check (user_id = auth.uid());

-- ── Requests (contact form submissions and generated proposals) ──────────
create table if not exists public.requests (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  kind       text not null check (kind in ('contact','proposal')),
  payload    jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.requests enable row level security;
drop policy if exists "requests: read own"   on public.requests;
drop policy if exists "requests: insert own" on public.requests;
create policy "requests: read own"   on public.requests for select using (user_id = auth.uid());
create policy "requests: insert own" on public.requests for insert with check (user_id = auth.uid());

-- ── Grievances (s.13 — readily available grievance redressal) ────────────
create table if not exists public.grievances (
  id          uuid primary key default gen_random_uuid(),
  reference   text not null unique default upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  user_id     uuid references auth.users(id) on delete set null,
  name        text not null check (char_length(name) between 1 and 80),
  email       text not null check (char_length(email) between 3 and 160),
  category    text not null check (char_length(category) <= 40),
  details     text not null check (char_length(details) between 10 and 4000),
  status      text not null default 'received' check (status in ('received','in_progress','resolved')),
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.grievances enable row level security;
drop policy if exists "grievances: insert"   on public.grievances;
drop policy if exists "grievances: read own" on public.grievances;
create policy "grievances: insert"   on public.grievances for insert
  with check (user_id is null or user_id = auth.uid());
create policy "grievances: read own" on public.grievances for select using (user_id = auth.uid());

-- ── Security events (DPDP Rules 2025, rule 6: keep access logs for a year) ─
create table if not exists public.security_events (
  id         bigint generated always as identity primary key,
  user_id    uuid references auth.users(id) on delete set null,
  event      text not null check (event in ('sign_in','data_export','account_deleted','profile_updated')),
  created_at timestamptz not null default now()
);

alter table public.security_events enable row level security;
drop policy if exists "security: read own"   on public.security_events;
drop policy if exists "security: insert own" on public.security_events;
create policy "security: read own"   on public.security_events for select using (user_id = auth.uid());
create policy "security: insert own" on public.security_events for insert with check (user_id = auth.uid());

-- ── Functions ────────────────────────────────────────────────────────────

-- Marks the visitor active (drives the inactivity retention rule).
create or replace function public.touch_last_active() returns void
language sql security definer set search_path = '' as $$
  update public.profiles
     set last_active_at = now(), deletion_notice_sent_at = null
   where id = auth.uid();
$$;
revoke all on function public.touch_last_active() from public, anon;
grant execute on function public.touch_last_active() to authenticated;

-- Self-service erasure (s.12(3)) and withdrawal of consent (s.6(4)):
-- deleting the auth user cascades to profile and requests.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  v   text;
begin
  if uid is null then
    raise exception 'not signed in';
  end if;
  select notice_version into v from public.profiles where id = uid;
  insert into public.consent_log (user_id, purpose, action, notice_version, source)
       values (uid, 'account', 'account_deleted', coalesce(v, 'n/a'), 'account');
  insert into public.security_events (user_id, event) values (uid, 'account_deleted');
  delete from auth.users where id = uid;
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- Retention sweep, called daily by /api/cron/daily with the service role.
-- Unlinked consent/security rows older than a year, resolved grievances older
-- than a year, and requests older than three years are removed.
create or replace function public.retention_sweep() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  c1 int; c2 int; c3 int; c4 int;
begin
  delete from public.consent_log     where user_id is null and created_at < now() - interval '1 year';
  get diagnostics c1 = row_count;
  delete from public.security_events where created_at < now() - interval '1 year';
  get diagnostics c2 = row_count;
  delete from public.grievances      where status = 'resolved' and resolved_at < now() - interval '1 year';
  get diagnostics c3 = row_count;
  delete from public.requests        where created_at < now() - interval '3 years';
  get diagnostics c4 = row_count;
  return jsonb_build_object('consent_log', c1, 'security_events', c2, 'grievances', c3, 'requests', c4);
end $$;
revoke all on function public.retention_sweep() from public, anon, authenticated;
