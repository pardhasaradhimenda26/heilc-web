/**
 * Long-form insight articles. Structured as typed blocks so every word is
 * server-rendered as real semantic HTML — headings, lists and definition
 * pairs — which is what both crawlers and answer engines extract.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "dl"; items: { term: string; def: string }[] };

export interface Article {
  slug: string;
  title: string;
  /** Answer-engine friendly one-sentence definition, rendered above the fold. */
  standfirst: string;
  metaDescription: string;
  datePublished: string;
  dateModified: string;
  authorSlug: string;
  readingMinutes: number;
  tags: string[];
  blocks: Block[];
}

export const ARTICLES: Article[] = [
  {
    slug: "how-rag-pipelines-work-for-enterprise-search",
    title: "How RAG Pipelines Work for Enterprise Search",
    standfirst:
      "Retrieval-augmented generation (RAG) is a technique that answers a question by first retrieving relevant passages from your own documents, then asking a language model to answer using only those passages — so the answer is grounded in your content and can cite where it came from.",
    metaDescription:
      "How RAG pipelines work for enterprise search, stage by stage: ingestion, chunking, hybrid retrieval, reranking, generation — and what to measure at each one.",
    datePublished: "2026-01-14",
    dateModified: "2026-01-14",
    authorSlug: "pardhasaradhi-menda",
    readingMinutes: 9,
    tags: ["RAG", "Enterprise Search", "Vector Databases", "LLM Architecture"],
    blocks: [
      {
        type: "p",
        text: "Enterprise search has been broken for twenty years for a boring reason: keyword indexes match strings, and people ask questions. Someone types 'what is our parental leave in Germany' and gets back seventeen PDFs whose filenames contain the word 'leave'. Retrieval-augmented generation fixes the last mile of that problem — but only if the retrieval half is built properly, and that is where most implementations fail.",
      },
      {
        type: "p",
        text: "This is how a production RAG pipeline is actually assembled, stage by stage, and what to measure at each one.",
      },
      { type: "h2", text: "The five stages of a RAG pipeline" },
      {
        type: "p",
        text: "Every RAG system, regardless of vendor or framework, is the same five stages. Understanding which stage is failing is most of the work of improving one.",
      },
      {
        type: "ol",
        items: [
          "Ingestion — pull documents from their source systems and normalise them to text plus metadata.",
          "Chunking — split each document into passages small enough to retrieve precisely and large enough to be self-contained.",
          "Indexing — embed each chunk into a vector and store it alongside a keyword index.",
          "Retrieval — for a given question, fetch candidate chunks, then rerank them so the best few go forward.",
          "Generation — pass the question and the retrieved passages to a language model, constrained to answer only from those passages, with citations.",
        ],
      },
      {
        type: "callout",
        text: "If your RAG answers are wrong, the cause is in stages 1–4 roughly nine times out of ten. Teams reliably spend their time on stage 5.",
      },
      { type: "h2", text: "Stage 1: Ingestion is a permissions problem" },
      {
        type: "p",
        text: "Ingestion looks like plumbing — connect to SharePoint, Confluence, Google Drive, a ticketing system, an S3 bucket — and it mostly is. The part that is not plumbing is access control. Enterprise documents have permissions, and a RAG system that ignores them will cheerfully quote the compensation spreadsheet to an intern.",
      },
      {
        type: "p",
        text: "The correct design captures the source system's access-control list as chunk metadata at ingestion time, and filters retrieval by the requesting user's identity before ranking. Filtering after retrieval is not equivalent: it leaks existence and it silently degrades result quality, because the model receives fewer passages than the ranker selected.",
      },
      {
        type: "ul",
        items: [
          "Store the source ACL, document owner, last-modified date and canonical URL on every chunk.",
          "Filter by identity as a pre-condition of the vector query, not as a post-processing step.",
          "Re-ingest on change rather than on a schedule — stale answers are indistinguishable from wrong ones.",
          "Keep a deletion path: when a source document is removed, its chunks must leave the index.",
        ],
      },
      { type: "h2", text: "Stage 2: Chunking decides your ceiling" },
      {
        type: "p",
        text: "Chunking is the single highest-leverage decision in the pipeline and the one most often made by accepting a default. The naive approach — split every 512 tokens with a 50-token overlap — cuts tables in half, separates a heading from the paragraph it governs, and orphans the sentence that says which product the section is about.",
      },
      {
        type: "p",
        text: "Structure-aware chunking respects the document's own boundaries: split on headings, keep tables whole, keep code blocks whole, and prepend the heading path to each chunk so a passage carries its own context.",
      },
      {
        type: "dl",
        items: [
          {
            term: "Fixed-size chunking",
            def: "Split every N tokens. Fast, universal, and reliably mediocre. Acceptable for homogeneous prose, damaging for structured documents.",
          },
          {
            term: "Structure-aware chunking",
            def: "Split on the document's semantic boundaries — headings, sections, list groups, table units. More work per format, materially better retrieval.",
          },
          {
            term: "Contextual chunk headers",
            def: "Prepend the document title and heading path to each chunk's embedded text. A cheap change that consistently improves retrieval on long technical documents.",
          },
          {
            term: "Parent-document retrieval",
            def: "Embed small chunks for precision, but pass the larger parent section to the model for context. Best of both, at the cost of a second lookup.",
          },
        ],
      },
      { type: "h2", text: "Stage 3 and 4: Hybrid retrieval and reranking" },
      {
        type: "p",
        text: "Pure vector search is worse than teams expect on enterprise corpora, for a specific reason: embeddings are good at semantic similarity and bad at exact tokens. Product codes, error identifiers, version numbers, surnames and internal acronyms are exactly the terms enterprise users search for, and exactly what embeddings blur.",
      },
      {
        type: "p",
        text: "Hybrid retrieval runs a sparse keyword search (BM25) and a dense vector search in parallel, then fuses the ranked lists — reciprocal rank fusion is the standard, cheap and effective choice. A reranker model then scores the fused candidates against the query directly and keeps the top few.",
      },
      {
        type: "ul",
        items: [
          "Retrieve broadly — 50 to 100 candidates — then rerank down to 3 to 8 passages for the prompt.",
          "Rerank with a cross-encoder: it reads the query and passage together and is far more accurate than embedding distance.",
          "Expand the query when it is short or underspecified: generate two or three paraphrases and retrieve for each.",
          "Log the retrieved set for every production query. You cannot debug retrieval you did not record.",
        ],
      },
      { type: "h2", text: "Stage 5: Generation, constrained" },
      {
        type: "p",
        text: "The generation prompt has one job: answer from the supplied passages, cite them, and refuse when they are insufficient. That last clause is what separates a system people trust from one they stop using. A model that fabricates a plausible answer once will not be consulted again for anything that matters.",
      },
      {
        type: "ul",
        items: [
          "Instruct explicitly that unsupported claims must be declined, and test that the refusal actually fires.",
          "Require inline citations to passage identifiers, and render them as links back to the source document.",
          "Return the retrieved passages to the interface alongside the answer, so a user can verify in one click.",
          "Set a groundedness check on the output: every factual sentence should be attributable to a retrieved passage.",
        ],
      },
      { type: "h2", text: "How to evaluate a RAG pipeline" },
      {
        type: "p",
        text: "Evaluate retrieval and generation separately, because they fail differently and the fixes are unrelated. Build a golden set of 50 to 200 real questions with known correct source documents before you write pipeline code — collected from your support queue, your search logs, or an hour with the team who will use it.",
      },
      {
        type: "dl",
        items: [
          {
            term: "Recall@k",
            def: "Did the correct passage appear in the top k retrieved? This is the ceiling on your answer quality — generation cannot recover what retrieval never returned.",
          },
          {
            term: "Mean reciprocal rank",
            def: "How high did the correct passage rank? Measures reranker quality specifically.",
          },
          {
            term: "Groundedness",
            def: "What proportion of the answer's factual claims are supported by the retrieved passages? Catches fabrication.",
          },
          {
            term: "Answer relevance",
            def: "Does the answer address the question that was asked? Catches the technically-grounded non-answer.",
          },
          {
            term: "Refusal accuracy",
            def: "On questions your corpus genuinely cannot answer, does the system decline? The most-skipped and most-diagnostic metric.",
          },
        ],
      },
      {
        type: "p",
        text: "Wire these into CI and gate merges on them. Without a regression gate, a prompt tweak that helps five questions and breaks twenty will ship, because it looked better in the demo.",
      },
      { type: "h2", text: "What this costs to run" },
      {
        type: "p",
        text: "Cost concentrates in two places: embedding the corpus once at ingestion, and generating an answer per query. The first is a fixed, predictable one-off plus a small delta on updates. The second is what scales with usage, and where the controls are.",
      },
      {
        type: "ul",
        items: [
          "Semantic caching on repeated and near-duplicate queries — in enterprise assistants, repeat rates are high, and a cache hit costs nothing.",
          "Model routing: send the easy majority of queries to a smaller model, reserve a frontier model for hard ones.",
          "Prune retrieved context aggressively — retrieved passages are usually the largest and most compressible part of the token bill.",
          "Better reranking reduces cost directly: fewer, better passages mean shorter prompts and better answers at once.",
        ],
      },
      { type: "h2", text: "The short version" },
      {
        type: "ol",
        items: [
          "Capture permissions at ingestion and filter retrieval by identity before ranking.",
          "Chunk on document structure, not on token count, and give each chunk its heading context.",
          "Use hybrid retrieval — dense plus sparse — then rerank with a cross-encoder.",
          "Constrain generation to the retrieved passages, require citations, and make refusal a tested behaviour.",
          "Build the evaluation set first, measure retrieval and generation separately, and gate CI on both.",
        ],
      },
    ],
  },
  {
    slug: "llm-fine-tuning-vs-rag-when-to-use-each",
    title: "LLM Fine-Tuning vs. RAG: When to Use Each",
    standfirst:
      "Fine-tuning changes how a model behaves; retrieval-augmented generation changes what a model knows at the moment it answers. Facts that change belong in retrieval, behaviour that must be consistent belongs in fine-tuning, and most production systems need both.",
    metaDescription:
      "Fine-tuning vs RAG explained: what each technique actually changes, a decision framework, realistic cost and latency comparisons, and when to combine the two.",
    datePublished: "2026-02-04",
    dateModified: "2026-02-04",
    authorSlug: "pardhasaradhi-menda",
    readingMinutes: 9,
    tags: ["Fine-Tuning", "RAG", "LLM Architecture", "Model Selection"],
    blocks: [
      {
        type: "p",
        text: "The question is usually posed as a fork — fine-tune or use RAG — and posed that way it has no good answer, because the two techniques address different problems. One is about knowledge, the other about behaviour. Deciding between them requires knowing which of those two things your system is currently getting wrong.",
      },
      { type: "h2", text: "Definitions, precisely" },
      {
        type: "dl",
        items: [
          {
            term: "Retrieval-augmented generation (RAG)",
            def: "Fetch relevant passages from an external store at query time and include them in the prompt. Changes what the model knows for that one answer. Knowledge updates by re-indexing a document.",
          },
          {
            term: "Fine-tuning",
            def: "Continue training a base model on your own examples so its weights shift. Changes how the model behaves by default — format, tone, task convention, domain vocabulary. Knowledge updates by retraining.",
          },
          {
            term: "Parameter-efficient fine-tuning (LoRA/QLoRA)",
            def: "Train a small set of adapter weights instead of the whole model. Most of the behavioural benefit at a fraction of the compute and storage, and adapters can be swapped per customer or task.",
          },
          {
            term: "Prompt engineering",
            def: "Neither of the above, and the correct first attempt. Free, instant to iterate, and frequently sufficient. Exhaust it before you spend money.",
          },
        ],
      },
      { type: "h2", text: "The decision framework" },
      {
        type: "p",
        text: "Ask three questions in order. The first that yields a clear answer determines the approach.",
      },
      { type: "h3", text: "1. Does the failure involve facts the model does not have?" },
      {
        type: "p",
        text: "If the model is wrong because it does not know your policies, your product catalogue, your customers or anything that happened after its training cutoff, that is a knowledge gap, and knowledge gaps are retrieval problems. Fine-tuning facts into weights is possible and almost always the wrong trade: the facts become unattributable, un-updatable without retraining, and impossible to cite.",
      },
      { type: "h3", text: "2. Does the failure involve format, tone or task convention?" },
      {
        type: "p",
        text: "If the model knows the answer but presents it wrongly — ignores your schema, adopts the wrong register, mislabels categories your domain defines idiosyncratically — that is behavioural, and behaviour is what fine-tuning changes. The tell is that a long prompt full of examples fixes it, but the prompt is now so long it is expensive and still occasionally ignored.",
      },
      { type: "h3", text: "3. Is the problem cost or latency at scale?" },
      {
        type: "p",
        text: "A fine-tuned small model can match a much larger model on one narrow task, at a fraction of the per-token cost and latency. If a working system is simply too expensive or too slow, distilling it into a fine-tuned smaller model is a legitimate and underused move — but only once you have a working system and its outputs to train on.",
      },
      { type: "h2", text: "Choose RAG when" },
      {
        type: "ul",
        items: [
          "The knowledge changes — documentation, policies, prices, inventory, tickets, anything with a version.",
          "Answers must cite their source. Retrieval gives you provenance for free; fine-tuning destroys it.",
          "Access control matters. Retrieval can be filtered per user; weights cannot.",
          "The corpus is large. You cannot fine-tune a hundred thousand documents into a model usefully, and you do not need to.",
          "You need auditability — the ability to show exactly which passage produced a given answer.",
          "Requirements are still moving. Re-indexing takes minutes; retraining takes a cycle.",
        ],
      },
      { type: "h2", text: "Choose fine-tuning when" },
      {
        type: "ul",
        items: [
          "Output format must be exact and prompt instructions are inconsistently followed.",
          "The domain has vocabulary or conventions the base model handles poorly — specialised clinical, legal or industrial language.",
          "Tone or house style must be consistent across thousands of generations.",
          "The task is narrow, repetitive and high-volume, and a smaller fine-tuned model would cut cost materially.",
          "Few-shot examples work but consume so much context that they have become the dominant cost.",
          "Latency budgets rule out the large model that currently gets it right.",
        ],
      },
      { type: "h2", text: "Use both when the system is mature" },
      {
        type: "p",
        text: "The strongest production systems fine-tune for behaviour and retrieve for facts. A support assistant might be fine-tuned to follow your escalation taxonomy, adopt your tone and always emit a structured resolution object — while retrieving the current product documentation at query time. Neither technique substitutes for the other; each is doing the job it is suited to.",
      },
      {
        type: "callout",
        text: "A useful sequencing rule: prompt-engineer first, add retrieval second, fine-tune third. Most teams that fine-tune first discover afterwards that their real problem was chunking.",
      },
      { type: "h2", text: "What each actually costs" },
      {
        type: "p",
        text: "Comparing costs honestly means separating one-off from recurring, and engineering time from compute. Compute is rarely the dominant term.",
      },
      { type: "h3", text: "RAG" },
      {
        type: "ul",
        items: [
          "One-off: ingestion connectors, chunking strategy, index setup, evaluation set. Days to weeks of engineering.",
          "Recurring: vector database hosting, re-embedding on document change, and a larger prompt on every query because retrieved context is included.",
          "Iteration: fast. A chunking or reranking change is testable in minutes.",
        ],
      },
      { type: "h3", text: "Fine-tuning" },
      {
        type: "ul",
        items: [
          "One-off: dataset construction — realistically hundreds to low thousands of high-quality examples, and this is the expensive part, not the GPU time.",
          "Recurring: cheaper inference per token if you moved to a smaller model, plus retraining whenever behaviour or the base model changes.",
          "Iteration: slow. Each experiment is a training run, and dataset problems only surface after it.",
        ],
      },
      {
        type: "p",
        text: "The asymmetry that matters: RAG iterations are cheap and reversible, fine-tuning iterations are neither. That alone justifies trying retrieval first in ambiguous cases.",
      },
      { type: "h2", text: "Failure modes to expect" },
      {
        type: "dl",
        items: [
          {
            term: "RAG: retrieval misses",
            def: "The answer exists in the corpus but never reached the prompt. Almost always chunking or the absence of hybrid search. Measure recall@k before blaming the model.",
          },
          {
            term: "RAG: context dilution",
            def: "Too many passages retrieved, the relevant one buried among mediocre neighbours. Retrieve broadly, rerank hard, pass few.",
          },
          {
            term: "Fine-tuning: catastrophic forgetting",
            def: "The model gets better at your task and worse at everything else. Mitigated by parameter-efficient methods and by keeping general examples in the training mix.",
          },
          {
            term: "Fine-tuning: baked-in staleness",
            def: "Facts trained into weights are now wrong and cannot be corrected without retraining. This is the failure that makes people regret fine-tuning knowledge.",
          },
          {
            term: "Both: no evaluation set",
            def: "Without a golden set, every change is judged by whichever example someone tried last. This is the most common failure of all, and it is not technical.",
          },
        ],
      },
      { type: "h2", text: "The short version" },
      {
        type: "ol",
        items: [
          "Facts that change, need citations, or need per-user access control: retrieval.",
          "Format, tone, domain convention, or cost-driven model shrinking: fine-tuning.",
          "Try prompt engineering properly before either — it is free and often enough.",
          "Build the evaluation set before choosing, or you will not be able to tell whether the choice worked.",
          "Mature systems use both, for the different jobs each is good at.",
        ],
      },
    ],
  },
  {
    slug: "ai-agency-selection-checklist-for-enterprises",
    title: "AI Agency Selection Checklist for Enterprises",
    standfirst:
      "Choosing an AI development partner comes down to six verifiable things: shipped production systems, a stated evaluation method, explicit data and IP terms, a named team, an honest cost model, and a handover plan that leaves you independent.",
    metaDescription:
      "A practical checklist for choosing an AI development agency: the questions to ask, the answers that should worry you, and the contract terms that matter most.",
    datePublished: "2026-03-03",
    dateModified: "2026-03-03",
    authorSlug: "varshith-dondamuri",
    readingMinutes: 8,
    tags: ["Vendor Selection", "AI Strategy", "Procurement", "Enterprise AI"],
    blocks: [
      {
        type: "p",
        text: "Every agency's pitch deck now says the same things. The differences that predict whether a project succeeds are not in the deck — they are in how the team answers six specific questions, and in what the contract says about data, ownership and exit. Here is what to ask and how to read the answers.",
      },
      {
        type: "callout",
        text: "We are an AI agency writing a guide to choosing AI agencies, so read this with the appropriate scepticism. Every criterion below is one we would expect to be judged on.",
      },
      { type: "h2", text: "1. What have they actually put in production?" },
      {
        type: "p",
        text: "A demo proves a model can produce an impressive output once. Production proves the team handled authentication, rate limiting, cost control, evaluation, monitoring, and the two a.m. failure — which is where the real engineering is.",
      },
      { type: "h3", text: "Ask" },
      {
        type: "ul",
        items: [
          "Which of these systems is running in production right now, and who operates it?",
          "What broke after launch, and what did you change as a result?",
          "What is the p95 latency and cost per query, and how do you know?",
          "Show me the evaluation report for one of these, redacted as needed.",
        ],
      },
      { type: "h3", text: "Worry if" },
      {
        type: "ul",
        items: [
          "Every reference is a pilot, a proof of concept, or 'under NDA' without exception.",
          "They cannot describe a post-launch failure. Every real system has one; not having a story means not having operated it.",
          "Accuracy is quoted with no mention of the dataset it was measured on.",
        ],
      },
      { type: "h2", text: "2. How do they define and measure 'working'?" },
      {
        type: "p",
        text: "This is the highest-signal question on the list. An agency that builds an evaluation set before writing model code is running an engineering process. One that demos and asks whether it feels right is running a design process wearing engineering clothes.",
      },
      { type: "h3", text: "Ask" },
      {
        type: "ul",
        items: [
          "When in the project do you build the evaluation set, and who supplies the examples?",
          "Which metrics gate a release, and what happens when one regresses?",
          "How would you detect that quality degraded three months after launch?",
          "How do you measure whether the system correctly refuses questions it cannot answer?",
        ],
      },
      { type: "h3", text: "Worry if" },
      {
        type: "ul",
        items: [
          "Evaluation is described as a phase near the end rather than an input at the start.",
          "The only metric is a single accuracy number with no baseline to beat.",
          "There is no answer for detecting post-launch drift.",
        ],
      },
      { type: "h2", text: "3. Where does your data go, and who owns the result?" },
      {
        type: "p",
        text: "Get this in writing before technical discussions go far, because it can disqualify a vendor regardless of engineering quality. The questions are specific and the answers should be too.",
      },
      { type: "h3", text: "Ask" },
      {
        type: "ul",
        items: [
          "Does the system run in our cloud account or yours? If yours, what exactly is stored, where, and for how long?",
          "Which third-party model providers see our data, under what data-processing terms, and is training on our data contractually disabled?",
          "Who owns the trained weights, the code, the prompts and the evaluation datasets at the end?",
          "Is there any licence-back to you on artefacts we paid to create?",
          "What happens to our data if we terminate?",
        ],
      },
      { type: "h3", text: "Worry if" },
      {
        type: "ul",
        items: [
          "Ownership is 'shared' or unspecified in the master agreement.",
          "The system depends on a proprietary runtime or platform only they can operate.",
          "They cannot name every third party that will process your data.",
        ],
      },
      { type: "h2", text: "4. Who is actually going to do the work?" },
      {
        type: "p",
        text: "The gap between the people in the pitch and the people on the commits is the oldest failure mode in the industry, and it has not improved. Name the team in the contract.",
      },
      { type: "h3", text: "Ask" },
      {
        type: "ul",
        items: [
          "Name the individuals who will be on this project and their allocation percentage.",
          "Which parts, if any, are subcontracted?",
          "What happens if a named person leaves mid-project?",
          "Can we meet the engineer who will lead it, not only the account lead?",
        ],
      },
      { type: "h3", text: "Worry if" },
      {
        type: "ul",
        items: [
          "The team is described only by role and seniority, never by name.",
          "Allocations are vague, or one 'lead' is spread across many concurrent clients.",
          "The technical lead is absent from every call.",
        ],
      },
      { type: "h2", text: "5. Is the cost model honest about what scales?" },
      {
        type: "p",
        text: "Build cost is knowable and quotable. Run cost is where projects get killed at month four, and it is dominated by inference volume, retrieval infrastructure and the size of the model chosen.",
      },
      { type: "h3", text: "Ask" },
      {
        type: "ul",
        items: [
          "What is the estimated monthly run cost at our expected volume, and what drives it?",
          "Are model-provider and cloud costs billed to our own accounts, or marked up through you?",
          "What is the plan if usage is ten times the estimate?",
          "Which optimisations are in scope, and at what point are they worth doing?",
        ],
      },
      { type: "h3", text: "Worry if" },
      {
        type: "ul",
        items: [
          "Run cost is not discussed until after the build quote is signed.",
          "Provider costs are opaquely bundled with a margin you cannot see.",
          "There is no answer for what happens at ten times volume.",
        ],
      },
      { type: "h2", text: "6. What does handover look like?" },
      {
        type: "p",
        text: "The best outcome is that you could continue without them. Ask what that would take, and listen for whether the answer sounds like a plan or a threat.",
      },
      { type: "h3", text: "Ask" },
      {
        type: "ul",
        items: [
          "What documentation exists at the end, and can we see an example from a past project?",
          "Could our own team run the retraining and re-indexing jobs unaided?",
          "What is the support tier structure and the response-time commitment in each?",
          "If we ended the engagement in month six, what would break?",
        ],
      },
      { type: "h3", text: "Worry if" },
      {
        type: "ul",
        items: [
          "Documentation is 'the code is the documentation'.",
          "Critical operations run on the vendor's infrastructure with no path to yours.",
          "SLA commitments are described verbally and absent from the contract.",
        ],
      },
      { type: "h2", text: "Signals that outrank the pitch" },
      {
        type: "ul",
        items: [
          "They tell you a part of your request is a bad idea, with a reason, before you have signed anything.",
          "They ask about your data quality early and specifically, because they know that is what determines the schedule.",
          "They scope discovery separately and hand you its output regardless of whether you continue.",
          "They quantify uncertainty instead of quoting a single confident number.",
          "They decline work that does not fit. An agency that says yes to everything is optimising for the contract, not the outcome.",
        ],
      },
      { type: "h2", text: "The short version" },
      {
        type: "ol",
        items: [
          "Ask what is in production, who operates it, and what broke.",
          "Ask when the evaluation set is built. Start-of-project is the answer you want.",
          "Get data residency, provider terms and IP ownership in writing before the technical deep-dive.",
          "Get the individual engineers named in the contract with allocations.",
          "Get a run-cost estimate at your real volume, with provider costs billed transparently.",
          "Get a handover definition that would let you continue without them.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Stable heading anchor id, shared by the article body and its contents nav. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function wordCount(article: Article): number {
  return article.blocks.reduce((total, block) => {
    if (block.type === "ul" || block.type === "ol") {
      return total + block.items.join(" ").split(/\s+/).length;
    }
    if (block.type === "dl") {
      return (
        total + block.items.map((i) => `${i.term} ${i.def}`).join(" ").split(/\s+/).length
      );
    }
    return total + block.text.split(/\s+/).length;
  }, 0);
}
