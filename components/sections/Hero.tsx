"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, ChevronDown } from "lucide-react";
import { usePersona } from "../features/PersonaContext";
import { Globe } from "lucide-react";

const slides = [
  {
    bg: "/assets/hero-1.jpg",
    faded: "ARTIFICIAL INTELLIGENCE",
    main: "SOLUTIONS",
    sub: "DIGITAL TRANSFORMATION",
  },
  {
    bg: "/assets/hero-2.jpg",
    faded: "CUSTOM AI",
    main: "CREATIONS",
    sub: "BY HEILC",
  },
  {
    bg: "/assets/hero-3.jpg",
    faded: "NEXT GENERATION",
    main: "TECHNOLOGY",
    sub: "AGENCY",
  },
];

const personaSlides = {
  startup: [
    { faded: "SHIP FASTER WITH", main: "AI PRODUCTS", sub: "FROM IDEA TO LIVE IN WEEKS" },
    ...slides.slice(1),
  ],
  enterprise: [
    { faded: "SCALE WITH", main: "CONFIDENCE", sub: "ENTERPRISE AI SOLUTIONS" },
    ...slides.slice(1),
  ],
  student: slides,
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const { persona, detectionData, isAutoDetected } = usePersona();
  const activeSlides = persona ? personaSlides[persona] || slides : slides;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#080808]">
      {/* Spline 3D background */}
      <iframe
        src="https://my.spline.design/nexbotrobotcharacterconcept-31DOxzlHdCF3vgOsdptaQ2Ii/"
        title="HEILC 3D Interactive AI Character Concept"
        frameBorder="0"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent z-[1] pointer-events-none" />

      {/* Auto-detection pill — shows when auto-detected */}
      {isAutoDetected && detectionData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 z-10 flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap"
          style={{
            background: "rgba(20,197,212,0.1)",
            border: "1px solid rgba(20,197,212,0.25)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Globe size={12} className="text-teal" />
          <span className="text-white/70 text-xs">
            Adapted for{" "}
            <span className="text-teal font-semibold">
              {detectionData.city}, {detectionData.country}
            </span>
          </span>
        </motion.div>
      )}

      {/* "POWERED BY AI" vertical text */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
        <p
          className="text-white/30 text-[9px] tracking-[4px] uppercase"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          POWERED BY AI
        </p>
      </div>

      {/* Dot navigation */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        {activeSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-1 rounded-full transition-all duration-300 ${
              i === current ? "h-6 bg-teal" : "h-2 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Main text content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-center px-4"
          >
            <h1 className="text-center">
              <span
                className="block text-white/30 tracking-widest uppercase mb-1"
                style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(18px,3vw,32px)" }}
              >
                {activeSlides[current].faded}
              </span>
              <span
                className="block text-white leading-none"
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(72px,14vw,160px)",
                  letterSpacing: "-0.01em",
                }}
              >
                {activeSlides[current].main}
              </span>
              <span
                className="block text-white/30 tracking-widest uppercase mt-1"
                style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(18px,3vw,32px)" }}
              >
                {activeSlides[current].sub}
              </span>
              <span className="sr-only"> — HEILC AI & Digital Transformation Agency: Custom Machine Learning Models & Enterprise Software Engineering</span>
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom elements */}
      <div className="absolute bottom-8 left-8 z-10">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <ChevronDown size={20} className="text-white/50" />
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 z-10">
        <a href="#" aria-label="Visit HEILC Instagram Profile" className="text-white/40 hover:text-teal transition-colors">
          <Instagram size={18} />
        </a>
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-[90%] sm:w-auto text-center justify-center">
        <a
          href="#work"
          className="px-5 py-2.5 sm:px-6 sm:py-3 bg-teal text-black text-xs sm:text-sm font-bold rounded-full hover:opacity-90 transition-opacity block sm:inline-block"
        >
          View Our Work
        </a>
        <a
          href="#contact"
          className="px-5 py-2.5 sm:px-6 sm:py-3 border border-white/20 text-white text-xs sm:text-sm rounded-full hover:border-teal hover:text-teal transition-all block sm:inline-block"
        >
          Book a Call
        </a>
      </div>
    </section>
  );
}
