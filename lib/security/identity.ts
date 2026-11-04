import { promises as dns } from "node:dns";

/** Throwaway inboxes used to farm accounts. Extend as abuse shows up. */
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.info", "sharklasers.com", "grr.la",
  "10minutemail.com", "10minutemail.net", "tempmail.com", "temp-mail.org", "temp-mail.io",
  "tempmail.dev", "tempmailo.com", "throwawaymail.com", "yopmail.com", "yopmail.net",
  "getnada.com", "nada.email", "trashmail.com", "trashmail.de", "dispostable.com",
  "maildrop.cc", "mailnesia.com", "mintemail.com", "fakeinbox.com", "emailondeck.com",
  "moakt.com", "mohmal.com", "spamgourmet.com", "mytemp.email", "tempr.email",
  "discard.email", "burnermail.io", "inboxkitten.com", "mailpoof.com", "tmail.ws",
  "tmpmail.org", "tmpmail.net", "1secmail.com", "1secmail.org", "1secmail.net",
  "minuteinbox.com", "emailfake.com", "fakemail.net", "spambox.us", "mail.tm",
]);

/** Big providers we know receive mail — skip the DNS lookup for speed. */
const COMMON = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.in", "outlook.com", "hotmail.com",
  "live.com", "icloud.com", "me.com", "rediffmail.com", "proton.me", "protonmail.com",
  "zoho.com", "zohomail.in", "aol.com", "heilc.com",
]);

const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

export type Checked = { ok: true; value: string } | { ok: false; error: string };

/**
 * A "valid email" means: well-formed, not a throwaway service, and its domain
 * can actually receive mail (has MX records, or an A record as RFC 5321 allows).
 */
export async function checkEmail(input: unknown): Promise<Checked> {
  const email = String(input ?? "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email) || email.includes("..")) {
    return { ok: false, error: "Enter a valid email address." };
  }
  const domain = email.split("@")[1];
  if (DISPOSABLE.has(domain) || Array.from(DISPOSABLE).some((d) => domain.endsWith(`.${d}`))) {
    return { ok: false, error: "Please use your regular email — temporary inboxes aren't accepted." };
  }
  if (COMMON.has(domain)) return { ok: true, value: email };
  try {
    const mx = await withTimeout(dns.resolveMx(domain), 2500);
    if (mx.some((r) => r.exchange && r.exchange !== ".")) return { ok: true, value: email };
    return { ok: false, error: "That email domain can't receive mail. Check for typos." };
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "ENOTFOUND" || code === "ENODATA") {
      try {
        await withTimeout(dns.resolve4(domain), 2000);
        return { ok: true, value: email };
      } catch (e) {
        const c = (e as { code?: string }).code;
        if (c === "ENOTFOUND" || c === "ENODATA") {
          return { ok: false, error: "That email domain doesn't exist. Check for typos." };
        }
        return { ok: true, value: email };
      }
    }
    // DNS timeout or resolver trouble: don't lock real people out.
    return { ok: true, value: email };
  }
}

/**
 * Mobile numbers are normalised to E.164. A bare 10-digit number is read as
 * Indian (+91). Indian mobiles must start with 6–9; other countries must be
 * listed in AUTH_PHONE_COUNTRIES.
 */
export function checkPhone(input: unknown): Checked {
  let digits = String(input ?? "").replace(/[\s\-().]/g, "");
  if (/^0?[6-9]\d{9}$/.test(digits)) digits = `+91${digits.slice(-10)}`;
  if (/^91[6-9]\d{9}$/.test(digits)) digits = `+${digits}`;
  if (!/^\+[1-9]\d{7,14}$/.test(digits)) {
    return { ok: false, error: "Enter a valid mobile number, e.g. 98765 43210." };
  }
  const allowed = (process.env.AUTH_PHONE_COUNTRIES ?? "91").split(",").map((c) => c.trim());
  const country = allowed.find((c) => c && digits.startsWith(`+${c}`));
  if (!country) return { ok: false, error: "Mobile sign-in isn't available for that country yet — please use email." };
  if (country === "91" && !/^\+91[6-9]\d{9}$/.test(digits)) {
    return { ok: false, error: "Enter a valid 10-digit Indian mobile number." };
  }
  return { ok: true, value: digits };
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(Object.assign(new Error("timeout"), { code: "ETIMEOUT" })), ms)),
  ]);
}
