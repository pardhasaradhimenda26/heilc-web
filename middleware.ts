import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { AUTH_ENABLED, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";
import { firewall } from "@/lib/security/firewall";

const SESSION_PATHS = /^\/(api|account|welcome|auth)(\/|$)/;

/**
 * 1. Firewall: every request is screened first (lib/security/firewall.ts).
 * 2. Keeps the Supabase session cookie fresh on the routes that read it on
 *    the server. Content pages skip this, so they stay static and cached.
 */
export async function middleware(request: NextRequest) {
  const blocked = firewall(request);
  if (blocked) return blocked;

  let response = NextResponse.next({ request });
  if (!AUTH_ENABLED || !SESSION_PATHS.test(request.nextUrl.pathname)) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  // Everything except build assets and images served from /public/assets.
  matcher: ["/((?!_next/static|_next/image|assets/|favicon\\.ico).*)"],
};
