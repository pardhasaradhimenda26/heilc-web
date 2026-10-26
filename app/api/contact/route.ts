import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";
import { requireSignedIn } from "@/lib/supabase/server";
import { escapeHtml, sendEmail, teamInbox } from "@/lib/email";
import { SEGMENTS, TIMELINES, interestLabels, labelOf } from "@/lib/onboarding";

export const runtime = "nodejs";

const SOURCES = new Set(["form", "chat", "proposal"]);

export async function POST(req: Request) {
  const gate = await requireSignedIn();
  if (!gate.ok) return gate.response;

  const key = gate.user?.id ?? req.headers.get("x-forwarded-for") ?? "anonymous";
  const limit = rateLimit(`contact:${key}`, 3, 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before trying again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetIn / 1000)) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { user, profile, supabase } = gate;
  const source = SOURCES.has(String(body.source)) ? String(body.source) : "form";
  const name = (profile?.full_name ?? String(body.name ?? "")).trim().slice(0, 80);
  const email = (user?.email ?? String(body.email ?? "")).trim().slice(0, 160);
  const company = (String(body.company ?? "") || profile?.company || "").trim().slice(0, 120);
  const budget = String(body.budget ?? "").trim().slice(0, 40);
  const message = String(body.message ?? "").trim().slice(0, 8000);
  const phone = profile?.phone ?? user?.phone ?? null;

  if (!name || !message || (!email && !phone)) {
    return NextResponse.json(
      { error: "Name, a way to reach you, and a message are required." },
      { status: 400 },
    );
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  // Keep a copy the visitor can see (and delete) on their Account page.
  if (supabase && user) {
    await supabase.from("requests").insert({
      user_id: user.id,
      kind: "contact",
      payload: { source, company, budget, message: message.slice(0, 4000) },
    });
  }

  const rows: [string, string | null | undefined][] = [
    ["Name", name],
    ["Email", email || "—"],
    ["Phone", phone],
    ["Company", company || "—"],
    ["Budget range", budget || "—"],
    ["Came from", source === "chat" ? "Assistant conversation" : source === "proposal" ? "Proposal generator" : "Contact form"],
    ...(profile
      ? ([
          ["Who they are", labelOf(SEGMENTS, profile.segment) ?? profile.persona],
          ["Interested in", interestLabels(profile.interests).join(", ") || "—"],
          ["Timeline", labelOf(TIMELINES, profile.timeline) ?? "—"],
          ["Their goal", profile.goal ?? "—"],
        ] as [string, string][])
      : []),
  ];

  const html = `
    <h2 style="font-family:sans-serif">New ${escapeHtml(source === "form" ? "project inquiry" : source)} from ${escapeHtml(name)}</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`)
        .join("")}
    </table>
    <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;background:#f4f4f5;padding:12px;border-radius:6px;border:1px solid #e4e4e7">${escapeHtml(message)}</p>
    <p style="font-family:sans-serif;font-size:12px;color:#888">Personal data — handle under HEILC's privacy notice. Delete this email once the request is closed.</p>`;

  const sent = await sendEmail({
    to: teamInbox(),
    subject: `New ${source === "form" ? "project inquiry" : source} from ${name}`,
    html,
    replyTo: email || undefined,
  });

  if (!sent.ok && !(supabase && user)) {
    console.error("Contact email failed:", sent.error);
    return NextResponse.json(
      { error: "We couldn't send that right now. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
