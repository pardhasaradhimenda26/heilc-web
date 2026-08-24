import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PersonaProvider } from "@/components/features/PersonaContext";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";
import JsonLd from "@/components/seo/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://heilc.com";

export const viewport: Viewport = {
  themeColor: "#14C5D4",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HEILC — AI & Digital Transformation Agency",
    template: "%s | HEILC",
  },
  description:
    "Where Human Intelligence Meets the Future. HEILC builds AI-powered products, custom machine learning models, and enterprise software that prove capability.",
  keywords: [
    "AI agency",
    "digital transformation",
    "machine learning",
    "enterprise software",
    "generative AI",
    "AI product development",
    "HEILC",
    "artificial intelligence consulting",
    "custom AI solutions",
  ],
  authors: [{ name: "HEILC Team", url: siteUrl }],
  creator: "HEILC",
  publisher: "HEILC",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HEILC — AI & Digital Transformation Agency",
    description:
      "Where Human Intelligence Meets the Future. HEILC builds AI-powered products that prove capability, not just describe it.",
    url: siteUrl,
    siteName: "HEILC",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/icon.png`,
        width: 512,
        height: 512,
        alt: "HEILC AI & Digital Transformation Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HEILC — AI & Digital Transformation Agency",
    description:
      "Where Human Intelligence Meets the Future. HEILC builds AI-powered products that prove capability, not just describe it.",
    creator: "@heilc",
    site: "@heilc",
    images: [`${siteUrl}/icon.png`],
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
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="grain">
      <head>
        <JsonLd />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
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

