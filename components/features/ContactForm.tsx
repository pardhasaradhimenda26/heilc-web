"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { clearDraft, readDraft, saveDraft } from "@/lib/privacy/consent";
import { interestLabels } from "@/lib/onboarding";

const budgetOptions = ["Under ₹1L", "₹1L – ₹5L", "₹5L – ₹20L", "₹20L+", "Let's discuss"];

interface FormState {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
}

const empty: FormState = { name: "", email: "", company: "", budget: "", message: "" };

/**
 * Shared contact form (homepage section and /contact). With accounts on,
 * members send as themselves — no retyping — and visitors are asked to sign
 * in at submit time, with their draft kept across the sign-in redirect.
 */
export default function ContactForm({ idPrefix = "contact" }: { idPrefix?: string }) {
  const { enabled, isMember, firstName, profile, user, requireAuth } = useAuth();
  const [form, setForm] = useState<FormState>(empty);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fieldId = (name: string) => `${idPrefix}-${name}`;

  useEffect(() => {
    const draft = readDraft<FormState>(`contact-${idPrefix}`);
    if (draft) setForm(draft);
  }, [idPrefix]);

  useEffect(() => {
    if (profile?.company) setForm((f) => (f.company ? f : { ...f, company: profile.company ?? "" }));
  }, [profile?.company]);

  const submit = async () => {
    setSending(true);
    setError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "form" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Failed to send. Please try again.");
      clearDraft(`contact-${idPrefix}`);
      setSent(true);
      setForm(empty);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDraft(`contact-${idPrefix}`, form);
    requireAuth("send your request", () => void submit());
  };

  if (sent) {
    return (
      <div role="status" className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 h-full">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle size={48} className="text-teal" aria-hidden="true" />
        </motion.div>
        <p style={{ fontFamily: "var(--font-bebas)", fontSize: "32px" }} className="text-white">
          {firstName ? `Got it, ${firstName}.` : "Message sent."}
        </p>
        <p className="text-white/50 text-sm text-center">
          A founder will reply within one business day.
          {isMember && (
            <>
              {" "}You can see it on your{" "}
              <Link href="/account" className="text-teal underline">account page</Link>.
            </>
          )}
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/50 outline-none focus:border-teal/40 transition-colors";
  const askIdentity = !enabled;
  const interests = interestLabels(profile?.interests).filter((i) => i !== "Just exploring");

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-4">
      {isMember && (
        <p className="text-white/60 text-xs rounded-xl border border-teal/20 bg-teal/5 px-4 py-3">
          Sending as <span className="text-white">{profile?.full_name}</span>
          {user?.email ? <> · {user.email}</> : null}.{" "}
          <Link href="/account" className="text-teal underline">Edit</Link>
        </p>
      )}

      {askIdentity && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={fieldId("name")} className="block text-white/50 text-xs mb-2">Your name</label>
            <input id={fieldId("name")} name="name" type="text" autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor={fieldId("email")} className="block text-white/50 text-xs mb-2">Email address</label>
            <input id={fieldId("email")} name="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
        </div>
      )}

      <div>
        <label htmlFor={fieldId("company")} className="block text-white/50 text-xs mb-2">
          Company <span className="text-white/50">(optional)</span>
        </label>
        <input id={fieldId("company")} name="company" type="text" autoComplete="organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass} />
      </div>

      <div>
        <label htmlFor={fieldId("budget")} className="block text-white/50 text-xs mb-2">Project budget range</label>
        <select id={fieldId("budget")} name="budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={`${inputClass} appearance-none`}>
          <option value="" className="bg-[#111]">Select a range</option>
          {budgetOptions.map((b) => (
            <option key={b} value={b} className="bg-[#111]">{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={fieldId("message")} className="block text-white/50 text-xs mb-2">
          {firstName ? `What are you building, ${firstName}?` : "What are you building?"}
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={4}
          required
          maxLength={8000}
          placeholder={
            interests.length
              ? `You mentioned ${interests.slice(0, 2).join(" and ").toLowerCase()} — what's the problem behind it, what data exists, and what's the constraint?`
              : "The problem, the data you already have, and the constraint you are working against."
          }
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && <p role="alert" className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="w-full flex items-center justify-center gap-2 py-4 bg-teal text-black font-bold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {sending ? (
          <>
            <span aria-hidden="true" className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send size={16} aria-hidden="true" />
            {enabled && !isMember ? "Sign in & send" : "Send message"}
          </>
        )}
      </button>
      <p className="text-white/40 text-[11px] text-center">
        Used only to reply to you. See our <Link href="/privacy" className="underline">privacy notice</Link>.
      </p>
    </form>
  );
}
