/**
 * Streaming chat completions with free-first provider fallback.
 *
 *   1. Groq free tier (no card needed) — GROQ_MODEL, default llama-3.3-70b.
 *   2. Groq's higher-throughput free model if the first is rate limited.
 *   3. Anthropic, only if ANTHROPIC_API_KEY is set (paid).
 *
 * Returns a plain-text byte stream so the existing clients keep working.
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface StreamOptions {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  /** Called with the full text once streaming finishes. */
  onComplete?: (text: string) => void | Promise<void>;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function* sseLines(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (line.startsWith("data:")) yield line.slice(5).trim();
    }
  }
}

type Attempt = () => Promise<Response | null>;

function groqAttempt(model: string, opts: StreamOptions): Attempt {
  return async () => {
    const key = process.env.GROQ_API_KEY;
    if (!key) return null;
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: opts.temperature ?? 0.5,
        max_tokens: opts.maxTokens ?? 700,
        messages: [{ role: "system", content: opts.system }, ...opts.messages],
      }),
    });
    return res.ok && res.body ? res : null;
  };
}

function anthropicAttempt(opts: StreamOptions): Attempt {
  return async () => {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return null;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        stream: true,
        max_tokens: opts.maxTokens ?? 700,
        temperature: opts.temperature ?? 0.5,
        system: opts.system,
        messages: opts.messages,
      }),
    });
    return res.ok && res.body ? res : null;
  };
}

function extractDelta(provider: "groq" | "anthropic", data: string): string {
  if (data === "[DONE]") return "";
  try {
    const json = JSON.parse(data);
    if (provider === "groq") return json.choices?.[0]?.delta?.content ?? "";
    if (json.type === "content_block_delta" && json.delta?.type === "text_delta") return json.delta.text ?? "";
  } catch {
    // keep-alive or partial line
  }
  return "";
}

export function hasLlmProvider(): boolean {
  return Boolean(process.env.GROQ_API_KEY || process.env.ANTHROPIC_API_KEY);
}

export async function streamText(opts: StreamOptions): Promise<ReadableStream<Uint8Array>> {
  const primary = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const secondary = process.env.GROQ_FALLBACK_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";
  const attempts: { provider: "groq" | "anthropic"; run: Attempt }[] = [
    { provider: "groq", run: groqAttempt(primary, opts) },
    ...(secondary !== primary ? [{ provider: "groq" as const, run: groqAttempt(secondary, opts) }] : []),
    { provider: "anthropic", run: anthropicAttempt(opts) },
  ];

  let chosen: { provider: "groq" | "anthropic"; res: Response } | null = null;
  for (const a of attempts) {
    try {
      const res = await a.run();
      if (res) {
        chosen = { provider: a.provider, res };
        break;
      }
    } catch {
      // network error — try the next provider
    }
  }

  if (!chosen) {
    const msg =
      "Our assistant is taking a breather right now. Your message didn't go to waste — use the contact form at /contact and one of the founders will reply within one business day.";
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(msg));
        controller.close();
      },
    });
  }

  const { provider, res } = chosen;
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = "";
      try {
        for await (const data of sseLines(res.body!)) {
          const text = extractDelta(provider, data);
          if (text) {
            full += text;
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n(The connection dropped mid-reply — please ask again.)"));
      }
      controller.close();
      try {
        await opts.onComplete?.(full);
      } catch {
        // persistence is best-effort
      }
    },
  });
}

export const STREAM_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
