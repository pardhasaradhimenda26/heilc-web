/**
 * HEILC knowledge base for the assistant and proposal generator.
 *
 * Built from the same content modules the pages render, so the assistant can
 * only state what the site states. A small keyword retriever picks the chunks
 * relevant to each question, which keeps prompts short (the free Groq tier is
 * limited by tokens per minute) and keeps answers grounded in specifics
 * rather than generic agency talk.
 */
import { SERVICES } from "@/lib/content/services";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { FAQS } from "@/lib/content/faq";
import { FOUNDERS } from "@/lib/content/team";
import { ARTICLES } from "@/lib/content/insights";
import { BUSINESS_LOCATION, CONTACT_EMAIL } from "@/lib/site";

export interface Chunk {
  id: string;
  kind: "service" | "case" | "faq" | "article" | "founder";
  title: string;
  path: string;
  text: string;
}

export const CORE_FACTS = [
  `HEILC is an AI and digital transformation agency based in ${BUSINESS_LOCATION.addressLocality}, India, working with clients worldwide. Tagline: "Where Human Intelligence Meets the Future."`,
  `Founders: ${FOUNDERS.map((f) => `${f.name} (${f.role})`).join("; ")}.`,
  "What we build: RAG systems over private documents, fine-tuned and prompt-engineered LLM apps, classical ML models for prediction, and the web/mobile/enterprise software they live inside — through to deployment and monitoring.",
  "How we work: week one is discovery and an evaluation set built from real queries or records, defining what 'correct' means before model code is written. Focused MVPs reach production in 3–6 weeks, then bi-weekly sprints with a written plan and a demo at the end of each.",
  "Engagements: fixed-scope projects quoted after a paid discovery week (architecture, evaluation definition, sprint plan — yours to keep either way), or an 'Intelligence on Demand' pod (AI architect, ML engineer, full-stack engineer, product designer) at a fixed monthly rate, resizable at sprint boundaries. No public rate card. Cloud and model costs are billed to the client's own accounts, never marked up.",
  "Ownership & security: systems run in the client's own cloud account; the client owns the repo, model weights, data and docs. We build for SOC 2 / HIPAA readiness but never claim a certification the client hasn't obtained.",
  "What we won't do: quote before we understand scope, or push AI where a query or rules engine would do it better and cheaper. A bad fit is 'adopt AI' with no workflow attached, data that doesn't exist yet, or no agreed definition of success.",
  `Contact: ${CONTACT_EMAIL} or /contact — a technical person replies within one business day.`,
].join("\n");

const trim = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

function buildChunks(): Chunk[] {
  const chunks: Chunk[] = [];

  for (const s of SERVICES) {
    chunks.push({
      id: `service:${s.slug}`,
      kind: "service",
      title: s.title,
      path: `/services/${s.slug}`,
      text: [
        `${s.title}: ${s.definition}`,
        ...s.sections.map((sec) => `${sec.heading}: ${trim(sec.body, 260)}${sec.bullets ? ` (${sec.bullets.slice(0, 4).join("; ")})` : ""}`),
        `Deliverables: ${s.deliverables.join("; ")}.`,
        `Engagement: ${s.engagement}`,
      ].join("\n"),
    });
  }

  for (const c of CASE_STUDIES) {
    chunks.push({
      id: `case:${c.slug}`,
      kind: "case",
      title: c.title,
      path: `/case-studies/${c.slug}`,
      text: [
        `${c.title} — ${c.subtitle} (${c.category}, ${c.year}).`,
        `Problem: ${trim(c.problem, 300)}`,
        `Key numbers: ${c.metrics.map((m) => `${m.value} ${m.label}`).join("; ")}.`,
        `Approach: ${c.approach.map((a) => `${a.heading} — ${trim(a.body, 160)}`).join(" | ")}`,
        `Stack: ${c.stack.map((g) => `${g.group}: ${g.items.join(", ")}`).join("; ")}.`,
        `Outcome: ${trim(c.outcome, 260)}`,
      ].join("\n"),
    });
  }

  for (const f of FAQS) {
    chunks.push({
      id: `faq:${f.id}`,
      kind: "faq",
      title: f.question,
      path: `/faq#${f.id}`,
      text: `${f.category.toLowerCase()}. Q: ${f.question}\nA: ${trim(f.answer, 700)}`,
    });
  }

  for (const a of ARTICLES) {
    chunks.push({
      id: `article:${a.slug}`,
      kind: "article",
      title: a.title,
      path: `/insights/${a.slug}`,
      text: `${a.title}: ${a.standfirst} Tags: ${a.tags.join(", ")}.`,
    });
  }

  for (const f of FOUNDERS) {
    chunks.push({
      id: `founder:${f.slug}`,
      kind: "founder",
      title: f.name,
      path: `/about#${f.slug}`,
      text: `${f.name}, ${f.role}. ${trim(f.longBio, 500)}`,
    });
  }

  return chunks;
}

const STOP = new Set(
  "a an the and or but if of to in on for with at by from as is are was were be been being it this that these those i we you your our my me us they them he she his her its do does did can could would should will shall may might must have has had not no yes so than then there here what which who whom how why when where about into over under more most some any all each other such only own same very just also too out up down off again further once both few".split(
    " ",
  ),
);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[-.]+|[-.]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(t));
}

const CHUNKS = buildChunks();
const CHUNK_TOKENS = CHUNKS.map((c) => new Set(tokens(`${c.title} ${c.title} ${c.text}`)));
const DF = new Map<string, number>();
for (const set of CHUNK_TOKENS) for (const t of Array.from(set)) DF.set(t, (DF.get(t) ?? 0) + 1);

/** Synonyms that bridge how visitors talk and how the site is written. */
const EXPAND: Record<string, string[]> = {
  chatbot: ["llm", "chatbot", "assistant", "rag", "chat"],
  bot: ["chatbot", "llm", "assistant"],
  whatsapp: ["chatbot", "llm", "assistant", "automation"],
  questions: ["chatbot", "assistant", "rag"],
  faq: ["chatbot", "rag", "assistant"],
  support: ["chatbot", "assistant", "automation"],
  customer: ["chatbot", "assistant"],
  reception: ["chatbot", "automation"],
  desk: ["chatbot", "automation"],
  website: ["web", "platform", "next.js"],
  site: ["web", "platform"],
  app: ["mobile", "web", "application"],
  android: ["mobile"],
  ios: ["mobile"],
  price: ["pricing", "price", "quote", "discovery"],
  cost: ["pricing", "price", "quote", "cost"],
  much: ["pricing", "price"],
  budget: ["pricing", "price", "quote"],
  charge: ["pricing", "price"],
  rate: ["pricing", "price", "pod"],
  mvp: ["mvp", "timeline", "weeks"],
  timeline: ["weeks", "mvp", "timeline"],
  fast: ["weeks", "mvp", "timeline"],
  ship: ["weeks", "mvp", "production"],
  long: ["weeks", "timeline"],
  secure: ["security", "privacy"],
  security: ["security", "privacy", "ownership"],
  data: ["analytics", "data", "dashboard"],
  dashboard: ["analytics", "visualization", "dashboard"],
  clinic: ["healthcare", "clinicians"],
  hospital: ["healthcare", "clinicians"],
  health: ["healthcare", "clinicians"],
  patients: ["healthcare"],
  movie: ["film", "cinegenome"],
  recommend: ["recommendation", "cinegenome"],
  resume: ["resumeai", "ats"],
  hiring: ["hr", "recruitment", "resumeai"],
  legacy: ["modernisation", "strangler", "erp", "legacy"],
  sap: ["erp", "legacy", "integration"],
  erp: ["erp", "legacy", "integration"],
  crm: ["crm", "legacy", "integration"],
  automate: ["automation", "workflow"],
  manual: ["automation", "workflow"],
  documents: ["document", "rag", "automation"],
  invoices: ["document", "automation", "extraction"],
  team: ["pod", "engineers"],
  hire: ["pod", "engineers"],
  intern: ["internship", "students"],
  interns: ["internship", "students"],
};


export function retrieve(query: string, opts: { boostPaths?: string[]; k?: number; budget?: number } = {}): Chunk[] {
  const { boostPaths = [], k = 6, budget = 5200 } = opts;
  const q = tokens(query);
  const expanded = new Set(q);
  for (const t of q) for (const e of EXPAND[t] ?? []) expanded.add(e);

  const N = CHUNKS.length;
  const scored = CHUNKS.map((chunk, i) => {
    let score = 0;
    for (const t of Array.from(expanded)) {
      if (CHUNK_TOKENS[i].has(t)) score += Math.log(1 + N / (DF.get(t) ?? 1));
    }
    if (boostPaths.includes(chunk.path)) score += 2.5;
    return { chunk, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const out: Chunk[] = [];
  let used = 0;
  for (const { chunk } of scored) {
    if (out.length >= k) break;
    if (used + chunk.text.length > budget) continue;
    out.push(chunk);
    used += chunk.text.length;
  }
  return out;
}

export function formatChunks(chunks: Chunk[]): string {
  return chunks.map((c) => `[${c.title} — ${c.path}]\n${c.text}`).join("\n\n");
}

export const ALL_CASE_STUDIES = CASE_STUDIES.map((c) => ({ title: c.title, path: `/case-studies/${c.slug}` }));
