"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Rocket, Building2, GraduationCap } from "lucide-react";
import { usePersona } from "./PersonaContext";

const personas = [
  {
    id: "startup" as const,
    icon: Rocket,
    label: "Startup",
    desc: "Ship AI faster",
    color: "#14C5D4",
  },
  {
    id: "enterprise" as const,
    icon: Building2,
    label: "Enterprise",
    desc: "Scale with confidence",
    color: "#7C5CBF",
  },
  {
    id: "student" as const,
    icon: GraduationCap,
    label: "Student",
    desc: "Learn & collaborate",
    color: "#4F46E5",
  },
];

export default function PersonaModal() {
  const [open, setOpen] = useState(false);
  const [showDetectionBadge, setShowDetectionBadge] = useState(false);
  const { setPersona, detectionData, isAutoDetected, autoDetecting } = usePersona();

  useEffect(() => {
    if (!autoDetecting) {
      if (isAutoDetected && detectionData) {
        setShowDetectionBadge(true);
        setTimeout(() => setShowDetectionBadge(false), 4000);
      } else {
        const seen = localStorage.getItem("heilc-persona-seen");
        if (!seen) {
          const timer = setTimeout(() => setOpen(true), 2500);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [autoDetecting, isAutoDetected, detectionData]);

  const handleSelect = (id: "startup" | "enterprise" | "student") => {
    setPersona(id);
    localStorage.setItem("heilc-persona-seen", Date.now().toString());
    setOpen(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("heilc-persona-seen", Date.now().toString());
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="glass-card rounded-2xl p-8 max-w-lg w-full relative"
          >
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <p className="section-label mb-3">PERSONALIZE YOUR EXPERIENCE</p>
            <h2
              className="text-white mb-2"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "42px",
                lineHeight: 1,
              }}
            >
              WHO ARE YOU?
            </h2>
            <p className="text-white/50 text-sm mb-8">
              We&apos;ll tailor HEILC&apos;s story to match your goals.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className="glass-card glass-card-hover rounded-xl p-5 flex flex-col items-center gap-3 group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `${p.color}22`, border: `1px solid ${p.color}44` }}
                  >
                    <p.icon size={18} style={{ color: p.color }} />
                  </div>
                  <span className="text-white font-semibold text-sm">{p.label}</span>
                  <span className="text-white/60 text-xs">{p.desc}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
