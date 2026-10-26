"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  OPEN_CHOICES_EVENT,
  consumeChoicesRequest,
  readSiteChoices,
  saveSiteChoices,
} from "@/lib/privacy/consent";

/**
 * First-visit privacy choices. HEILC sets no analytics or advertising
 * trackers; the only optional processing is region-based personalisation.
 * Both buttons are equally prominent — refusing is as easy as accepting
 * (DPDP s.6(1) free consent, s.6(4) easy withdrawal).
 */
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (consumeChoicesRequest()) {
      setOpen(true);
      return;
    }
    if (!readSiteChoices()) {
      const t = setTimeout(() => setOpen(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const reopen = () => {
      consumeChoicesRequest();
      setOpen(true);
    };
    window.addEventListener(OPEN_CHOICES_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CHOICES_EVENT, reopen);
  }, []);

  const choose = (personalisation: boolean) => {
    saveSiteChoices(personalisation);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-labelledby="privacy-choices-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-[60] rounded-2xl border border-white/10 bg-[#0d0d0d]/95 backdrop-blur-xl p-5 shadow-2xl"
        >
          <p id="privacy-choices-title" className="text-white text-sm font-semibold mb-2">
            Your privacy choices
          </p>
          <p className="text-white/60 text-xs leading-relaxed mb-4">
            We don&apos;t use ads or analytics trackers. If you allow it, we&apos;ll use your
            approximate region (from your connection) to tailor the homepage — kept only in
            your browser. See our{" "}
            <Link href="/privacy" className="text-teal underline">privacy notice</Link>.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => choose(false)}
              className="px-3 py-2.5 rounded-xl border border-white/15 text-white text-xs font-semibold hover:border-white/40"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={() => choose(true)}
              className="px-3 py-2.5 rounded-xl border border-white/15 text-white text-xs font-semibold hover:border-teal hover:text-teal"
            >
              Allow personalisation
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
