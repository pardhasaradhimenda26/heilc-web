import { getAdminSupabase } from "@/lib/supabase/server";

export type RateLimitResult = { success: boolean; remaining: number; resetIn: number };

const memory = new Map<string, { count: number; resetTime: number }>();

function memoryLimit(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  if (memory.size > 5000) {
    memory.forEach((v, k) => {
      if (v.resetTime < now) memory.delete(k);
    });
  }
  const record = memory.get(key);
  if (!record || now > record.resetTime) {
    memory.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: max - 1, resetIn: windowMs };
  }
  record.count++;
  return {
    success: record.count <= max,
    remaining: Math.max(max - record.count, 0),
    resetIn: record.resetTime - now,
  };
}

/** Keys are hashed so no raw IP, email or phone number is ever stored. */
async function hashKey(key: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Works on both the Node and Edge runtimes (Web Crypto only).
 * Rate limit shared across every serverless instance (Supabase table, free).
 * Falls back to per-instance memory if the database isn't configured or
 * can't be reached, so limits never take the site down.
 */
export async function rateLimit(
  key: string,
  maxRequests: number,
  windowMs = 60_000,
): Promise<RateLimitResult> {
  const hashed = await hashKey(key);
  const admin = getAdminSupabase();
  if (admin) {
    const { data, error } = await admin.rpc("rate_limit_hit", {
      p_key: hashed,
      p_max: maxRequests,
      p_window_seconds: Math.ceil(windowMs / 1000),
    });
    if (!error && data) {
      const d = data as { success: boolean; remaining: number; reset_ms: number };
      return { success: d.success, remaining: d.remaining, resetIn: Number(d.reset_ms) };
    }
  }
  return memoryLimit(hashed, maxRequests, windowMs);
}

/** The visitor's IP as reported by Vercel's edge (not spoofable there). */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function tooMany(limit: RateLimitResult, message: string) {
  return Response.json(
    { error: message },
    { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetIn / 1000)) } },
  );
}
