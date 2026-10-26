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

const requested = (process.env.NEXT_PUBLIC_AUTH_PROVIDERS ?? "google,facebook,email")
  .split(",")
  .map((p) => p.trim().toLowerCase())
  .filter(Boolean);

/**
 * Phone OTP needs an SMS provider (Twilio, MessageBird, Vonage…), and none of
 * them send SMS for free, so it is opt-in: set NEXT_PUBLIC_ENABLE_PHONE_LOGIN
 * to "true" once an SMS provider is connected in Supabase.
 */
export const PHONE_LOGIN_ENABLED = process.env.NEXT_PUBLIC_ENABLE_PHONE_LOGIN === "true";

export const LOGIN_METHODS: LoginMethod[] = (
  ["google", "facebook", "email", "phone"] as LoginMethod[]
).filter((m) => (m === "phone" ? PHONE_LOGIN_ENABLED : requested.includes(m)));
