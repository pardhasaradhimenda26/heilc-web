import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import CTABand from "@/components/ui/CTABand";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { CASE_STUDIES, badgeTextColor } from "@/lib/content/case-studies";
import { absoluteUrl } from "@/lib/site";
import {
  baseGraphNodes,
  breadcrumbSchema,
  caseStudyArticleSchema,
  caseStudySchema,
  graph,
  webPageSchema,
} from "@/lib/schema";

const title = "AI Case Studies";
const description =
  "Three products HEILC designed and shipped: a 97.37%-accuracy DNA risk classifier, a 3,477-film retrieval engine, and a resume builder delivered in 24 hours.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  const schema = graph([
    ...baseGraphNodes(),
    webPageSchema({ path: "/case-studies", name: `${title} | HEILC`, description }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Case studies", path: "/case-studies" },
    ]),
    {
      "@type": "ItemList",
      "@id": `${absoluteUrl("/case-studies")}#list`,
      name: "HEILC case studies",
      itemListElement: CASE_STUDIES.map((study, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/case-studies/${study.slug}`),
        name: study.title,
      })),
    },
    ...CASE_STUDIES.map(caseStudySchema),
    ...CASE_STUDIES.map(caseStudyArticleSchema),
  ]);

  return (
    <PageShell>
      <JsonLd schema={schema} />

      <PageHeader
        eyebrow="— OUR WORK"
        title="Three products, with the numbers attached"
        lead="Each of these is a system we designed, built and deployed. The problem, the approach, the stack and the measured outcome are all on the page — including where the number came from."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Case studies", path: "/case-studies" },
        ]}
      />

      <section className="max-w-7xl mx-auto px-8 pb-24">
        <ul className="space-y-8 list-none">
          {CASE_STUDIES.map((study) => (
            <li key={study.slug}>
              <Link
                href={`/case-studies/${study.slug}`}
                className="group grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] gap-8 glass-card rounded-2xl overflow-hidden border border-white/8 hover:border-teal/30 transition-all duration-300"
              >
                <div className="relative h-[220px] md:h-full min-h-[220px] bg-[#111]">
                  <Image
                    src={study.image}
                    alt={study.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      background: study.badgeColor,
                      color: badgeTextColor(study.badgeColor),
                    }}
                  >
                    {study.badge}
                  </span>
                </div>

                <div className="p-7 md:pr-10 md:py-8">
                  <p className="text-white/55 text-[11px] tracking-widest uppercase mb-3">
                    {study.category} · {study.year}
                  </p>
                  <h2 className="text-white text-2xl font-semibold mb-1 group-hover:text-teal transition-colors">
                    {study.title}
                  </h2>
                  <p className="text-teal text-sm mb-4">{study.subtitle}</p>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-2xl">
                    {study.summary}
                  </p>

                  <dl className="flex flex-wrap gap-x-10 gap-y-4">
                    {study.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt className="sr-only">{metric.label}</dt>
                        <dd>
                          <span
                            style={{ fontFamily: "var(--font-bebas)", fontSize: "32px" }}
                            className="text-gradient leading-none block"
                          >
                            {metric.value}
                          </span>
                          <span className="text-white/60 text-[11px] block max-w-[190px] mt-1">
                            {metric.label}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CTABand
        title="Want the same treatment for your problem?"
        body="Every one of these started with a specific question and a dataset. Bring yours."
        secondaryLabel="See our services"
        secondaryHref="/services"
      />
    </PageShell>
  );
}
