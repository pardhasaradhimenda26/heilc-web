"use client";
import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin, Github } from "lucide-react";

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com/company/heilc", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/heilc", label: "Instagram" },
  { icon: Github, href: "https://github.com/heilc", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com/heilc", label: "Twitter" },
];

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

const navigationLinks: Record<string, NavItem[]> = {
  Services: [
    { label: "AI Platforms & Web Software", href: "#services" },
    { label: "Mobile Application Engineering", href: "#services" },
    { label: "Custom RAG & LLM Integration", href: "#services" },
    { label: "Analytics & Data Pipelines", href: "#services" },
  ],
  Company: [
    { label: "About HEILC Agency", href: "#about" },
    { label: "Core Technical Capabilities", href: "#capabilities" },
    { label: "FAQ Knowledge Base", href: "#faq" },
    { label: "Contact Engineering Team", href: "#contact" },
  ],
  Ecosystem: [
    { label: "Next.js Framework", href: "https://nextjs.org", external: true },
    { label: "OpenAI Platform", href: "https://openai.com", external: true },
    { label: "Anthropic Claude", href: "https://anthropic.com", external: true },
    { label: "Google Cloud AI", href: "https://cloud.google.com", external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#030303] border-t border-white/6">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <h3
              style={{ fontFamily: "var(--font-bebas)", fontSize: "36px", letterSpacing: "0.08em" }}
              className="text-white mb-3"
            >
              HEILC
            </h3>
            <p className="text-white/40 text-xs leading-relaxed max-w-[200px]">
              Where Human Intelligence Meets the Future. Elite AI & Enterprise Software Engineering.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`HEILC on ${item.label}`}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-teal hover:border-teal/40 transition-all"
                >
                  <item.icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(navigationLinks).map(([category, items]) => (
            <div key={category}>
              <p className="text-white/60 text-xs tracking-widest uppercase mb-5">{category}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="text-white/40 text-sm hover:text-teal transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2026 HEILC. All rights reserved.
          </p>
          <p className="text-white/30 text-xs tracking-widest uppercase">
            POWERED BY AI & HUMAN INTELLIGENCE — HEILC
          </p>
        </div>
      </div>
    </footer>
  );
}
