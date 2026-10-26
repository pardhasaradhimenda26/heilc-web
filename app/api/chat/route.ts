import { rateLimit } from "@/lib/ratelimit";
import { requireSignedIn } from "@/lib/supabase/server";
import { CORE_FACTS, formatChunks, retrieve } from "@/lib/ai/knowledge";
import { HEILC_VOICE, PERSONA_GUIDANCE, describeVisitor } from "@/lib/ai/voice";
import { STREAM_HEADERS, streamText, type ChatMessage } from "@/lib/ai/llm";
import { servicesForInterests } from "@/lib/onboarding";

export const runtime = "edge";

const MAX_MESSAGES = 16;
const MAX_CHARS = 2000;

function clean(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const msgs = raw
    .filter(
      (m): m is ChatMessage =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_MESSAGES);
  // Providers require the conversation to open with a user turn.
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  return msgs.length && msgs[msgs.length - 1].role === "user" ? msgs : null;
}

export async function POST(req: Request) {
  const gate = await requireSignedIn();
  if (!gate.ok) return gate.response;

  const key = gate.user?.id ?? req.headers.get("x-forwarded-for") ?? "anonymous";
  const limit = rateLimit(`chat:${key}`, 12, 60_000);
  if (!limit.success) {
    return Response.json(
      { error: "Too many messages — give it a few seconds." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetIn / 1000)) } },
    );
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const messages = clean(body.messages);
  if (!messages) return Response.json({ error: "Invalid conversation." }, { status: 400 });

  const profile = gate.profile;
  const lastUser = messages[messages.length - 1].content;
  const recentUser = messages.filter((m) => m.role === "user").slice(-3).map((m) => m.content).join(" ");
  const boostPaths = servicesForInterests(profile?.interests).map((s) => `/services/${s}`);
  const chunks = retrieve(`${recentUser} ${lastUser} ${profile?.goal ?? ""}`, { boostPaths, k: 5, budget: 4200 });

  const system = `You are the HEILC assistant on heilc.com, speaking for HEILC.

${HEILC_VOICE}

CHAT FORMAT
- 2–5 sentences by default. A short list only for options or steps. No headings. Markdown links allowed, e.g. [GeneRisk AI](/case-studies/generisk-ai).
- End with ONE specific follow-up question about their situation — or, once they've described a real project, suggest the next step: the "Send to the team" button under this chat, and say a founder replies within one business day. Do not repeat a sign-off every turn.
- If asked what you are: HEILC's assistant, an AI model working only from HEILC's own material; anything binding comes from the founders directly.
- Off-topic requests (homework, unrelated code, general trivia): one line saying that's outside what you can help with here, then bring it back to what they're building.

THE PERSON
${describeVisitor(profile, gate.user?.email)}
${profile ? PERSONA_GUIDANCE[profile.persona] : ""}

HEILC KNOWLEDGE — the only facts you may state
${CORE_FACTS}

${formatChunks(chunks)}`;

  const stream = await streamText({ system, messages, maxTokens: 450, temperature: 0.45 });
  return new Response(stream, { headers: STREAM_HEADERS });
}
