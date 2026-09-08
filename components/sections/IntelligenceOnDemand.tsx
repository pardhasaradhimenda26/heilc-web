"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function IntelligenceOnDemand() {
  return (
    <section
      aria-labelledby="iod-heading"
      className="relative py-32 bg-[#080808] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(20,197,212,0.06) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {/* Split text layout */}
        <h2 id="iod-heading" className="flex items-center justify-between gap-8 mb-16 font-normal">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span
              style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px,8vw,100px)", lineHeight: 0.9 }}
              className="text-white block"
            >
              INTELLIGENCE
            </span>
          </motion.div>

          {/* Center orb visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-shrink-0 hidden md:flex items-center justify-center"
          >
            <div className="relative w-32 h-32 lg:w-48 lg:h-48">
              <div className="absolute inset-0 rounded-full border border-teal/20 animate-ping" style={{ animationDuration: "3s" }} />
              <div className="absolute inset-4 rounded-full border border-teal/30" />
              <div className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{ background: "radial-gradient(circle, rgba(20,197,212,0.15) 0%, transparent 70%)" }}>
                <div className="w-3 h-3 rounded-full bg-teal animate-pulse" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span
              style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px,8vw,100px)", lineHeight: 0.9 }}
              className="text-gradient text-right block"
            >
              ON DEMAND
            </span>
          </motion.div>
        </h2>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pt-12 border-t border-white/8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/50 text-base leading-relaxed max-w-md"
          >
            A cross-functional pod — AI architect, ML engineer, full-stack
            engineer, product designer — embedded with your team on a fixed
            monthly commitment. Senior capability in days rather than the three
            to six months a comparable hire takes.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            href="/faq#intelligence-on-demand"
            className="flex items-center gap-2 text-white hover:text-teal transition-colors group"
          >
            <span className="text-sm tracking-widest uppercase border-b border-white/30 group-hover:border-teal pb-1 transition-colors">
              How the pod model works
            </span>
            <ArrowRight size={16} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
