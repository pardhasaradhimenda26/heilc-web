"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

const projects = [
  {
    title: "GeneRisk AI",
    subtitle: "ML-Powered Cancer Risk Prediction",
    desc: "DNA sequence analysis platform using XGBoost achieving 97.37% accuracy. Deployed on Railway with a Flask API and React dashboard.",
    tags: ["Python", "XGBoost", "React", "Railway", "ML"],
    img: "/assets/generisk-mockup.jpg",
    badge: "LIVE",
    badgeColor: "#14C5D4",
  },
  {
    title: "CineGenome",
    subtitle: "AI Film Recommendation Platform",
    desc: "Cinematic DNA-based recommendation engine analyzing 3,477 films across Visual, Narrative, Audio, Emotional dimensions powered by Claude AI and Pinecone.",
    tags: ["Next.js", "Claude AI", "Pinecone", "MySQL", "FastAPI"],
    img: "/assets/cinegenome-mockup.jpg",
    badge: "LIVE",
    badgeColor: "#7C5CBF",
  },
  {
    title: "ResumeAI",
    subtitle: "AI Resume Builder with ATS Scoring",
    desc: "Real-time resume generation with ATS scoring and three-strategy JSON parsing. Built in 24 hours at AppXcelerate 1.0 Hackathon using Groq LLaMA.",
    tags: ["React", "Groq", "LLaMA", "Node.js", "AI"],
    img: "/assets/resumeai-mockup.jpg",
    badge: "HACKATHON",
    badgeColor: "#4F46E5",
  },
];

const industries = [
  "Healthcare", "FinTech", "EdTech", "E-Commerce",
  "Real Estate", "HR & Recruitment", "SaaS", "Logistics",
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
    <section id="work" className="py-32 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Top row */}
        <div className="flex items-center justify-between mb-16 pb-8 border-b border-white/10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-end gap-2"
          >
            <span style={{ fontFamily: "var(--font-bebas)" }} className="text-[#E0E0E0] text-[80px] leading-[0.8]">
              {projects.length}
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="section-label mb-1">— OUR WORK</p>
            <h2 className="text-white font-bold text-xl md:text-2xl tracking-wide uppercase">
              FEATURED AI & DIGITAL TRANSFORMATION CASE STUDIES
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-start"
          >
            <a href="#" className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 hover:bg-white hover:text-black transition-colors">
              <ArrowUpRight size={20} />
            </a>
          </motion.div>
        </div>

        {/* Project horizontal scrolling strip */}
        <div className="flex overflow-x-auto snap-x gap-6 pb-12 mb-8 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group shrink-0 w-[280px] glass-card rounded-[12px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] cursor-pointer snap-start"
            >
              {/* Image */}
              <div className="relative h-[200px] overflow-hidden bg-[#111]">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${project.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/80 to-transparent" />
                <span
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold text-black uppercase tracking-wider"
                  style={{ background: project.badgeColor }}
                >
                  {project.badge}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-white font-bold text-base">{project.title}</h3>
                </div>
                <p className="text-teal text-xs mb-3">{project.subtitle}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/50 text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats row */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 pb-20">
          <p className="text-[#E0E0E0]/80 text-sm font-medium tracking-wide">10+ Projects</p>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/20" />
          <p className="text-[#E0E0E0]/80 text-sm font-medium tracking-wide">3 AI Products</p>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/20" />
          <p className="text-[#E0E0E0]/80 text-sm font-medium tracking-wide">100% Live</p>
        </div>

        {/* Proposal Generator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 md:p-12"
          style={{ border: "1px solid rgba(20,197,212,0.2)" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={20} className="text-teal" />
            <p className="section-label">LIVE PROPOSAL GENERATOR</p>
          </div>
          <h3
            style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(28px,4vw,48px)" }}
            className="text-white mb-2"
          >
            GET YOUR CUSTOM HEILC PROPOSAL
          </h3>
          <p className="text-white/40 text-sm mb-8">
            Tell us your industry and challenge. HEILC AI writes a branded solution proposal in seconds.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-teal/40 transition-colors appearance-none"
            >
              <option value="" disabled className="bg-[#111]">Select your industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind} className="bg-[#111]">{ind}</option>
              ))}
            </select>
            <button
              onClick={generateProposal}
              disabled={!industry || !problem.trim() || generating}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-teal text-black font-bold text-sm rounded-xl disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Proposal
                </>
              )}
            </button>
          </div>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Describe your business challenge or what you want to build..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none focus:border-teal/40 transition-colors resize-none mb-4"
          />

          {proposal && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-xl bg-white/3 border border-teal/20"
            >
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{proposal}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
