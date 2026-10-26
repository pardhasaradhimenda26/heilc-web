# Personal data breach — response playbook

DPDP Act 2023 s.8(6) and the DPDP Rules, 2025: on becoming aware of a personal data breach, HEILC must inform **each affected person** and the **Data Protection Board of India** without delay, then send the Board a **detailed report within 72 hours**.

A breach is *any* unauthorised processing, accidental disclosure, acquisition, sharing, use, alteration, destruction or loss of access that compromises confidentiality, integrity or availability (s.2(u)). A leaked API key that *could* expose data, an email sent to the wrong person, or a lost laptop with exported data all count.

## First hour

1. **Contain.** Rotate the exposed secret (Supabase service-role key, Resend/Groq keys in Vercel → Settings → Environment Variables → redeploy). Revoke sessions in Supabase (Authentication → Users → sign out all) if accounts may be affected. Take the affected feature offline if needed.
2. **Preserve evidence.** Export Supabase logs (Logs Explorer), Vercel logs, and the `security_events` table. Don't delete anything.
3. **Start a log** in this format: time noticed, who noticed, what happened, systems involved, data types, number of people, actions taken (with times).

## Within the same day — tell people

**To the Board** (intimation, without delay): description of the breach, nature, extent, timing, location, and likely impact. Use the Board's digital office as published by the Board.

**To each affected person** — plain language, via email to the address on their account:

> Subject: Important: a security incident affecting your HEILC account
>
> Hi {first name},
>
> On {date} we found that {what happened, one sentence}. This may have exposed your {data types}. 
>
> What could happen: {likely consequences}.
> What we've done: {containment steps}.
> What you can do: {e.g. watch for phishing emails that mention HEILC; sign out of other sessions}.
>
> Questions: {Grievance Officer name}, {email}. We're sorry this happened.
>
> — HEILC

## Within 72 hours — detailed report to the Board

- Updated description, facts and circumstances, and cause
- Measures taken to mitigate risk
- Findings about the person responsible (if any)
- Remedial measures to prevent recurrence
- Report of the intimations sent to affected people

## Afterwards

- Write a short post-incident review; add a row to `COMPLIANCE.md` if a control changed.
- Keep the incident log for at least one year.

## Contacts to keep current

| Role | Name | Contact |
|---|---|---|
| Grievance Officer / incident lead | Pardhasaradhi Menda | set `NEXT_PUBLIC_GRIEVANCE_EMAIL` |
| Backup | Varshith Dondamuri | — |
| Data Protection Board of India | — | via the Board's official digital office |
