"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Phone, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { LOGIN_METHODS } from "@/lib/supabase/config";
import {
  CONSENT_NOTICE,
  NOTICE_LANGUAGES,
  type NoticeLanguage,
} from "@/lib/privacy/notice";
import { savePendingConsent } from "@/lib/privacy/consent";

type Step = "choose" | "email" | "email-code" | "phone" | "phone-code";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M15.1 12.6l.4-2.7h-2.6V8.2c0-.8.4-1.5 1.6-1.5h1.2V4.4s-1.1-.2-2.1-.2c-2.2 0-3.6 1.3-3.6 3.7v2h-2.4v2.7H10V19h3V12.6h2.1z"
      />
    </svg>
  );
}

/**
 * The sign-in surface, shared by the modal and the /login page.
 *
 * DPDP s.5–6: the notice is shown and an unticked consent box must be ticked
 * — a clear affirmative action — before any button can send data to an
 * identity provider. The notice language can be switched (s.6(3)).
 */
export default function AuthPanel({
  reason,
  next = "/",
  onDone,
}: {
  reason?: string;
  next?: string;
  onDone?: () => void;
}) {
  const { getClient, refreshProfile } = useAuth();
  const [lang, setLang] = useState<NoticeLanguage>("en");
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notice = CONSENT_NOTICE[lang];

  useEffect(() => setError(null), [step]);

  const callbackUrl = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const afterOtp = async () => {
    const supabase = await getClient();
    const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
    const profile = data.user ? await refreshProfile() : null;
    onDone?.();
    window.location.assign(profile ? next : `/welcome?next=${encodeURIComponent(next)}`);
  };

  const oauth = async (provider: "google" | "facebook") => {
    if (!agreed) return;
    setBusy(true);
    savePendingConsent(lang);
    const supabase = await getClient();
    const { error: err } = (await supabase?.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl(),
        scopes: provider === "facebook" ? "email public_profile" : undefined,
      },
    })) ?? { error: null };
    if (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const sendEmailCode = async () => {
    if (!agreed || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    savePendingConsent(lang);
    const supabase = await getClient();
    const { error: err } = (await supabase?.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true, emailRedirectTo: callbackUrl() },
    })) ?? { error: null };
    setBusy(false);
    if (err) return setError(err.message);
    setStep("email-code");
  };

  const sendPhoneCode = async () => {
    const normalised = phone.replace(/[^\d+]/g, "");
    if (!agreed || !/^\+\d{8,15}$/.test(normalised)) {
      setError("Enter your number with country code, e.g. +91 98765 43210.");
      return;
    }
    setBusy(true);
    savePendingConsent(lang);
    const supabase = await getClient();
    const { error: err } = (await supabase?.auth.signInWithOtp({ phone: normalised })) ?? {
      error: null,
    };
    setBusy(false);
    if (err) return setError(err.message);
    setPhone(normalised);
    setStep("phone-code");
  };

  const verify = async (kind: "email" | "sms") => {
    if (!/^\d{6,8}$/.test(code.trim())) return setError("Enter the code from the message.");
    setBusy(true);
    const supabase = await getClient();
    const result =
      kind === "email"
        ? await supabase?.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email" })
        : await supabase?.auth.verifyOtp({ phone, token: code.trim(), type: "sms" });
    setBusy(false);
    if (result?.error) return setError(result.error.message);
    await afterOtp();
  };

  const buttonBase =
    "w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="text-left">
      <p className="section-label mb-2">— SIGN IN TO HEILC</p>
      <h2
        id="auth-title"
        className="text-white mb-2"
        style={{ fontFamily: "var(--font-bebas)", fontSize: "38px", lineHeight: 1 }}
      >
        {reason ? `Sign in to ${reason}` : "Welcome to HEILC"}
      </h2>
      <p className="text-white/55 text-sm mb-5">
        Browsing stays open to everyone. An account lets you send requests, generate
        proposals and talk to the HEILC assistant — and lets us tailor the site to you.
      </p>

      {/* Notice — s.5(1) itemised, s.6(3) language option */}
      <section
        aria-labelledby="notice-title"
        className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-4"
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 id="notice-title" className="text-white text-sm font-semibold flex items-center gap-2">
            <ShieldCheck size={15} className="text-teal" aria-hidden="true" />
            {notice.title}
          </h3>
          <label className="sr-only" htmlFor="notice-lang">
            Notice language
          </label>
          <select
            id="notice-lang"
            value={lang}
            onChange={(e) => setLang(e.target.value as NoticeLanguage)}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white/80 text-xs outline-none"
          >
            {NOTICE_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-[#111]">
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <p className="text-white/60 text-xs mb-2">{notice.intro}</p>
        <ul className="list-disc pl-4 space-y-1 text-white/60 text-xs mb-2">
          {notice.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-white/60 text-xs mb-1">{notice.rights}</p>
        <p className="text-white/60 text-xs mb-2">{notice.grievance}</p>
        <Link href="/privacy" target="_blank" className="text-teal text-xs underline underline-offset-2">
          {notice.fullNotice}
        </Link>
      </section>

      <label className="flex items-start gap-3 mb-5 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#14C5D4] shrink-0"
        />
        <span className="text-white/80 text-xs leading-relaxed">{notice.checkbox}</span>
      </label>

      {step === "choose" && (
        <div className="space-y-3">
          {LOGIN_METHODS.includes("google") && (
            <button
              type="button"
              disabled={!agreed || busy}
              onClick={() => oauth("google")}
              className={`${buttonBase} bg-white text-black hover:bg-white/90`}
            >
              <GoogleMark /> Continue with Google
            </button>
          )}
          {LOGIN_METHODS.includes("facebook") && (
            <button
              type="button"
              disabled={!agreed || busy}
              onClick={() => oauth("facebook")}
              className={`${buttonBase} bg-[#1877F2] text-white hover:opacity-90`}
            >
              <FacebookMark /> Continue with Facebook
            </button>
          )}
          {LOGIN_METHODS.includes("email") && (
            <button
              type="button"
              disabled={!agreed || busy}
              onClick={() => setStep("email")}
              className={`${buttonBase} border border-white/15 text-white hover:border-teal hover:text-teal`}
            >
              <Mail size={17} aria-hidden="true" /> Continue with email
            </button>
          )}
          {LOGIN_METHODS.includes("phone") && (
            <button
              type="button"
              disabled={!agreed || busy}
              onClick={() => setStep("phone")}
              className={`${buttonBase} border border-white/15 text-white hover:border-teal hover:text-teal`}
            >
              <Phone size={17} aria-hidden="true" /> Continue with mobile number
            </button>
          )}
          {!agreed && (
            <p className="text-white/45 text-[11px] text-center">
              Tick the box above to choose a sign-in method.
            </p>
          )}
        </div>
      )}

      {(step === "email" || step === "phone") && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void (step === "email" ? sendEmailCode() : sendPhoneCode());
          }}
          className="space-y-3"
        >
          <label htmlFor="auth-id" className="block text-white/50 text-xs">
            {step === "email" ? "Your email address" : "Mobile number with country code"}
          </label>
          <input
            id="auth-id"
            type={step === "email" ? "email" : "tel"}
            autoComplete={step === "email" ? "email" : "tel"}
            autoFocus
            value={step === "email" ? email : phone}
            onChange={(e) => (step === "email" ? setEmail(e.target.value) : setPhone(e.target.value))}
            placeholder={step === "email" ? "you@company.com" : "+91 98765 43210"}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-teal/40"
          />
          <button
            type="submit"
            disabled={!agreed || busy}
            className={`${buttonBase} bg-teal text-black hover:opacity-90`}
          >
            {busy ? "Sending…" : "Send me a code"}
          </button>
          <button
            type="button"
            onClick={() => setStep("choose")}
            className="w-full flex items-center justify-center gap-2 text-white/50 text-xs hover:text-white"
          >
            <ArrowLeft size={13} aria-hidden="true" /> Other sign-in options
          </button>
        </form>
      )}

      {(step === "email-code" || step === "phone-code") && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void verify(step === "email-code" ? "email" : "sms");
          }}
          className="space-y-3"
        >
          <p className="text-white/60 text-xs">
            We sent a code to{" "}
            <span className="text-white">{step === "email-code" ? email : phone}</span>.
            {step === "email-code" && " You can also just click the link in that email."}
          </p>
          <label htmlFor="auth-code" className="block text-white/50 text-xs">
            Verification code
          </label>
          <input
            id="auth-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={8}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg tracking-[0.4em] text-center outline-none focus:border-teal/40"
          />
          <button type="submit" disabled={busy} className={`${buttonBase} bg-teal text-black hover:opacity-90`}>
            {busy ? "Checking…" : "Verify and continue"}
          </button>
          <button
            type="button"
            onClick={() => {
              setCode("");
              setStep(step === "email-code" ? "email" : "phone");
            }}
            className="w-full text-white/50 text-xs hover:text-white"
          >
            Use a different {step === "email-code" ? "email" : "number"}
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="text-red-400 text-xs mt-3">
          {error}
        </p>
      )}
    </div>
  );
}
