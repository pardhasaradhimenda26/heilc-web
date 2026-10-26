"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Download, LogOut, Trash2, Save, ShieldCheck, UserRound, Inbox, Scale } from "lucide-react";
import { useAuth } from "./AuthProvider";
import {
  COMPANY_SIZES,
  INTERESTS,
  SEGMENTS,
  STARTUP_STAGES,
  TIMELINES,
  labelOf,
} from "@/lib/onboarding";
import { DATA_INVENTORY, PROCESSORS } from "@/lib/privacy/notice";
import { readSiteChoices, saveSiteChoices } from "@/lib/privacy/consent";
import { GRIEVANCE_OFFICER, PRIVACY_NOTICE_VERSION } from "@/lib/site";
import type { Profile } from "@/lib/supabase/types";

interface RequestRow {
  id: string;
  kind: "contact" | "proposal";
  payload: Record<string, unknown>;
  created_at: string;
}

interface GrievanceRow {
  reference: string;
  category: string;
  status: string;
  created_at: string;
}

const input =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-teal/50";

function Card({
  icon: Icon,
  title,
  children,
  id,
}: {
  icon: typeof UserRound;
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="glass-card rounded-2xl p-6 sm:p-8 scroll-mt-28">
      <h2 className="flex items-center gap-2 text-white font-semibold mb-5">
        <Icon size={17} className="text-teal" aria-hidden="true" /> {title}
      </h2>
      {children}
    </section>
  );
}

export default function AccountDashboard() {
  const { enabled, ready, user, profile, firstName, getClient, refreshProfile, signOut } = useAuth();
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [grievances, setGrievances] = useState<GrievanceRow[]>([]);
  const [personalisation, setPersonalisation] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!enabled) return void window.location.replace("/");
    if (!user) return void window.location.replace("/login?next=/account");
    if (!profile) return void window.location.replace("/welcome?next=/account");
    setForm(profile);
    setPersonalisation(Boolean(readSiteChoices()?.personalisation));
  }, [ready, enabled, user, profile]);

  const loadLists = useCallback(async () => {
    const supabase = await getClient();
    if (!supabase || !user) return;
    const [r, g] = await Promise.all([
      supabase.from("requests").select("id,kind,payload,created_at").order("created_at", { ascending: false }).limit(20),
      supabase.from("grievances").select("reference,category,status,created_at").order("created_at", { ascending: false }),
    ]);
    setRequests((r.data as RequestRow[]) ?? []);
    setGrievances((g.data as GrievanceRow[]) ?? []);
  }, [getClient, user]);

  useEffect(() => {
    if (user && profile) void loadLists();
  }, [user, profile, loadLists]);

  if (!ready || !user || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const flash = (msg: string) => {
    setSaved(msg);
    setTimeout(() => setSaved(null), 3000);
  };

  const logConsent = async (purpose: string, action: "granted" | "withdrawn") => {
    const supabase = await getClient();
    await supabase?.from("consent_log").insert({
      user_id: user.id,
      purpose,
      action,
      notice_version: PRIVACY_NOTICE_VERSION,
      notice_language: profile.notice_language,
      source: "account",
    });
  };

  // s.12(2): correction, completion and updating.
  const saveProfile = async () => {
    const supabase = await getClient();
    if (!supabase) return;
    const segment = SEGMENTS.find((s) => s.id === form.segment);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: (form.full_name ?? "").trim().slice(0, 80) || profile.full_name,
        segment: form.segment,
        persona: segment?.persona ?? profile.persona,
        company: form.company?.trim() || null,
        role: form.role?.trim() || null,
        stage: form.stage || null,
        timeline: form.timeline || null,
        interests: form.interests ?? [],
        goal: form.goal?.trim() || null,
        phone: form.phone?.replace(/[^\d+]/g, "") || null,
        nominee_name: form.nominee_name?.trim() || null,
        nominee_contact: form.nominee_contact?.trim() || null,
      })
      .eq("id", user.id);
    if (error) return flash("Couldn't save — please try again.");
    await supabase.from("security_events").insert({ user_id: user.id, event: "profile_updated" });
    await refreshProfile();
    flash("Saved.");
  };

  const toggleMarketing = async () => {
    const supabase = await getClient();
    const next = !profile.marketing_opt_in;
    await supabase?.from("profiles").update({ marketing_opt_in: next }).eq("id", user.id);
    await logConsent("marketing", next ? "granted" : "withdrawn");
    await refreshProfile();
    flash(next ? "You'll get occasional updates." : "Updates switched off.");
  };

  const togglePersonalisation = () => {
    const next = !personalisation;
    saveSiteChoices(next);
    setPersonalisation(next);
    void logConsent("personalisation", next ? "granted" : "withdrawn");
  };

  // s.11: summary of personal data, processing and who it is shared with.
  const exportData = async () => {
    const supabase = await getClient();
    if (!supabase) return;
    const [p, c, r, g, s] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("consent_log").select("purpose,action,notice_version,notice_language,source,created_at"),
      supabase.from("requests").select("kind,payload,created_at"),
      supabase.from("grievances").select("reference,category,details,status,created_at,resolved_at"),
      supabase.from("security_events").select("event,created_at"),
    ]);
    await supabase.from("security_events").insert({ user_id: user.id, event: "data_export" });
    const exportDoc = {
      generated_at: new Date().toISOString(),
      data_fiduciary: "HEILC",
      grievance_officer: GRIEVANCE_OFFICER,
      account: { id: user.id, email: user.email, phone: user.phone, sign_in_provider: user.provider },
      profile: p.data,
      consent_history: c.data,
      requests: r.data,
      grievances: g.data,
      security_events: s.data,
      browser_privacy_choices: readSiteChoices(),
      processing_activities: DATA_INVENTORY,
      shared_with_data_processors: PROCESSORS,
    };
    const blob = new Blob([JSON.stringify(exportDoc, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `heilc-my-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // s.6(4) withdrawal + s.12(3) erasure: one action, as easy as signing up.
  const deleteAccount = async () => {
    if (confirmText.trim().toUpperCase() !== "DELETE") return;
    setDeleting(true);
    const supabase = await getClient();
    const { error } = (await supabase?.rpc("delete_my_account")) ?? { error: null };
    if (error) {
      setDeleting(false);
      return flash("Deletion failed — please contact the Grievance Officer.");
    }
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    await signOut();
    window.location.replace("/?account=deleted");
  };

  const persona = SEGMENTS.find((s) => s.id === form.segment)?.persona ?? profile.persona;
  const stageOptions = persona === "enterprise" ? COMPANY_SIZES : STARTUP_STAGES;

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-36 pb-24 space-y-6">
      <header className="mb-4">
        <p className="section-label mb-3">— YOUR ACCOUNT</p>
        <h1 className="text-white mb-2" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px,6vw,72px)", lineHeight: 1 }}>
          Hi, {firstName}.
        </h1>
        <p className="text-white/55 text-sm">
          Signed in as {user.email ?? user.phone}
          {user.provider && user.provider !== "email" ? ` with ${user.provider[0].toUpperCase()}${user.provider.slice(1)}` : ""}.
        </p>
        {saved && <p role="status" className="text-teal text-sm mt-3">{saved}</p>}
      </header>

      <Card icon={UserRound} title="Your profile">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ac-name" className="block text-white/50 text-xs mb-1.5">Name</label>
            <input id="ac-name" className={input} value={form.full_name ?? ""} maxLength={80} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div>
            <label htmlFor="ac-seg" className="block text-white/50 text-xs mb-1.5">Which describes you</label>
            <select id="ac-seg" className={input} value={form.segment ?? ""} onChange={(e) => setForm({ ...form, segment: e.target.value, stage: null })}>
              {SEGMENTS.map((s) => <option key={s.id} value={s.id} className="bg-[#111]">{s.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ac-company" className="block text-white/50 text-xs mb-1.5">{persona === "student" ? "College or organisation" : "Company"}</label>
            <input id="ac-company" className={input} value={form.company ?? ""} maxLength={120} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <div>
            <label htmlFor="ac-role" className="block text-white/50 text-xs mb-1.5">Role</label>
            <input id="ac-role" className={input} value={form.role ?? ""} maxLength={80} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </div>
          {persona !== "student" && (
            <>
              <div>
                <label htmlFor="ac-stage" className="block text-white/50 text-xs mb-1.5">{persona === "enterprise" ? "Company size" : "Stage"}</label>
                <select id="ac-stage" className={input} value={form.stage ?? ""} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                  <option value="" className="bg-[#111]">—</option>
                  {stageOptions.map((o) => <option key={o.id} value={o.id} className="bg-[#111]">{o.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="ac-time" className="block text-white/50 text-xs mb-1.5">Timeline</label>
                <select id="ac-time" className={input} value={form.timeline ?? ""} onChange={(e) => setForm({ ...form, timeline: e.target.value })}>
                  <option value="" className="bg-[#111]">—</option>
                  {TIMELINES.map((o) => <option key={o.id} value={o.id} className="bg-[#111]">{o.label}</option>)}
                </select>
              </div>
            </>
          )}
          <div className="sm:col-span-2">
            <p className="block text-white/50 text-xs mb-1.5">Interested in</p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.filter((i) => i.personas.includes(persona)).map((i) => {
                const on = (form.interests ?? []).includes(i.id);
                return (
                  <button
                    key={i.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      setForm({
                        ...form,
                        interests: on ? (form.interests ?? []).filter((x) => x !== i.id) : [...(form.interests ?? []), i.id],
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg border text-xs ${on ? "border-teal bg-teal/10 text-white" : "border-white/10 text-white/60"}`}
                  >
                    {i.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="ac-goal" className="block text-white/50 text-xs mb-1.5">What you&apos;re trying to get done</label>
            <textarea id="ac-goal" rows={2} className={`${input} resize-none`} maxLength={500} value={form.goal ?? ""} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
          </div>
          <div>
            <label htmlFor="ac-phone" className="block text-white/50 text-xs mb-1.5">Phone (optional)</label>
            <input id="ac-phone" type="tel" className={input} value={form.phone ?? ""} maxLength={20} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>

        <h3 className="text-white text-sm font-semibold mt-8 mb-1">Nominee</h3>
        <p className="text-white/50 text-xs mb-3">
          Someone who can exercise your data rights if you die or become unable to (DPDP Act, s.14). Optional.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input aria-label="Nominee name" placeholder="Nominee name" className={input} maxLength={80} value={form.nominee_name ?? ""} onChange={(e) => setForm({ ...form, nominee_name: e.target.value })} />
          <input aria-label="Nominee email or phone" placeholder="Nominee email or phone" className={input} maxLength={120} value={form.nominee_contact ?? ""} onChange={(e) => setForm({ ...form, nominee_contact: e.target.value })} />
        </div>

        <button type="button" onClick={saveProfile} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-black text-sm font-bold rounded-full hover:opacity-90">
          <Save size={15} aria-hidden="true" /> Save changes
        </button>
      </Card>

      <Card icon={Inbox} title="Your requests">
        {requests.length === 0 ? (
          <p className="text-white/55 text-sm">
            Nothing yet. <Link href="/contact" className="text-teal underline">Send us a request</Link> or{" "}
            <Link href="/#proposal" className="text-teal underline">generate a proposal</Link>.
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {requests.map((r) => (
              <li key={r.id} className="py-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-white text-sm capitalize">{r.kind === "contact" ? "Contact request" : `Proposal — ${String(r.payload.industry ?? "")}`}</p>
                  <p className="text-white/50 text-xs truncate">{String(r.payload.message ?? r.payload.problem ?? "")}</p>
                </div>
                <time className="text-white/40 text-xs shrink-0">{new Date(r.created_at).toLocaleDateString()}</time>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card icon={ShieldCheck} title="Privacy choices" id="privacy">
        <div className="space-y-4">
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <span>
              <span className="block text-white text-sm">Email updates</span>
              <span className="block text-white/50 text-xs">Occasional case studies and launches.</span>
            </span>
            <input type="checkbox" checked={profile.marketing_opt_in} onChange={toggleMarketing} className="mt-1 h-4 w-4 accent-[#14C5D4]" />
          </label>
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <span>
              <span className="block text-white text-sm">Region-based personalisation</span>
              <span className="block text-white/50 text-xs">Adapt the homepage using your approximate location (stays in this browser).</span>
            </span>
            <input type="checkbox" checked={personalisation} onChange={togglePersonalisation} className="mt-1 h-4 w-4 accent-[#14C5D4]" />
          </label>
          <p className="text-white/45 text-xs">
            Account consent given {new Date(profile.consented_at).toLocaleDateString()} against notice version {profile.notice_version}.
          </p>
        </div>
      </Card>

      <Card icon={Download} title="Your data">
        <p className="text-white/55 text-sm mb-4">
          Download everything HEILC holds about you, the purposes we use it for, and every
          service provider it is shared with (DPDP Act, s.11).
        </p>
        <button type="button" onClick={exportData} className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/15 text-white text-sm rounded-full hover:border-teal hover:text-teal">
          <Download size={15} aria-hidden="true" /> Download my data
        </button>
        <details className="mt-5">
          <summary className="text-white/60 text-xs cursor-pointer">Who your data is shared with</summary>
          <ul className="mt-3 space-y-2">
            {PROCESSORS.map((p) => (
              <li key={p.name} className="text-white/55 text-xs"><span className="text-white/80">{p.name}</span> — {p.role} ({p.location})</li>
            ))}
          </ul>
        </details>
      </Card>

      <Card icon={Scale} title="Grievances">
        <p className="text-white/55 text-sm mb-3">
          Unhappy with how we handled your data? Raise it with our Grievance Officer, {GRIEVANCE_OFFICER.name}.
        </p>
        <Link href="/grievance" className="text-teal text-sm underline">Raise a grievance</Link>
        {grievances.length > 0 && (
          <ul className="mt-4 divide-y divide-white/5">
            {grievances.map((g) => (
              <li key={g.reference} className="py-2 flex justify-between text-xs">
                <span className="text-white/70">#{g.reference} · {g.category}</span>
                <span className="text-white/50 capitalize">{g.status.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card icon={Trash2} title="Withdraw consent and delete account">
        <p className="text-white/55 text-sm mb-4">
          This withdraws your consent and permanently erases your profile and requests. Consent and
          security records are unlinked from you and expire within a year. It can&apos;t be undone.
        </p>
        <label htmlFor="ac-del" className="block text-white/50 text-xs mb-1.5">Type DELETE to confirm</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input id="ac-del" className={`${input} sm:max-w-[200px]`} value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
          <button
            type="button"
            disabled={confirmText.trim().toUpperCase() !== "DELETE" || deleting}
            onClick={deleteAccount}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500/90 text-white text-sm font-bold rounded-full disabled:opacity-30"
          >
            <Trash2 size={15} aria-hidden="true" /> {deleting ? "Deleting…" : "Delete my account"}
          </button>
        </div>
      </Card>

      <div className="flex justify-between items-center pt-2">
        <p className="text-white/40 text-xs">Persona: {labelOf(SEGMENTS, profile.segment) ?? profile.persona}</p>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            window.location.assign("/");
          }}
          className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-white"
        >
          <LogOut size={15} aria-hidden="true" /> Sign out
        </button>
      </div>
    </div>
  );
}
