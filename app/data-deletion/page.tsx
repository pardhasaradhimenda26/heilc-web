import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import { pageMetadata } from "@/lib/seo";
import { GRIEVANCE_OFFICER } from "@/lib/site";

const title = "Delete your HEILC data";
const description =
  "How to delete your HEILC account and personal data, including data received through Facebook or Google sign-in.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/data-deletion" });

export default function DataDeletionPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="— YOUR DATA"
        title="Delete your data"
        lead="You can erase your HEILC account and everything in it yourself, at any time, in under a minute."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Data deletion", path: "/data-deletion" },
        ]}
      />
      <article className="max-w-3xl mx-auto px-8 pb-32 text-white/65 text-[15px] leading-relaxed space-y-8">
        <section>
          <h2 className="text-white text-lg font-semibold mb-2">Option 1 — do it yourself</h2>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Sign in and open your <Link href="/account" className="text-teal underline">Account page</Link>.</li>
            <li>Scroll to <em>Withdraw consent and delete account</em>.</li>
            <li>Type DELETE and press <em>Delete my account</em>.</li>
          </ol>
          <p className="mt-3">
            Your profile, requests and proposals are erased immediately. Consent and security records are unlinked
            from you and expire within a year, as the DPDP Rules require.
          </p>
        </section>
        <section>
          <h2 className="text-white text-lg font-semibold mb-2">Option 2 — ask us</h2>
          <p>
            Use the <Link href="/grievance" className="text-teal underline">grievance form</Link> (choose
            &ldquo;Erase my data&rdquo;) or email {GRIEVANCE_OFFICER.email} from the address on your account. We confirm
            within 72 hours and complete the deletion within 30 days.
          </p>
        </section>
        <section>
          <h2 className="text-white text-lg font-semibold mb-2">Signed in with Facebook or Google?</h2>
          <p>
            We only received your name, email address and profile picture. Deleting your HEILC account erases them.
            You can also remove HEILC from your Facebook account under Settings &amp; privacy → Settings → Apps and
            websites, or from your Google account under Security → Third-party apps with account access.
          </p>
        </section>
      </article>
    </PageShell>
  );
}
