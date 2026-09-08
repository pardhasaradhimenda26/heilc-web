import type { Metadata } from "next";
import { OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from "./site";

interface PageMetaInput {
  title: string;
  description: string;
  /** Site-root-relative path, e.g. "/services/…". */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

/**
 * Builds page metadata with a self-referencing absolute canonical and
 * per-page OpenGraph/Twitter tags. The 1200x630 card produced by
 * app/opengraph-image.tsx is attached explicitly so every route carries a
 * large-format image regardless of segment inheritance.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const image = {
    url: absoluteUrl(OG_IMAGE.url),
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
    alt: OG_IMAGE.alt,
    type: "image/png",
  };

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images: [image],
      ...(type === "article"
        ? { publishedTime, modifiedTime, authors, tags }
        : {}),
    },
    twitter: {
      // Justified: the card image is 1200x630 (1.91:1).
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
      site: "@heilc",
      creator: "@heilc",
    },
  };
}

/** Serialises a schema object for a <script type="application/ld+json"> tag. */
export function jsonLdScript(schema: unknown): { __html: string } {
  // `<` is escaped so a stray sequence in content can never close the script tag.
  return { __html: JSON.stringify(schema).replace(/</g, "\\u003c") };
}

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;
