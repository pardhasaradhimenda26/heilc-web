"use client";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-transparent"
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-2">
        <img 
          src="/assets/heilc-logo.png"
          alt="HEILC Logo"
          className="object-contain"
          style={{ 
            height: "36px",
            width: "36px"
          }}
        />
        <span 
          style={{ 
            fontFamily: "var(--font-bebas)", 
            fontSize: "22px",
            letterSpacing: "0.08em"
          }}
          className="text-white"
        >
          HEILC
        </span>
      </a>

      {/* Center Links */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-8">
        <a href="#capabilities" className="text-white/80 text-xs font-semibold tracking-widest uppercase hover:text-teal transition-colors">
          CAPABILITIES
        </a>
        <a href="#services" className="text-white/80 text-xs font-semibold tracking-widest uppercase hover:text-teal transition-colors">
          SERVICES
        </a>
        <a href="#about" className="text-white/80 text-xs font-semibold tracking-widest uppercase hover:text-teal transition-colors">
          ABOUT
        </a>
        <a href="#faq" className="text-white/80 text-xs font-semibold tracking-widest uppercase hover:text-teal transition-colors">
          FAQ
        </a>
      </div>

      {/* Right CTA */}
      <a 
        href="#contact" 
        className="hidden md:inline-flex px-6 py-2.5 bg-white text-black hover:bg-white/90 text-xs font-bold tracking-widest uppercase rounded-full transition-colors"
      >
        LET'S TALK
      </a>
      
      {/* Mobile let's talk */}
      <a 
        href="#contact" 
        className="md:hidden px-4 py-2 bg-white text-black hover:bg-white/90 text-[10px] font-bold tracking-widest uppercase rounded-full transition-colors"
      >
        LET'S TALK
      </a>
    </motion.nav>
  );
}
