import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60 * 1000;

/**
 * Runs once a day (vercel.json cron, free on Hobby):
 *  1. Keeps the free Supabase project awake (free projects pause after a
 *     week without activity, which would break sign-in).
 *  2. Retention — DPDP s.8(7)/(8): accounts idle for 3 years get a 48-hour
 *     notice, then are erased; old unlinked records are swept.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  const admin = getAdminSupabase();
  if (!admin) return NextResponse.json({ skipped: "Supabase service role not configured" });

  const report: Record<string, unknown> = {};

  // 1. Keep-alive: any real query counts as activity.
  const { count } = await admin.from("profiles").select("id", { count: "exact", head: true });
  report.profiles = count ?? 0;

  // 2a. Send the 48-hour notice to accounts idle for 3 years.
  const cutoff = new Date(Date.now() - 3 * 365 * DAY).toISOString();
  const { data: idle } = await admin
    .from("profiles")
    .select("id, full_name")
    .lt("last_active_at", cutoff)
    .is("deletion_notice_sent_at", null)
    .limit(50);

  let notified = 0;
  for (const p of idle ?? []) {
    const { data } = await admin.auth.admin.getUserById(p.id);
    const email = data.user?.email;
    if (email) {
      const r = await sendEmail({
        to: email,
        subject: "Your HEILC account will be deleted in 48 hours",
        html: `<div style="font-family:sans-serif;font-size:14px"><p>Hi ${p.full_name.split(" ")[0]},</p>
          <p>Your HEILC account hasn't been used for three years, so under our privacy notice we'll erase it and its data in 48 hours.</p>
          <p>Want to keep it? Just <a href="${SITE_URL}/login">sign in</a> before then.</p><p>— HEILC</p></div>`,
      });
      if (!r.ok) continue;
    }
    await admin.from("profiles").update({ deletion_notice_sent_at: new Date().toISOString() }).eq("id", p.id);
    notified++;
  }
  report.notified = notified;

  // 2b. Erase accounts whose notice expired without a sign-in.
  const noticeCutoff = new Date(Date.now() - 2 * DAY).toISOString();
  const { data: expired } = await admin
    .from("profiles")
    .select("id, notice_version")
    .lt("deletion_notice_sent_at", noticeCutoff)
    .lt("last_active_at", cutoff)
    .limit(50);

  let erased = 0;
  for (const p of expired ?? []) {
    await admin.from("consent_log").insert({
      user_id: p.id,
      purpose: "account",
      action: "account_deleted",
      notice_version: p.notice_version,
      source: "retention",
    });
    const { error } = await admin.auth.admin.deleteUser(p.id);
    if (!error) erased++;
  }
  report.erased = erased;

  // 2c. Sweep old unlinked records.
  const { data: swept } = await admin.rpc("retention_sweep");
  report.swept = swept;

  return NextResponse.json(report);
}
