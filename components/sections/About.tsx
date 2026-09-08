"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { usePersona } from "../features/PersonaContext";
import { Compass } from "lucide-react";
import { FOUNDERS } from "@/lib/content/team";

/**
 * Each figure is paired with the claim it supports and rendered as a
 * definition pair, so the number is never an orphaned string.
 */
const stats = [
  { num: "10+", label: "Projects delivered" },
  { num: "3", label: "AI products built end to end" },
  { num: "97.37%", label: "GeneRisk AI held-out accuracy" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const { detectionData, refineLocation, isRefining } = usePersona();
  const [timeState, setTimeState] = useState({ 
    time: "", 
    date: "",
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      let timeZone = detectionData?.timezone || undefined;
      if (timeZone === "undefined" || timeZone === "null" || !timeZone) {
        timeZone = undefined;
      }

      let timeString = "";
      let dateString = "";
      try {
        timeString = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone
        }).format(now);
        
        dateString = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone
        }).format(now);
      } catch (err) {
        // Fallback to system timezone on error
        timeString = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }).format(now);
        
        dateString = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric"
        }).format(now);
      }

      let targetHours = now.getHours();
      let targetMinutes = now.getMinutes();
      let targetSeconds = now.getSeconds();

      if (timeZone) {
        try {
          const timeStr = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
            timeZone
          }).format(now);

          const match = timeStr.match(/(\d+):(\d+):(\d+)/);
          if (match) {
            targetHours = parseInt(match[1], 10);
            targetMinutes = parseInt(match[2], 10);
            targetSeconds = parseInt(match[3], 10);
          }
        } catch (e) {
          console.warn("Timezone formatting failed, using client fallback:", e);
        }
      }

      setTimeState({
        time: timeString,
        date: dateString,
        hours: targetHours,
        minutes: targetMinutes,
        seconds: targetSeconds
      });
    };
    
    formatTime();
    const interval = setInterval(formatTime, 1000);
    return () => clearInterval(interval);
  }, [detectionData?.timezone]);

  return (
    <section id="about" ref={ref} aria-labelledby="about-heading" className="py-32 bg-[#0A0A0A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left image with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] rounded-2xl overflow-hidden"
          >
            <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
              <Image
                src="/assets/about-bg.jpg"
                alt="The HEILC engineering workspace"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 to-transparent" />
            <div className="absolute inset-0 border border-white/8 rounded-2xl" />
            {/* Founder chip */}
            <div className="absolute bottom-6 left-6 glass-card rounded-xl px-4 py-3">
              <p className="text-teal text-xs mb-1">FOUNDED BY</p>
              {FOUNDERS.map((founder) => (
                <p key={founder.slug} className="text-white text-sm font-semibold">
                  {founder.name}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Right content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="section-label mb-6">— 05 WHO WE ARE</p>
            <h2
              id="about-heading"
              style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px,5.5vw,68px)", lineHeight: 0.95 }}
              className="text-white mb-6"
            >
              WE DON&apos;T FOLLOW
              <br />
              <span className="text-gradient">TRENDS.</span>
              <br />
              WE BUILD THEM.
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-6">
              HEILC is a technology engineering agency that turns ambitious ideas
              into systems people can depend on. We build custom machine learning
              models, retrieval and generative AI architectures, legacy
              modernisation, cloud infrastructure and process automation — and we
              measure each one against an evaluation set agreed before the work
              starts.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Founded on the conviction that human judgement and machine
              capability compound, our team ships software that proves itself in
              production: deployed in your own cloud account, monitored after
              launch, and documented well enough that you could run it without us.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-white/60 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                <span>Artificial Intelligence & Machine Learning</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                <span>Enterprise Digital Transformation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                <span>Custom RAG Pipelines & Autonomous Agents</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                <span>High-Performance Cloud Architecture</span>
              </li>
            </ul>

            {/* Stats and Location Row */}
            <div className="flex flex-col gap-8 mb-10 pt-8 border-t border-white/8">
              
              {/* Stats */}
              <dl className="flex-1 grid grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <dd
                      style={{ fontFamily: "var(--font-bebas)", fontSize: "42px" }}
                      className="text-gradient leading-none mb-1"
                    >
                      {stat.num}
                    </dd>
                    <dt className="text-white/60 text-[10px] uppercase tracking-wider">
                      {stat.label}
                    </dt>
                  </motion.div>
                ))}
              </dl>

              {/* Location Widget */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 sm:gap-6 min-w-0 sm:min-w-[280px] w-full max-w-md"
              >
                <div className="flex-1">
                  <p className="text-white/60 text-[10px] tracking-widest uppercase mb-1">LOCAL TIME</p>
                  <p className="text-white font-medium text-sm mb-0.5">
                    {detectionData?.city || "Current Location"}
                  </p>
                  <p className="text-white/50 text-xs mb-2">{timeState.date || "Loading..."}</p>
                  <p style={{ fontFamily: "var(--font-bebas)" }} className="text-teal text-2xl tracking-wide leading-none mb-3">
                    {timeState.time || "..."}
                  </p>
                  <button
                    onClick={refineLocation}
                    disabled={isRefining}
                    className="inline-flex items-center gap-1.5 text-[10px] text-teal hover:text-teal font-semibold tracking-wider uppercase transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Compass size={10} aria-hidden="true" className={isRefining ? "animate-spin" : ""} />
                    {isRefining ? "Refining..." : "Refine by Signal"}
                  </button>
                </div>

                {/* Analog Clock */}
                <div className="relative w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                  <div className="absolute w-[3px] h-[3px] rounded-full bg-teal z-10" />
                  {/* Hour hand */}
                  <div 
                    className="absolute w-[1.5px] h-4 bg-white origin-bottom z-0"
                    style={{ 
                      bottom: "50%",
                      transform: `rotate(${(timeState.hours % 12) * 30 + (timeState.minutes / 2)}deg)`
                    }}
                  />
                  {/* Minute hand */}
                  <div 
                    className="absolute w-[1px] h-6 bg-white/80 origin-bottom z-0"
                    style={{ 
                      bottom: "50%",
                      transform: `rotate(${timeState.minutes * 6}deg)`
                    }}
                  />
                  {/* Second hand */}
                  <div 
                    className="absolute w-[1px] h-7 bg-teal origin-bottom z-0"
                    style={{ 
                      bottom: "50%",
                      transform: `rotate(${timeState.seconds * 6}deg)`
                    }}
                  />
                </div>
              </motion.div>

            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-black font-bold text-sm rounded-full hover:opacity-90 transition-opacity"
              >
                Work With Us
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm rounded-full hover:border-teal hover:text-teal transition-all"
              >
                Meet the founders
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
