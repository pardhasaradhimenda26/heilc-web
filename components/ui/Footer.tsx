import Link from "next/link";
import { Instagram, Twitter, Linkedin, Github } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/site";
import { CAPABILITIES, OFFERINGS } from "@/lib/content/services";
import { CASE_STUDIES } from "@/lib/content/case-studies";

const socialLinks = [
  { icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
  { icon: Github, href: SOCIAL_LINKS.github, label: "GitHub" },
  { icon: Twitter, href: SOCIAL_LINKS.twitter, label: "Twitter" },
];

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Capabilities",
    links: CAPABILITIES.map((c) => ({
      label: c.title,
      href: `/services/${c.slug}`,
    })),
  },
  {
    title: "What we build",
    links: [
      ...OFFERINGS.slice(0, 3).map((o) => ({
        label: o.title,
        href: `/services/${o.slug}`,
      })),
      { label: "All services", href: "/services" },
    ],
  },
  {
    title: "Work & company",
    links: [
      ...CASE_STUDIES.map((c) => ({
        label: c.title,
        href: `/case-studies/${c.slug}`,
      })),
      { label: "About HEILC", href: "/about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#030303] border-t border-white/6">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <p
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "36px",
                letterSpacing: "0.08em",
              }}
              className="text-white mb-3"
            >
              HEILC
            </p>
            <p className="text-white/60 text-xs leading-relaxed max-w-[220px]">
              Where Human Intelligence Meets the Future. AI products, machine
              learning models and enterprise software, built to reach production.
            </p>
            <p className="text-white/55 text-xs mt-4">Chennai, India · Working worldwide</p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={`HEILC on ${item.label}`}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-teal hover:border-teal/40 transition-all"
                >
                  <item.icon size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-white/60 text-xs tracking-widest uppercase mb-5">
                {column.title}
              </p>
              <ul className="space-y-3">
                {column.links.map((item) => (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      className="text-white/60 text-sm hover:text-teal transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/55 text-xs">
            © {new Date().getFullYear()} HEILC. All rights reserved.
          </p>
          <p className="text-white/55 text-xs tracking-widest uppercase">
            Human intelligence, engineered with AI
          </p>
        </div>
      </div>
    </footer>
  );
}
