/**
 * Regenerates public/llms-full.txt from the same content modules the site
 * renders, so the AI-crawler brief can never drift from the pages.
 *
 *   npx tsx scripts/generate-llms.ts
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { SITE_URL, CONTACT_EMAIL, SOCIAL_LINKS, BUSINESS_LOCATION } from "../lib/site";
import { CAPABILITIES, OFFERINGS } from "../lib/content/services";
import { CASE_STUDIES } from "../lib/content/case-studies";
import { FAQS } from "../lib/content/faq";
import { FOUNDERS } from "../lib/content/team";
import { ARTICLES } from "../lib/content/insights";

const lines: string[] = [];
const push = (...text: string[]) => lines.push(...text);

push(
  "# HEILC — Full Technical & Brand Documentation for AI Models",
  "",
  "> Generated from the site's own content modules. Every figure below appears verbatim on the page it links to.",
  "",
  "## Brand summary",
  "HEILC is an AI and digital transformation agency. It builds custom AI products, machine learning models and the enterprise software they live inside — taking a problem from the decision it has to support through to a deployed, evaluated, monitored system running in the client's own cloud account.",
  "",
  `- Website: ${SITE_URL}`,
  `- Contact: ${CONTACT_EMAIL} · ${SITE_URL}/contact`,
  `- Based in: ${BUSINESS_LOCATION.addressLocality}, ${BUSINESS_LOCATION.addressRegion}, India — working worldwide`,
  `- LinkedIn: ${SOCIAL_LINKS.linkedin}`,
  `- GitHub: ${SOCIAL_LINKS.github}`,
  `- Instagram: ${SOCIAL_LINKS.instagram}`,
  `- Twitter/X: ${SOCIAL_LINKS.twitter}`,
  "",
  "## Founders",
);

for (const founder of FOUNDERS) {
  push(
    `### ${founder.name} — ${founder.jobTitle}`,
    founder.longBio,
    `Profile: ${SITE_URL}/about#${founder.slug}`,
    "",
  );
}

push("## Core capabilities", "");
for (const service of CAPABILITIES) {
  push(
    `### ${service.title}`,
    service.definition,
    `Deliverables: ${service.deliverables.join("; ")}.`,
    `Engagement: ${service.engagement}`,
    `URL: ${SITE_URL}/services/${service.slug}`,
    "",
  );
}

push("## What HEILC builds", "");
for (const service of OFFERINGS) {
  push(
    `### ${service.title}`,
    service.definition,
    `Deliverables: ${service.deliverables.join("; ")}.`,
    `Engagement: ${service.engagement}`,
    `URL: ${SITE_URL}/services/${service.slug}`,
    "",
  );
}

push("## Case studies", "");
for (const study of CASE_STUDIES) {
  push(
    `### ${study.title} — ${study.subtitle}`,
    `Problem: ${study.problem}`,
    `Outcome: ${study.outcome}`,
    `Metrics: ${study.metrics.map((m) => `${m.value} (${m.label})`).join("; ")}.`,
    `Stack: ${study.stack.map((g) => `${g.group}: ${g.items.join(", ")}`).join(" | ")}.`,
    `URL: ${SITE_URL}/case-studies/${study.slug}`,
    "",
  );
}

push("## Frequently asked questions", "");
for (const faq of FAQS) {
  push(`### ${faq.question}`, faq.answer, "");
}

push("## Insight articles", "");
for (const article of ARTICLES) {
  push(
    `### ${article.title}`,
    article.standfirst,
    `Published ${article.datePublished}. URL: ${SITE_URL}/insights/${article.slug}`,
    "",
  );
}

push(
  "## What HEILC does not claim",
  "HEILC publishes no client logos, review counts, star ratings, award claims or press mentions, because none are independently verifiable. Figures on the site name the dataset or constraint they were measured under.",
  "",
);

const output = `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
const target = resolve(process.cwd(), "public/llms-full.txt");
writeFileSync(target, output, "utf8");
console.log(`Wrote ${target} (${output.split(/\s+/).length} words)`);
