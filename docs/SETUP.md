# Switching it all on — free setup guide

Everything below is on a free plan. Total time: about an hour, mostly waiting for DNS. Until step 1 is done the site behaves exactly as before (no login, all forms open), so you can merge the code first.

Replace `<ref>` with your Supabase project reference (the part before `.supabase.co`).

## 1. Supabase — accounts and database (free: 50,000 users)

1. https://supabase.com/dashboard/new → **New project** → name `heilc` → region **South Asia (Mumbai)** → generate a strong DB password and save it.
2. **SQL Editor** → New query → paste all of `supabase/migrations/0001_heilc_accounts_and_privacy.sql` → **Run**.
3. **Authentication → URL Configuration**
   - Site URL: `https://www.heilc.com`
   - Redirect URLs: `https://www.heilc.com/auth/callback`, `http://localhost:3000/auth/callback`
4. **Project Settings → API**: copy the Project URL, the `anon`/publishable key and the `service_role` key (for step 7).
5. **Authentication → Emails → Templates → Magic Link**: make sure the body contains `{{ .Token }}` so people get a 6-digit code, e.g.
   `Your HEILC sign-in code is {{ .Token }}. Or click: {{ .ConfirmationURL }}`

> Free projects pause after 7 days with no activity. The daily job (`/api/cron/daily`) queries the database once a day so this never happens.

## 2. Google sign-in (free)

1. https://console.cloud.google.com/apis/credentials/consent → **External** → app name `HEILC`, support email, logo, app domain `https://www.heilc.com`, privacy policy `https://www.heilc.com/privacy`, terms `https://www.heilc.com/terms`, authorised domains `heilc.com` and `supabase.co`. Scopes: only `email`, `profile`, `openid`. **Publish app**.
2. https://console.cloud.google.com/apis/credentials → **Create credentials → OAuth client ID → Web application**
   - Authorised JavaScript origins: `https://www.heilc.com`
   - Authorised redirect URI: `https://<ref>.supabase.co/auth/v1/callback`
3. Copy the Client ID and secret → Supabase **Authentication → Sign In / Providers → Google** → enable → paste → save.

## 3. Facebook sign-in (free)

1. https://developers.facebook.com/apps/ → **Create app** → use case **Authenticate and request data from users with Facebook Login**.
2. **App settings → Basic**: App domains `heilc.com`; Privacy policy URL `https://www.heilc.com/privacy`; User data deletion → **Data deletion instructions URL** `https://www.heilc.com/data-deletion`; category; icon. Save.
3. **Facebook Login → Settings**: Valid OAuth Redirect URIs `https://<ref>.supabase.co/auth/v1/callback`.
4. Permissions: `email`, `public_profile` (standard access, no review needed).
5. Switch the app from **Development** to **Live**.
6. Copy App ID and App secret → Supabase **Providers → Facebook** → enable → paste → save.

## 4. Email codes through Resend (free: 3,000/month, 100/day)

Supabase's built-in mailer only sends to your own team, so real visitors need custom SMTP.

1. https://resend.com/domains → **Add domain** `heilc.com` → add the DNS records it shows at your domain registrar → wait for **Verified**.
2. Supabase **Authentication → Emails → SMTP Settings** → enable custom SMTP:
   host `smtp.resend.com`, port `465`, user `resend`, password = a Resend API key, sender `no-reply@heilc.com`, name `HEILC`.
3. In Vercel set `CONTACT_FROM_EMAIL="HEILC <hello@heilc.com>"` so team notifications also come from your domain.

## 5. Groq — the assistant and proposal generator (free, no card)

https://console.groq.com/keys → **Create API key** → copy. Free limits are roughly 30 requests/minute and 1,000/day on the default model, with an automatic fallback to a second free model. That's plenty for an agency site.

## 6. Phone sign-in (optional — not free)

SMS costs money with every provider (Supabase needs Twilio/MessageBird/Vonage; Firebase only sends SMS on its paid plan). The code is ready: connect an SMS provider in Supabase → Providers → Phone, then set `NEXT_PUBLIC_ENABLE_PHONE_LOGIN=true`. Until then, onboarding still asks for an optional phone/WhatsApp number for call-backs.

## 7. Vercel environment variables

Vercel → project → **Settings → Environment Variables** (Production + Preview), then **Redeploy**:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (secret) |
| `GROQ_API_KEY` | from step 5 |
| `RESEND_API_KEY` | existing |
| `CONTACT_RECEIVER_EMAIL` | where enquiries go |
| `CONTACT_FROM_EMAIL` | `HEILC <hello@heilc.com>` |
| `NEXT_PUBLIC_GRIEVANCE_EMAIL` | a monitored privacy inbox |
| `CRON_SECRET` | any long random string |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | from step 8 |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | from step 9 (optional) |

`ANTHROPIC_API_KEY` is no longer required — only add it if you want a paid fallback.

> **Heads-up on cost:** Vercel's free Hobby plan is for non-commercial use under Vercel's terms. If you want to stay free *and* within the terms for a business site, Cloudflare Pages and Netlify's free tiers allow commercial use.

## 8. Google Search Console (free)

1. https://search.google.com/search-console → **Add property**.
   - Best: **Domain** `heilc.com` → add the TXT record at your registrar.
   - Or **URL prefix** `https://www.heilc.com/` → **HTML tag** → copy only the `content="…"` value into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → redeploy → **Verify**.
2. **Sitemaps** → submit `sitemap.xml`.
3. **URL Inspection** → request indexing for `/`, `/services`, `/case-studies`, `/about`, `/contact`, `/faq`.

## 9. Bing Webmaster Tools (free — also feeds ChatGPT search and Copilot)

1. https://www.bing.com/webmasters → **Import from Google Search Console** (no extra verification).
2. **Sitemaps** → submit `https://www.heilc.com/sitemap.xml`.
3. After every meaningful deploy: `npm run indexnow` (pings Bing, Yandex, Seznam, Naver instantly).

## 10. Google Business Profile (free — the biggest lever for "agency near me / in Chennai")

https://business.google.com/create → **HEILC** → primary category *Software company* (add *Website designer* as secondary) → **service-area business** (hide the street address; serve Chennai, India and online) → website `https://www.heilc.com` → verify (usually a short video). Then add services, photos of real work, and ask happy clients for Google reviews.

## 11. Free listings that help AI assistants find and recommend HEILC

Assistants recommend brands that independent sites describe consistently. Create matching profiles (same name, one-line description, `https://www.heilc.com`) on: LinkedIn company page, Clutch, GoodFirms, DesignRush, Crunchbase (free), and a GitHub organisation. Then update `SOCIAL_LINKS` in `lib/site.ts` so `sameAs` points only to profiles that really exist.

## 12. Spline robot (optional, faster still)

If the NEXBOT scene is in your own Spline account: **Export → Code → Public URL**, then self-host it with `@splinetool/runtime`. This removes the third-party page entirely. Not required — the poster + early load already fixes the slow start.
