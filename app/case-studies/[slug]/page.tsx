import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import CTABand from "@/components/ui/CTABand";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { CASE_STUDIES, badgeTextColor, getCaseStudy } from "@/lib/content/case-studies";
import {
  baseGraphNodes,
  breadcrumbSchema,
  caseStudyArticleSchema,
  caseStudySchema,
  graph,
} from "@/lib/schema";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const study = getCaseStudy(params.slug);
  if (!study) return {};

  return pageMetadata({
    title: `${study.title} — ${study.subtitle}`,
    description: study.metaDescription,
    path: `/case-studies/${study.slug}`,
  });
}

export default function CaseStudyPage({ params }: Props) {
  const study = getCaseStudy(params.slug);
  if (!study) notFound();

  const others = CASE_STUDIES.filter((c) => c.slug !== study.slug);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Case studies", path: "/case-studies" },
    { name: study.title, path: `/case-studies/${study.slug}` },
  ];

  const schema = graph([
    ...baseGraphNodes(),
    breadcrumbSchema(crumbs),
    caseStudySchema(study),
    caseStudyArticleSchema(study),
  ]);

  return (
    <PageShell>
      <JsonLd schema={schema} />

      <PageHeader
        eyebrow={`— CASE STUDY · ${study.category.toUpperCase()}`}
        title={study.title}
        lead={study.subtitle}
        crumbs={crumbs}
      >
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <span
            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: study.badgeColor,
              color: badgeTextColor(study.badgeColor),
            }}
          >
            {study.badge}
          </span>
          {study.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full border border-white/10 text-white/50 text-xs"
            >
              {tag}
            </span>
          ))}
          {study.liveUrl && (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal text-black text-xs font-bold"
            >
              Visit the live product
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          )}
        </div>
      </PageHeader>

      {/* Hero image */}
      <div className="max-w-7xl mx-auto px-8 mb-16">
        <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden bg-[#111] border border-white/8">
          <Image
            src={study.image}
            alt={study.imageAlt}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1216px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Metrics */}
      <section aria-labelledby="outcome-metrics" className="max-w-7xl mx-auto px-8 mb-20">
        <h2 id="outcome-metrics" className="sr-only">
          Outcome metrics
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {study.metrics.map((metric) => (
            <div
              key={metric.label}
              className="glass-card rounded-2xl p-6 border border-white/8"
            >
              <dd>
                <span
                  style={{ fontFamily: "var(--font-bebas)", fontSize: "48px" }}
                  className="text-gradient leading-none block mb-2"
                >
                  {metric.value}
                </span>
              </dd>
              <dt className="text-white/60 text-xs leading-relaxed">{metric.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <div className="max-w-7xl mx-auto px-8 pb-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-16">
        <article className="prose-heilc">
          <section>
            <h2>The problem</h2>
            <p>{study.problem}</p>
          </section>

          <section>
            <h2>The approach</h2>
            {study.approach.map((section) => (
              <div key={section.heading}>
                <h3>{section.heading}</h3>
                <p>{section.body}</p>
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>

          <section>
            <h2>The outcome</h2>
            <p>{study.outcome}</p>
            <ul>
              {study.outcomeBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {!study.liveUrl && (
              <p className="text-white/55 text-sm">
                A public URL for this product is not currently published. The
                figures above come from HEILC&apos;s own build and evaluation
                records for the project.
              </p>
            )}
          </section>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <p className="section-label mb-4">Tech stack</p>
            <div className="space-y-5">
              {study.stack.map((group) => (
                <div key={group.group}>
                  <p className="text-white/70 text-xs font-semibold mb-2">
                    {group.group}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/50 text-[11px]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <p className="section-label mb-4">Other case studies</p>
            <ul className="space-y-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/case-studies/${item.slug}`}
                    className="text-white/60 text-sm hover:text-teal transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <CTABand
        title="Bring us the next one"
        body="If your problem looks like any of these — a model that needs to be trusted, a corpus that needs to be searchable, a deadline that is not moving — we should talk."
        secondaryLabel="All case studies"
        secondaryHref="/case-studies"
      />
    </PageShell>
  );
}
