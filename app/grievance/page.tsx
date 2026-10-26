import type { Metadata } from "next";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import GrievanceForm from "@/components/privacy/GrievanceForm";
import { pageMetadata } from "@/lib/seo";
import { GRIEVANCE_OFFICER } from "@/lib/site";
import { GRIEVANCE_TIMELINE } from "@/lib/privacy/notice";

const title = "Grievance redressal";
const description =
  "Raise a data-protection grievance with HEILC: access, correction, erasure, consent withdrawal, nomination or any concern about your personal data.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/grievance" });

export default function GrievancePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="— DATA PROTECTION"
        title="Raise a grievance"
        lead="Any concern about how HEILC handles your personal data — or a request to access, correct, erase or stop processing it."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Grievance", path: "/grievance" },
        ]}
      />
      <div className="max-w-5xl mx-auto px-8 pb-32 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <GrievanceForm />
        <aside className="space-y-4 text-sm text-white/65">
          <div className="glass-card rounded-2xl p-6">
            <p className="text-white font-semibold mb-1">{GRIEVANCE_OFFICER.name}</p>
            <p className="text-white/50 text-xs mb-3">{GRIEVANCE_OFFICER.role}</p>
            <a href={`mailto:${GRIEVANCE_OFFICER.email}`} className="text-teal underline break-all">
              {GRIEVANCE_OFFICER.email}
            </a>
          </div>
          <div className="glass-card rounded-2xl p-6 space-y-2">
            <p>We acknowledge {GRIEVANCE_TIMELINE.acknowledge}.</p>
            <p>We resolve {GRIEVANCE_TIMELINE.resolve}.</p>
            <p>
              If you&apos;re not satisfied after this process, you can complain to the Data Protection Board of India
              (DPDP Act, s.13(3)).
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
