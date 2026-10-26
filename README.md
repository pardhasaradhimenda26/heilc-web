# HEILC Website

**Where Human Intelligence Meets the Future.**

## Setup

```bash
npm install
cp .env.example .env.local   # every key is optional — see docs/SETUP.md
npm run dev
```

Open the dev server printed in your terminal (http://localhost:3000 by default).

With no keys set, the site runs exactly as a public brochure site: no login, all forms open. Each key you add switches a feature on:

| Feature | Keys | Guide |
|---|---|---|
| Accounts (Google, Facebook, email codes), onboarding, personalisation | `NEXT_PUBLIC_SUPABASE_*` | `docs/SETUP.md` §1–4 |
| HEILC assistant + proposal generator (free Groq tier) | `GROQ_API_KEY` | §5 |
| Request emails | `RESEND_API_KEY` | §4 |
| Daily keep-alive + data retention job | `CRON_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` | §7 |
| Search Console / Bing verification | `NEXT_PUBLIC_*_SITE_VERIFICATION` | §8–9 |

## Privacy (DPDP Act 2023)

- Section-by-section compliance record: `docs/dpdp/COMPLIANCE.md`
- Breach playbook: `docs/dpdp/incident-response.md`
- Database schema with row-level security: `supabase/migrations/0001_heilc_accounts_and_privacy.sql`

## Scripts

- `npm run llms` — regenerate `public/llms-full.txt` from the site content
- `npm run indexnow` — tell Bing/IndexNow engines the pages changed (run after deploys)

## Tech stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lenis
- Supabase (auth + Postgres), Groq / Claude (assistant), Resend (email)
- Spline (hero robot, with an instant poster fallback)

## Deploy
Push to `main` → Vercel. Add environment variables in Vercel → Settings → Environment Variables.
