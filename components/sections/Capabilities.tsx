"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, RefreshCw, Code2, Zap } from "lucide-react";
import { CAPABILITIES } from "@/lib/content/services";

const icons: Record<string, typeof Brain> = {
  "artificial-intelligence-solutions": Brain,
  "digital-transformation-and-modernization": RefreshCw,
  "enterprise-software-engineering": Code2,
  "intelligent-automation-solutions": Zap,
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="py-32 bg-[#080808]"
    >
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="flex items-start gap-16 mb-20">
          <p
            aria-hidden="true"
            className="text-white/8 font-display text-[120px] leading-none select-none hidden lg:block"
          >
            01
          </p>
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-label mb-4"
            >
              — WHAT WE DO
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                id="capabilities-heading"
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(48px,7vw,88px)",
                  lineHeight: 0.95,
                }}
              >
                <span className="text-white">CORE</span>
                <br />
                <span className="text-gradient">CAPABILITIES</span>
              </motion.h2>
            </div>
          </div>
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-0 list-none">
          {CAPABILITIES.map((cap, i) => {
            const Icon = icons[cap.slug] ?? Brain;
            return (
              <motion.li
                key={cap.slug}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group relative border-b border-white/8 md:odd:border-r md:border-r-white/8"
              >
                <Link href={`/services/${cap.slug}`} className="block p-8 h-full">
                  {/* Left accent line */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-8 w-[2px] h-0 group-hover:h-[calc(100%-64px)] transition-all duration-500"
                    style={{ background: cap.color }}
                  />

                  <div className="flex items-start gap-6 pl-4">
                    <span className="text-white/50 text-sm font-mono mt-1">{cap.num}</span>
                    <div className="flex-1">
                      <span
                        aria-hidden="true"
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: `${cap.color}18`,
                          border: `1px solid ${cap.color}33`,
                        }}
                      >
                        <Icon size={18} style={{ color: cap.color }} />
                      </span>
                      <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-teal transition-colors duration-300">
                        {cap.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed">
                        {cap.summary}
                      </p>
                      <span className="flex items-center gap-2 mt-5 text-teal text-xs tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                        EXPLORE <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
