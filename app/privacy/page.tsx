import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { BUSINESS_LOCATION, GRIEVANCE_OFFICER, PRIVACY_NOTICE_VERSION } from "@/lib/site";
import {
  CONSENT_NOTICE,
  DATA_INVENTORY,
  GRIEVANCE_TIMELINE,
  NOTICE_LANGUAGES,
  PROCESSORS,
} from "@/lib/privacy/notice";
import { baseGraphNodes, breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";

const title = "Privacy Notice";
const description =
  "How HEILC collects, uses, shares and protects personal data under India's Digital Personal Data Protection Act, 2023 — and how to exercise your rights.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/privacy" });

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-white text-xl font-semibold mt-14 mb-4 scroll-mt-28">
      {children}
    </h2>
  );
}

export default function PrivacyPage() {
  const schema = graph([
    ...baseGraphNodes(),
    webPageSchema({ path: "/privacy", name: `${title} | HEILC`, description }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Privacy", path: "/privacy" },
    ]),
  ]);

  return (
    <PageShell>
      <JsonLd schema={schema} />
      <PageHeader
        eyebrow="— PRIVACY"
        title="Privacy notice"
        lead="What we collect, why, who sees it, how long we keep it, and how you stay in control — written to the Digital Personal Data Protection Act, 2023 (DPDP Act)."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]}
      >
        <p className="text-white/45 text-xs mt-6">Version {PRIVACY_NOTICE_VERSION}</p>
      </PageHeader>

      <article className="max-w-3xl mx-auto px-8 pb-32 text-white/65 text-[15px] leading-relaxed">
        <nav aria-label="On this page" className="glass-card rounded-2xl p-6 mb-4">
          <p className="text-white text-sm font-semibold mb-3">On this page</p>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm list-decimal pl-5">
            {[
              ["who", "Who we are"],
              ["languages", "This notice in your language"],
              ["what", "What we collect and why"],
              ["not", "What we don't do"],
              ["sharing", "Who we share it with"],
              ["retention", "How long we keep it"],
              ["rights", "Your rights"],
              ["exercise", "How to use your rights"],
              ["children", "Children"],
              ["security", "How we protect it"],
              ["breach", "If something goes wrong"],
              ["duties", "Your duties"],
              ["changes", "Changes to this notice"],
            ].map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="hover:text-teal">{label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <H2 id="who">1. Who we are</H2>
        <p>
          HEILC (&ldquo;we&rdquo;) is an AI and digital transformation agency based in{" "}
          {BUSINESS_LOCATION.addressLocality}, {BUSINESS_LOCATION.addressRegion}, India. For the personal data
          described here, HEILC is the <strong className="text-white">Data Fiduciary</strong> — we decide why and
          how it is processed (DPDP Act, s.2(i)).
        </p>
        <p className="mt-3">
          Questions about your data, and grievances, go to our <strong className="text-white">{GRIEVANCE_OFFICER.role}</strong>:{" "}
          {GRIEVANCE_OFFICER.name},{" "}
          <a href={`mailto:${GRIEVANCE_OFFICER.email}`} className="text-teal underline">{GRIEVANCE_OFFICER.email}</a>, or the{" "}
          <Link href="/grievance" className="text-teal underline">grievance form</Link> (s.8(9), s.8(10)).
        </p>

        <H2 id="languages">2. This notice in your language</H2>
        <p className="mb-4">
          The summary you see before signing in is available in the languages below. If you&apos;d like it in any other
          language in the Eighth Schedule to the Constitution, ask through the{" "}
          <Link href="/grievance" className="text-teal underline">grievance form</Link> and we will provide it (s.5(3), s.6(3)).
        </p>
        <div className="space-y-2">
          {NOTICE_LANGUAGES.map((l) => {
            const n = CONSENT_NOTICE[l.code];
            return (
              <details key={l.code} lang={l.code} className="glass-card rounded-xl px-5 py-3" open={l.code === "en"}>
                <summary className="cursor-pointer text-white text-sm font-semibold">{l.label}</summary>
                <div className="mt-3 text-sm space-y-2">
                  <p>{n.intro}</p>
                  <ul className="list-disc pl-5 space-y-1">{n.items.map((i) => <li key={i}>{i}</li>)}</ul>
                  <p>{n.rights}</p>
                  <p>{n.grievance}</p>
                </div>
              </details>
            );
          })}
        </div>

        <H2 id="what">3. What we collect and why</H2>
        <p className="mb-4">
          Reading the site needs no account and no personal data beyond what any web request carries. We ask for data
          only when you choose to sign in, send a request, generate a proposal or talk to our assistant — and only what
          that purpose needs (s.4, s.6(1)).
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-left text-sm border-separate border-spacing-y-2 min-w-[640px]">
            <thead>
              <tr className="text-white/50 text-xs uppercase tracking-wider">
                <th className="px-2">Personal data</th>
                <th className="px-2">Purpose</th>
                <th className="px-2">Basis</th>
                <th className="px-2">Kept for</th>
              </tr>
            </thead>
            <tbody>
              {DATA_INVENTORY.map((d) => (
                <tr key={d.data} className="align-top">
                  <td className="px-2 py-2 text-white/85 bg-white/[0.03] rounded-l-lg">{d.data}</td>
                  <td className="px-2 py-2 bg-white/[0.03]">{d.purpose}</td>
                  <td className="px-2 py-2 bg-white/[0.03]">{d.basis}</td>
                  <td className="px-2 py-2 bg-white/[0.03] rounded-r-lg">{d.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          Sign-in providers: if you use Google or Facebook, we receive your name, email address and profile picture
          from them — nothing else. We never ask for your password, contacts or social posts.
        </p>

        <H2 id="not">4. What we don&apos;t do</H2>
        <ul className="list-disc pl-5 space-y-2">
          <li>We don&apos;t sell or rent personal data, and we run no advertising or analytics trackers.</li>
          <li>We don&apos;t ask for precise (GPS) location. Region personalisation uses only your approximate location, only with your permission, and stays in your browser.</li>
          <li>We don&apos;t make decisions that legally or significantly affect you by automated means. The assistant and proposal generator produce drafts; people at HEILC make every real decision.</li>
          <li>We don&apos;t create accounts for, track, or target advertising at anyone under 18.</li>
        </ul>

        <H2 id="sharing">5. Who we share it with</H2>
        <p className="mb-4">
          These service providers process personal data on our behalf, as Data Processors under contract (s.8(2)). We
          remain responsible for what they do with it (s.8(1)). Some are outside India; the DPDP Act permits transfer
          except to countries the Government restricts by notification (s.16), and we will stop any transfer that
          becomes restricted.
        </p>
        <ul className="space-y-2">
          {PROCESSORS.map((p) => (
            <li key={p.name} className="glass-card rounded-xl px-4 py-3 text-sm">
              <span className="text-white font-semibold">{p.name}</span> — {p.role}.{" "}
              <span className="text-white/45">Location: {p.location}.</span>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          We disclose personal data to authorities only when Indian law requires it (s.7(c)–(e)), and we will tell you
          when the law allows us to.
        </p>

        <H2 id="retention">6. How long we keep it</H2>
        <p>
          The table above lists each period. We erase personal data once its purpose is served or when you withdraw
          consent, whichever comes first, unless a law requires us to keep it (s.8(7)). If your account is inactive for
          three years we treat its purpose as no longer served: we email you 48 hours before erasing it, and signing in
          stops the deletion (s.8(8)). Our processors are instructed to erase what we shared with them (s.8(7)(b)).
        </p>

        <H2 id="rights">7. Your rights</H2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-white">Access (s.11)</strong> — a summary of your data, what we do with it, and everyone we&apos;ve shared it with.</li>
          <li><strong className="text-white">Correction, completion, updating and erasure (s.12)</strong> — fix or remove anything, or delete your account entirely.</li>
          <li><strong className="text-white">Withdraw consent (s.6(4))</strong> — at any time, as easily as you gave it. Withdrawing doesn&apos;t make earlier processing unlawful, and you won&apos;t be able to use account-only features afterwards (s.6(5)); we stop processing and ask our processors to stop too (s.6(6)).</li>
          <li><strong className="text-white">Grievance redressal (s.13)</strong> — a fast, free route to raise any concern with us.</li>
          <li><strong className="text-white">Nominate (s.14)</strong> — name someone to exercise these rights if you die or become unable to.</li>
        </ul>

        <H2 id="exercise">8. How to use your rights</H2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Signed in? Your <Link href="/account" className="text-teal underline">Account page</Link> lets you view and edit everything, download all your data, set a nominee, change consents and delete your account — immediately, no email needed.</li>
          <li>Otherwise, use the <Link href="/grievance" className="text-teal underline">grievance form</Link> or email {GRIEVANCE_OFFICER.email}.</li>
          <li>We acknowledge grievances {GRIEVANCE_TIMELINE.acknowledge} and resolve them {GRIEVANCE_TIMELINE.resolve}.</li>
          <li>If you are not satisfied after using our grievance process, you can complain to the <strong className="text-white">Data Protection Board of India</strong> (s.13(3), s.27).</li>
        </ul>

        <H2 id="children">9. Children</H2>
        <p>
          Accounts are for people aged 18 or over; we ask you to confirm this before sign-in. Under the DPDP Act anyone
          under 18 is a child, and processing their data needs verifiable parental consent (s.9(1)). We don&apos;t offer
          that, so if we learn a child has created an account we delete it. We never track, behaviourally monitor or
          target advertising at children (s.9(3)).
        </p>

        <H2 id="security">10. How we protect it</H2>
        <p>Reasonable security safeguards (s.8(5)), including:</p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Encryption in transit everywhere (HTTPS with HSTS), and encryption at rest by our database provider.</li>
          <li>Database row-level security: every person can read only their own records; staff access is limited to what a task needs.</li>
          <li>Rate limits and input validation on every form and AI endpoint; strict browser security headers.</li>
          <li>Sign-in, export and deletion events logged and kept for one year to detect misuse.</li>
          <li>No passwords stored by us — sign-in is via one-time codes or your Google/Facebook account.</li>
        </ul>

        <H2 id="breach">11. If something goes wrong</H2>
        <p>
          If a personal data breach affects you, we will tell you and the Data Protection Board without delay — what
          happened, the likely consequences, what we&apos;re doing about it and what you can do — followed by a detailed
          report to the Board within 72 hours (s.8(6); DPDP Rules, 2025).
        </p>

        <H2 id="duties">12. Your duties</H2>
        <p>
          The DPDP Act also asks you not to impersonate anyone, not to suppress material information, not to file false
          or frivolous grievances, and to give only verifiably authentic information when asking for a correction or
          erasure (s.15).
        </p>

        <H2 id="changes">13. Changes to this notice</H2>
        <p>
          If we change what we collect or why, we update this notice, change its version number, and ask for your
          consent again before processing anything new. This is version {PRIVACY_NOTICE_VERSION}. See also our{" "}
          <Link href="/terms" className="text-teal underline">terms of use</Link> and{" "}
          <Link href="/data-deletion" className="text-teal underline">data deletion instructions</Link>.
        </p>
      </article>
    </PageShell>
  );
}
