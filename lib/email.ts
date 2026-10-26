/** Minimal Resend wrapper (free tier: 3,000 emails/month). */

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function teamInbox(): string {
  return process.env.CONTACT_RECEIVER_EMAIL || "pardhasaradhimenda26@gmail.com";
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not configured" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      // onboarding@resend.dev works without a verified domain, but only to the
      // Resend account owner's address. Verify heilc.com in Resend and set
      // CONTACT_FROM_EMAIL to send from your own domain.
      from: process.env.CONTACT_FROM_EMAIL || "HEILC Website <onboarding@resend.dev>",
      to: input.to,
      subject: input.subject.replace(/[\r\n]+/g, " ").slice(0, 180),
      html: input.html,
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
    }),
  });
  if (!res.ok) return { ok: false, error: await res.text() };
  return { ok: true };
}
