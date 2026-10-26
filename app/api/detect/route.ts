import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Region-based persona hint, from the hosting platform's own request headers.
 * Called only after the visitor allows personalisation. Nothing is logged or
 * stored here, and no third-party geolocation service is involved.
 */
function mapToPersona(country: string, referrer: string): { persona: string; reason: string } {
  if (referrer.includes("linkedin.com")) return { persona: "enterprise", reason: "LinkedIn referral" };
  if (referrer.includes("github.com") || referrer.includes("dev.to"))
    return { persona: "startup", reason: "Developer community referral" };
  if (/\b(edu|ac\.in|college|university)\b/.test(referrer))
    return { persona: "student", reason: "Education referral" };

  const enterprise = ["US", "GB", "DE", "JP", "SG", "AU", "CA", "FR", "NL", "SE", "CH", "AE"];
  if (enterprise.includes(country)) return { persona: "enterprise", reason: `Region (${country})` };
  return { persona: "startup", reason: `Region (${country})` };
}

export async function GET(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country") || "IN";
  const rawCity = req.headers.get("x-vercel-ip-city");
  const city = rawCity ? decodeURIComponent(rawCity) : "Chennai";
  const region = req.headers.get("x-vercel-ip-country-region") || "TN";
  const timezone = req.headers.get("x-vercel-ip-timezone") || "Asia/Kolkata";
  const lat = Number(req.headers.get("x-vercel-ip-latitude"));
  const lon = Number(req.headers.get("x-vercel-ip-longitude"));
  const referrer = req.headers.get("referer") || "";

  const { persona, reason } = mapToPersona(country, referrer);

  return Response.json(
    {
      country,
      city,
      region,
      timezone,
      detectedPersona: persona,
      reason,
      // City-level and rounded — enough for the globe marker, nothing finer.
      ...(Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0
        ? { latitude: Math.round(lat * 10) / 10, longitude: Math.round(lon * 10) / 10 }
        : {}),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
