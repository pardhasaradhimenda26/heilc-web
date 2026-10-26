"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, Copy } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import Markdown from "@/components/ui/Markdown";
import { clearDraft, readDraft, saveDraft } from "@/lib/privacy/consent";

const industries = [
  "Healthcare",
  "FinTech",
  "EdTech",
  "E-Commerce",
  "Real Estate",
  "HR & Recruitment",
  "SaaS",
  "Logistics",
  "Manufacturing",
  "Hospitality",
  "Other",
];

interface Draft {
  industry: string;
  problem: string;
}

export default function ProposalGenerator() {
  const { isMember, firstName, profile, requireAuth } = useAuth();
  const [industry, setIndustry] = useState("");
  const [problem, setProblem] = useState("");
  const [proposal, setProposal] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [handoff, setHandoff] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [copied, setCopied] = useState(false);

  // Restore what they typed before signing in; otherwise start from their goal.
  useEffect(() => {
    const draft = readDraft<Draft>("proposal");
    if (draft) {
      setIndustry(draft.industry);
      setProblem(draft.problem);
    } else if (profile?.goal && !problem) {
      setProblem(profile.goal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.goal]);

  const generate = () => {
    if (!industry || problem.trim().length < 15) {
      setError("Pick an industry and describe the problem in at least a sentence.");
      return;
    }
    saveDraft("proposal", { industry, problem });
    requireAuth("generate your proposal", () => void run(), "/#proposal");
  };

  const run = async () => {
    setGenerating(true);
    setError(null);
    setProposal("");
    setHandoff("idle");
    try {
      const res = await fetch("/api/casegen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, problem }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Couldn't generate that — try again in a moment.");
        setGenerating(false);
        return;
      }
      clearDraft("proposal");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setProposal((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch {
      setError("Lost the connection — try again.");
    }
    setGenerating(false);
  };

  const sendToTeam = async () => {
    setHandoff("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "proposal",
        message: `Industry: ${industry}\n\nWhat they told us:\n${problem}\n\n---\nGenerated draft:\n${proposal}`,
      }),
    }).catch(() => null);
    setHandoff(res?.ok ? "sent" : "error");
  };

  return (
    <motion.div
      id="proposal"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-2xl p-8 md:p-12 scroll-mt-28"
      style={{ border: "1px solid rgba(20,197,212,0.2)" }}
    >
      <div className="flex items-center gap-3 mb-2">
        <Sparkles size={20} className="text-teal" aria-hidden="true" />
        <p className="section-label">LIVE PROPOSAL GENERATOR</p>
      </div>
      <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(28px,4vw,48px)" }} className="text-white mb-2">
        {isMember && firstName ? `${firstName.toUpperCase()}, GET YOUR FIRST-DRAFT PROPOSAL` : "GET A FIRST-DRAFT HEILC PROPOSAL"}
      </h3>
      <p className="text-white/60 text-sm mb-8 max-w-2xl">
        Describe the problem the way you&apos;d explain it to an engineer. You&apos;ll get the draft
        we&apos;d send after reading your note — scope, how we&apos;d prove it works, the closest
        thing we&apos;ve built, a week-by-week plan and the questions we&apos;d ask you.
        {profile?.company ? ` Written for ${profile.company}.` : ""}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="proposal-industry" className="block text-white/50 text-xs mb-2">Your industry</label>
          <select
            id="proposal-industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-teal/40 appearance-none"
          >
            <option value="" className="bg-[#111]">Select your industry</option>
            {industries.map((ind) => (
              <option key={ind} value={ind} className="bg-[#111]">{ind}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={generate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal text-black font-bold text-sm rounded-xl disabled:opacity-40 hover:opacity-90"
          >
            {generating ? (
              <>
                <span aria-hidden="true" className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Writing your proposal…
              </>
            ) : (
              <>
                <Sparkles size={16} aria-hidden="true" />
                {isMember ? "Generate proposal" : "Sign in & generate"}
              </>
            )}
          </button>
        </div>
      </div>

      <label htmlFor="proposal-problem" className="block text-white/50 text-xs mb-2">The problem</label>
      <textarea
        id="proposal-problem"
        value={problem}
        maxLength={1500}
        onChange={(e) => setProblem(e.target.value)}
        placeholder="e.g. Our clinic's front desk spends 3 hours a day answering the same appointment and billing questions on WhatsApp."
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/45 outline-none focus:border-teal/40 resize-none mb-2"
      />
      {error && <p role="alert" className="text-red-400 text-xs mb-2">{error}</p>}

      {proposal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          aria-live="polite"
          className="mt-6 p-6 md:p-8 rounded-xl bg-white/[0.03] border border-teal/20 text-white/80 text-sm leading-relaxed"
        >
          <Markdown text={proposal} />
          {!generating && (
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center">
              {handoff === "sent" ? (
                <p className="flex items-center gap-2 text-teal text-sm">
                  <Check size={15} aria-hidden="true" /> Sent to the founders — expect a reply within one business day.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={sendToTeam}
                  disabled={handoff === "sending"}
                  className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 disabled:opacity-50"
                >
                  {handoff === "sending" ? "Sending…" : handoff === "error" ? "Retry — send to the team" : "Send to the team"}
                </button>
              )}
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(proposal);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-white"
              >
                {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                {copied ? "Copied" : "Copy proposal"}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
