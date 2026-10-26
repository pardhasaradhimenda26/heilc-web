/**
 * Onboarding vocabulary. The answers pick which of the three persona engines
 * (startup, enterprise, student) drives the site, and give the assistant and
 * proposal generator real context about the visitor.
 */

export type Persona = "startup" | "enterprise" | "student";

export interface Option {
  id: string;
  label: string;
  desc?: string;
}

export const SEGMENTS: (Option & { persona: Persona })[] = [
  {
    id: "founder",
    persona: "startup",
    label: "I'm building a startup",
    desc: "Founder or early team — you need a product live, fast, without burning runway.",
  },
  {
    id: "business",
    persona: "enterprise",
    label: "I run or work at an established business",
    desc: "You want to automate work, modernise systems or put AI into real workflows.",
  },
  {
    id: "student",
    persona: "student",
    label: "I'm a student or early-career builder",
    desc: "You want to learn how production AI gets built, collaborate or intern.",
  },
];

export const PERSONA_LABEL: Record<Persona, string> = {
  startup: "startup founders",
  enterprise: "established businesses",
  student: "students and early-career builders",
};

/** Interest → the service pages that answer it. */
export const INTERESTS: (Option & { personas: Persona[]; services: string[] })[] = [
  { id: "ai-product", label: "An AI product or chatbot", personas: ["startup", "enterprise"], services: ["custom-llm-and-chatbot-integration", "artificial-intelligence-solutions"] },
  { id: "website", label: "A website or web app", personas: ["startup", "enterprise"], services: ["ai-powered-web-platforms", "ui-ux-design-and-prototyping"] },
  { id: "mobile", label: "A mobile app", personas: ["startup", "enterprise"], services: ["mobile-app-development"] },
  { id: "automation", label: "Automating a manual workflow", personas: ["startup", "enterprise"], services: ["intelligent-automation-solutions"] },
  { id: "data-ml", label: "A data dashboard or ML model", personas: ["startup", "enterprise"], services: ["data-analytics-and-visualization", "artificial-intelligence-solutions"] },
  { id: "modernise", label: "Modernising an old system", personas: ["enterprise"], services: ["digital-transformation-and-modernization", "enterprise-software-engineering"] },
  { id: "cloud", label: "Cloud, DevOps or scaling", personas: ["startup", "enterprise"], services: ["cloud-infrastructure-and-devops"] },
  { id: "design", label: "UI/UX design", personas: ["startup", "enterprise"], services: ["ui-ux-design-and-prototyping"] },
  { id: "learning", label: "Learning how AI products are built", personas: ["student"], services: ["artificial-intelligence-solutions"] },
  { id: "internship", label: "An internship or collaboration", personas: ["student"], services: [] },
  { id: "hackathon", label: "A hackathon or club partnership", personas: ["student"], services: [] },
  { id: "project-help", label: "Guidance on my own project", personas: ["student"], services: ["artificial-intelligence-solutions"] },
  { id: "exploring", label: "Just exploring", personas: ["startup", "enterprise", "student"], services: [] },
];

export const STARTUP_STAGES: Option[] = [
  { id: "idea", label: "Idea — nothing built yet" },
  { id: "mvp", label: "Building the first version" },
  { id: "launched", label: "Launched — finding users" },
  { id: "scaling", label: "Growing or raising" },
];

export const COMPANY_SIZES: Option[] = [
  { id: "1-10", label: "1–10 people" },
  { id: "11-50", label: "11–50 people" },
  { id: "51-200", label: "51–200 people" },
  { id: "201-1000", label: "201–1,000 people" },
  { id: "1000+", label: "1,000+ people" },
];

export const TIMELINES: Option[] = [
  { id: "asap", label: "Within a month" },
  { id: "1-3m", label: "In 1–3 months" },
  { id: "3m+", label: "Later this year" },
  { id: "exploring", label: "No timeline — exploring" },
];

export function labelOf(list: Option[], id: string | null | undefined): string | null {
  if (!id) return null;
  return list.find((o) => o.id === id)?.label ?? id;
}

export function interestLabels(ids: string[] | null | undefined): string[] {
  return (ids ?? []).map((id) => INTERESTS.find((i) => i.id === id)?.label ?? id);
}

export function servicesForInterests(ids: string[] | null | undefined): string[] {
  const out = new Set<string>();
  for (const id of ids ?? []) {
    for (const s of INTERESTS.find((i) => i.id === id)?.services ?? []) out.add(s);
  }
  return Array.from(out);
}
