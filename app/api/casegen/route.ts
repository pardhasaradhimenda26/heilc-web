import { rateLimit } from "@/lib/ratelimit";
import { requireSignedIn } from "@/lib/supabase/server";
import { ALL_CASE_STUDIES, CORE_FACTS, formatChunks, retrieve } from "@/lib/ai/knowledge";
import { HEILC_VOICE, PERSONA_GUIDANCE, describeVisitor } from "@/lib/ai/voice";
import { STREAM_HEADERS, streamText } from "@/lib/ai/llm";
import { servicesForInterests } from "@/lib/onboarding";

export const runtime = "edge";

const INDUSTRIES = new Set([
  "Healthcare",
  "FinTech",
  "EdTech",
  "E-Commerce",
  "Real Estate",
  "HR & Recruitment",
  "SaaS",
  "Logistics",
  "Manufacturing",
  "Hospitality",
  "Other",
]);

export async function POST(req: Request) {
  const gate = await requireSignedIn();
  if (!gate.ok) return gate.response;

  const key = gate.user?.id ?? req.headers.get("x-forwarded-for") ?? "anonymous";
  const limit = rateLimit(`casegen:${key}`, 4, 60_000);
  if (!limit.success) {
    return Response.json(
      { error: "One proposal at a time — try again in a minute." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetIn / 1000)) } },
    );
  }

  let industry = "";
  let problem = "";
  try {
    const body = await req.json();
    industry = String(body.industry ?? "").trim();
    problem = String(body.problem ?? "").trim().slice(0, 1500);
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!INDUSTRIES.has(industry) || problem.length < 15) {
    return Response.json(
      { error: "Pick an industry and describe the problem in at least a sentence." },
      { status: 400 },
    );
  }

  const profile = gate.profile;
  const boostPaths = servicesForInterests(profile?.interests).map((s) => `/services/${s}`);
  const chunks = retrieve(`${industry} ${problem} ${profile?.goal ?? ""}`, { boostPaths, k: 6, budget: 5200 });
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const preparedFor = profile
    ? `${profile.full_name}${profile.company ? `, ${profile.company}` : ""}`
    : "you";
  const isStudent = profile?.persona === "student";

  const system = `You write first-pass proposals for HEILC. This is what a founder would send after reading the client's note — not a brochure.

${HEILC_VOICE}

PROPOSAL RULES
- Restate their problem more precisely than they did. Name the decision or workflow the software must support.
- Recommend the smallest thing that solves it. Name what you'd deliberately leave out of version one.
- Name the HEILC services by their real names and link them, e.g. [Custom LLM & Chatbot Integration](/services/custom-llm-and-chatbot-integration).
- "Closest thing we've built": pick from ${ALL_CASE_STUDIES.map((c) => `${c.title} (${c.path})`).join(", ")}. Say honestly how close it is. If none is relevant, say so plainly.
- Write down your assumptions. Never state a price. 350–450 words. Markdown only, exactly the sections below, no extra preamble.

FORMAT
# ${isStudent ? "Build plan" : "Proposal"} for ${preparedFor}
Prepared ${today} by HEILC · first draft, to be confirmed on a call

## What we heard
## What we'd build
## How we'd know it works
## Closest thing we've built
## ${isStudent ? "How to approach it" : "Plan"}
(Bullets by week. ${isStudent ? "A learning-and-building plan the student can follow themselves." : "Week 1 is always discovery and the evaluation set; total 3–6 weeks to a production first version."})
## Stack
(4–7 bullets, each with a short reason)
## What we'd need from you
## Open questions
## Next step
${isStudent ? "(Point to the most relevant /insights article and the contact form for collaboration.)" : "(One or two sentences: the paid discovery week, or press \"Send to the team\" below and a founder replies within one business day.)"}

— Pardhasaradhi & Varshith, HEILC

THE CLIENT
${describeVisitor(profile, gate.user?.email)}
${profile ? PERSONA_GUIDANCE[profile.persona] : ""}

HEILC KNOWLEDGE — the only facts you may state about HEILC
${CORE_FACTS}

${formatChunks(chunks)}`;

  const supabase = gate.supabase;
  const userId = gate.user?.id;

  const stream = await streamText({
    system,
    messages: [{ role: "user", content: `Industry: ${industry}\nWhat they told us: ${problem}` }],
    maxTokens: 900,
    temperature: 0.4,
    onComplete: async (proposal) => {
      if (supabase && userId && proposal.length > 200) {
        await supabase.from("requests").insert({
          user_id: userId,
          kind: "proposal",
          payload: { industry, problem, proposal: proposal.slice(0, 8000) },
        });
      }
    },
  });

  return new Response(stream, { headers: STREAM_HEADERS });
}
