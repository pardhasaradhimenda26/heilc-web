/**
 * Auth configuration. Everything here is read from NEXT_PUBLIC_ variables so
 * it is inlined at build time and identical on server and client.
 *
 * When Supabase is not configured, AUTH_ENABLED is false and every gated
 * feature (contact form, proposal generator, chat) stays open exactly as it
 * was before login existed — the site never breaks because a key is missing.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

export const AUTH_ENABLED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export type LoginMethod = "google" | "facebook" | "email" | "phone";

/**
 * Which sign-in buttons to show, in this order. Default: Google, email and
 * mobile number. Facebook is supported too — add "facebook" to the list.
 *
 * Mobile sign-in needs an SMS provider connected in Supabase (Auth →
 * Providers → Phone). No provider sends SMS for free; until one is
 * connected, drop "phone" from NEXT_PUBLIC_AUTH_PROVIDERS.
 */
const requested = (process.env.NEXT_PUBLIC_AUTH_PROVIDERS ?? "google,email,phone")
  .split(",")
  .map((p) => p.trim().toLowerCase())
  .filter(Boolean);

export const LOGIN_METHODS: LoginMethod[] = (
  ["google", "email", "phone", "facebook"] as LoginMethod[]
).filter((m) => requested.includes(m));

/** Cloudflare Turnstile (free bot check) — shown on email/mobile sign-in when set. */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
