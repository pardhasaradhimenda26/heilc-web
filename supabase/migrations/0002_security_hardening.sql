-- HEILC security hardening: shared rate limiting + database lockdown.
-- Run once in Supabase → SQL Editor, after 0001. Safe to re-run.

-- ── 1. Lock down defaults ────────────────────────────────────────────────
-- New functions are not callable by anon/public unless granted explicitly.
alter default privileges in schema public revoke execute on functions from public, anon;

-- Row-level security applies even to the table owner (defence in depth).
alter table public.profiles        force row level security;
alter table public.consent_log     force row level security;
alter table public.requests        force row level security;
alter table public.grievances      force row level security;
alter table public.security_events force row level security;

-- Anonymous visitors may only file a grievance (insert, never read back).
-- Signed-in users keep only what RLS policies allow.
revoke all on public.profiles, public.consent_log, public.requests,
              public.security_events from anon;
revoke update, delete, truncate on public.consent_log, public.requests,
              public.security_events from authenticated;
revoke delete, truncate on public.profiles from authenticated;
revoke select, update, delete, truncate on public.grievances from anon;
revoke update, delete, truncate on public.grievances from authenticated;

-- Stop runaway queries from API keys tying up the free database.
alter role anon          set statement_timeout = '3s';
alter role authenticated set statement_timeout = '8s';

-- A profile's identity and consent proof cannot be rewritten by the user.
create or replace function public.protect_profile_columns() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.id <> old.id
     or new.consented_at <> old.consented_at
     or new.created_at <> old.created_at then
    raise exception 'protected column';
  end if;
  return new;
end $$;
drop trigger if exists profiles_protect on public.profiles;
create trigger profiles_protect before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- Mobile numbers are stored in E.164 form only.
alter table public.profiles drop constraint if exists profiles_phone_e164;
alter table public.profiles add constraint profiles_phone_e164
  check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$');

-- Allow logging sign-in failures and OTP requests.
alter table public.security_events drop constraint if exists security_events_event_check;
alter table public.security_events add constraint security_events_event_check
  check (event in ('sign_in','data_export','account_deleted','profile_updated','otp_requested'));

-- ── 2. Shared rate limiter ───────────────────────────────────────────────
-- Serverless functions don't share memory, so limits live here. Keys are
-- SHA-256 hashes; no raw IPs, emails or numbers are stored.
create table if not exists public.rate_limits (
  key        text primary key check (char_length(key) <= 128),
  hits       int  not null default 0,
  reset_at   timestamptz not null
);
alter table public.rate_limits enable row level security;
alter table public.rate_limits force row level security;
revoke all on public.rate_limits from public, anon, authenticated;
-- No policies: only the service role (which bypasses RLS) can reach it.

create or replace function public.rate_limit_hit(p_key text, p_max int, p_window_seconds int)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  r public.rate_limits;
begin
  insert into public.rate_limits as t (key, hits, reset_at)
       values (p_key, 1, now() + make_interval(secs => p_window_seconds))
  on conflict (key) do update
     set hits     = case when t.reset_at <= now() then 1 else t.hits + 1 end,
         reset_at = case when t.reset_at <= now()
                         then now() + make_interval(secs => p_window_seconds)
                         else t.reset_at end
  returning * into r;
  return jsonb_build_object(
    'success',   r.hits <= p_max,
    'remaining', greatest(p_max - r.hits, 0),
    'reset_ms',  greatest((extract(epoch from (r.reset_at - now())) * 1000)::bigint, 0)
  );
end $$;
revoke all on function public.rate_limit_hit(text, int, int) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, int, int) to service_role;

-- ── 3. Retention sweep now also clears expired rate-limit rows ───────────
create or replace function public.retention_sweep() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  c1 int; c2 int; c3 int; c4 int; c5 int;
begin
  delete from public.consent_log     where user_id is null and created_at < now() - interval '1 year';
  get diagnostics c1 = row_count;
  delete from public.security_events where created_at < now() - interval '1 year';
  get diagnostics c2 = row_count;
  delete from public.grievances      where status = 'resolved' and resolved_at < now() - interval '1 year';
  get diagnostics c3 = row_count;
  delete from public.requests        where created_at < now() - interval '3 years';
  get diagnostics c4 = row_count;
  delete from public.rate_limits     where reset_at < now() - interval '1 day';
  get diagnostics c5 = row_count;
  return jsonb_build_object('consent_log', c1, 'security_events', c2, 'grievances', c3,
                            'requests', c4, 'rate_limits', c5);
end $$;
revoke all on function public.retention_sweep() from public, anon, authenticated;
grant execute on function public.retention_sweep() to service_role;

-- ── 4. Self-check: every public table must have RLS on ───────────────────
do $$
declare t text;
begin
  for t in select tablename from pg_tables
            where schemaname = 'public' and not rowsecurity loop
    raise warning 'RLS is OFF on public.% — enable it before going live', t;
  end loop;
end $$;
