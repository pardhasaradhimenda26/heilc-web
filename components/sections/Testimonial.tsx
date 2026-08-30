"use client";
import { motion } from "framer-motion";

export default function Testimonial() {
  return (
    <section className="py-32 bg-[#030303]">
      <div className="max-w-5xl mx-auto px-8 text-center">
        <h2 className="sr-only">CLIENT TESTIMONIALS & ENTERPRISE SOLUTION REVIEWS</h2>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-white/20 text-5xl mb-8" style={{ fontFamily: "Georgia, serif" }}>"</p>
          <blockquote
            style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(28px,4.5vw,56px)", lineHeight: 1.1 }}
            className="text-white mb-8"
          >
            THE INTELLIGENCE HEILC BRINGS TO EVERY BUILD RIVALS ANY
            ENTERPRISE SOLUTION WE'VE SEEN.
            <span className="text-gradient"> THEY DON'T JUST BUILD — THEY THINK.</span>
          </blockquote>
          <div className="flex items-center justify-center gap-3 mb-16">
            <div className="w-8 h-[1px] bg-teal" />
            <p className="text-white/40 text-sm tracking-widest uppercase">Client · Forward-Thinking Business</p>
            <div className="w-8 h-[1px] bg-teal" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="section-label mb-8">AS BUILT WITH CORE TECHNOLOGIES</h3>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {["React", "Next.js", "Claude AI", "PostgreSQL", "Python", "Node.js", "Vercel"].map((tech) => (
              <span key={tech} className="text-white/25 text-sm font-medium tracking-wide hover:text-white/60 transition-colors cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
