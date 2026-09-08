"use client";
import { motion } from "framer-motion";

export default function Presence() {
  return (
    <section className="py-32 bg-[#020202] overflow-hidden flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-7xl mx-auto px-8 text-center mb-16 z-10">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-label mb-6"
        >
          — GLOBAL REACH
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px,10vw,140px)", lineHeight: 0.85 }} 
          className="text-white"
        >
          INTELLIGENCE
          <br />
          <span className="text-white/55">WITHOUT BORDERS</span>
        </motion.h2>
      </div>

      {/* Pure CSS Globe Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center mb-16"
      >
        {/* Globe base */}
        <div className="absolute inset-0 rounded-full border border-white/5 bg-gradient-to-tr from-[#000] to-[#111] overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.8),_0_0_50px_rgba(20,197,212,0.05)]">
          
          {/* Latitude/Longitude Lines (CSS) */}
          <div className="absolute inset-0 rounded-full border border-white/5" style={{ transform: "rotateX(75deg)" }} />
          <div className="absolute inset-0 rounded-full border border-white/5" style={{ transform: "rotateX(75deg) translateY(-80px) scale(0.8)" }} />
          <div className="absolute inset-0 rounded-full border border-white/5" style={{ transform: "rotateX(75deg) translateY(80px) scale(0.8)" }} />
          <div className="absolute inset-x-1/2 top-0 bottom-0 border-l border-white/5" />
          <div className="absolute inset-x-1/2 top-0 bottom-0 border-l border-white/5" style={{ transform: "rotateY(45deg)" }} />
          <div className="absolute inset-x-1/2 top-0 bottom-0 border-l border-white/5" style={{ transform: "rotateY(90deg)" }} />
          <div className="absolute inset-x-1/2 top-0 bottom-0 border-l border-white/5" style={{ transform: "rotateY(135deg)" }} />

          {/* Core Rotation Layer Container */}
          <div className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]">
            {/* Dots / Cities */}
            <div className="absolute top-[30%] left-[20%] w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]" />
            <div className="absolute top-[45%] left-[60%] w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]" />
            <div className="absolute top-[60%] left-[40%] w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]" />
            <div className="absolute top-[25%] left-[75%] w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]" />

            {/* Connection Arcs (CSS SVG approach) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
              <path d="M 100 150 Q 200 100 300 225" fill="none" stroke="rgba(20,197,212,0.4)" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M 300 225 Q 250 250 200 300" fill="none" stroke="rgba(20,197,212,0.4)" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M 200 300 Q 300 180 375 125" fill="none" stroke="rgba(20,197,212,0.4)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="z-10 text-center"
      >
        <p className="text-white/55 text-xs md:text-sm tracking-[0.2em] font-medium">
          CHENNAI <span aria-hidden="true" className="mx-3 text-white/10">·</span> SAN FRANCISCO <span aria-hidden="true" className="mx-3 text-white/10">·</span> LONDON <span aria-hidden="true" className="mx-3 text-white/10">·</span> SINGAPORE
        </p>
      </motion.div>
    </section>
  );
}
