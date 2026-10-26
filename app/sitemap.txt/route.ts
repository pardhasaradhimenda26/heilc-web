import sitemap from "../sitemap";

/**
 * Plain-text sitemap (one URL per line) — accepted by Google and Bing and
 * the simplest format for AI crawlers and IndexNow scripts to consume.
 */
export const dynamic = "force-static";

export function GET() {
  const body = sitemap()
    .map((entry) => entry.url)
    .join("\n");
  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
