"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import AuthPanel from "./AuthPanel";

export default function AuthModal({
  reason,
  next,
  onClose,
}: {
  reason?: string;
  next?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6"
      onClick={onClose}
      data-lenis-prevent
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 24, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
        className="relative glass-card rounded-2xl p-6 sm:p-8 w-full max-w-md max-h-full overflow-y-auto bg-[#0b0b0b]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sign-in"
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <AuthPanel reason={reason} next={next} onDone={onClose} />
      </motion.div>
    </motion.div>
  );
}
