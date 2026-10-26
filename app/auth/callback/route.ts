import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getServerSupabase } from "@/lib/supabase/server";

/** Only same-site relative paths are accepted as a post-login destination. */
function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

/**
 * Completes OAuth (Google, Facebook) and email-link sign-in, then sends the
 * visitor to onboarding the first time or straight back to where they were.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get("next"));
  const origin = url.origin;
  const supabase = getServerSupabase();

  if (!supabase) return NextResponse.redirect(`${origin}${next}`);

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  let failed = Boolean(url.searchParams.get("error"));
  if (!failed && code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    failed = Boolean(error);
  } else if (!failed && tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    failed = Boolean(error);
  } else if (!code && !tokenHash) {
    failed = true;
  }

  if (failed) {
    return NextResponse.redirect(
      `${origin}/login?error=signin_failed&next=${encodeURIComponent(next)}`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login?error=signin_failed`);

  await supabase.from("security_events").insert({ user_id: user.id, event: "sign_in" });

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.redirect(`${origin}/welcome?next=${encodeURIComponent(next)}`);
  }

  await supabase.rpc("touch_last_active");
  return NextResponse.redirect(`${origin}${next}`);
}
