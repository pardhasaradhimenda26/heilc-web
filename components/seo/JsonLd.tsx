import { jsonLdScript } from "@/lib/seo";

/**
 * Renders one JSON-LD @graph document. Pages compose their own graph from
 * lib/schema.ts builders and pass it here.
 */
export default function JsonLd({ schema }: { schema: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={jsonLdScript(schema)}
    />
  );
}
