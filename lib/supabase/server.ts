import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { AUTH_ENABLED, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import type { Profile } from "./types";

export type { Profile } from "./types";

/**
 * Server client bound to the visitor's auth cookies. Use it in route handlers
 * and server components; row-level security applies as that user.
 */
export function getServerSupabase(): SupabaseClient | null {
  if (!AUTH_ENABLED) return null;
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a server component, where cookies are read-only.
          // The middleware refreshes the session instead.
        }
      },
    },
  });
}

/**
 * Service-role client for jobs that act on behalf of HEILC rather than a
 * visitor (retention clean-up). Never import this into client code.
 */
export function getAdminSupabase(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!AUTH_ENABLED || !key) return null;
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}


export type GateResult =
  | { ok: true; user: User | null; profile: Profile | null; supabase: SupabaseClient | null }
  | { ok: false; response: Response };

/**
 * Guard for API routes that need a signed-in, onboarded visitor. With auth
 * switched off it lets everyone through, preserving the old behaviour.
 */
export async function requireSignedIn(): Promise<GateResult> {
  const supabase = getServerSupabase();
  if (!supabase) return { ok: true, user: null, profile: null, supabase: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: Response.json(
        { error: "Please sign in to continue.", code: "auth_required" },
        { status: 401 },
      ),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (!profile) {
    return {
      ok: false,
      response: Response.json(
        { error: "Finish setting up your profile first.", code: "onboarding_required" },
        { status: 403 },
      ),
    };
  }

  // Activity timestamp drives the 3-year inactivity retention rule.
  void supabase.rpc("touch_last_active");

  return { ok: true, user, profile, supabase };
}
