"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MIN_VISIBLE_MS = 550;
const MAX_VISIBLE_MS = 1100;
const SESSION_KEY = "heilc:intro-shown";

/**
 * The intro overlay used to sit on top of the page for a hard-coded 2000ms,
 * which made it the gate on Largest Contentful Paint. It now dismisses as soon
 * as the page has loaded (with a short floor so the animation still reads),
 * skips repeat views within a session, and is skipped entirely for visitors
 * who ask for reduced motion. The visual itself is unchanged.
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Storage blocked (private mode); treat as a first view.
    }

    if (prefersReducedMotion || alreadyShown) {
      setVisible(false);
      return;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Non-fatal.
    }

    const start = performance.now();
    let floorTimer: ReturnType<typeof setTimeout> | undefined;

    const dismiss = () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      floorTimer = setTimeout(() => setVisible(false), remaining);
    };

    const ceiling = setTimeout(() => setVisible(false), MAX_VISIBLE_MS);

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    return () => {
      clearTimeout(ceiling);
      if (floorTimer) clearTimeout(floorTimer);
      window.removeEventListener("load", dismiss);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080808]"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "56px",
                letterSpacing: "0.1em",
              }}
              className="text-white"
            >
              HEILC
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-[2px] w-24 bg-teal origin-left"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-white/60 text-xs tracking-widest uppercase"
            >
              AI &amp; Digital Transformation
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
