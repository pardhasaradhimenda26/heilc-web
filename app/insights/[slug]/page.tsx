import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import CTABand from "@/components/ui/CTABand";
import ArticleBody from "@/components/insights/ArticleBody";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { ARTICLES, getArticle, headingId } from "@/lib/content/insights";
import { FOUNDERS } from "@/lib/content/team";
import {
  articleSchema,
  baseGraphNodes,
  breadcrumbSchema,
  graph,
} from "@/lib/schema";

interface Props {
  params: { slug: string };
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};

  const author = FOUNDERS.find((f) => f.slug === article.authorSlug);

  return pageMetadata({
    title: article.title,
    description: article.metaDescription,
    path: `/insights/${article.slug}`,
    type: "article",
    publishedTime: article.datePublished,
    modifiedTime: article.dateModified,
    authors: author ? [author.name] : undefined,
    tags: article.tags,
  });
}

export default function ArticlePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const author = FOUNDERS.find((f) => f.slug === article.authorSlug);
  const others = ARTICLES.filter((a) => a.slug !== article.slug);
  const headings = article.blocks.filter(
    (b): b is { type: "h2"; text: string } => b.type === "h2",
  );

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: article.title, path: `/insights/${article.slug}` },
  ];

  const schema = graph([
    ...baseGraphNodes(),
    breadcrumbSchema(crumbs),
    articleSchema(article),
  ]);

  return (
    <PageShell>
      <JsonLd schema={schema} />

      <PageHeader
        eyebrow="— INSIGHTS"
        title={article.title}
        lead={article.standfirst}
        crumbs={crumbs}
      >
        <div className="flex flex-wrap items-center gap-3 mt-8 text-xs text-white/60">
          <time dateTime={article.datePublished}>
            {dateFormat.format(new Date(article.datePublished))}
          </time>
          <span aria-hidden="true">·</span>
          <span>{article.readingMinutes} min read</span>
          {author && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                By{" "}
                <Link
                  href={`/about#${author.slug}`}
                  className="text-teal underline underline-offset-2 hover:text-white"
                >
                  {author.name}
                </Link>
                , {author.jobTitle}
              </span>
            </>
          )}
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-8 pb-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-16">
        <article>
          <ArticleBody blocks={article.blocks} />

          {author && (
            <footer className="mt-16 glass-card rounded-2xl p-7 border border-white/8">
              <p className="section-label mb-3">About the author</p>
              <p className="text-white font-semibold mb-1">{author.name}</p>
              <p className="text-teal text-xs mb-4">{author.role}</p>
              <p className="text-white/50 text-sm leading-relaxed">{author.bio}</p>
            </footer>
          )}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="On this page" className="glass-card rounded-2xl p-6 border border-white/8">
            <p className="section-label mb-4">On this page</p>
            <ul className="space-y-2.5 list-none">
              {headings.map((heading) => (
                <li key={heading.text}>
                  <a
                    href={`#${headingId(heading.text)}`}
                    className="text-white/50 text-xs leading-relaxed hover:text-teal transition-colors block"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <p className="section-label mb-4">More insights</p>
            <ul className="space-y-3 list-none">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/insights/${item.slug}`}
                    className="text-white/60 text-sm hover:text-teal transition-colors leading-snug block"
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
        title="Working on this problem right now?"
        body="If your version of this has a constraint the article does not cover, that is exactly the conversation we are useful in."
        secondaryLabel="All insights"
        secondaryHref="/insights"
      />
    </PageShell>
  );
}
