import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageShell, { PageHeader } from "@/components/ui/PageShell";
import CTABand from "@/components/ui/CTABand";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { FOUNDERS } from "@/lib/content/team";
import { CAPABILITIES } from "@/lib/content/services";
import {
  baseGraphNodes,
  breadcrumbSchema,
  graph,
  webPageSchema,
} from "@/lib/schema";

const title = "About HEILC";
const description =
  "HEILC is an AI and digital transformation agency in Chennai, founded by Pardhasaradhi Menda and Varshith Dondamuri, building AI systems that reach production.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/about",
});

const principles = [
  {
    heading: "Evaluation before implementation",
    body: "We build the evaluation set — real questions, real records, an agreed definition of correct — before we write model code. Without it, 'better' is an opinion and nobody can say when the project is finished.",
  },
  {
    heading: "You own everything at the end",
    body: "Repository, model weights, training data, documentation, cloud account. No licence-back, no proprietary runtime you have to keep paying for. If you wanted to continue without us, you could.",
  },
  {
    heading: "We will tell you when AI is the wrong tool",
    body: "A rules engine, a better query, or leaving a working legacy system alone are all legitimate outcomes of a discovery week. Saying so early is cheaper for you than discovering it in week five.",
  },
  {
    heading: "Numbers come with their source",
    body: "Every figure on this site names the dataset or the constraint it was measured under. Where we do not have a number, we say so rather than reaching for a plausible one.",
  },
];

export default function AboutPage() {
  const schema = graph([
    ...baseGraphNodes(),
    webPageSchema({ path: "/about", name: `${title} | HEILC`, description }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
  ]);

  return (
    <PageShell>
      <JsonLd schema={schema} />

      <PageHeader
        eyebrow="— WHO WE ARE"
        title="An engineering agency, not a strategy deck"
        lead="HEILC builds AI products, machine learning models and the enterprise software they live inside. We work from Chennai, India, with clients worldwide, and we measure ourselves on what reaches production."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      {/* Story */}
      <section className="max-w-7xl mx-auto px-8 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="relative h-[420px] rounded-2xl overflow-hidden border border-white/8">
          <Image
            src="/assets/about-bg.jpg"
            alt="The HEILC engineering workspace"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent" />
          <div className="absolute bottom-6 left-6 glass-card rounded-xl px-4 py-3">
            <p className="text-teal text-xs mb-1">FOUNDED BY</p>
            {FOUNDERS.map((founder) => (
              <p key={founder.slug} className="text-white text-sm font-semibold">
                {founder.name}
              </p>
            ))}
          </div>
        </div>

        <div className="prose-heilc">
          <h2 style={{ marginTop: 0 }}>Why HEILC exists</h2>
          <p>
            Most AI work dies in the gap between a notebook that produces an
            impressive output once and a system a business can depend on daily.
            The interesting engineering is almost entirely in that gap:
            evaluation, retrieval quality, access control, latency budgets, cost
            per query, monitoring, and what happens when a model provider is
            degraded at two in the morning.
          </p>
          <p>
            HEILC was founded to work in that gap. We take a problem from the
            decision it has to support through to a deployed, monitored,
            documented system running in the client&apos;s own cloud account —
            and we prove it works against an evaluation set built before the
            first line of model code.
          </p>
          <p>
            Our own products are the reference. GeneRisk AI classifies DNA
            sequences at 97.37% accuracy on held-out data. CineGenome holds
            structured analysis of 3,477 films across four independent dimensions
            and serves recommendations from cached vectors rather than live model
            calls. ResumeAI went from concept to working build inside a 24-hour
            hackathon. Different problems, same discipline.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section aria-labelledby="founders" className="max-w-7xl mx-auto px-8 pb-24">
        <h2
          id="founders"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(30px,4vw,52px)" }}
          className="text-white mb-3"
        >
          THE <span className="text-gradient">FOUNDERS</span>
        </h2>
        <p className="text-white/60 text-sm mb-12 max-w-2xl">
          Two people, named, who are on the calls and on the commits.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FOUNDERS.map((founder) => (
            <article
              key={founder.slug}
              id={founder.slug}
              className="glass-card rounded-2xl p-8 border border-white/8 scroll-mt-32"
            >
              <h3 className="text-white text-2xl font-semibold mb-1">
                {founder.name}
              </h3>
              <p className="text-teal text-sm mb-6">{founder.role}</p>
              <p className="text-white/55 text-sm leading-relaxed mb-6">
                {founder.longBio}
              </p>
              <p className="text-white/55 text-[11px] tracking-widest uppercase mb-3">
                Focus areas
              </p>
              <ul className="space-y-2">
                {founder.focus.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-white/50 text-sm leading-relaxed"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="principles" className="max-w-7xl mx-auto px-8 pb-24">
        <h2
          id="principles"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(30px,4vw,52px)" }}
          className="text-white mb-12"
        >
          HOW WE <span className="text-gradient">WORK</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {principles.map((principle) => (
            <div key={principle.heading}>
              <h3 className="text-white text-lg font-semibold mb-3">
                {principle.heading}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {principle.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities links */}
      <section aria-labelledby="what-we-do" className="max-w-7xl mx-auto px-8 pb-24">
        <h2
          id="what-we-do"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(30px,4vw,52px)" }}
          className="text-white mb-12"
        >
          WHAT WE <span className="text-gradient">TAKE ON</span>
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none">
          {CAPABILITIES.map((capability) => (
            <li key={capability.slug}>
              <Link
                href={`/services/${capability.slug}`}
                className="group block glass-card rounded-2xl p-6 border border-white/8 hover:border-teal/30 transition-all h-full"
              >
                <h3 className="text-white font-semibold mb-2 group-hover:text-teal transition-colors">
                  {capability.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {capability.definition}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CTABand
        title="Work with us"
        body="Tell us what you are building and what is in the way. We will be straight about whether we are the right team for it."
        secondaryLabel="Read the FAQ"
        secondaryHref="/faq"
      />
    </PageShell>
  );
}
