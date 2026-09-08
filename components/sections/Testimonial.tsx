"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CASE_STUDIES } from "@/lib/content/case-studies";

const technologies = [
  "React",
  "Next.js",
  "Claude AI",
  "PostgreSQL",
  "Python",
  "Node.js",
  "Vercel",
];

/**
 * This section previously carried an unattributed client quote. HEILC has no
 * verifiable named testimonial to publish, and an anonymous quote is a weaker
 * trust signal than none, so it is replaced with claims that can be checked:
 * the shipped work and the stack behind it.
 */
export default function Testimonial() {
  return (
    <section aria-labelledby="proof-heading" className="py-32 bg-[#030303]">
      <div className="max-w-5xl mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-label mb-6">— PROOF, NOT PROMISES</p>
          <h2
            id="proof-heading"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(28px,4.5vw,56px)",
              lineHeight: 1.1,
            }}
            className="text-white mb-6"
          >
            EVERY CLAIM ON THIS SITE HAS
            <span className="text-gradient"> A NUMBER AND A SOURCE.</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl mx-auto mb-12">
            We publish the dataset a figure was measured on, or we do not publish
            the figure. Below are the three products behind the numbers you see
            elsewhere on this page.
          </p>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 text-left list-none">
            {CASE_STUDIES.map((study) => (
              <li key={study.slug}>
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="group block h-full glass-card rounded-2xl p-6 border border-white/8 hover:border-teal/30 transition-all"
                >
                  <span
                    style={{ fontFamily: "var(--font-bebas)", fontSize: "40px" }}
                    className="text-gradient leading-none block mb-2"
                  >
                    {study.metrics[0].value}
                  </span>
                  <span className="block text-white/60 text-xs leading-relaxed mb-4">
                    {study.metrics[0].label}
                  </span>
                  <span className="text-white text-sm font-semibold group-hover:text-teal transition-colors">
                    {study.title} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="section-label mb-8">BUILT WITH</p>
          <ul className="flex flex-wrap items-center justify-center gap-8 list-none">
            {technologies.map((tech) => (
              <li
                key={tech}
                className="text-white/50 text-sm font-medium tracking-wide"
              >
                {tech}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
