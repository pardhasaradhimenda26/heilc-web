"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message. Please try again.");
      }

      setSent(true);
      setForm({ name: "", email: "", company: "", budget: "", message: "" });
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      alert(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSending(false);
    }
  };

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
              style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px,6vw,72px)", lineHeight: 0.95 }}
              className="text-white mb-8"
            >
              LET'S BUILD
              <br />
              <span className="text-gradient">SOMETHING</span>
              <br />
              TOGETHER
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-10 max-w-sm">
              Tell us what you're building. We'll tell you how we can make it intelligent, scalable, and production-ready.
            </p>
            <div className="space-y-5">
              {[
                { icon: Mail, label: "Email", value: "hello@heilc.com" },
                { icon: MapPin, label: "Location", value: "Chennai, India" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center">
                    <item.icon size={16} className="text-teal" />
                  </div>
                  <div>
                    <p className="text-white/30 text-xs">{item.label}</p>
                    <p className="text-white text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {sent ? (
              <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 h-full">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <CheckCircle size={48} className="text-teal" />
                </motion.div>
                <p style={{ fontFamily: "var(--font-bebas)", fontSize: "32px" }} className="text-white">
                  Message Sent.
                </p>
                <p className="text-white/50 text-sm text-center">
                  We'll get back to you within 24 hours. Get ready to build something great.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "name", placeholder: "Your Name", type: "text" },
                    { key: "email", placeholder: "Email Address", type: "email" },
                  ].map((f) => (
                    <input
                      key={f.key}
                      type={f.type}
                      placeholder={f.placeholder}
                      required
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none focus:border-teal/40 transition-colors"
                    />
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Company (optional)"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none focus:border-teal/40 transition-colors"
                />
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-teal/40 transition-colors appearance-none"
                >
                  <option value="" disabled className="bg-[#111]">Project budget range</option>
                  {["Under ₹1L", "₹1L – ₹5L", "₹5L – ₹20L", "₹20L+", "Let's discuss"].map((b) => (
                    <option key={b} value={b} className="bg-[#111]">{b}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Tell us about your project..."
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none focus:border-teal/40 transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-teal text-black font-bold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
