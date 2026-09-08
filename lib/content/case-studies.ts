/**
 * Case studies. Every figure below is sourced from HEILC's own project records
 * as already stated in this repository (chat assistant knowledge base and
 * homepage copy). Nothing here is estimated or invented — where a number is
 * unknown, the field is simply absent.
 */

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudySection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  /** Card copy on the homepage. */
  summary: string;
  metaDescription: string;
  /** Status badge preserved from the existing design. */
  badge: string;
  badgeColor: string;
  image: string;
  imageAlt: string;
  category: string;
  year: string;
  /** Absolute URL of the live product, when one is publicly published. */
  liveUrl?: string;
  applicationCategory: string;
  tags: string[];
  metrics: CaseStudyMetric[];
  problem: string;
  approach: CaseStudySection[];
  stack: { group: string; items: string[] }[];
  outcome: string;
  outcomeBullets: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "generisk-ai",
    title: "GeneRisk AI",
    subtitle: "ML-Powered Cancer Risk Prediction",
    summary:
      "DNA sequence analysis platform using XGBoost achieving 97.37% accuracy. Deployed on Railway with a Flask API and React dashboard.",
    metaDescription:
      "How HEILC built GeneRisk AI: a DNA sequence classifier reaching 97.37% accuracy on held-out data, served through a Flask API and React dashboard on Railway.",
    badge: "LIVE",
    badgeColor: "#14C5D4",
    image: "/assets/generisk-mockup.jpg",
    imageAlt:
      "GeneRisk AI dashboard showing DNA sequence risk classification results and model confidence scores",
    category: "Healthcare / Bioinformatics",
    year: "2025",
    applicationCategory: "HealthApplication",
    tags: ["Python", "XGBoost", "React", "Railway", "Flask", "scikit-learn"],
    metrics: [
      { value: "97.37%", label: "Classification accuracy on held-out test data" },
      { value: "<1s", label: "Typical end-to-end prediction response time" },
      { value: "1 API", label: "Flask service backing both dashboard and batch use" },
    ],
    problem:
      "Genomic risk screening is dominated by tooling built for bioinformaticians: command-line pipelines, file formats nobody outside the lab reads, and turnaround measured in hours. The people who need the answer — clinicians, researchers running a first-pass triage — are not the people the tooling was designed for. We wanted to find out whether a well-engineered gradient-boosted model behind a plain web interface could return a defensible risk classification from a DNA sequence in under a second, without asking the user to learn a pipeline.",
    approach: [
      {
        heading: "Feature engineering over raw sequence",
        body: "Raw nucleotide sequences are not directly usable by a tabular model, so the first half of the work was representation. We built a deterministic feature extraction stage that turns each sequence into a fixed-width numeric vector, then held that stage constant so every later accuracy comparison measured the model rather than the preprocessing.",
        bullets: [
          "k-mer frequency encoding across multiple k values to capture local motifs",
          "GC content, sequence length and composition-ratio features",
          "Deterministic, versioned preprocessing shared by training and inference",
        ],
      },
      {
        heading: "Model selection and validation",
        body: "XGBoost was chosen over a deep sequence model deliberately: on this dataset size it trained in minutes rather than hours, produced per-feature importances a domain reviewer could interrogate, and gave up nothing measurable in accuracy. Validation used stratified splits with a test set untouched until the final evaluation.",
        bullets: [
          "Stratified train/validation/test split preserving class balance",
          "Hyperparameter search over depth, learning rate and subsampling",
          "97.37% accuracy on the held-out test set, with the confusion matrix reviewed rather than the headline number alone",
          "Feature importance surfaced in the UI so a prediction can be questioned",
        ],
      },
      {
        heading: "Serving it to non-specialists",
        body: "A Flask API loads the serialised model once at process start and exposes a single prediction endpoint; a React dashboard handles sequence input, validation and result presentation. Both are deployed on Railway, which kept infrastructure work proportional to the size of the project.",
        bullets: [
          "Model loaded once at boot, not per request",
          "Input validation and clear error states for malformed sequences",
          "Results presented with confidence, not as a bare label",
        ],
      },
    ],
    stack: [
      { group: "Machine learning", items: ["Python", "XGBoost", "scikit-learn", "NumPy", "pandas"] },
      { group: "Backend", items: ["Flask", "REST API", "Gunicorn"] },
      { group: "Frontend", items: ["React", "Vite", "Chart rendering"] },
      { group: "Infrastructure", items: ["Railway", "Container deployment"] },
    ],
    outcome:
      "GeneRisk AI classifies a submitted DNA sequence at 97.37% accuracy on held-out test data and returns the result, with model confidence and contributing features, in about a second — through a browser, with no bioinformatics pipeline for the user to install or operate.",
    outcomeBullets: [
      "97.37% accuracy on a held-out test set the model never saw during tuning",
      "Sub-second typical prediction latency end to end",
      "Explainable output: contributing features shown alongside every prediction",
      "Deployed and reachable as a normal web application, not a research notebook",
    ],
  },
  {
    slug: "cinegenome",
    title: "CineGenome",
    subtitle: "AI Film Recommendation Platform",
    summary:
      "Cinematic DNA-based recommendation engine analysing 3,477 films across visual, narrative, audio and emotional dimensions, powered by Claude and Pinecone.",
    metaDescription:
      "How HEILC built CineGenome: 3,477 films decomposed into visual, narrative, audio and emotional vectors with Claude and Pinecone for taste-based recommendation.",
    badge: "LIVE",
    badgeColor: "#7C5CBF",
    image: "/assets/cinegenome-mockup.jpg",
    imageAlt:
      "CineGenome interface showing a film's cinematic DNA breakdown across visual, narrative, audio and emotional dimensions",
    category: "Media / Recommendation Systems",
    year: "2025",
    applicationCategory: "WebApplication",
    tags: ["Next.js", "Claude AI", "Pinecone", "MySQL", "FastAPI", "Vector Search"],
    metrics: [
      { value: "3,477", label: "Films decomposed into cinematic DNA profiles" },
      { value: "4", label: "Independent dimensions per film: visual, narrative, audio, emotional" },
      { value: "1 pass", label: "Enrichment cost model — analysis cached, never recomputed per query" },
    ],
    problem:
      "Collaborative filtering recommends what people like you also watched. It cannot explain why, it collapses on films with thin viewing histories, and it has nothing useful to say when your request is 'something that feels like this one, but not the same story'. Taste in film is multi-dimensional — you can love a film's cinematography and be indifferent to its plot — and a single similarity score flattens all of that into one number.",
    approach: [
      {
        heading: "Decomposing films into cinematic DNA",
        body: "Rather than one embedding per film, we used Claude to analyse each title along four independent axes and emit a structured profile per axis. Separating the dimensions is what makes the system explainable: a recommendation can point at which axis drove the match.",
        bullets: [
          "Visual: cinematography, palette, composition, pacing of the cut",
          "Narrative: structure, theme, character architecture",
          "Audio: score, sound design, use of silence",
          "Emotional: tonal arc and the register the film leaves you in",
        ],
      },
      {
        heading: "Vector retrieval across 3,477 titles",
        body: "Each dimension is embedded and indexed separately in Pinecone, so a query can weight axes independently. Relational metadata — cast, year, runtime, provenance of the analysis — stays in MySQL, joined back after retrieval.",
        bullets: [
          "Per-dimension vector namespaces rather than one blended embedding",
          "Weighted multi-vector query so users can ask for visual similarity but narrative contrast",
          "MySQL as the source of truth for catalogue metadata",
          "FastAPI service mediating retrieval, weighting and re-ranking",
        ],
      },
      {
        heading: "Making enrichment affordable",
        body: "Analysing 3,477 films with a frontier model is only viable if you do it once. Enrichment runs as an idempotent batch job with results persisted; the query path touches vectors and the database, never the model. This is the difference between a demo and something you can leave running.",
        bullets: [
          "Idempotent, resumable batch enrichment with per-film checkpointing",
          "Analysis persisted and versioned, so a prompt change is a re-run decision rather than a per-query cost",
          "Query path serves from Pinecone and MySQL only",
        ],
      },
    ],
    stack: [
      { group: "AI & retrieval", items: ["Anthropic Claude API", "Pinecone", "Vector embeddings"] },
      { group: "Backend", items: ["FastAPI", "Python", "MySQL"] },
      { group: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
      { group: "Infrastructure", items: ["Serverless deployment", "Batch enrichment pipeline"] },
    ],
    outcome:
      "CineGenome holds structured cinematic DNA profiles for 3,477 films across four independent dimensions, and answers similarity queries from cached vectors rather than live model calls — so recommendations are explainable by axis and cost nothing per query beyond retrieval.",
    outcomeBullets: [
      "3,477 films fully enriched across four independent analysis dimensions",
      "Recommendations attributable to a specific axis rather than an opaque score",
      "Zero model inference on the query path — enrichment cost paid once, offline",
      "Cold-start handled by content analysis rather than viewing history",
    ],
  },
  {
    slug: "resumeai",
    title: "ResumeAI",
    subtitle: "AI Resume Builder with ATS Scoring",
    summary:
      "Real-time resume generation with ATS scoring and three-strategy JSON parsing. Built in 24 hours at the AppXcelerate 1.0 hackathon using Groq LLaMA.",
    metaDescription:
      "How HEILC built ResumeAI in 24 hours at AppXcelerate 1.0: Groq-hosted LLaMA generation, live ATS scoring, and a three-strategy JSON parser for reliable output.",
    badge: "HACKATHON",
    badgeColor: "#4F46E5",
    image: "/assets/resumeai-mockup.jpg",
    imageAlt:
      "ResumeAI interface showing generated resume content alongside a live applicant tracking system compatibility score",
    category: "HR Tech / Generative AI",
    year: "2025",
    applicationCategory: "WebApplication",
    tags: ["React", "Groq", "LLaMA", "Node.js", "ATS Scoring"],
    metrics: [
      { value: "24 hours", label: "Concept to working build at AppXcelerate 1.0" },
      { value: "3", label: "Fallback strategies in the JSON parsing chain" },
      { value: "Live", label: "ATS compatibility score recomputed as the user edits" },
    ],
    problem:
      "Most applicants never reach a human reader: an applicant tracking system parses the file first, and a resume that survives that parse looks different from one designed to impress a person. Candidates get no feedback on which of the two they have written. The build constraint was equally concrete — one 24-hour hackathon at AppXcelerate 1.0, so every architectural decision had to be defensible in minutes rather than debated.",
    approach: [
      {
        heading: "Latency as the product decision",
        body: "The interaction only works if regeneration feels immediate; a fifteen-second wait turns iteration into form-filling. We used LLaMA on Groq specifically for inference speed, and structured the UI so users regenerate individual sections rather than the whole document.",
        bullets: [
          "Groq-hosted LLaMA chosen for throughput over marginal quality gains",
          "Section-level regeneration instead of whole-document rewrites",
          "Optimistic UI updates while generation streams",
        ],
      },
      {
        heading: "Three-strategy JSON parsing",
        body: "Structured output from a language model fails in predictable ways: fenced code blocks, prose wrapped around the object, trailing commas. Rather than one strict parser that throws away an otherwise good response, we chained three strategies and only surfaced an error if all three failed — the single change that most improved perceived reliability.",
        bullets: [
          "Strategy one: direct JSON parse of the raw response",
          "Strategy two: extract and parse the first balanced JSON object found in the text",
          "Strategy three: repair common malformations — code fences, trailing commas, smart quotes — then reparse",
          "Explicit failure state and retry only after all three strategies fail",
        ],
      },
      {
        heading: "Scoring the resume the way a machine reads it",
        body: "The ATS score is computed client-side against the generated content and updates as the user edits, so the feedback loop is immediate and costs nothing per keystroke.",
        bullets: [
          "Keyword coverage against the target job description",
          "Section completeness and standard heading detection",
          "Formatting checks for constructs that commonly break parsers",
          "Score recomputed live on edit, with no server round trip",
        ],
      },
    ],
    stack: [
      { group: "AI", items: ["Groq", "LLaMA", "Structured output parsing"] },
      { group: "Backend", items: ["Node.js", "Express", "REST API"] },
      { group: "Frontend", items: ["React", "Tailwind CSS", "Client-side scoring engine"] },
      { group: "Delivery", items: ["24-hour hackathon build", "AppXcelerate 1.0"] },
    ],
    outcome:
      "ResumeAI went from concept to a working, demonstrable build inside the 24-hour AppXcelerate 1.0 window: users generate resume sections against a target job description, see an ATS compatibility score update as they edit, and the three-strategy parser keeps malformed model output from surfacing as a failure.",
    outcomeBullets: [
      "Working build delivered within the 24-hour hackathon constraint",
      "Three-strategy parser chain absorbing the common structured-output failure modes",
      "ATS score recomputed live on edit with no server round trip",
      "Section-level regeneration keeping the iteration loop short",
    ],
  },
];

/**
 * Badge foreground picked from the badge's own luminance: black on the teal
 * badge, white on the violet and indigo ones. Hard-coding black failed WCAG AA
 * on the two darker badge colours.
 */
export function badgeTextColor(background: string): string {
  const hex = background.replace("#", "");
  const channel = (i: number) => {
    const v = parseInt(hex.slice(i * 2, i * 2 + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const luminance =
    0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
  // Contrast against black vs white; pick whichever is higher.
  return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05)
    ? "#050505"
    : "#FFFFFF";
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
