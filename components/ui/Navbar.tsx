"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";

const navLinks = [
  { label: "SERVICES", href: "/services" },
  { label: "WORK", href: "/case-studies" },
  { label: "INSIGHTS", href: "/insights" },
  { label: "ABOUT", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

function AccountControl() {
  const { enabled, ready, user, firstName, openAuth } = useAuth();
  if (!enabled || !ready) return null;
  if (user) {
    return (
      <Link
        href="/account"
        aria-label={`Your account${firstName ? `, ${firstName}` : ""}`}
        className="flex items-center gap-2 text-white/85 hover:text-teal transition-colors"
      >
        <span className="w-8 h-8 rounded-full bg-teal/15 border border-teal/40 flex items-center justify-center text-teal text-xs font-bold">
          {(firstName ?? user.email ?? "?").charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase">
          {firstName ? `Hi, ${firstName}` : "Finish setup"}
        </span>
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => openAuth()}
      className="text-white/80 text-xs font-semibold tracking-widest uppercase hover:text-teal transition-colors"
    >
      Sign in
    </button>
  );
}

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      aria-label="Primary"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-transparent"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/heilc-logo.png"
          alt="HEILC"
          width={36}
          height={36}
          priority
          className="object-contain"
        />
        <span
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "22px",
            letterSpacing: "0.08em",
          }}
          className="text-white"
        >
          HEILC
        </span>
      </Link>

      {/* Center Links */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-white/80 text-xs font-semibold tracking-widest uppercase hover:text-teal transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side: account + CTA */}
      <div className="flex items-center gap-4 md:gap-6">
      <AccountControl />
      <Link
        href="/contact"
        className="hidden md:inline-flex px-6 py-2.5 bg-white text-black hover:bg-white/90 text-xs font-bold tracking-widest uppercase rounded-full transition-colors"
      >
        START A PROJECT
      </Link>

      {/* Mobile CTA */}
      <Link
        href="/contact"
        className="md:hidden px-4 py-2 bg-white text-black hover:bg-white/90 text-[10px] font-bold tracking-widest uppercase rounded-full transition-colors"
      >
        TALK TO US
      </Link>
      </div>
    </motion.nav>
  );
}
