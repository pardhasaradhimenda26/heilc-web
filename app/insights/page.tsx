import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import CTABand from "@/components/ui/CTABand";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { ARTICLES } from "@/lib/content/insights";
import { FOUNDERS } from "@/lib/content/team";
import { absoluteUrl } from "@/lib/site";
import {
  articleSchema,
  baseGraphNodes,
  breadcrumbSchema,
  graph,
  webPageSchema,
} from "@/lib/schema";

const title = "Insights";
const description =
  "Technical writing on AI systems that reach production: RAG pipeline architecture, fine-tuning versus retrieval, and choosing an AI development partner.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/insights",
});

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function InsightsPage() {
  const schema = graph([
    ...baseGraphNodes(),
    webPageSchema({ path: "/insights", name: `${title} | HEILC`, description }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Insights", path: "/insights" },
    ]),
    {
      "@type": "Blog",
      "@id": `${absoluteUrl("/insights")}#blog`,
      name: "HEILC Insights",
      description,
      url: absoluteUrl("/insights"),
      inLanguage: "en-US",
      blogPost: ARTICLES.map((a) => ({
        "@id": `${absoluteUrl(`/insights/${a.slug}`)}#article`,
      })),
    },
    ...ARTICLES.map(articleSchema),
  ]);

  return (
    <PageShell>
      <JsonLd schema={schema} />

      <PageHeader
        eyebrow="— INSIGHTS"
        title="How this work actually gets done"
        lead="Long-form technical writing on the decisions that determine whether an AI system survives contact with production — architecture, evaluation, cost, and choosing who builds it."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
        ]}
      />

      <section className="max-w-5xl mx-auto px-8 pb-24">
        <ul className="space-y-6 list-none">
          {ARTICLES.map((article) => {
            const author = FOUNDERS.find((f) => f.slug === article.authorSlug);
            return (
              <li key={article.slug}>
                <Link
                  href={`/insights/${article.slug}`}
                  className="group block glass-card rounded-2xl p-8 border border-white/8 hover:border-teal/30 transition-all duration-300"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-[11px] text-white/55">
                    <time dateTime={article.datePublished}>
                      {dateFormat.format(new Date(article.datePublished))}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{article.readingMinutes} min read</span>
                    {author && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{author.name}</span>
                      </>
                    )}
                  </div>

                  <h2 className="text-white text-xl md:text-2xl font-semibold mb-4 group-hover:text-teal transition-colors leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-3xl">
                    {article.standfirst}
                  </p>

                  <ul className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <li
                        key={tag}
                        className="px-2.5 py-1 rounded-full border border-white/10 text-white/60 text-[11px]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <CTABand
        title="Have a harder version of one of these problems?"
        body="These articles describe the general case. Yours will have a constraint that changes the answer — that is the conversation worth having."
        secondaryLabel="See our services"
        secondaryHref="/services"
      />
    </PageShell>
  );
}
