# DPDP Act 2023 — compliance matrix for heilc.com

Every section of the Digital Personal Data Protection Act, 2023 (No. 22 of 2023), read against this website. Status as of **2026-10-26** (notice version `2026-10-26`).

**Commencement.** The DPDP Rules, 2025 were notified on 13–14 November 2025. Board provisions are in force; the Consent Manager rule starts November 2026; the core operational duties (notice, security, breach reporting, retention, children, rights) start **May 2027**. This site already implements them so nothing changes on that date.

**Legend:** ✅ implemented · ⚙️ needs a one-time action by HEILC (listed at the bottom) · ➖ does not apply to HEILC (reason given).

| Section | What it requires | Applies? | How heilc.com meets it | Where |
|---|---|---|---|---|
| 1 | Short title, commencement | ➖ | Informational. | — |
| 2 | Definitions | ✅ | Notice uses the Act's terms: Data Fiduciary (HEILC), Data Principal, Data Processor, child (<18), personal data breach. | `app/privacy/page.tsx` |
| 3(a) | Applies to digital personal data collected in India | ✅ | All account, request, chat and grievance data is digital → full compliance. | — |
| 3(b) | Applies to processing outside India for offering services in India | ✅ | Processors outside India (Groq, Resend, Vercel edge) are disclosed and contracted. | `lib/privacy/notice.ts` → `PROCESSORS` |
| 3(c) | Exempts personal/domestic use and data made public by the person | ➖ | HEILC is a business; exemption not relied on. | — |
| 4(1) | Process only for a lawful purpose with consent or a legitimate use | ✅ | Every data item has a stated purpose and basis. Consent for account/profile/chat; s.7(a) also covers voluntarily sent requests. | `DATA_INVENTORY` |
| 4(2) | "Lawful purpose" = not forbidden by law | ✅ | All purposes are ordinary business purposes. | — |
| 5(1) | Notice with or before consent: the data and purpose; how to exercise s.6(4) and s.13 rights; how to complain to the Board | ✅ | Itemised notice shown inside the sign-in panel **before** any button can send data to Google/Facebook/email; covers data, purpose, withdrawal, grievance and Board complaint. | `components/auth/AuthPanel.tsx`, `lib/privacy/notice.ts` |
| 5(2) | Notice for consent given before the Act | ➖ | No pre-existing consent-based accounts. Old contact-form emails: see action ⚙️7. | — |
| 5(3) | Notice available in English or any Eighth Schedule language | ✅ ⚙️ | Consent notice in English, Hindi, Tamil, Telugu with a language switcher; any other Eighth Schedule language on request via grievance form. See ⚙️6 to add more. | `CONSENT_NOTICE`, `/privacy#languages` |
| 6(1) | Consent free, specific, informed, unconditional, unambiguous, clear affirmative action, limited to necessary data | ✅ | Unticked checkbox that must be ticked; buttons disabled until then. Marketing is a separate optional box. Only name + "who are you" required in onboarding; phone, company, goal optional. GPS location and third-party IP lookups removed. | `AuthPanel.tsx`, `Onboarding.tsx`, `PersonaContext.tsx` |
| 6(2) | Consent infringing the Act is invalid to that extent | ✅ | No waiver clauses anywhere; terms don't limit DPDP rights. | `app/terms/page.tsx` |
| 6(3) | Consent request in clear language, language option, contact of person who responds | ✅ | Plain-language notice, 4 languages, Grievance Officer name + email in notice. | `CONSENT_NOTICE`, `GRIEVANCE_OFFICER` |
| 6(4) | Withdraw consent any time, as easily as giving it | ✅ | One-step toggles for marketing and personalisation; "Withdraw consent and delete account" on Account page; privacy-choices banner reopenable from every footer. | `AccountDashboard.tsx`, `ConsentBanner.tsx` |
| 6(5) | Consequences of withdrawal borne by the person; past processing stays lawful | ✅ | Stated in notice §7. | `/privacy#rights` |
| 6(6) | On withdrawal, stop processing and make processors stop | ✅ | Account deletion erases profile + requests (cascade); personalisation withdrawal deletes cached region data in browser. Processors: ⚙️3. | `delete_my_account()` in migration, `saveSiteChoices()` |
| 6(7)–(9) | Consent Managers | ➖ | Optional for fiduciaries; HEILC doesn't use one. | — |
| 6(10) | Fiduciary must prove notice and consent | ✅ | `consent_log` stores purpose, action, notice version, language, source and time for every grant/withdrawal; profile stores `notice_version` and `consented_at`. | migration `0001`, `Onboarding.tsx` |
| 7(a) | Legitimate use: data voluntarily provided for a purpose | ✅ | Contact requests and grievances. | — |
| 7(b)–(i) | State benefits, legal obligations, emergencies, disasters, employment | ➖ | Not activities of this website (employment data of HEILC staff is outside this site). | — |
| 8(1) | Fiduciary responsible, including for processors | ✅ | Stated in notice §5; processor list maintained. | `/privacy#sharing` |
| 8(2) | Processors only under a valid contract | ⚙️ | Accept each provider's DPA (free, click-through). See ⚙️3. | — |
| 8(3) | Completeness, accuracy, consistency when data is used for decisions or shared | ✅ | No automated decisions; visitors edit their own profile; requests emailed with profile context verbatim. | `AccountDashboard.tsx` |
| 8(4) | Appropriate technical and organisational measures | ✅ | This matrix, incident playbook, retention job, RLS, consent records. | `docs/dpdp/` |
| 8(5) | Reasonable security safeguards to prevent breach | ✅ | HTTPS + HSTS; CSP, X-Frame-Options, Permissions-Policy; row-level security on every table; no passwords stored (OTP/OAuth); rate limits and input validation on every API; HTML-escaping in emails (fixed an injection bug in the old contact route); service-role key server-only; Next.js patched to 14.2.35 (fixes the middleware-bypass CVE). | `next.config.mjs`, migration, `app/api/*`, `lib/email.ts` |
| 8(6) | Notify the Board and each affected person of a breach | ✅ ⚙️ | Breach playbook with timelines and templates; grievance form flags "Possible data breach" to the team immediately. | `docs/dpdp/incident-response.md`, `app/api/grievance/route.ts` |
| 8(7) | Erase when consent withdrawn or purpose no longer served; make processors erase | ✅ | Self-service erasure; retention periods per data item; daily retention job. | `/api/cron/daily`, `retention_sweep()` |
| 8(8) | Purpose deemed over if person doesn't engage for the prescribed period | ✅ | Accounts idle 3 years → 48-hour notice email → erased unless they sign in (Rules: 48h notice). | `/api/cron/daily` |
| 8(9) | Publish contact of a person who answers questions | ✅ ⚙️ | Grievance Officer name + email in notice, sign-in panel, grievance page, footer. Set a real inbox: ⚙️5. | `GRIEVANCE_OFFICER` in `lib/site.ts` |
| 8(10) | Effective grievance redressal mechanism | ✅ | `/grievance` form (anonymous or signed-in), reference number, stored + emailed, timelines published. | `app/grievance`, `app/api/grievance` |
| 8(11) | "Not approached" clarification | ✅ | `last_active_at` updated on sign-in and every API use. | `touch_last_active()` |
| 9(1) | Verifiable parental consent for children (<18) | ✅ | Accounts restricted to 18+; age confirmed in the consent checkbox and stored (`age_confirmed` must be true). No children's data processed. | `AuthPanel.tsx`, migration |
| 9(2) | No processing detrimental to a child's well-being | ✅ | No children's accounts. | — |
| 9(3) | No tracking, behavioural monitoring or targeted ads at children | ✅ | No ad or analytics trackers at all; old in-memory "behaviour score" removed. | `PersonaContext.tsx` |
| 9(4)–(5) | Exemptions for classes/ages | ➖ | Not relied on. | — |
| 10 | Significant Data Fiduciary duties (DPO, audits, DPIA) | ➖ | Only applies if the Government notifies HEILC as an SDF; volume and sensitivity are far below that. | — |
| 11(1) | Right to a summary of data, processing, and who it's shared with | ✅ | "Download my data" exports everything plus processing purposes and the processor list. | `AccountDashboard.tsx` |
| 11(2) | Sharing with law enforcement need not be listed | ✅ | Noted in notice §5. | — |
| 12(1)–(2) | Correction, completion, updating | ✅ | Every profile field editable on Account page. | `AccountDashboard.tsx` |
| 12(3) | Erasure on request | ✅ | Self-service, immediate; or via grievance form. | `delete_my_account()` |
| 13(1)–(2) | Readily available grievance redressal; respond within prescribed period | ✅ | Acknowledge within 72h, resolve within 30 days (90-day legal maximum). | `/grievance` |
| 13(3) | Exhaust grievance redressal before approaching the Board | ✅ | Explained in notice and grievance page. | — |
| 14 | Right to nominate | ✅ | Nominee name + contact on Account page. | `AccountDashboard.tsx` |
| 15 | Duties of Data Principals | ✅ | Explained in notice §12 and terms §7. | `/privacy#duties`, `/terms` |
| 16 | Government may restrict transfers to notified countries | ✅ ⚙️ | No country is restricted today; processor locations disclosed. Re-check if a notification is issued. | `PROCESSORS` |
| 17 | Exemptions (legal claims, courts, investigations, startups etc.) | ➖ | Not relied on. 17(3) startup exemption only applies if the Government notifies it. | — |
| 18–26 | Data Protection Board: establishment, composition, members, staff | ➖ | Obligations on the Government, not on HEILC. | — |
| 27–28 | Board powers, inquiries, directions | ✅ | HEILC must comply with any Board direction; complaint route explained to users. | — |
| 29–30 | Appeals to TDSAT | ➖ | Procedural. | — |
| 31 | Mediation | ➖ | Procedural. | — |
| 32 | Voluntary undertaking | ➖ | Procedural; if ever given, breaching it is a breach of the Act (Schedule item 6). | — |
| 33–34 | Penalties | ✅ | See Schedule below — each penalty line maps to a control above. | — |
| 35–37 | Good faith protection, Government information requests, blocking orders | ➖ | Government powers. | — |
| 38 | Act is in addition to other laws | ✅ | IT Act, 2000 still applies; the old IT Act s.43A is repealed by s.44(2). | — |
| 39–43 | Bar of civil court jurisdiction, rules, laying, schedule amendment, removing difficulties | ➖ | Procedural. | — |
| 44 | Amendments to TRAI Act, IT Act (s.43A omitted), RTI Act | ➖ | Informational. | — |

### The Schedule (penalties) → control

| # | Breach | Max penalty | Control on heilc.com |
|---|---|---|---|
| 1 | No reasonable security safeguards (s.8(5)) | ₹250 crore | RLS, headers, OTP/OAuth, rate limits, escaping, patched framework |
| 2 | Failure to notify a breach (s.8(6)) | ₹200 crore | `incident-response.md` |
| 3 | Children's obligations (s.9) | ₹200 crore | 18+ only, no trackers |
| 4 | Significant Data Fiduciary duties (s.10) | ₹150 crore | Not applicable |
| 5 | Data Principal duties (s.15) | ₹10,000 | Users informed |
| 6 | Breach of a voluntary undertaking (s.32) | As applicable | None given |
| 7 | Any other provision | ₹50 crore | Rows above |

### What changed in the code to get here

- Removed silent third-party IP geolocation (ipapi.co, freeipapi.com) and the GPS + bigdatacloud.com reverse-geocoding feature; region personalisation now uses the hosting platform's own headers and only after opt-in.
- Removed the auto-opening "Who are you?" modal; persona now comes from consented onboarding.
- Fixed HTML injection in the contact email (user input was inserted unescaped).
- Added notice, consent capture, consent log, rights dashboard, grievance mechanism, retention job, security headers.

## ⚙️ One-time actions for HEILC

1. **Run the database migration** `supabase/migrations/0001_heilc_accounts_and_privacy.sql` in the Supabase SQL editor.
2. **Choose the Mumbai (ap-south-1) region** when creating the Supabase project, so account data stays in India.
3. **Accept processor DPAs** (all free, in each dashboard): Supabase (Settings → Legal), Vercel (vercel.com/legal/dpa), Resend, Groq. Keep the signed copies. *(s.8(2))*
4. **Read `incident-response.md` once** and keep the Board contact details current in it.
5. **Set up a real privacy inbox** (e.g. privacy@heilc.com via free email forwarding) and set `NEXT_PUBLIC_GRIEVANCE_EMAIL`. The notice currently shows `hello@heilc.com` — confirm that inbox exists and is monitored. *(s.8(9))*
6. **Notice languages:** the four translations were written for this release; have a native speaker check the Hindi, Tamil and Telugu text. Add more languages to `CONSENT_NOTICE` as requests come in. *(s.5(3))*
7. **Old enquiries:** contact-form emails received before this release sit in the team inbox. Delete those no longer needed for an active conversation. *(s.8(7))*
8. **Supabase dashboard:** keep "Confirm email" on; set the OTP expiry to 10 minutes; restrict redirect URLs to heilc.com.
9. **Review this matrix** whenever a new form, tracker, integration or processor is added, and bump `PRIVACY_NOTICE_VERSION` when the notice changes.

*This document is an engineering compliance record, not legal advice. Have it reviewed by a lawyer before relying on it.*
