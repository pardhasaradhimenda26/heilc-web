"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, ChevronDown, Globe } from "lucide-react";
import { usePersona } from "../features/PersonaContext";
import LazySpline from "../features/LazySpline";
import { SOCIAL_LINKS } from "@/lib/site";

/**
 * Each slide is one natural sentence split across the three type sizes the
 * hero design uses, so the <h1> always reads as a single clear statement
 * rather than three concatenated keyword phrases.
 */
const slides = [
  {
    faded: "HEILC IS AN",
    main: "AI AGENCY",
    sub: "FOR DIGITAL TRANSFORMATION",
    sentence: "HEILC is an AI agency for digital transformation.",
  },
  {
    faded: "WE BUILD CUSTOM",
    main: "AI PRODUCTS",
    sub: "THAT REACH PRODUCTION",
    sentence: "We build custom AI products that reach production.",
  },
  {
    faded: "FROM ML MODELS TO",
    main: "ENTERPRISE",
    sub: "SOFTWARE THAT SCALES",
    sentence: "From ML models to enterprise software that scales.",
  },
];

const personaSlides = {
  startup: [
    {
      faded: "WE SHIP STARTUP",
      main: "AI PRODUCTS",
      sub: "FROM IDEA TO LIVE IN WEEKS",
      sentence: "We ship startup AI products from idea to live in weeks.",
    },
    ...slides.slice(1),
  ],
  enterprise: [
    {
      faded: "WE SCALE ENTERPRISE",
      main: "AI SYSTEMS",
      sub: "WITH SECURITY AND EVIDENCE",
      sentence: "We scale enterprise AI systems with security and evidence.",
    },
    ...slides.slice(1),
  ],
  student: slides,
};

const SPLINE_SRC =
  "https://my.spline.design/nexbotrobotcharacterconcept-31DOxzlHdCF3vgOsdptaQ2Ii/";

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

  const slide = activeSlides[current];

  return (
    <section
      aria-label="Introduction"
      className="relative w-full h-screen overflow-hidden bg-[#080808]"
    >
      {/* Spline 3D background — deferred until idle and on screen */}
      <LazySpline src={SPLINE_SRC} title="HEILC 3D AI character concept" />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent z-[1] pointer-events-none" />

      {/* Auto-detection pill */}
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
          <Globe size={12} className="text-teal" aria-hidden="true" />
          <span className="text-white/70 text-xs">
            Adapted for{" "}
            <span className="text-teal font-semibold">
              {detectionData.city}, {detectionData.country}
            </span>
          </span>
        </motion.div>
      )}

      {/* "POWERED BY AI" vertical text */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10" aria-hidden="true">
        <p
          className="text-white/55 text-[9px] tracking-[4px] uppercase"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          POWERED BY AI
        </p>
      </div>

      {/* Dot navigation */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        {activeSlides.map((item, i) => (
          <button
            key={item.main}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Show headline ${i + 1} of ${activeSlides.length}`}
            aria-current={i === current}
            className={`w-1 rounded-full transition-all duration-300 ${
              i === current ? "h-6 bg-teal" : "h-2 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Main text content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {/*
          One <h1> per page. The rotating spans are a presentation detail, so
          the heading carries a stable accessible name and the visible text of
          each slide still reads as a complete sentence on its own.
        */}
        <h1 className="text-center px-4" aria-label={slide.sentence}>
          {/*
            initial={false} makes the first slide render at its final state, so
            the heading ships visible in the server HTML instead of at
            opacity:0 awaiting hydration — it was the page's LCP element.
            Slide transitions after the first still animate.
          */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="block"
            >
              <span
                className="block text-white/55 tracking-widest uppercase mb-1"
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(18px,3vw,32px)",
                }}
              >
                {slide.faded}
              </span>
              <span
                className="block text-white leading-none"
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(72px,14vw,160px)",
                  letterSpacing: "-0.01em",
                }}
              >
                {slide.main}
              </span>
              <span
                className="block text-white/55 tracking-widest uppercase mt-1"
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(18px,3vw,32px)",
                }}
              >
                {slide.sub}
              </span>
            </motion.span>
          </AnimatePresence>
        </h1>
      </div>

      {/* Bottom elements */}
      <div className="absolute bottom-8 left-8 z-10" aria-hidden="true">
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
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer me"
          aria-label="HEILC on Instagram"
          className="text-white/60 hover:text-teal transition-colors"
        >
          <Instagram size={18} aria-hidden="true" />
        </a>
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-[90%] sm:w-auto text-center justify-center">
        <Link
          href="/case-studies"
          className="px-5 py-2.5 sm:px-6 sm:py-3 bg-teal text-black text-xs sm:text-sm font-bold rounded-full hover:opacity-90 transition-opacity block sm:inline-block"
        >
          Explore Case Studies
        </Link>
        <Link
          href="/contact"
          className="px-5 py-2.5 sm:px-6 sm:py-3 border border-white/20 text-white text-xs sm:text-sm rounded-full hover:border-teal hover:text-teal transition-all block sm:inline-block"
        >
          Schedule a Discovery Call
        </Link>
      </div>
    </section>
  );
}
