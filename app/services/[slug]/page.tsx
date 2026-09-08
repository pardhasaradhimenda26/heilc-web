import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import CTABand from "@/components/ui/CTABand";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { SERVICES, getService } from "@/lib/content/services";
import {
  baseGraphNodes,
  breadcrumbSchema,
  graph,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const service = getService(params.slug);
  if (!service) return {};

  return pageMetadata({
    title: service.title,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

export default function ServiceDetailPage({ params }: Props) {
  const service = getService(params.slug);
  if (!service) notFound();

  const related = service.related
    .map(getService)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.title, path: `/services/${service.slug}` },
  ];

  const schema = graph([
    ...baseGraphNodes(),
    webPageSchema({
      path: `/services/${service.slug}`,
      name: `${service.title} | HEILC`,
      description: service.metaDescription,
    }),
    breadcrumbSchema(crumbs),
    serviceSchema(service),
  ]);

  return (
    <PageShell>
      <JsonLd schema={schema} />

      <PageHeader
        eyebrow={`— ${service.group === "capability" ? "CORE CAPABILITY" : "WHAT WE BUILD"} ${service.num}`}
        title={service.title}
        lead={service.definition}
        crumbs={crumbs}
      >
        <div className="flex flex-wrap gap-2 mt-8">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full border border-white/10 text-white/50 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-8 pb-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-16">
        {/* Body */}
        <article className="prose-heilc">
          {service.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section>
            <h2>What you get</h2>
            <ul>
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>How the engagement runs</h2>
            <p>{service.engagement}</p>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <p className="section-label mb-4">Deliverables</p>
            <ul className="space-y-3">
              {service.deliverables.map((item) => (
                <li key={item} className="flex gap-3 text-white/55 text-sm leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-2 w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {related.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-white/8">
              <p className="section-label mb-4">Related services</p>
              <ul className="space-y-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/services/${item.slug}`}
                      className="text-white/60 text-sm hover:text-teal transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="glass-card rounded-2xl p-6 border border-teal/20">
            <p className="text-white text-sm font-semibold mb-2">Scope this with us</p>
            <p className="text-white/50 text-xs leading-relaxed mb-4">
              A first call is a conversation about your data and the decision it
              has to support — not a pitch.
            </p>
            <Link
              href="/contact"
              className="inline-flex px-5 py-2.5 bg-teal text-black font-bold text-xs rounded-full hover:opacity-90 transition-opacity"
            >
              Get in touch
            </Link>
          </div>
        </aside>
      </div>

      <CTABand
        title={`Ready to talk about ${service.title.toLowerCase()}?`}
        body="Bring the problem, the data you already have, and the constraint you are working against. We will tell you what is feasible and what is not."
        secondaryLabel="Browse all services"
        secondaryHref="/services"
      />
    </PageShell>
  );
}
