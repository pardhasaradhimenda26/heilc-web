# HEILC security: login, firewall, rate limits, database

Everything here is free unless marked **(paid)**.

## 1. What the code does

| Layer | Where | What it does |
|---|---|---|
| Firewall | `lib/security/firewall.ts` (runs in `middleware.ts` before every request) | Returns 404 for scanner paths (`/wp-*`, `/.env`, `.php`, `/.git` …). Blocks attack tools by User-Agent (sqlmap, nikto, nuclei …) and injection payloads in URLs (`<script`, `union select`, `../`, `${jndi:`). On `/api`, allows only GET/POST/HEAD/OPTIONS. Rejects cross-site POSTs (CSRF), non-JSON bodies, and bodies over 64 KB. Caps each IP at 60 API/auth requests a minute. |
| Rate limits | `lib/ratelimit.ts` + `rate_limit_hit()` in Postgres | Shared across all Vercel instances. Keys are SHA-256 hashed, so no raw IPs, emails or numbers are stored. If the database is down, it falls back to in-memory limits. |
| Login | `app/api/auth/otp/route.ts`, `lib/security/identity.ts` | Email and mobile codes are requested through the server, which validates them first (details below). |
| Headers | `next.config.mjs` | Strict CSP, HSTS preload, no framing, COOP/CORP. `no-store` on account, auth and API responses. |
| Database | `supabase/migrations/0002_security_hardening.sql` | Forced row-level security on all tables. Tables and functions are revoked from anonymous users. Query timeouts. Consent proof can't be edited. Phone numbers must be E.164. |

### Rate limits

| Action | Limit |
|---|---|
| Any `/api` or `/auth` request (edge) | 60 per minute per IP |
| Sign-in code requests | 6 per 10 min per IP; 3 per 10 min per address; 10 per day per email, 5 per day per mobile |
| Chat | 12 per minute per user |
| Proposal generator | 4 per minute per user |
| Contact form | 3 per minute per user |
| Grievance form | 3 per 10 min per IP |

Supabase applies its own limits on top: code verification attempts, emails per hour and SMS per hour.

### What a "valid email" means

The address must:

- Be well-formed.
- Not be on the list of 45 throwaway inbox services.
- Have a domain that can receive mail (an MX record, or an A record).

If the DNS lookup times out, the address is allowed, so real people are never locked out.

### Mobile number rules

- A bare 10-digit number is treated as Indian: `98765 43210` becomes `+919876543210`.
- Indian numbers must start with 6, 7, 8 or 9.
- Other countries are accepted only if listed in `AUTH_PHONE_COUNTRIES`.

## 2. Setup steps only you can do

### a. Run the database migration

Supabase → **SQL Editor** → paste `supabase/migrations/0002_security_hardening.sql` → **Run**. It's safe to run again. If it warns that RLS is off on a table, fix that before going live.

Then go to **Advisors → Security Advisor** and make sure it shows no errors.

### b. Supabase Auth settings (Authentication → …)

- **Sign In / Providers → Email**:
  - Confirm email: on.
  - OTP expiry: `600` seconds.
  - OTP length: `6`.
- **Rate Limits**: keep the defaults, or lower them. Set "SMS sent per hour" to about `30` to cap spend.
- **URL Configuration**:
  - Site URL: `https://www.heilc.com`.
  - Redirect URLs: only `https://www.heilc.com/auth/callback` and `https://heilc.com/auth/callback`. Remove any `*` wildcards.
- **Attack Protection → Enable CAPTCHA**: choose Cloudflare Turnstile and paste the **secret** key (see c).
- **Sessions**: set an inactivity timeout of `30 days`.

### c. Cloudflare Turnstile: free bot check on sign-in

1. dash.cloudflare.com (free account) → **Turnstile → Add widget**.
2. Hostnames: `heilc.com`, `www.heilc.com`. Mode: **Managed**.
3. Put the **site key** in Vercel as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
4. Put the **secret key** in Supabase (b, Attack Protection).

Do both together. If only one side is set, email and mobile sign-in fail.

### d. Google sign-in

1. Go to console.cloud.google.com → **APIs & Services → OAuth consent screen**.
   - App name: `HEILC`.
   - Authorised domain: `heilc.com`.
   - Scopes: `email`, `profile`, `openid` only.
2. Go to **Credentials → Create OAuth client ID → Web application**.
   - Authorised redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`.
3. In Supabase, go to **Providers → Google**, paste the Client ID and Secret, and enable it.

### e. Mobile number sign-in (needs an SMS provider; no free option exists)

In Supabase, go to **Providers → Phone** and connect an SMS provider.

- **Twilio**: the trial credit is enough for testing, but trial accounts only text numbers you've verified.
- **For real Indian traffic**: Indian law requires DLT registration of the sender ID and message template for all SMS. Twilio and MSG91 both guide you through it. Expect roughly ₹0.15–0.30 per message, plus provider fees.

Until a provider is connected, set `NEXT_PUBLIC_AUTH_PROVIDERS=google,email` in Vercel so the mobile button is hidden. Once it's connected, add `phone` back to the list.

### f. Vercel firewall (dashboard → project → **Firewall**)

- **Bot Protection / Attack Challenge Mode**: turn on only during an attack. It challenges every visitor.
- **Custom rules**: the Hobby plan includes a few. Suggested rules:
  1. Rate limit `/api/auth/otp`: 10 requests per minute per IP, action Deny.
  2. Deny requests where the path starts with `/wp-` or ends in `.php`. This stops them before middleware runs, which saves invocations.
- **Deployment Protection**: turn on Vercel Authentication for Preview deployments.

### g. Keep the keys safe

- `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, `RESEND_API_KEY` and `CRON_SECRET` must be Vercel variables of type **Sensitive**. Never give them a `NEXT_PUBLIC_` prefix.
- Turn on 2-factor authentication on GitHub, Vercel, Supabase, Google, Cloudflare and Resend.
- If a key ever leaks: rotate it in its own dashboard, update it in Vercel, then redeploy.
- In GitHub → repo → **Settings → Code security**, turn on secret scanning and push protection. Both are free.

### h. Backups

The Supabase Free plan has no downloadable backups. Once a month, export a copy:

- Use **Database → Backups**, if it's offered on your plan.
- Or run `supabase db dump`, using the CLI with your database password.

Store the export somewhere private and encrypted. It contains personal data, so the DPDP Act's security duty applies to it.

## 3. Check it's working

```bash
curl -I https://www.heilc.com/.env
```

You should get `404`.

```bash
curl -I -A sqlmap https://www.heilc.com/
```

You should get `403`.

```bash
curl -X POST -H "Origin: https://evil.example" -H "Content-Type: application/json" -d '{}' https://www.heilc.com/api/contact
```

You should get `403`.
