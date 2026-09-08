/**
 * Founder profiles. `sameAs` is deliberately absent: no verified personal
 * profile URLs for either founder exist in this repository or in HEILC's
 * published content, and fabricating them would poison the entity graph.
 * Add real URLs here and Person schema will pick them up automatically.
 */

export interface TeamMember {
  slug: string;
  name: string;
  jobTitle: string;
  /** One-line role summary used on cards. */
  role: string;
  /** Short public bio — two to three sentences. */
  bio: string;
  /** Longer bio for /about. */
  longBio: string;
  focus: string[];
  /** Verified public profile URLs only. Empty until confirmed. */
  sameAs: string[];
}

export const FOUNDERS: TeamMember[] = [
  {
    slug: "pardhasaradhi-menda",
    name: "Pardhasaradhi Menda",
    jobTitle: "Co-Founder",
    role: "Co-Founder — AI & Machine Learning Engineering",
    bio: "Co-founder of HEILC, leading machine learning engineering and applied AI architecture. His work spans model development and evaluation — including GeneRisk AI, the XGBoost DNA-sequence classifier that reaches 97.37% accuracy on held-out data — and the retrieval systems behind HEILC's LLM products.",
    longBio:
      "Pardhasaradhi Menda co-founded HEILC to close the gap between machine learning that works in a notebook and machine learning that works in production. He leads model development and evaluation across HEILC's engagements: feature engineering and validation strategy on classical ML problems, retrieval architecture and groundedness evaluation on LLM systems, and the evaluation harnesses that decide when a model is actually ready to ship. He built GeneRisk AI, the DNA-sequence cancer risk classifier that reaches 97.37% accuracy on its held-out test set, and led the cinematic-DNA enrichment pipeline behind CineGenome's 3,477-film index. He is direct about what models cannot do, which is usually the more useful half of the conversation.",
    focus: [
      "Machine learning engineering and model evaluation",
      "Retrieval-augmented generation architecture",
      "Applied AI product development",
    ],
    sameAs: [],
  },
  {
    slug: "varshith-dondamuri",
    name: "Varshith Dondamuri",
    jobTitle: "Co-Founder",
    role: "Co-Founder — Product & Platform Engineering",
    bio: "Co-founder of HEILC, leading product and platform engineering. He owns the systems around the models — application architecture, APIs, cloud infrastructure and delivery — including the platforms behind CineGenome and ResumeAI.",
    longBio:
      "Varshith Dondamuri co-founded HEILC and leads product and platform engineering: the application architecture, API design, cloud infrastructure and delivery pipelines that turn a model into something a business can depend on. His work covers full-stack product development in Next.js and TypeScript, backend services in Node.js and Python, and the deployment and observability layer underneath. He built the CineGenome platform — the FastAPI retrieval service, the Pinecone and MySQL data layer, and the Next.js interface over it — and delivered ResumeAI end to end inside the 24-hour AppXcelerate 1.0 hackathon window, including the three-strategy JSON parser that made its structured model output reliable enough to demo.",
    focus: [
      "Full-stack product engineering",
      "Cloud infrastructure and delivery",
      "API and platform architecture",
    ],
    sameAs: [],
  },
];

export function getFounder(slug: string): TeamMember | undefined {
  return FOUNDERS.find((f) => f.slug === slug);
}
