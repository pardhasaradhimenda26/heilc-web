"use client";
import { motion } from "framer-motion";
import { Brain, RefreshCw, Code2, Zap } from "lucide-react";

const capabilities = [
  {
    num: "01",
    icon: Brain,
    title: "Artificial Intelligence Solutions",
    desc: "Custom Large Language Model (LLM) fine-tuning, Retrieval-Augmented Generation (RAG) pipelines, predictive analytics, and production-grade artificial intelligence products that deliver operational value.",
    color: "#14C5D4",
  },
  {
    num: "02",
    icon: RefreshCw,
    title: "Digital Transformation & Modernization",
    desc: "Legacy system modernization, cloud infrastructure migration, and end-to-end digital transformation that modernizes enterprise workflows and accelerates innovation.",
    color: "#7C5CBF",
  },
  {
    num: "03",
    icon: Code2,
    title: "Enterprise Software Engineering",
    desc: "Scalable web platforms, resilient full-stack systems, secure microservices, and custom API architecture designed for demanding enterprise business environments.",
    color: "#4F46E5",
  },
  {
    num: "04",
    icon: Zap,
    title: "Intelligent Automation Solutions",
    desc: "Workflow automation, AI-driven process optimization, document intelligence, and robotic process design that eliminates operational bottlenecks permanently.",
    color: "#14C5D4",
  },
];

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
    <section id="capabilities" className="py-32 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="flex items-start gap-16 mb-20">
          <p className="text-white/8 font-display text-[120px] leading-none select-none hidden lg:block">
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
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px,7vw,88px)", lineHeight: 0.95 }}
              >
                <span className="text-white">CORE</span>
                <br />
                <span className="text-gradient">CAPABILITIES</span>
              </motion.h2>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.num}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative p-8 border-b border-white/8 last:border-b-0 md:odd:border-r md:border-r-white/8"
            >
              {/* Left accent line */}
              <div
                className="absolute left-0 top-8 w-[2px] h-0 group-hover:h-[calc(100%-64px)] transition-all duration-500"
                style={{ background: cap.color }}
              />

              <div className="flex items-start gap-6 pl-4">
                <span className="text-white/20 text-sm font-mono mt-1">{cap.num}</span>
                <div className="flex-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${cap.color}18`, border: `1px solid ${cap.color}33` }}
                  >
                    <cap.icon size={18} style={{ color: cap.color }} />
                  </div>
                  <h3
                    className="text-white text-xl font-semibold mb-3 group-hover:text-teal transition-colors duration-300"
                    style={{ transform: "translateX(0)", transition: "transform 0.3s ease" }}
                  >
                    {cap.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">{cap.desc}</p>
                  <div className="flex items-center gap-2 mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-teal text-xs tracking-widest">EXPLORE</span>
                    <span className="text-teal text-sm">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
