"use client";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export const GRIEVANCE_CATEGORIES = [
  "Access my data",
  "Correct or update my data",
  "Erase my data",
  "Withdraw consent",
  "Nominate someone",
  "Possible data breach",
  "Notice in another language",
  "Something else",
];

const input =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/45 outline-none focus:border-teal/40";

export default function GrievanceForm() {
  const { user, profile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(GRIEVANCE_CATEGORIES[0]);
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.full_name && !name) setName(profile.full_name);
    if (user?.email && !email) setEmail(user.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.full_name, user?.email]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    const res = await fetch("/api/grievance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, category, details }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setSending(false);
    if (!res?.ok) return setError(data?.error ?? "Couldn't submit — please email us instead.");
    setReference(data.reference);
  };

  if (reference) {
    return (
      <div role="status" className="glass-card rounded-2xl p-10 text-center">
        <CheckCircle size={44} className="text-teal mx-auto mb-4" aria-hidden="true" />
        <p className="text-white text-xl font-semibold mb-2">Grievance received</p>
        <p className="text-white/60 text-sm">
          Your reference is <span className="text-white font-mono">#{reference}</span>. Keep it — we&apos;ll quote it
          in every reply. Expect an acknowledgement within 72 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-card rounded-2xl p-8 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="g-name" className="block text-white/50 text-xs mb-2">Your name</label>
          <input id="g-name" required maxLength={80} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="g-email" className="block text-white/50 text-xs mb-2">Email for our reply</label>
          <input id="g-email" type="email" required maxLength={160} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="g-cat" className="block text-white/50 text-xs mb-2">What is it about?</label>
        <select id="g-cat" value={category} onChange={(e) => setCategory(e.target.value)} className={`${input} appearance-none`}>
          {GRIEVANCE_CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-[#111]">{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="g-details" className="block text-white/50 text-xs mb-2">Details</label>
        <textarea
          id="g-details"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className={`${input} resize-none`}
          placeholder="What happened, what you'd like us to do, and (if it's about your account) the email or phone you signed in with."
        />
      </div>
      {error && <p role="alert" className="text-red-400 text-xs">{error}</p>}
      <button type="submit" disabled={sending} className="w-full py-4 bg-teal text-black font-bold text-sm rounded-xl hover:opacity-90 disabled:opacity-60">
        {sending ? "Submitting…" : "Submit grievance"}
      </button>
      <p className="text-white/40 text-[11px]">
        We use these details only to handle this grievance and keep them for one year after it&apos;s resolved.
      </p>
    </form>
  );
}
