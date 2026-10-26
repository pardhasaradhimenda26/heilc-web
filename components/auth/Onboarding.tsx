"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Rocket, Building2, GraduationCap } from "lucide-react";
import { useAuth } from "./AuthProvider";
import {
  COMPANY_SIZES,
  INTERESTS,
  PERSONA_LABEL,
  SEGMENTS,
  STARTUP_STAGES,
  TIMELINES,
  type Persona,
} from "@/lib/onboarding";
import { CONSENT_NOTICE, NOTICE_LANGUAGES, type NoticeLanguage } from "@/lib/privacy/notice";
import { clearPendingConsent, readPendingConsent } from "@/lib/privacy/consent";
import { PRIVACY_NOTICE_VERSION } from "@/lib/site";

const ICONS: Record<Persona, typeof Rocket> = {
  startup: Rocket,
  enterprise: Building2,
  student: GraduationCap,
};

const STEPS = ["name", "segment", "details", "interests", "privacy"] as const;
type Step = (typeof STEPS)[number] | "done";

function safeNext(): string {
  if (typeof window === "undefined") return "/";
  const n = new URLSearchParams(window.location.search).get("next");
  return n && n.startsWith("/") && !n.startsWith("//") ? n : "/";
}

const input =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/40 outline-none focus:border-teal/50 transition-colors";

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl border text-sm text-left transition-all ${
        selected
          ? "border-teal bg-teal/10 text-white"
          : "border-white/10 text-white/70 hover:border-white/30"
      }`}
    >
      {selected && <Check size={13} className="inline mr-1.5 text-teal" aria-hidden="true" />}
      {children}
    </button>
  );
}

/**
 * First-run questions. Five short steps; the answers choose the persona engine
 * and personalise the assistant and proposals. Only the name and "who are you"
 * are required — everything else is optional (s.6(1) data minimisation).
 */
export default function Onboarding() {
  const { enabled, ready, user, profile, getClient, refreshProfile } = useAuth();
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [segment, setSegment] = useState<string>("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [stage, setStage] = useState("");
  const [timeline, setTimeline] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [phone, setPhone] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [needsConsent, setNeedsConsent] = useState(false);
  const [consent, setConsent] = useState(false);
  const [lang, setLang] = useState<NoticeLanguage>("en");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persona: Persona | null = useMemo(
    () => SEGMENTS.find((s) => s.id === segment)?.persona ?? null,
    [segment],
  );
  const firstName = name.trim().split(/\s+/)[0] || "there";

  useEffect(() => {
    if (!ready) return;
    if (!enabled) return void window.location.replace("/");
    if (!user) return void window.location.replace(`/login?next=${encodeURIComponent(safeNext())}`);
    if (profile && step !== "done") return void window.location.replace(safeNext());
    if (user.name && !name) setName(user.name);
    const pending = readPendingConsent();
    if (pending) setLang(pending.language);
    setNeedsConsent(!pending || pending.version !== PRIVACY_NOTICE_VERSION);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, enabled, user, profile]);
  // (`step` is read but deliberately not a dependency: once onboarding
  // finishes we show the welcome moment instead of redirecting instantly.)

  const index = step === "done" ? STEPS.length : STEPS.indexOf(step);
  const go = (s: Step) => {
    setError(null);
    setStep(s);
    window.scrollTo({ top: 0 });
  };

  const canContinue =
    (step === "name" && name.trim().length >= 1) ||
    (step === "segment" && Boolean(segment)) ||
    step === "details" ||
    step === "interests" ||
    (step === "privacy" && (!needsConsent || consent));

  const toggleInterest = (id: string) =>
    setInterests((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const save = async () => {
    if (!user || !persona) return;
    setSaving(true);
    setError(null);
    const supabase = await getClient();
    if (!supabase) return;
    const pending = readPendingConsent();
    const language = pending?.language ?? lang;
    const consentedAt = needsConsent ? new Date().toISOString() : pending?.at ?? new Date().toISOString();

    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      full_name: name.trim().slice(0, 80),
      persona,
      segment,
      interests,
      company: company.trim() || null,
      role: role.trim() || null,
      stage: stage || null,
      timeline: timeline || null,
      goal: goal.trim() || null,
      phone: phone.replace(/[^\d+]/g, "") || null,
      marketing_opt_in: marketing,
      notice_version: PRIVACY_NOTICE_VERSION,
      notice_language: language,
      consented_at: consentedAt,
      age_confirmed: true,
    });

    if (insertError) {
      setSaving(false);
      setError("We couldn't save that. Please try again in a moment.");
      return;
    }

    const consentRows = [
      {
        user_id: user.id,
        purpose: "account",
        action: "granted",
        notice_version: PRIVACY_NOTICE_VERSION,
        notice_language: language,
        source: needsConsent ? "onboarding" : "signin_panel",
      },
      ...(marketing
        ? [
            {
              user_id: user.id,
              purpose: "marketing",
              action: "granted",
              notice_version: PRIVACY_NOTICE_VERSION,
              notice_language: language,
              source: "onboarding",
            },
          ]
        : []),
    ];
    await supabase.from("consent_log").insert(consentRows);
    clearPendingConsent();
    setSaving(false);
    go("done");
    await refreshProfile();
    setTimeout(() => window.location.assign(safeNext()), 2200);
  };

  if (!ready || !user || (profile && step !== "done")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const Icon = persona ? ICONS[persona] : Rocket;
  const notice = CONSENT_NOTICE[lang];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 sm:px-10 py-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/heilc-logo.png" alt="HEILC" width={30} height={30} />
          <span style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", letterSpacing: "0.08em" }} className="text-white">
            HEILC
          </span>
        </Link>
        {step !== "done" && (
          <p className="text-white/50 text-xs tracking-widest uppercase">
            Step {index + 1} of {STEPS.length}
          </p>
        )}
      </header>

      <div className="h-[2px] bg-white/5">
        <motion.div
          className="h-full bg-teal"
          animate={{ width: `${((index + (step === "done" ? 0 : 1)) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex-1 flex items-start sm:items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
            >
              {step === "name" && (
                <section>
                  <p className="section-label mb-3">— LET&apos;S GET ACQUAINTED</p>
                  <h1 className="text-white mb-3" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px,6vw,56px)", lineHeight: 1 }}>
                    First, what should we call you?
                  </h1>
                  <p className="text-white/55 text-sm mb-6">
                    Five quick questions. They decide what HEILC shows you — and they mean our
                    team and assistant talk to you, not to &ldquo;a visitor&rdquo;.
                  </p>
                  <label htmlFor="ob-name" className="block text-white/50 text-xs mb-2">Your name</label>
                  <input
                    id="ob-name"
                    autoFocus
                    autoComplete="name"
                    maxLength={80}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && canContinue && go("segment")}
                    className={input}
                    placeholder="e.g. Priya Raman"
                  />
                </section>
              )}

              {step === "segment" && (
                <section>
                  <p className="section-label mb-3">— NICE TO MEET YOU, {firstName.toUpperCase()}</p>
                  <h1 className="text-white mb-6" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px,6vw,56px)", lineHeight: 1 }}>
                    Which of these sounds like you?
                  </h1>
                  <div className="space-y-3">
                    {SEGMENTS.map((s) => {
                      const SIcon = ICONS[s.persona];
                      const selected = segment === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSegment(s.id)}
                          className={`w-full flex items-start gap-4 p-5 rounded-2xl border text-left transition-all ${
                            selected ? "border-teal bg-teal/10" : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          <span className="w-10 h-10 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center shrink-0">
                            <SIcon size={18} className="text-teal" aria-hidden="true" />
                          </span>
                          <span>
                            <span className="block text-white font-semibold text-sm mb-1">{s.label}</span>
                            <span className="block text-white/55 text-xs leading-relaxed">{s.desc}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {step === "details" && persona && (
                <section>
                  <p className="section-label mb-3">— A LITTLE CONTEXT</p>
                  <h1 className="text-white mb-6" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px,6vw,56px)", lineHeight: 1 }}>
                    {persona === "startup" && "Where is your startup today?"}
                    {persona === "enterprise" && "Tell us about your team."}
                    {persona === "student" && "Where are you studying or working?"}
                  </h1>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="ob-company" className="block text-white/50 text-xs mb-2">
                        {persona === "student" ? "College or organisation" : "Company name"}{" "}
                        <span className="text-white/35">(optional)</span>
                      </label>
                      <input id="ob-company" maxLength={120} value={company} onChange={(e) => setCompany(e.target.value)} className={input} autoComplete="organization" />
                    </div>
                    {persona !== "student" && (
                      <div>
                        <label htmlFor="ob-role" className="block text-white/50 text-xs mb-2">
                          Your role <span className="text-white/35">(optional)</span>
                        </label>
                        <input id="ob-role" maxLength={80} value={role} onChange={(e) => setRole(e.target.value)} className={input} placeholder={persona === "startup" ? "Founder, CTO…" : "Operations lead, CIO…"} autoComplete="organization-title" />
                      </div>
                    )}
                    {persona === "startup" && (
                      <fieldset>
                        <legend className="text-white/50 text-xs mb-2">Stage</legend>
                        <div className="flex flex-wrap gap-2">
                          {STARTUP_STAGES.map((o) => (
                            <Chip key={o.id} selected={stage === o.id} onClick={() => setStage(stage === o.id ? "" : o.id)}>
                              {o.label}
                            </Chip>
                          ))}
                        </div>
                      </fieldset>
                    )}
                    {persona === "enterprise" && (
                      <fieldset>
                        <legend className="text-white/50 text-xs mb-2">Company size</legend>
                        <div className="flex flex-wrap gap-2">
                          {COMPANY_SIZES.map((o) => (
                            <Chip key={o.id} selected={stage === o.id} onClick={() => setStage(stage === o.id ? "" : o.id)}>
                              {o.label}
                            </Chip>
                          ))}
                        </div>
                      </fieldset>
                    )}
                    {persona !== "student" && (
                      <fieldset>
                        <legend className="text-white/50 text-xs mb-2">When do you want to start?</legend>
                        <div className="flex flex-wrap gap-2">
                          {TIMELINES.map((o) => (
                            <Chip key={o.id} selected={timeline === o.id} onClick={() => setTimeline(timeline === o.id ? "" : o.id)}>
                              {o.label}
                            </Chip>
                          ))}
                        </div>
                      </fieldset>
                    )}
                  </div>
                </section>
              )}

              {step === "interests" && persona && (
                <section>
                  <p className="section-label mb-3">— WHAT BRINGS YOU HERE</p>
                  <h1 className="text-white mb-6" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px,6vw,56px)", lineHeight: 1 }}>
                    {persona === "student" ? "What are you hoping to get from HEILC?" : "What are you looking to build?"}
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {INTERESTS.filter((i) => i.personas.includes(persona)).map((i) => (
                      <Chip key={i.id} selected={interests.includes(i.id)} onClick={() => toggleInterest(i.id)}>
                        {i.label}
                      </Chip>
                    ))}
                  </div>
                  <label htmlFor="ob-goal" className="block text-white/50 text-xs mb-2">
                    In a line, what are you trying to get done? <span className="text-white/35">(optional)</span>
                  </label>
                  <textarea
                    id="ob-goal"
                    rows={3}
                    maxLength={500}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className={`${input} resize-none`}
                    placeholder={
                      persona === "student"
                        ? "e.g. I want to understand how RAG systems are evaluated"
                        : "e.g. Our support team answers the same 40 questions every day"
                    }
                  />
                </section>
              )}

              {step === "privacy" && (
                <section>
                  <p className="section-label mb-3">— LAST STEP</p>
                  <h1 className="text-white mb-6" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px,6vw,56px)", lineHeight: 1 }}>
                    Your data, your call
                  </h1>

                  {needsConsent && (
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white text-sm font-semibold">{notice.title}</p>
                        <select
                          aria-label="Notice language"
                          value={lang}
                          onChange={(e) => setLang(e.target.value as NoticeLanguage)}
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white/80 text-xs"
                        >
                          {NOTICE_LANGUAGES.map((l) => (
                            <option key={l.code} value={l.code} className="bg-[#111]">{l.label}</option>
                          ))}
                        </select>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-white/60 text-xs mb-2">
                        {notice.items.map((i) => <li key={i}>{i}</li>)}
                      </ul>
                      <p className="text-white/60 text-xs mb-3">{notice.rights}</p>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#14C5D4]" />
                        <span className="text-white/80 text-xs">{notice.checkbox}</span>
                      </label>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="ob-phone" className="block text-white/50 text-xs mb-2">
                        Phone or WhatsApp <span className="text-white/35">(optional — only if you&apos;d like a call back)</span>
                      </label>
                      <input id="ob-phone" type="tel" autoComplete="tel" maxLength={20} value={phone} onChange={(e) => setPhone(e.target.value)} className={input} placeholder="+91 98765 43210" />
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#14C5D4]" />
                      <span className="text-white/70 text-xs leading-relaxed">
                        Optional: email me occasionally about new HEILC case studies and launches. You can
                        switch this off any time from your Account page.
                      </span>
                    </label>
                    <p className="text-white/45 text-xs leading-relaxed">
                      You can see, change, download or delete everything you&apos;ve told us from your{" "}
                      <span className="text-white/70">Account</span> page. Details in our{" "}
                      <Link href="/privacy" target="_blank" className="text-teal underline">privacy notice</Link>.
                    </p>
                  </div>
                </section>
              )}

              {step === "done" && persona && (
                <section className="text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 14 }}
                    className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal/15 border border-teal/40 flex items-center justify-center"
                  >
                    <Icon size={26} className="text-teal" aria-hidden="true" />
                  </motion.div>
                  <h1 className="text-white mb-3" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px,7vw,64px)", lineHeight: 1 }}>
                    You&apos;re in, {firstName}.
                  </h1>
                  <p className="text-white/60 text-sm">
                    We&apos;ve set HEILC up for {PERSONA_LABEL[persona]}. Taking you back now…
                  </p>
                </section>
              )}
            </motion.div>
          </AnimatePresence>

          {error && <p role="alert" className="text-red-400 text-xs mt-4">{error}</p>}

          {step !== "done" && (
            <div className="flex items-center justify-between mt-10">
              {index > 0 ? (
                <button type="button" onClick={() => go(STEPS[index - 1])} className="flex items-center gap-2 text-white/55 text-sm hover:text-white">
                  <ArrowLeft size={15} aria-hidden="true" /> Back
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                disabled={!canContinue || saving}
                onClick={() => (step === "privacy" ? void save() : go(STEPS[index + 1]))}
                className="flex items-center gap-2 px-6 py-3 bg-teal text-black font-bold text-sm rounded-full disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {step === "privacy" ? (saving ? "Saving…" : "Finish") : "Continue"}
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
