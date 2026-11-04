import { createClient } from "@supabase/supabase-js";
import { AUTH_ENABLED, LOGIN_METHODS, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";
import { checkEmail, checkPhone } from "@/lib/security/identity";
import { clientIp, rateLimit, tooMany } from "@/lib/ratelimit";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEN_MIN = 10 * 60_000;
const DAY = 24 * 60 * 60_000;

/**
 * Sends a one-time sign-in code by email or SMS. Going through this route
 * (instead of calling Supabase from the browser) lets the server validate
 * the address, block throwaway inboxes and enforce rate limits that a bot
 * can't skip. Codes are verified in the browser with supabase.auth.verifyOtp.
 */
export async function POST(req: Request) {
  if (!AUTH_ENABLED) return Response.json({ error: "Sign-in isn't switched on yet." }, { status: 503 });

  let body: { channel?: string; identifier?: string; captchaToken?: string; next?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const channel = body.channel === "phone" ? "phone" : body.channel === "email" ? "email" : null;
  if (!channel || !LOGIN_METHODS.includes(channel)) {
    return Response.json({ error: "That sign-in method isn't available." }, { status: 400 });
  }

  const ip = clientIp(req);
  const ipLimit = await rateLimit(`otp:ip:${ip}`, 6, TEN_MIN);
  if (!ipLimit.success) return tooMany(ipLimit, "Too many code requests. Try again in a few minutes.");

  const checked = channel === "email" ? await checkEmail(body.identifier) : checkPhone(body.identifier);
  if (!checked.ok) return Response.json({ error: checked.error }, { status: 400 });

  // Per address: stops one inbox or phone being flooded (and SMS bills).
  const shortLimit = await rateLimit(`otp:id:${checked.value}`, 3, TEN_MIN);
  if (!shortLimit.success) return tooMany(shortLimit, "We just sent a code. Wait a few minutes before asking again.");
  const dayLimit = await rateLimit(`otp:day:${checked.value}`, channel === "phone" ? 5 : 10, DAY);
  if (!dayLimit.success) return tooMany(dayLimit, "Daily limit reached for this address. Try again tomorrow.");

  const next = typeof body.next === "string" && /^\/(?![/\\])/.test(body.next) ? body.next : "/";
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const captchaToken = typeof body.captchaToken === "string" ? body.captchaToken.slice(0, 4096) : undefined;

  const { error } =
    channel === "email"
      ? await supabase.auth.signInWithOtp({
          email: checked.value,
          options: {
            shouldCreateUser: true,
            captchaToken,
            emailRedirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        })
      : await supabase.auth.signInWithOtp({
          phone: checked.value,
          options: { shouldCreateUser: true, channel: "sms", captchaToken },
        });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("captcha")) {
      return Response.json({ error: "Please complete the security check and try again." }, { status: 400 });
    }
    if (msg.includes("provider") || msg.includes("sms")) {
      console.error("[otp] SMS provider error:", error.message);
      return Response.json(
        { error: "Mobile sign-in is temporarily unavailable. Please use Google or email." },
        { status: 503 },
      );
    }
    if (error.status === 429) return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    console.error("[otp]", error.message);
    return Response.json({ error: "We couldn't send a code just now. Please try again." }, { status: 502 });
  }

  return Response.json({ identifier: checked.value });
}
