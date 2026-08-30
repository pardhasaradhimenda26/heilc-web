"use client";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-32 bg-[#030303] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-teal/30" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-t from-transparent to-teal/30" />
      </div>

      <div className="max-w-5xl mx-auto px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-label mb-8"
        >
          NEXT-GENERATION AI FOR NEXT-GENERATION BUSINESSES
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden"
        >
          <h2
            style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(56px,10vw,120px)", lineHeight: 0.9, letterSpacing: "-0.01em" }}
            className="text-white mb-2"
          >
            START BUILDING YOUR AI FUTURE
          </h2>
          {/* White underline */}
          <div className="flex justify-center mb-10">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-[2px] w-48 bg-white origin-left"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#contact"
            className="px-8 py-4 bg-teal text-black font-bold text-sm rounded-full hover:opacity-90 transition-opacity"
          >
            Book a Call
          </a>
          <button
            onClick={() => {
              const btn = document.querySelector('[data-chatbot]') as HTMLButtonElement;
              btn?.click();
            }}
            className="px-8 py-4 border border-white/20 text-white text-sm rounded-full hover:border-teal hover:text-teal transition-all"
          >
            Talk to HEILC AI
          </button>
        </motion.div>
      </div>
    </section>
  );
}
