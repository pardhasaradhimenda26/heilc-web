/**
 * Service catalogue. Powers the homepage sections, /services, /services/[slug],
 * the sitemap and the Service JSON-LD — one definition, no drift.
 *
 * `group: "capability"` = the four core capabilities ("What we do").
 * `group: "offering"`   = the six build offerings ("What we build for you").
 */

export type ServiceGroup = "capability" | "offering";

export interface ServiceSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface Service {
  slug: string;
  group: ServiceGroup;
  /** Two-digit index used by the existing homepage design. */
  num: string;
  title: string;
  /** Short card copy shown on the homepage. */
  summary: string;
  /** ~150-160 char meta description for /services/[slug]. */
  metaDescription: string;
  /** One-sentence definition, first paragraph on the detail page. */
  definition: string;
  tags: string[];
  color: string;
  sections: ServiceSection[];
  deliverables: string[];
  /** Realistic engagement shape — no invented pricing. */
  engagement: string;
  related: string[];
}

export const SERVICES: Service[] = [
  {
    slug: "artificial-intelligence-solutions",
    group: "capability",
    num: "01",
    title: "Artificial Intelligence Solutions",
    summary:
      "Custom Large Language Model (LLM) fine-tuning, Retrieval-Augmented Generation (RAG) pipelines, predictive analytics, and production-grade artificial intelligence products that deliver operational value.",
    metaDescription:
      "Custom LLM fine-tuning, RAG pipelines and predictive models built for production. HEILC ships evaluated, monitored AI systems — not proof-of-concept demos.",
    definition:
      "An artificial intelligence solution is a system that turns your own data into decisions or generated output — through a fine-tuned model, a retrieval pipeline, or a predictive model — and runs reliably enough for people to depend on it daily.",
    tags: ["LLM Fine-Tuning", "RAG", "Predictive ML", "Evaluation"],
    color: "#14C5D4",
    sections: [
      {
        heading: "What we build",
        body: "Most AI work fails between the notebook and production. We start from the decision the system has to support, then build backwards: data pipeline, retrieval or training strategy, evaluation harness, then the interface.",
        bullets: [
          "Retrieval-Augmented Generation over private document sets, with hybrid (vector + keyword) retrieval and reranking",
          "Supervised fine-tuning and LoRA adapters where prompt engineering has hit a ceiling",
          "Classical ML for tabular prediction — gradient boosting, calibration, feature stores",
          "Agent workflows with explicit tool schemas, retries and human approval gates",
        ],
      },
      {
        heading: "How we prove it works",
        body: "Every engagement includes an evaluation set built from your real queries before we write model code. We report accuracy, groundedness and latency against that set on every change, so 'it feels better' is never the acceptance criterion.",
        bullets: [
          "Golden-set evaluation with regression gates wired into CI",
          "Groundedness and citation checks on every RAG response",
          "Latency budgets tracked at p50, p95 and p99",
          "Drift monitoring on inputs and outputs after launch",
        ],
      },
      {
        heading: "Reference point",
        body: "GeneRisk AI — our DNA-sequence cancer risk classifier — reaches 97.37% accuracy on its held-out test set and serves predictions through a Flask API behind a React dashboard. The same evaluation discipline applies to client work.",
      },
    ],
    deliverables: [
      "Evaluation harness and golden dataset you keep",
      "Model or pipeline deployed in your cloud account",
      "Inference API with authentication and rate limiting",
      "Runbook covering retraining, rollback and cost controls",
    ],
    engagement:
      "Typically a 3–6 week build for a first production system, then bi-weekly iteration sprints. Scope is fixed per sprint; the evaluation set decides what ships.",
    related: ["custom-llm-and-chatbot-integration", "data-analytics-and-visualization"],
  },
  {
    slug: "digital-transformation-and-modernization",
    group: "capability",
    num: "02",
    title: "Digital Transformation & Modernization",
    summary:
      "Legacy system modernization, cloud infrastructure migration, and end-to-end digital transformation that modernizes enterprise workflows and accelerates innovation.",
    metaDescription:
      "Legacy modernisation without a rewrite: strangler-pattern migration, API bridges to ERP and CRM systems, cloud-native infrastructure, delivered in steps.",
    definition:
      "Digital transformation is the incremental replacement of manual or legacy workflows with systems that are observable, integrable and cheap to change — done without a big-bang rewrite that stops the business.",
    tags: ["Legacy Migration", "Cloud Native", "API Bridges", "Event-Driven"],
    color: "#7C5CBF",
    sections: [
      {
        heading: "The approach: strangler, not rewrite",
        body: "We put an API layer in front of the legacy system, move one workflow at a time behind it, and retire the old path only once the new one carries real traffic. Nothing goes dark, and every step is independently reversible.",
        bullets: [
          "Domain and data-flow mapping before any code is written",
          "REST and GraphQL bridges over legacy ERP, CRM and database systems",
          "Event-driven synchronisation with change-data-capture where dual-write is unsafe",
          "Migration sequenced by business risk, lowest first",
        ],
      },
      {
        heading: "Infrastructure we leave behind",
        body: "Infrastructure as code, containerised services, and CI/CD that a two-person team can operate. We do not hand over a platform that only its builders understand.",
        bullets: [
          "Terraform or equivalent IaC for every provisioned resource",
          "Blue/green or canary deploys with automated rollback",
          "Centralised structured logging, metrics and tracing",
          "Cost dashboards broken down per service",
        ],
      },
      {
        heading: "What we do not do",
        body: "We do not recommend replatforming systems that work and cost little to run. Modernisation is justified by integration cost, change velocity or compliance exposure — if none of those apply, we will say so.",
      },
    ],
    deliverables: [
      "Current-state architecture map and prioritised migration plan",
      "API gateway and integration layer over existing systems",
      "Infrastructure-as-code repository and CI/CD pipelines",
      "Cutover and rollback plan per workflow",
    ],
    engagement:
      "Discovery in 1–2 weeks, then workflow-by-workflow delivery in bi-weekly sprints. Each sprint ends with something in production.",
    related: ["cloud-infrastructure-and-devops", "enterprise-software-engineering"],
  },
  {
    slug: "enterprise-software-engineering",
    group: "capability",
    num: "03",
    title: "Enterprise Software Engineering",
    summary:
      "Scalable web platforms, resilient full-stack systems, secure microservices, and custom API architecture designed for demanding enterprise business environments.",
    metaDescription:
      "Full-stack product engineering for enterprise: typed APIs, tested services, role-based access control and CI/CD — software your team can safely change later.",
    definition:
      "Enterprise software engineering is building systems where correctness, access control and operability matter as much as features — because the software will outlive the team that wrote it.",
    tags: ["TypeScript", "Microservices", "RBAC", "CI/CD"],
    color: "#4F46E5",
    sections: [
      {
        heading: "How we build",
        body: "Typed end to end, tested at the boundaries, and deployable from the first week. We optimise for the second year of the codebase, not the first demo.",
        bullets: [
          "TypeScript across API and client, with schema-validated request and response contracts",
          "Service boundaries drawn around data ownership, not org charts",
          "Role-based access control and audit logging designed in, not bolted on",
          "Integration tests against real database instances in CI",
        ],
      },
      {
        heading: "Security and compliance posture",
        body: "We build to SOC 2 and HIPAA-readiness patterns by default: encryption in transit and at rest, least-privilege IAM, secret management, dependency scanning and audit trails. We prepare systems for audit; the certification itself is yours to obtain.",
        bullets: [
          "TLS everywhere; encryption at rest via managed cloud KMS",
          "Least-privilege IAM roles and short-lived credentials",
          "Automated dependency and container image scanning in CI",
          "Immutable audit logs on privileged actions",
        ],
      },
      {
        heading: "Handover",
        body: "You own the repository, the cloud account and the documentation from day one. There is no proprietary runtime you have to keep paying us for.",
      },
    ],
    deliverables: [
      "Production application in your cloud account and repository",
      "API documentation generated from the source schema",
      "Test suite and CI pipeline",
      "Architecture decision records for every significant choice",
    ],
    engagement:
      "3–6 weeks to a usable production release for a focused scope, then continuous delivery in bi-weekly sprints.",
    related: ["ai-powered-web-platforms", "cloud-infrastructure-and-devops"],
  },
  {
    slug: "intelligent-automation-solutions",
    group: "capability",
    num: "04",
    title: "Intelligent Automation Solutions",
    summary:
      "Workflow automation, AI-driven process optimization, document intelligence, and robotic process design that eliminates operational bottlenecks permanently.",
    metaDescription:
      "Automate the document and workflow steps that consume your team's day — extraction, routing, reconciliation — with measured accuracy and human review.",
    definition:
      "Intelligent automation is applying extraction, classification and routing models to the repetitive steps in a business process, with explicit confidence thresholds that decide when a human still needs to look.",
    tags: ["Document AI", "Workflow", "OCR", "Human-in-the-Loop"],
    color: "#14C5D4",
    sections: [
      {
        heading: "Where automation pays",
        body: "We look for high-volume, rule-shaped, low-variance steps first — invoice and claim intake, contract clause extraction, ticket triage, reconciliation. Those are measurable, and measurable is what gets funded a second time.",
        bullets: [
          "Document extraction with structured output schemas and field-level confidence",
          "Classification and routing over email, tickets and forms",
          "Reconciliation between systems that disagree",
          "Human-in-the-loop review queues for anything below the confidence threshold",
        ],
      },
      {
        heading: "Designing for the failure case",
        body: "An automation that is right 92% of the time and silent about the other 8% is worse than no automation. Every workflow we ship declares a confidence threshold, routes uncertain cases to a person, and records the correction as training signal.",
        bullets: [
          "Per-field confidence scoring, not per-document",
          "Explicit escalation paths and SLA timers on review queues",
          "Corrections captured and fed back into evaluation sets",
          "Straight-through-processing rate reported as the headline metric",
        ],
      },
      {
        heading: "Measurement",
        body: "We baseline the manual process — time per item, error rate, backlog — before automating, so the after-number means something.",
      },
    ],
    deliverables: [
      "Baseline measurement of the current manual process",
      "Automation pipeline with confidence thresholds and review queue",
      "Operator dashboard showing straight-through-processing rate",
      "Feedback loop that turns corrections into evaluation data",
    ],
    engagement:
      "Two-week baseline and pilot on a single workflow, then expansion once the straight-through rate is proven.",
    related: ["artificial-intelligence-solutions", "data-analytics-and-visualization"],
  },
  {
    slug: "ai-powered-web-platforms",
    group: "offering",
    num: "01",
    title: "AI-Powered Web Platforms",
    summary:
      "Next-gen web applications built with Next.js, full LLM integrations, real-time contextual awareness, and high-speed cloud architecture.",
    metaDescription:
      "Next.js web platforms with LLM features built in — streaming responses, server-rendered content, and Core Web Vitals treated as a release requirement.",
    definition:
      "An AI-powered web platform is a normal, fast, accessible web application in which model-driven features — search, generation, summarisation — are first-class product surfaces rather than a bolted-on chat widget.",
    tags: ["Next.js", "Streaming", "Edge", "Core Web Vitals"],
    color: "#14C5D4",
    sections: [
      {
        heading: "What makes these different",
        body: "Model latency is a UX problem before it is an infrastructure problem. We stream tokens, render skeletons that match final layout, and keep the non-AI path of the app fully functional when a provider is degraded.",
        bullets: [
          "Server-rendered content so pages are indexable and fast on first load",
          "Streamed responses with cancellation and retry",
          "Graceful degradation when a model provider is slow or down",
          "Rate limiting and abuse controls on every model-backed endpoint",
        ],
      },
      {
        heading: "Performance discipline",
        body: "Heavy embeds, 3D scenes and analytics load after the page is interactive. Images go through the framework's optimiser. Core Web Vitals are a release gate, not a post-launch clean-up.",
      },
    ],
    deliverables: [
      "Production Next.js application with server-rendered content",
      "Model-backed endpoints with streaming, rate limiting and observability",
      "Design system components matching your brand",
      "Lighthouse and Core Web Vitals report at handover",
    ],
    engagement: "4–8 weeks for a first public release, depending on surface area.",
    related: ["custom-llm-and-chatbot-integration", "ui-ux-design-and-prototyping"],
  },
  {
    slug: "mobile-app-development",
    group: "offering",
    num: "02",
    title: "Mobile App Development",
    summary:
      "Cross-platform iOS and Android mobile solutions with embedded AI features, smooth native feel, and enterprise backend synchronization.",
    metaDescription:
      "Cross-platform iOS and Android apps with offline-first sync, embedded AI features and a shared backend — one codebase, native-feeling on both stores.",
    definition:
      "Cross-platform mobile development means one React Native or Flutter codebase producing iOS and Android builds that behave like native apps, sharing the same API and authentication layer as your web product.",
    tags: ["React Native", "Flutter", "Offline-First", "App Store"],
    color: "#7C5CBF",
    sections: [
      {
        heading: "Architecture",
        body: "Offline-first data layer, background sync, and a single shared API contract with the web client. Push notifications, deep links and store release pipelines are set up in the first sprint, not the last.",
        bullets: [
          "Local-first storage with conflict resolution on sync",
          "Shared typed API client across web and mobile",
          "Biometric and token-based authentication",
          "Automated builds and store submission pipelines",
        ],
      },
      {
        heading: "On-device and hosted AI",
        body: "Where latency or privacy demands it, inference runs on device; where quality demands it, we call a hosted model over an authenticated backend endpoint — never with provider keys embedded in the app.",
      },
    ],
    deliverables: [
      "iOS and Android builds from a single codebase",
      "Store listings, signing and release automation",
      "Crash reporting and analytics instrumentation",
      "Offline sync layer and API client",
    ],
    engagement: "6–10 weeks to first store submission for a focused feature set.",
    related: ["enterprise-software-engineering", "cloud-infrastructure-and-devops"],
  },
  {
    slug: "custom-llm-and-chatbot-integration",
    group: "offering",
    num: "03",
    title: "Custom LLM & Chatbot Integration",
    summary:
      "Private RAG pipelines, autonomous agent assistants, fine-tuned models, and intelligent conversational tools tailored to proprietary business data.",
    metaDescription:
      "Private RAG pipelines and assistants grounded in your own documents, with citations, guardrails and evaluation — deployed inside your cloud environment.",
    definition:
      "A custom LLM integration is an assistant grounded in your own content: it retrieves from your documents, cites what it used, refuses what it cannot support, and runs inside infrastructure you control.",
    tags: ["RAG", "Claude", "Vector Search", "Guardrails"],
    color: "#4F46E5",
    sections: [
      {
        heading: "Retrieval first, generation second",
        body: "Answer quality is mostly a retrieval problem. We invest in chunking strategy, hybrid search and reranking before touching prompts, because a well-retrieved passage beats a clever instruction every time.",
        bullets: [
          "Structure-aware chunking that respects headings, tables and code blocks",
          "Hybrid dense + sparse retrieval with a reranking pass",
          "Permission-aware retrieval so users only see what they may see",
          "Mandatory citations back to the source passage",
        ],
      },
      {
        heading: "Guardrails and cost control",
        body: "Semantic caching, prompt compression and routing between smaller open models and frontier APIs keep per-query cost predictable. Input and output filters, plus refusal behaviour on unsupported questions, keep the assistant honest.",
        bullets: [
          "Semantic cache on repeated and near-duplicate queries",
          "Model routing by task difficulty rather than one model for everything",
          "Token budgets and per-tenant spend caps",
          "Logged transcripts for review, with PII redaction",
        ],
      },
    ],
    deliverables: [
      "Ingestion and indexing pipeline for your document sources",
      "Assistant API and embeddable UI",
      "Evaluation set with groundedness and citation scoring",
      "Cost and latency dashboard",
    ],
    engagement: "3–6 weeks to a grounded assistant on a first document corpus.",
    related: ["artificial-intelligence-solutions", "ai-powered-web-platforms"],
  },
  {
    slug: "data-analytics-and-visualization",
    group: "offering",
    num: "04",
    title: "Data Analytics & Visualization",
    summary:
      "Interactive real-time data dashboards, predictive analytics engines, custom ML modeling, and automated business reporting.",
    metaDescription:
      "Warehouse modelling, version-controlled transformations and dashboards people actually open — plus forecasting and anomaly models with honest backtests.",
    definition:
      "Analytics engineering is the work between raw source data and a chart: modelling it into tested, documented tables so that every dashboard in the business computes the same number the same way.",
    tags: ["Warehouse", "Dashboards", "Forecasting", "PostgreSQL"],
    color: "#14C5D4",
    sections: [
      {
        heading: "Model the data before drawing it",
        body: "Conflicting dashboards are a modelling problem. We define metrics once, in version-controlled and tested transformations, then build every view on top of those definitions.",
        bullets: [
          "Ingestion from operational databases, SaaS APIs and event streams",
          "Version-controlled transformations with data tests on every model",
          "A single metric layer with documented definitions",
          "Freshness and volume alerting on critical tables",
        ],
      },
      {
        heading: "Prediction where it earns its place",
        body: "Forecasting, churn scoring, anomaly detection and segmentation — with honest backtests, confidence intervals, and a stated baseline the model has to beat.",
      },
    ],
    deliverables: [
      "Warehouse schema and tested transformation repository",
      "Dashboards for the questions your team actually asks",
      "Predictive models with backtest reports",
      "Data quality alerting",
    ],
    engagement: "3–5 weeks to a first modelled domain and dashboard set.",
    related: ["intelligent-automation-solutions", "cloud-infrastructure-and-devops"],
  },
  {
    slug: "cloud-infrastructure-and-devops",
    group: "offering",
    num: "05",
    title: "Cloud Infrastructure & DevOps",
    summary:
      "High-availability cloud architecture, serverless microservices, CI/CD pipelines, containerized deployments, and continuous security monitoring.",
    metaDescription:
      "Infrastructure as code, CI/CD with automated rollback, and observability that answers what broke and when — on AWS, GCP, Azure, Vercel or Railway.",
    definition:
      "Cloud and DevOps work is making deployment boring: infrastructure defined in code, releases automated and reversible, and enough observability that incidents are diagnosed from dashboards rather than guesswork.",
    tags: ["Terraform", "Kubernetes", "Observability", "AWS"],
    color: "#7C5CBF",
    sections: [
      {
        heading: "Deploy, observe, roll back",
        body: "Every environment is reproducible from code. Every release is automated, health-checked and reversible. Every service emits structured logs, metrics and traces with a consistent request identifier.",
        bullets: [
          "Infrastructure as code for all environments",
          "Canary or blue/green deploys with automated rollback on health-check failure",
          "Structured logs, RED metrics and distributed tracing",
          "Alerting on symptoms users feel, not on raw CPU",
        ],
      },
      {
        heading: "Cost and security as standing work",
        body: "Right-sizing, autoscaling policies, spend attribution per service, dependency and image scanning in CI, and secrets in a managed store rather than environment files.",
      },
    ],
    deliverables: [
      "Infrastructure-as-code repository covering all environments",
      "CI/CD pipelines with automated rollback",
      "Observability stack with dashboards and alert routing",
      "Incident runbooks and on-call handover documentation",
    ],
    engagement: "2–4 weeks for a platform baseline; ongoing support under an SLA tier.",
    related: ["digital-transformation-and-modernization", "enterprise-software-engineering"],
  },
  {
    slug: "ui-ux-design-and-prototyping",
    group: "offering",
    num: "06",
    title: "UI/UX Design & Prototyping",
    summary:
      "Futuristic dark-mode UI designs, glassmorphism systems, rapid visual prototyping, and human-centric interface engineering.",
    metaDescription:
      "Design systems and clickable prototypes built as real components — accessible contrast, keyboard paths and motion that respects reduced-motion settings.",
    definition:
      "Product design here means a component-level design system and working prototypes, delivered in the same language as the code, so what is designed is what ships.",
    tags: ["Figma", "Design Systems", "Accessibility", "Prototyping"],
    color: "#4F46E5",
    sections: [
      {
        heading: "Systems, not screens",
        body: "We design tokens and components — colour, type scale, spacing, states — then compose screens from them. Handover is a component library, not a folder of images.",
        bullets: [
          "Design tokens shared between Figma and code",
          "Every component specified in default, hover, focus, loading, error and empty states",
          "WCAG AA contrast checked at design time",
          "Motion specifications that honour prefers-reduced-motion",
        ],
      },
      {
        heading: "Prototype before you build",
        body: "Clickable prototypes tested with real users on the two or three flows that determine whether the product works. Cheaper to change a prototype than a shipped release.",
      },
    ],
    deliverables: [
      "Design token set and component library",
      "Clickable prototype of primary flows",
      "Accessibility annotations for keyboard and screen-reader behaviour",
      "Implementation-ready specifications",
    ],
    engagement: "2–4 weeks for a design system and prototype of core flows.",
    related: ["ai-powered-web-platforms", "enterprise-software-engineering"],
  },
];

export const CAPABILITIES = SERVICES.filter((s) => s.group === "capability");
export const OFFERINGS = SERVICES.filter((s) => s.group === "offering");

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
