import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import { pageMetadata } from "@/lib/seo";
import { GRIEVANCE_OFFICER, PRIVACY_NOTICE_VERSION } from "@/lib/site";

const title = "Terms of Use";
const description = "The terms for using heilc.com, HEILC accounts, the HEILC assistant and the proposal generator.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/terms" });

const sections: { h: string; p: React.ReactNode }[] = [
  {
    h: "1. Using the site",
    p: "Everything on heilc.com can be read without an account. An account is needed to send requests, generate proposals and use the HEILC assistant. You must be 18 or older to create one.",
  },
  {
    h: "2. Your account",
    p: "Keep access to your email, phone or sign-in provider secure — that is how you sign in. Give accurate information, and don't sign in as someone else. You can delete your account at any time from the Account page.",
  },
  {
    h: "3. AI-generated content",
    p: "The assistant and proposal generator write first drafts from HEILC's published material. They can be wrong, and they are not quotes, offers or commitments. Anything binding comes in writing from HEILC's founders after a conversation with you.",
  },
  {
    h: "4. Acceptable use",
    p: "Don't use the site to break the law, to probe or disrupt our systems, to scrape at scale, to submit other people's personal data without their permission, or to try to make the assistant produce harmful content. We may suspend accounts that do.",
  },
  {
    h: "5. What you send us",
    p: "You keep ownership of what you tell us about your project. You let us use it only to reply to you and prepare the work you asked about, as described in our privacy notice.",
  },
  {
    h: "6. Our content",
    p: "The site's text, design, code and case studies belong to HEILC. You may quote and link to them with attribution.",
  },
  {
    h: "7. Your duties under the DPDP Act",
    p: "When you give us personal data or exercise your data rights, the Digital Personal Data Protection Act, 2023 requires you not to impersonate anyone, not to suppress material information, not to raise false or frivolous grievances, and to provide only verifiably authentic information (s.15).",
  },
  {
    h: "8. Liability",
    p: "The site is provided as is. To the extent the law allows, HEILC isn't liable for losses caused by relying on site content or AI-generated drafts without a written agreement with us.",
  },
  {
    h: "9. Law and disputes",
    p: "These terms are governed by the laws of India, and the courts at Chennai, Tamil Nadu have jurisdiction. Data-protection grievances follow the process in our privacy notice.",
  },
];

export default function TermsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="— LEGAL"
        title="Terms of use"
        lead="Short and plain. If anything here is unclear, ask us."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ]}
      />
      <article className="max-w-3xl mx-auto px-8 pb-32 text-white/65 text-[15px] leading-relaxed space-y-8">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-white text-lg font-semibold mb-2">{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}
        <p className="text-white/45 text-sm">
          Last updated {PRIVACY_NOTICE_VERSION}. Contact: {GRIEVANCE_OFFICER.email}. See the{" "}
          <Link href="/privacy" className="text-teal underline">privacy notice</Link>.
        </p>
      </article>
    </PageShell>
  );
}
