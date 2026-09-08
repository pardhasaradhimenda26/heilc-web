"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { CASE_STUDIES, badgeTextColor } from "@/lib/content/case-studies";

const industries = [
  "Healthcare",
  "FinTech",
  "EdTech",
  "E-Commerce",
  "Real Estate",
  "HR & Recruitment",
  "SaaS",
  "Logistics",
];

/** Each number is bound to its own label so it is never an orphaned figure. */
const proofPoints = [
  { value: "97.37%", label: "GeneRisk AI accuracy on held-out test data" },
  { value: "3,477", label: "Films enriched in the CineGenome index" },
  { value: "24 hrs", label: "Concept to working build for ResumeAI" },
];

export default function CaseStudies() {
  const [industry, setIndustry] = useState("");
  const [problem, setProblem] = useState("");
  const [proposal, setProposal] = useState("");
  const [generating, setGenerating] = useState(false);

  const generateProposal = async () => {
    if (!industry || !problem.trim()) return;
    setGenerating(true);
    setProposal("");

    try {
      const res = await fetch("/api/casegen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, problem }),
      });

      if (res.status === 429) {
        setProposal("Please wait a moment before generating another proposal.");
        setGenerating(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        setProposal((prev) => prev + decoder.decode(value));
      }
    } catch {
      setProposal("Error generating proposal. Please try again.");
    }
    setGenerating(false);
  };

  return (
    <section id="work" aria-labelledby="work-heading" className="py-32 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-8">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 pb-8 border-b border-white/10">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-baseline gap-3"
          >
            <span
              style={{ fontFamily: "var(--font-bebas)" }}
              className="text-[#E0E0E0] text-[64px] leading-[0.8]"
            >
              {CASE_STUDIES.length}
            </span>
            <span className="text-white/60 text-xs tracking-widest uppercase max-w-[120px]">
              detailed case studies
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="section-label mb-1">— OUR WORK</p>
            <h2
              id="work-heading"
              className="text-white font-bold text-xl md:text-2xl tracking-wide uppercase"
            >
              Featured AI &amp; digital transformation case studies
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/case-studies"
              aria-label="View all case studies"
              className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-colors"
            >
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* Project cards */}
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-8 list-none">
          {CASE_STUDIES.map((project, i) => (
            <motion.li
              key={project.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <Link
                href={`/case-studies/${project.slug}`}
                className="group block h-full glass-card rounded-[12px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
              >
                <div className="relative h-[200px] overflow-hidden bg-[#111]">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/80 to-transparent" />
                  <span
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      background: project.badgeColor,
                      color: badgeTextColor(project.badgeColor),
                    }}
                  >
                    {project.badge}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-white font-bold text-base mb-1 group-hover:text-teal transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-teal text-xs mb-3">{project.subtitle}</p>
                  <p className="text-white/60 text-xs leading-relaxed mb-4">
                    {project.metrics[0].value} — {project.metrics[0].label}
                  </p>
                  <ul className="flex flex-wrap gap-1.5 list-none">
                    {project.tags.slice(0, 3).map((tag) => (
                      <li
                        key={tag}
                        className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/50 text-[10px]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Proof points — number and label as one unit */}
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-8 pb-20">
          {proofPoints.map((point) => (
            <div key={point.label}>
              <dd
                style={{ fontFamily: "var(--font-bebas)", fontSize: "36px" }}
                className="text-gradient leading-none mb-1"
              >
                {point.value}
              </dd>
              <dt className="text-[#E0E0E0]/60 text-xs leading-relaxed">
                {point.label}
              </dt>
            </div>
          ))}
        </dl>

        {/* Proposal Generator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 md:p-12"
          style={{ border: "1px solid rgba(20,197,212,0.2)" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={20} className="text-teal" aria-hidden="true" />
            <p className="section-label">LIVE PROPOSAL GENERATOR</p>
          </div>
          <h3
            style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(28px,4vw,48px)" }}
            className="text-white mb-2"
          >
            GET YOUR CUSTOM HEILC PROPOSAL
          </h3>
          <p className="text-white/60 text-sm mb-8">
            Tell us your industry and challenge. HEILC AI writes a branded
            solution proposal in seconds.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="proposal-industry" className="block text-white/50 text-xs mb-2">
                Your industry
              </label>
              <select
                id="proposal-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-teal/40 transition-colors appearance-none"
              >
                <option value="" className="bg-[#111]">
                  Select your industry
                </option>
                {industries.map((ind) => (
                  <option key={ind} value={ind} className="bg-[#111]">
                    {ind}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={generateProposal}
                disabled={!industry || !problem.trim() || generating}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal text-black font-bold text-sm rounded-xl disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {generating ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"
                    />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} aria-hidden="true" />
                    Generate Proposal
                  </>
                )}
              </button>
            </div>
          </div>

          <label htmlFor="proposal-problem" className="block text-white/50 text-xs mb-2">
            Your business challenge
          </label>
          <textarea
            id="proposal-problem"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Describe your business challenge or what you want to build..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-teal/40 transition-colors resize-none mb-4"
          />

          {proposal && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              aria-live="polite"
              className="mt-6 p-6 rounded-xl bg-white/3 border border-teal/20"
            >
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                {proposal}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
