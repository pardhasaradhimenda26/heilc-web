import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "HEILC — AI & Digital Transformation Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * 1200x630 (1.91:1) social card — the aspect ratio that justifies
 * twitter:card=summary_large_image. Replaces the old 512x512 icon.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#080808",
          backgroundImage:
            "radial-gradient(circle at 78% 22%, rgba(20,197,212,0.22) 0%, rgba(8,8,8,0) 55%), radial-gradient(circle at 12% 88%, rgba(124,92,191,0.20) 0%, rgba(8,8,8,0) 55%)",
          padding: "72px 80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#14C5D4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#050505",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            H
          </div>
          <div
            style={{
              fontSize: 30,
              letterSpacing: 8,
              fontWeight: 700,
            }}
          >
            HEILC
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 74,
              lineHeight: 1.06,
              fontWeight: 700,
              letterSpacing: -1.5,
              maxWidth: 940,
            }}
          >
            AI &amp; Digital Transformation Agency
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.62)",
              maxWidth: 900,
            }}
          >
            Custom AI products, machine learning models and enterprise software —
            built, evaluated and shipped to production.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            paddingTop: 28,
            fontSize: 24,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <div style={{ display: "flex" }}>www.heilc.com</div>
          <div style={{ display: "flex", color: "#14C5D4", letterSpacing: 3 }}>
            CHENNAI · WORLDWIDE
          </div>
        </div>
      </div>
    ),
    size,
  );
}
