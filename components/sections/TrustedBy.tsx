"use client";
import { motion } from "framer-motion";

const clients = [
  ["Healthcare", "FinTech", "EdTech"],
  ["E-Commerce", "Real Estate", "SaaS"],
  ["HR & Recruitment", "Logistics", "AI Startups"]
];

export default function TrustedBy() {
  return (
    <section className="py-24 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6"
          >
            <span style={{ fontFamily: "var(--font-bebas)" }} className="text-white/10 text-[120px] leading-[0.8]">
              70
            </span>
            <h2 className="flex flex-col">
              <span className="text-white font-medium tracking-wide">TRUSTED BY GLOBAL BRANDS</span>
              <span className="text-white/40 text-sm">Artificial Intelligence & Digital Transformation Leaders</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8">
          {clients.map((column, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-6 border-l border-white/5 pl-8">
              {column.map((client, i) => (
                <motion.div
                  key={client}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (colIdx * 0.1) + (i * 0.1) }}
                  className="group cursor-default"
                >
                  <p 
                    style={{ fontFamily: "var(--font-bebas)" }} 
                    className="text-white/40 text-[40px] md:text-[56px] leading-[1] transition-colors duration-500 group-hover:text-white"
                  >
                    {client}
                  </p>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
