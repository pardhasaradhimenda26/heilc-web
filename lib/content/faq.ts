/**
 * FAQ content. This is the single source for the on-page accordion, the /faq
 * route and the FAQPage JSON-LD — the schema text and the rendered text are
 * the same string, which is the requirement Google states for FAQ rich results.
 */

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  /** Rendered verbatim on the page and emitted verbatim in FAQPage schema. */
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    id: "what-we-build",
    category: "AI & ML ENGINEERING",
    question: "What custom AI and digital transformation solutions does HEILC engineer?",
    answer:
      "HEILC builds four things: retrieval-augmented generation (RAG) systems over private document sets, fine-tuned and prompt-engineered LLM applications, classical machine learning models for prediction and classification, and the enterprise software those models live inside. A typical engagement covers the whole path — data ingestion, evaluation harness, model or pipeline, API, interface, deployment and monitoring — rather than a model handed over as a notebook. Our own products show the range: GeneRisk AI is an XGBoost classifier at 97.37% held-out accuracy served through a Flask API, and CineGenome is a Claude-plus-Pinecone retrieval system over 3,477 enriched film profiles.",
  },
  {
    id: "security-and-ip",
    category: "ENTERPRISE SECURITY",
    question: "How does HEILC ensure data privacy, security, and IP protection?",
    answer:
      "Three commitments. First, deployment location: models and pipelines run inside your own AWS, GCP or Azure account, on your VPC, so training data and prompts never traverse a HEILC-controlled system. Second, ownership: the contract assigns you the repository, the model weights, the training data and the documentation — we retain no licence-back and there is no proprietary runtime you must keep paying for. Third, engineering practice: TLS in transit and cloud-KMS encryption at rest, least-privilege IAM with short-lived credentials, secrets in a managed store rather than environment files, automated dependency and container scanning in CI, and immutable audit logs on privileged actions. That is SOC 2 and HIPAA-readiness posture — we build systems that can pass an audit; obtaining the certification remains your process, and we will not claim otherwise.",
  },
  {
    id: "mvp-timeline",
    category: "TIMELINES & EXECUTION",
    question: "What is the typical development timeline for an enterprise AI MVP?",
    answer:
      "Three to six weeks to a production MVP for a focused scope, then bi-weekly iteration sprints. Week one is discovery and the evaluation set: we collect real queries or records and define what 'correct' means before writing model code, because that set is what decides when the project is done. Weeks two and three build the pipeline and a usable interface against it. Weeks four to six harden — authentication, rate limiting, observability, CI/CD, rollback. The variables that move that range are data readiness and access approvals, not engineering capacity; if your data needs cleaning or a security review has to clear first, we tell you at week one rather than at week five.",
  },
  {
    id: "legacy-integration",
    category: "INTEGRATION & ARCHITECTURE",
    question: "Can HEILC integrate custom AI models with existing enterprise legacy systems?",
    answer:
      "Yes, and without a rewrite. We use the strangler pattern: an API layer goes in front of the legacy system, one workflow moves behind it at a time, and the old path is retired only once the new one carries real traffic. In practice that means REST or GraphQL bridges over legacy ERP, CRM and database systems; change-data-capture or event streams where a dual write would risk inconsistency; and an anti-corruption layer so legacy data models do not leak into the new services. Every migration step is independently reversible and sequenced lowest-business-risk first. If a legacy system works and costs little to run, we will tell you to leave it alone — modernisation has to be justified by integration cost, change velocity or compliance exposure.",
  },
  {
    id: "intelligence-on-demand",
    category: "ENGAGEMENT MODELS",
    question: "How does HEILC's 'Intelligence on Demand' pod model operate?",
    answer:
      "A pod is a small cross-functional team — typically an AI architect, a machine learning engineer, a full-stack engineer and a product designer — embedded with your team for a fixed monthly commitment rather than billed per ticket. The pod works in your repository, your issue tracker and your standups, commits directly, and is accountable for outcomes in your backlog rather than for a statement of work negotiated in advance. Engagements run in bi-weekly sprints with a written plan at the start and a demo at the end; you can resize or end the pod at a sprint boundary. The point is to add senior capability in days instead of the three to six months a comparable hire takes, without the pod becoming a black box you cannot inspect.",
  },
  {
    id: "cost-and-latency",
    category: "PERFORMANCE & COST OPTIMIZATION",
    question: "How does HEILC optimize AI inference latency and operational API costs?",
    answer:
      "Five techniques, applied in order of payoff. Semantic caching first — repeated and near-duplicate queries are extremely common in enterprise assistants, and a cache hit costs nothing and returns instantly. Then model routing: classify the difficulty of a request and send the easy majority to a small open model such as Llama or Mistral, reserving frontier APIs for what genuinely needs them. Then prompt and context pruning, since retrieved context is usually the largest and most compressible part of the token bill. Then retrieval tuning — better chunking and reranking mean fewer passages carried into the prompt. Finally quantisation and batching for self-hosted models. We instrument cost per query and p50/p95 latency before optimising, so the improvement is measured against your own baseline rather than a general claim.",
  },
  {
    id: "support-and-slas",
    category: "SUPPORT & SLA TIERS",
    question: "What ongoing maintenance, SLAs, and model monitoring does HEILC provide post-deployment?",
    answer:
      "Support is tiered and written into the contract rather than assumed. A standard tier covers business-hours response with a next-business-day target on non-critical issues; a critical tier covers 24/7 paging with a one-hour acknowledgement target on production-down incidents. Every tier includes the same monitoring baseline: uptime and error-rate alerting, p95 latency tracking, input and output drift detection against the launch evaluation set, cost-per-query dashboards with spend alerts, and dependency and security patching. Model quality is re-scored against the golden evaluation set on a schedule and after any provider model update, so degradation is caught by a failing check rather than by a user complaint. Retraining and re-indexing pipelines are handed over as documented, runnable jobs — you are not dependent on us to run them.",
  },
  {
    id: "who-we-work-with",
    category: "ENGAGEMENT & FIT",
    question: "Who does HEILC work with, and what makes a project a good fit?",
    answer:
      "We work with startups that need a first AI product in production quickly, and with mid-market and enterprise teams automating workflows or modernising legacy systems. A project fits well when there is a named decision the software has to support, data that already exists in some form, and someone on your side empowered to answer questions within a day. A project fits badly when the goal is 'adopt AI' without a workflow attached, when the required data has not been collected yet, or when success has no definition anyone will commit to in writing. We would rather say that at the first call than discover it in week four.",
  },
  {
    id: "pricing",
    category: "PRICING & CONTRACTS",
    question: "How does HEILC price engagements?",
    answer:
      "Two shapes. Fixed-scope projects are quoted after a paid discovery week that produces an architecture, an evaluation definition and a sprint plan — quoting before that step means quoting a guess. Ongoing work uses the Intelligence on Demand pod model at a fixed monthly rate per pod, resizable at sprint boundaries. Cloud and model-provider costs are billed to your own accounts rather than marked up through us, so you can see exactly what the system costs to run. We publish no rate card because scope varies too widely for one to be honest; you get a written quote after discovery, and the discovery output is yours whether or not you continue.",
  },
];

export function getFaq(id: string): FaqItem | undefined {
  return FAQS.find((f) => f.id === id);
}
