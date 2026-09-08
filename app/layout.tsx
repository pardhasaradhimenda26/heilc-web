import type { Metadata, Viewport } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";

import { PersonaProvider } from "@/components/features/PersonaContext";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * Self-hosted at build time via next/font, which removes the render-blocking
 * fonts.googleapis.com stylesheet the head used to carry and preloads the
 * font file instead. `--font-bebas` is the variable the whole design already
 * references.
 */
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas",
  fallback: ["Impact", "sans-serif"],
});

export const viewport: Viewport = {
  themeColor: "#14C5D4",
  width: "device-width",
  initialScale: 1,
};

const defaultTitle = "HEILC — AI & Digital Transformation Agency";
const defaultDescription =
  "HEILC is an AI and digital transformation agency building custom AI products, machine learning models and enterprise software — from evaluation to production.";

export const metadata: Metadata = {
  // Every relative URL in per-page metadata resolves against the canonical origin.
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: "%s | HEILC",
  },
  description: defaultDescription,
  applicationName: SITE_NAME,
  authors: [{ name: "HEILC", url: SITE_URL }],
  creator: "HEILC",
  publisher: "HEILC",
  category: "technology",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: absoluteUrl(OG_IMAGE.url),
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    creator: "@heilc",
    site: "@heilc",
    images: [absoluteUrl(OG_IMAGE.url)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.png" }],
    shortcut: ["/icon.png"],
    apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`grain ${bebasNeue.variable}`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <PersonaProvider>
          <SmoothScroll>
            <LoadingScreen />
            <CustomCursor />
            {children}
          </SmoothScroll>
        </PersonaProvider>
      </body>
    </html>
  );
}
