"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

const budgetOptions = ["Under ₹1L", "₹1L – ₹5L", "₹5L – ₹20L", "₹20L+", "Let's discuss"];

/**
 * The contact form, extracted so the homepage section and the /contact route
 * share one implementation. Every field carries a real <label>.
 */
export default function ContactForm({ idPrefix = "contact" }: { idPrefix?: string }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fieldId = (name: string) => `${idPrefix}-${name}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message. Please try again.");
      }

      setSent(true);
      setForm({ name: "", email: "", company: "", budget: "", message: "" });
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div
        role="status"
        className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 h-full"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle size={48} className="text-teal" aria-hidden="true" />
        </motion.div>
        <p style={{ fontFamily: "var(--font-bebas)", fontSize: "32px" }} className="text-white">
          Message Sent.
        </p>
        <p className="text-white/50 text-sm text-center">
          We&apos;ll get back to you within one business day.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-teal/40 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={fieldId("name")} className="block text-white/50 text-xs mb-2">
            Your name
          </label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={fieldId("email")} className="block text-white/50 text-xs mb-2">
            Email address
          </label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("company")} className="block text-white/50 text-xs mb-2">
          Company <span className="text-white/50">(optional)</span>
        </label>
        <input
          id={fieldId("company")}
          name="company"
          type="text"
          autoComplete="organization"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={fieldId("budget")} className="block text-white/50 text-xs mb-2">
          Project budget range
        </label>
        <select
          id={fieldId("budget")}
          name="budget"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          className={`${inputClass} appearance-none`}
        >
          <option value="" className="bg-[#111]">
            Select a range
          </option>
          {budgetOptions.map((b) => (
            <option key={b} value={b} className="bg-[#111]">
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={fieldId("message")} className="block text-white/50 text-xs mb-2">
          What are you building?
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={4}
          required
          placeholder="The problem, the data you already have, and the constraint you are working against."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <p role="alert" className="text-red-400 text-xs">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full flex items-center justify-center gap-2 py-4 bg-teal text-black font-bold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {sending ? (
          <>
            <span
              aria-hidden="true"
              className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"
            />
            Sending…
          </>
        ) : (
          <>
            <Send size={16} aria-hidden="true" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
