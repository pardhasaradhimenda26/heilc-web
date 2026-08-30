"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { usePersona } from "../features/PersonaContext";
import { Compass } from "lucide-react";

const stats = [
  { num: "10+", label: "Projects Delivered" },
  { num: "3", label: "AI Products Live" },
  { num: "100%", label: "Built & Deployed" },
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
    <section id="about" ref={ref} className="py-32 bg-[#0A0A0A] overflow-hidden">
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
            <motion.div
              style={{ y: imgY }}
              className="absolute inset-0 bg-cover bg-center scale-110"
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url(/assets/about-bg.jpg)" }}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 to-transparent" />
            <div className="absolute inset-0 border border-white/8 rounded-2xl" />
            {/* Founder chip */}
            <div className="absolute bottom-6 left-6 glass-card rounded-xl px-4 py-3">
              <p className="text-teal text-xs mb-1">FOUNDED BY</p>
              <p className="text-white text-sm font-semibold">Pardhasaradhi Menda</p>
              <p className="text-white text-sm font-semibold">Varshith Dondamuri</p>
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
              style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px,5.5vw,68px)", lineHeight: 0.95 }}
              className="text-white mb-6"
            >
              WE DON'T FOLLOW
              <br />
              <span className="text-gradient">TRENDS.</span>
              <br />
              WE BUILD THEM.
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-6">
              HEILC is a elite technology consulting agency that turns ambitious ideas into intelligent, scalable digital systems. We specialize in custom AI models, generative AI architectures, digital transformation, enterprise cloud engineering, and operational automation — for organizations that demand measurable business impact.
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Founded on the conviction that human intelligence and synthetic machine capabilities produce unmatched speed, our cross-functional team designs software that proves capability through live performance, secure execution, and high-performance infrastructure.
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
              <div className="flex-1 grid grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <p
                      style={{ fontFamily: "var(--font-bebas)", fontSize: "42px" }}
                      className="text-gradient leading-none mb-1"
                    >
                      {stat.num}
                    </p>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Location Widget */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 sm:gap-6 min-w-0 sm:min-w-[280px] w-full max-w-md"
              >
                <div className="flex-1">
                  <p className="text-white/40 text-[10px] tracking-widest uppercase mb-1">LOCAL TIME</p>
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
                    className="inline-flex items-center gap-1.5 text-[10px] text-teal/80 hover:text-teal font-semibold tracking-wider uppercase transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Compass size={10} className={isRefining ? "animate-spin" : ""} />
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

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-black font-bold text-sm rounded-full hover:opacity-90 transition-opacity"
            >
              Work With Us
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
