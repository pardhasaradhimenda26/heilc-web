"use client";
import { motion } from "framer-motion";

/**
 * These are the industries HEILC builds for, not a client roster. The heading
 * says so plainly: the previous "trusted by global brands" framing implied
 * client logos that do not exist, and the large "70" beside it was an orphaned
 * figure with nothing behind it.
 */
const industries = [
  ["Healthcare", "FinTech", "EdTech"],
  ["E-Commerce", "Real Estate", "SaaS"],
  ["HR & Recruitment", "Logistics", "AI Startups"],
];

const industryCount = industries.flat().length;

export default function TrustedBy() {
  return (
    <section
      aria-labelledby="industries-heading"
      className="py-24 bg-[#050505] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6"
          >
            <p className="flex items-baseline gap-3">
              {/* Decorative: the sr-only sibling carries the same figure. */}
              <span
                aria-hidden="true"
                style={{ fontFamily: "var(--font-bebas)" }}
                className="text-white/15 text-[96px] leading-[0.8]"
              >
                {industryCount}
              </span>
              <span className="sr-only">
                {industryCount} industries we build for
              </span>
            </p>
            <h2 id="industries-heading" className="flex flex-col">
              <span className="text-white font-medium tracking-wide uppercase">
                Industries we build for
              </span>
              <span className="text-white/60 text-sm">
                Where our AI and digital transformation work has shipped
              </span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8">
          {industries.map((column, colIdx) => (
            <ul
              key={colIdx}
              className="flex flex-col gap-6 border-l border-white/5 pl-8 list-none"
            >
              {column.map((industry, i) => (
                <motion.li
                  key={industry}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: colIdx * 0.1 + i * 0.1 }}
                  className="group"
                >
                  <span
                    style={{ fontFamily: "var(--font-bebas)" }}
                    className="text-white/60 text-[40px] md:text-[56px] leading-[1] transition-colors duration-500 group-hover:text-white block"
                  >
                    {industry}
                  </span>
                </motion.li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
