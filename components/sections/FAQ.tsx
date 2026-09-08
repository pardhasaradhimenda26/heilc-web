"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQS } from "@/lib/content/faq";

/**
 * Homepage accordion. Answer text is ALWAYS in the DOM — the panel is
 * collapsed with an animated height rather than unmounted — so every answer
 * ships in the server-rendered HTML and matches the FAQPage schema exactly.
 * `aria-hidden` keeps collapsed panels out of the accessibility tree.
 */
export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/6"
    >
      <div className="max-w-5xl mx-auto px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <HelpCircle className="text-teal" size={18} aria-hidden="true" />
            <span className="section-label">TECHNICAL KNOWLEDGE BASE</span>
          </motion.div>

          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px,5vw,64px)",
              lineHeight: 1,
            }}
            className="text-white mb-4"
          >
            FREQUENTLY ASKED <span className="text-gradient">QUESTIONS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-sm leading-relaxed"
          >
            Security, IP ownership, timelines, integration, cost and SLAs —
            answered specifically. The{" "}
            <Link href="/faq" className="text-teal underline underline-offset-2 hover:text-white">
              full FAQ page
            </Link>{" "}
            has every answer written out in one place.
          </motion.p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i, 5) * 0.08 }}
                className="glass-card rounded-2xl overflow-hidden border border-white/8 hover:border-teal/30 transition-all duration-300"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${faq.id}`}
                    id={`faq-button-${faq.id}`}
                  >
                    <span className="space-y-1">
                      <span className="block text-[10px] font-mono tracking-widest text-teal uppercase">
                        {faq.category}
                      </span>
                      <span className="block text-white font-semibold text-base md:text-lg pr-4">
                        {faq.question}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "rotate-180 bg-teal/20 border-teal/40 text-teal"
                          : "text-white/60"
                      }`}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>
                </h3>

                {/*
                  Always rendered. `grid-template-rows` animates from 0fr to
                  1fr, which collapses the panel without removing the text.
                */}
                <div
                  id={`faq-panel-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-button-${faq.id}`}
                  aria-hidden={!isOpen}
                  className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 pt-2 border-t border-white/5 text-white/60 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/faq"
            className="inline-flex px-6 py-3 border border-white/20 text-white text-sm rounded-full hover:border-teal hover:text-teal transition-all"
          >
            Read the full FAQ
          </Link>
        </div>
      </div>
    </section>
  );
}
