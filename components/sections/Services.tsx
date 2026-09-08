"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePersona } from "../features/PersonaContext";
import { OFFERINGS } from "@/lib/content/services";

const personaOrder = {
  startup: [0, 2, 1, 5, 3, 4],
  enterprise: [3, 4, 0, 2, 1, 5],
  student: [0, 1, 2, 3, 4, 5],
};

export default function Services() {
  const { persona } = usePersona();
  const order = persona ? personaOrder[persona] : [0, 1, 2, 3, 4, 5];
  const services = order.map((i) => OFFERINGS[i]).filter(Boolean);

  return (
    <section id="services" aria-labelledby="services-heading" className="py-32 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-4"
          >
            — 02 SERVICES
          </motion.p>
          <motion.h2
            id="services-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(40px,6vw,72px)",
              lineHeight: 0.95,
            }}
          >
            <span className="text-white">WHAT WE BUILD</span>
            <br />
            <span className="text-gradient">FOR YOU</span>
          </motion.h2>
        </div>

        <ul className="divide-y divide-white/8 list-none">
          {services.map((svc, i) => (
            <motion.li
              key={svc.slug}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group"
            >
              <Link
                href={`/services/${svc.slug}`}
                className="flex items-center justify-between gap-6 py-6 px-4 rounded-lg hover:bg-teal/5 transition-all duration-300"
              >
                <div className="flex items-center gap-8">
                  <span className="text-white/50 text-xs font-mono w-6">{svc.num}</span>
                  <div>
                    <h3
                      className="text-white group-hover:text-teal transition-colors duration-300"
                      style={{
                        fontFamily: "var(--font-bebas)",
                        fontSize: "clamp(22px,3vw,36px)",
                      }}
                    >
                      {svc.title}
                    </h3>
                    <p className="text-white/60 text-xs mt-1 max-w-xl hidden sm:block leading-relaxed">
                      {svc.summary}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex gap-2">
                    {svc.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full border border-white/10 text-white/60 text-xs whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:border-teal group-hover:bg-teal/10 transition-all">
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="text-white/60 group-hover:text-teal transition-colors"
                    />
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>

        <div className="mt-12">
          <Link
            href="/services"
            className="inline-flex px-6 py-3 border border-white/20 text-white text-sm rounded-full hover:border-teal hover:text-teal transition-all"
          >
            See all ten services
          </Link>
        </div>
      </div>
    </section>
  );
}
