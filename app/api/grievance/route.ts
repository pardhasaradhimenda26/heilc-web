import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";
import { getServerSupabase } from "@/lib/supabase/server";
import { escapeHtml, sendEmail, teamInbox } from "@/lib/email";
import { GRIEVANCE_OFFICER } from "@/lib/site";

export const runtime = "nodejs";

const CATEGORIES = new Set([
  "Access my data",
  "Correct or update my data",
  "Erase my data",
  "Withdraw consent",
  "Nominate someone",
  "Possible data breach",
  "Notice in another language",
  "Something else",
]);

/** DPDP s.13 — open to everyone, signed in or not. */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const limit = rateLimit(`grievance:${ip}`, 3, 10 * 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Please wait a few minutes before submitting again." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 80);
  const email = String(body.email ?? "").trim().slice(0, 160);
  const category = String(body.category ?? "");
  const details = String(body.details ?? "").trim().slice(0, 4000);

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !CATEGORIES.has(category) || details.length < 10) {
    return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
  }

  const reference = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  const supabase = getServerSupabase();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // No .select(): anonymous visitors may insert but not read grievances back.
    await supabase
      .from("grievances")
      .insert({ reference, user_id: user?.id ?? null, name, email, category, details });
  }

  const sent = await sendEmail({
    to: teamInbox(),
    replyTo: email,
    subject: `[Grievance #${reference}] ${category}`,
    html: `<div style="font-family:sans-serif;font-size:14px">
      <h2>Data-protection grievance #${escapeHtml(reference)}</h2>
      <p><b>Category:</b> ${escapeHtml(category)}<br/><b>Name:</b> ${escapeHtml(name)}<br/><b>Email:</b> ${escapeHtml(email)}</p>
      <p style="white-space:pre-wrap;background:#f4f4f5;padding:12px;border-radius:6px">${escapeHtml(details)}</p>
      <p style="color:#b45309"><b>Deadlines:</b> acknowledge within 72 hours; resolve within 30 days (90 days is the legal maximum).
      ${category === "Possible data breach" ? "<br/><b>Possible breach:</b> follow docs/dpdp/incident-response.md now — Board notification is due without delay, detailed report within 72 hours." : ""}</p>
      <p style="color:#888">Grievance Officer: ${escapeHtml(GRIEVANCE_OFFICER.name)}</p>
    </div>`,
  });

  if (!supabase && !sent.ok) {
    return NextResponse.json(
      { error: `We couldn't record that. Please email ${GRIEVANCE_OFFICER.email} directly.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ reference });
}
