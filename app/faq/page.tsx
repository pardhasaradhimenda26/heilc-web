import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import CTABand from "@/components/ui/CTABand";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { FAQS } from "@/lib/content/faq";
import { absoluteUrl } from "@/lib/site";
import {
  baseGraphNodes,
  breadcrumbSchema,
  faqPageSchema,
  graph,
  webPageSchema,
} from "@/lib/schema";

const title = "Frequently Asked Questions";
const description =
  "Straight answers on HEILC's security posture, IP ownership, MVP timelines, legacy integration, the pod model, cost optimisation and SLA tiers.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/faq",
});

export default function FaqPage() {
  const schema = graph([
    ...baseGraphNodes(),
    webPageSchema({ path: "/faq", name: `${title} | HEILC`, description }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "FAQ", path: "/faq" },
    ]),
    faqPageSchema(FAQS, `${absoluteUrl("/faq")}#faq`),
  ]);

  return (
    <PageShell>
      <JsonLd schema={schema} />

      <PageHeader
        eyebrow="— TECHNICAL KNOWLEDGE BASE"
        title="Frequently asked questions"
        lead="Every answer below is stated in full on this page — no expanding, no clicking. If something you need is missing, ask us directly and we will add it here."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      />

      {/* Question index */}
      <nav aria-label="Questions on this page" className="max-w-4xl mx-auto px-8 pb-16">
        <p className="section-label mb-5">On this page</p>
        <ol className="space-y-2 list-none">
          {FAQS.map((faq, i) => (
            <li key={faq.id} className="flex gap-3 text-sm">
              <span className="text-white/50 font-mono text-xs mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <a
                href={`#${faq.id}`}
                className="text-white/55 hover:text-teal transition-colors"
              >
                {faq.question}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Answers — all rendered, all expanded */}
      <div className="max-w-4xl mx-auto px-8 pb-24 space-y-12">
        {FAQS.map((faq) => (
          <article
            key={faq.id}
            id={faq.id}
            className="scroll-mt-32 border-t border-white/8 pt-10"
          >
            <p className="text-[10px] font-mono tracking-widest text-teal uppercase mb-3">
              {faq.category}
            </p>
            <h2 className="text-white text-xl md:text-2xl font-semibold mb-4 leading-snug">
              {faq.question}
            </h2>
            <p className="text-white/60 text-[15px] leading-relaxed">{faq.answer}</p>
          </article>
        ))}
      </div>

      <section className="max-w-4xl mx-auto px-8 pb-20">
        <div className="glass-card rounded-2xl p-8 border border-white/8">
          <h2 className="text-white text-lg font-semibold mb-3">
            Still have a question?
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            The fastest route is a direct message — we answer technical questions
            with technical answers, and we will tell you if the honest answer is
            &ldquo;that depends on your data&rdquo;.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-6 py-3 bg-teal text-black font-bold text-sm rounded-full hover:opacity-90 transition-opacity"
          >
            Ask us directly
          </Link>
        </div>
      </section>

      <CTABand
        title="Ready for a scoped conversation?"
        body="Bring the problem and the data you already have. Half an hour usually settles whether there is a project here."
        secondaryLabel="Read our insights"
        secondaryHref="/insights"
      />
    </PageShell>
  );
}
