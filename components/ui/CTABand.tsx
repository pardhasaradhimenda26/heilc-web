import Link from "next/link";

export default function CTABand({
  title = "Start with a scoped conversation",
  body = "Tell us the decision the software has to support. We will tell you whether AI is the right tool for it, and what it would take to find out.",
  primaryLabel = "Talk to the engineering team",
  primaryHref = "/contact",
  secondaryLabel = "See how we work",
  secondaryHref = "/case-studies",
}: {
  title?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="max-w-7xl mx-auto px-8 pb-32">
      <div className="glass-card rounded-2xl p-8 md:p-12 border border-teal/20">
        <h2
          style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(28px,4vw,48px)" }}
          className="text-white mb-3"
        >
          {title}
        </h2>
        <p className="text-white/50 text-sm leading-relaxed max-w-2xl mb-8">{body}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={primaryHref}
            className="px-6 py-3 bg-teal text-black font-bold text-sm rounded-full hover:opacity-90 transition-opacity text-center"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="px-6 py-3 border border-white/20 text-white text-sm rounded-full hover:border-teal hover:text-teal transition-all text-center"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
