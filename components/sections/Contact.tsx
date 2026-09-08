"use client";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import ContactForm from "@/components/features/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";

export default function Contact() {
  return (
    <section id="contact" className="py-32 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-label mb-6">— 06 GET IN TOUCH</p>
            <h2
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(40px,6vw,72px)",
                lineHeight: 0.95,
              }}
              className="text-white mb-8"
            >
              LET&apos;S BUILD
              <br />
              <span className="text-gradient">SOMETHING</span>
              <br />
              TOGETHER
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-10 max-w-sm">
              Tell us what you&apos;re building. We&apos;ll tell you how we can
              make it intelligent, scalable, and production-ready.
            </p>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center">
                  <Mail size={16} className="text-teal" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-white/55 text-xs">Email</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-white text-sm hover:text-teal transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center">
                  <MapPin size={16} className="text-teal" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-white/55 text-xs">Location</p>
                  <p className="text-white text-sm">Chennai, India</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <ContactForm idPrefix="home-contact" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
