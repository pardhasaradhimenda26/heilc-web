"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageSquare, Bot, Check, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePersona } from "./PersonaContext";
import Markdown from "@/components/ui/Markdown";
import { interestLabels } from "@/lib/onboarding";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTERS: Record<"startup" | "enterprise" | "student" | "default", string[]> = {
  startup: [
    "How fast can you get a first version live?",
    "What would you cut from v1 of my idea?",
    "How do you price a startup MVP?",
  ],
  enterprise: [
    "Can you work with our existing ERP or CRM?",
    "Where would our data live?",
    "How do you prove an AI system is accurate?",
  ],
  student: [
    "How does HEILC evaluate a RAG system?",
    "Do you take interns or collaborators?",
    "How was GeneRisk AI built?",
  ],
  default: [
    "What does HEILC actually build?",
    "How long does a first version take?",
    "Show me something you've shipped",
  ],
};

export default function ChatBot() {
  const { enabled, isMember, firstName, profile, requireAuth } = useAuth();
  const { persona } = usePersona();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [handoff, setHandoff] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const bottomRef = useRef<HTMLDivElement>(null);

  const greeting = useMemo(() => {
    if (enabled && !isMember) {
      return "This is HEILC's assistant. It answers from our own case studies, services and process — sign in and it can also work from what you're building.";
    }
    if (firstName && profile) {
      const interests = interestLabels(profile.interests).filter((i) => i !== "Just exploring");
      if (profile.persona === "student") {
        return `Hey ${firstName}. Ask me how we build things — evaluation, retrieval, deployment — or about working with us. I'll point you to the write-ups that go deeper.`;
      }
      if (profile.goal) {
        return `Hi ${firstName}. You mentioned: "${profile.goal}". Want to start there? Tell me what exists today — data, tools, the team — and I'll tell you how we'd approach it.`;
      }
      if (interests.length) {
        return `Hi ${firstName}. You're looking at ${interests.slice(0, 2).join(" and ").toLowerCase()}. What's the problem behind it — and what happens today without it?`;
      }
      return `Hi ${firstName}. What are you trying to get built? The more concrete, the more useful I'll be.`;
    }
    return "Hi — this is HEILC's assistant. Ask about what we build, how we work, or something we've shipped.";
  }, [enabled, isMember, firstName, profile]);

  const starters = STARTERS[(persona ?? "default") as keyof typeof STARTERS] ?? STARTERS.default;
  const userTurns = messages.filter((m) => m.role === "user").length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    requireAuth("talk to the HEILC assistant", () => void run(content));
  };

  const run = async (content: string) => {
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error ?? "That didn't go through — try again in a moment." },
        ]);
        setLoading(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: text };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I lost the connection. Try again, or use /contact." },
      ]);
    }
    setLoading(false);
  };

  // Turns a promising conversation into a request the founders see.
  const sendToTeam = async () => {
    setHandoff("sending");
    const transcript = messages
      .map((m) => `${m.role === "user" ? (firstName ?? "Visitor") : "HEILC assistant"}: ${m.content}`)
      .join("\n\n");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "chat", message: transcript }),
    }).catch(() => null);
    setHandoff(res?.ok ? "sent" : "error");
  };

  return (
    <>
      <motion.button
        type="button"
        data-chatbot
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open the HEILC assistant"
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-teal flex items-center justify-center shadow-lg"
        style={{ boxShadow: "0 0 0 0 rgba(20,197,212,0.4)", animation: "pulse-teal 2s infinite" }}
      >
        <MessageSquare size={22} aria-hidden="true" className="text-black" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="HEILC assistant"
            data-lenis-prevent
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 z-50 w-full sm:w-[400px] h-[min(640px,100dvh)] flex flex-col"
            style={{
              background: "rgba(8,8,8,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px 20px 0 0",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal/20 border border-teal/40 flex items-center justify-center">
                  <Bot size={16} aria-hidden="true" className="text-teal" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">HEILC assistant</p>
                  <p className="text-white/50 text-[11px]">Answers from HEILC&apos;s own work · founders reply to requests</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close the assistant" className="text-white/60 hover:text-white">
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed glass-card text-white/80">{greeting}</div>
              </div>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pl-1">
                  {starters.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="px-3 py-1.5 rounded-full border border-teal/30 text-teal/90 text-xs hover:bg-teal/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user" ? "bg-teal text-black font-medium" : "glass-card text-white/80"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      msg.content ? (
                        <Markdown text={msg.content} compact />
                      ) : (
                        <div className="flex gap-1 items-center py-1">
                          {[0, 1, 2].map((d) => (
                            <motion.div
                              key={d}
                              className="w-1.5 h-1.5 rounded-full bg-teal"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                            />
                          ))}
                        </div>
                      )
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {enabled && !isMember && messages.length === 0 && (
                <button
                  type="button"
                  onClick={() => requireAuth("talk to the HEILC assistant", () => {})}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/15 text-white text-xs font-semibold hover:border-teal hover:text-teal"
                >
                  Sign in to start <ArrowUpRight size={13} aria-hidden="true" />
                </button>
              )}

              {userTurns >= 2 && !loading && (
                <div className="flex justify-center">
                  {handoff === "sent" ? (
                    <p className="flex items-center gap-1.5 text-teal text-xs">
                      <Check size={13} aria-hidden="true" /> Sent. A founder will reply within one business day.
                    </p>
                  ) : (
                    <button
                      type="button"
                      disabled={handoff === "sending"}
                      onClick={sendToTeam}
                      className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-white/90 disabled:opacity-50"
                    >
                      {handoff === "sending" ? "Sending…" : handoff === "error" ? "Retry — send to the team" : "Send to the team"}
                    </button>
                  )}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-white/10">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <label htmlFor="chat-input" className="sr-only">Message</label>
                <input
                  id="chat-input"
                  value={input}
                  maxLength={2000}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={firstName ? `What are you building, ${firstName}?` : "Ask HEILC anything…"}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/45 outline-none focus:border-teal/40"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="w-11 h-11 rounded-xl bg-teal flex items-center justify-center disabled:opacity-40"
                >
                  <Send size={16} aria-hidden="true" className="text-black" />
                </button>
              </form>
              <p className="text-white/35 text-[10px] mt-2 text-center">
                Messages go to our AI provider to write the reply and aren&apos;t stored by HEILC.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
