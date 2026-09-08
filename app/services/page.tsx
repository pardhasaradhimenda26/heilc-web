import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import CTABand from "@/components/ui/CTABand";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { CAPABILITIES, OFFERINGS, SERVICES } from "@/lib/content/services";
import {
  baseGraphNodes,
  breadcrumbSchema,
  graph,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";

const title = "AI & Software Services";
const description =
  "Ten services across four capabilities and six build offerings — from RAG systems and fine-tuning to legacy modernisation, cloud platforms and design.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/services",
});

function ServiceGrid({
  services,
  headingId,
}: {
  services: typeof SERVICES;
  headingId: string;
}) {
  return (
    <ul
      aria-labelledby={headingId}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none"
    >
      {services.map((service) => (
        <li key={service.slug}>
          <Link
            href={`/services/${service.slug}`}
            className="group glass-card rounded-2xl p-7 h-full flex flex-col border border-white/8 hover:border-teal/30 transition-all duration-300"
          >
            <span className="text-white/50 text-xs font-mono mb-4">{service.num}</span>
            <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-teal transition-colors">
              {service.title}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">
              {service.definition}
            </p>
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full border border-white/10 text-white/60 text-[11px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function ServicesPage() {
  const schema = graph([
    ...baseGraphNodes(),
    webPageSchema({ path: "/services", name: `${title} | HEILC`, description }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]),
    ...SERVICES.map(serviceSchema),
  ]);

  return (
    <PageShell>
      <JsonLd schema={schema} />

      <PageHeader
        eyebrow="— SERVICES"
        title="What HEILC builds, and how"
        lead="Four core capabilities describe the kind of problem we take on. Six build offerings describe the shape of what gets delivered. Every page below states the method, the deliverables and the realistic timeline."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />

      <section className="max-w-7xl mx-auto px-8 pb-20">
        <h2
          id="capabilities-heading"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(30px,4vw,52px)" }}
          className="text-white mb-3"
        >
          CORE <span className="text-gradient">CAPABILITIES</span>
        </h2>
        <p className="text-white/60 text-sm mb-10 max-w-2xl">
          The four problem domains we take end-to-end responsibility for.
        </p>
        <ServiceGrid services={CAPABILITIES} headingId="capabilities-heading" />
      </section>

      <section className="max-w-7xl mx-auto px-8 pb-24">
        <h2
          id="offerings-heading"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(30px,4vw,52px)" }}
          className="text-white mb-3"
        >
          WHAT WE <span className="text-gradient">BUILD FOR YOU</span>
        </h2>
        <p className="text-white/60 text-sm mb-10 max-w-2xl">
          The six delivery formats those capabilities arrive in.
        </p>
        <ServiceGrid services={OFFERINGS} headingId="offerings-heading" />
      </section>

      <CTABand
        title="Not sure which of these you need?"
        body="Most engagements start as one of these and turn out to be another. A first call costs nothing and usually narrows it in half an hour."
        secondaryLabel="Read the FAQ"
        secondaryHref="/faq"
      />
    </PageShell>
  );
}
