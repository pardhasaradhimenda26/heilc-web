/**
 * Application firewall, run in middleware at Vercel's edge on every request
 * before any page or API code. Free and complementary to Vercel's built-in
 * DDoS protection (see docs/SECURITY.md for the dashboard-side rules).
 */

/** Paths only vulnerability scanners ask for. This site has none of them. */
const PROBE_PATH =
  /(^\/(wp-|wordpress|xmlrpc|phpmyadmin|pma|cgi-bin|vendor\/|admin\.php|server-status|actuator|boaform|HNAP1|\.well-known\/(?!security\.txt|apple|assetlinks)))|(\/\.(env|git|svn|hg|aws|ssh|DS_Store|htaccess|htpasswd))|\.(php\d?|asp|aspx|jsp|cgi|sql|bak|old|swp)$/i;

/** Attack tooling that announces itself. */
const BAD_AGENT =
  /(sqlmap|nikto|nmap|masscan|zgrab|acunetix|nuclei|wpscan|dirbuster|gobuster|ffuf|feroxbuster|hydra|havij|netsparker|w3af|jorgee|fimap|nessus|openvas|commix)/i;

/** Classic injection payloads in the URL. Real visitors never send these. */
const BAD_QUERY =
  /(<script|%3Cscript|javascript:|union(\s|%20|\+)+select|information_schema|sleep\(\d|benchmark\(|\.\.\/|\.\.%2f|%00|etc\/passwd|\$\{jndi:)/i;

const API_METHODS = new Set(["GET", "POST", "HEAD", "OPTIONS"]);
const MAX_API_BODY = 64 * 1024; // 64 KB — the largest legit payload is a chat history.

/** Burst limit per edge instance; the precise per-feature limits live in the API routes. */
const BURST_MAX = 60;
const BURST_WINDOW_MS = 60_000;
const burst = new Map<string, { n: number; reset: number }>();

function burstExceeded(ip: string): number {
  const now = Date.now();
  if (burst.size > 10_000) burst.clear();
  const r = burst.get(ip);
  if (!r || r.reset < now) {
    burst.set(ip, { n: 1, reset: now + BURST_WINDOW_MS });
    return 0;
  }
  r.n++;
  return r.n > BURST_MAX ? Math.ceil((r.reset - now) / 1000) : 0;
}

function block(status: number, message: string, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...extra },
  });
}

function allowedOrigin(origin: string, host: string | null): boolean {
  try {
    const o = new URL(origin);
    if (host && o.host === host) return true;
    const site = process.env.NEXT_PUBLIC_SITE_URL;
    return Boolean(site && new URL(site).host === o.host);
  } catch {
    return false;
  }
}

/** Returns a blocking Response, or null to let the request through. */
export function firewall(req: Request): Response | null {
  const url = new URL(req.url);
  const path = url.pathname;
  const ua = req.headers.get("user-agent") ?? "";

  if (PROBE_PATH.test(path)) return block(404, "Not found");
  if (BAD_AGENT.test(ua)) return block(403, "Forbidden");

  let decoded = url.search;
  try {
    decoded = decodeURIComponent(url.search);
  } catch {
    return block(400, "Bad request");
  }
  if (BAD_QUERY.test(decoded) || BAD_QUERY.test(path)) return block(403, "Forbidden");

  const isApi = path.startsWith("/api/");
  const isAuth = path.startsWith("/auth/");
  if (!isApi && !isAuth) return null;

  if (isApi && !API_METHODS.has(req.method)) {
    return block(405, "Method not allowed", { allow: "GET, POST, HEAD, OPTIONS" });
  }

  const ip =
    req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const retry = burstExceeded(ip);
  if (retry) return block(429, "Too many requests. Please slow down.", { "retry-after": String(retry) });

  if (req.method === "POST" && isApi && !path.startsWith("/api/cron/")) {
    // CSRF: browsers always send Origin on cross-site POSTs; reject foreign ones.
    const origin = req.headers.get("origin");
    if (origin && !allowedOrigin(origin, req.headers.get("host"))) return block(403, "Forbidden");

    const length = Number(req.headers.get("content-length") ?? 0);
    if (length > MAX_API_BODY) return block(413, "Request too large");

    const type = req.headers.get("content-type") ?? "";
    if (!type.includes("application/json")) return block(415, "Send JSON");
  }
  return null;
}
