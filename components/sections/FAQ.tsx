"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "AI & ML ENGINEERING",
    question: "What custom AI and digital transformation solutions does HEILC engineer?",
    answer:
      "HEILC specializes in end-to-end artificial intelligence engineering, custom machine learning model development, Retrieval-Augmented Generation (RAG) architecture, private LLM fine-tuning, autonomous agent orchestration, and full-stack enterprise digital transformation. We turn complex data pipelines into real-time operational intelligence for scalable business outcomes.",
  },
  {
    category: "ENTERPRISE SECURITY",
    question: "How does HEILC ensure data privacy, security, and IP protection?",
    answer:
      "Security and intellectual property protection are embedded into every layer of our engineering methodology. We deploy private models inside your dedicated cloud environment (AWS, GCP, or Azure), ensuring zero third-party data leakage, full SOC2/HIPAA compliance readiness, end-to-end data encryption, and complete customer ownership of trained model weights and codebases.",
  },
  {
    category: "TIMELINES & EXECUTION",
    question: "What is the typical development timeline for an enterprise AI MVP?",
    answer:
      "Our agile engineering pods deliver fully functional custom AI prototypes and MVPs in as little as 3 to 6 weeks. Following initial deployment, we iterate rapidly in bi-weekly sprints—scaling from proof-of-concept validation to high-availability production deployment with full CI/CD pipelines, automated testing, and continuous monitoring.",
  },
  {
    category: "INTEGRATION & ARCHITECTURE",
    question: "Can HEILC integrate custom AI models with existing enterprise legacy systems?",
    answer:
      "Yes. Our modernization team designs cloud-native microservices, custom RESTful and GraphQL API bridges, and event-driven data architectures that seamlessly connect cutting-edge AI models with legacy ERPs, CRMs, databases, and enterprise software stack without requiring disruptive overhauls of existing infrastructure.",
  },
  {
    category: "ENGAGEMENT MODELS",
    question: "How does HEILC's 'Intelligence on Demand' pod model operate?",
    answer:
      "Intelligence on Demand provides senior cross-functional AI engineering teams—including AI architects, machine learning engineers, full-stack developers, and UI/UX strategists—working directly alongside your internal leadership. This flexible model enables rapid scaling of technical capabilities without the friction, overhead, and hiring delays of traditional recruiting.",
  },
  {
    category: "PERFORMANCE & COST OPTIMIZATION",
    question: "How does HEILC optimize artificial intelligence inference latency and operational API costs?",
    answer:
      "We implement advanced semantic caching, vector database indexing (Milvus, Pinecone, Qdrant), model quantization, intelligent routing between fast local open-source LLMs (Llama 3, Mistral) and frontier APIs (Claude 3.5, GPT-4o), and prompt token pruning. These techniques routinely cut cloud and API operational spend by up to 60% while delivering sub-second response latencies.",
  },
  {
    category: "SUPPORT & SLA TIERS",
    question: "What ongoing maintenance, SLAs, and model monitoring does HEILC provide post-deployment?",
    answer:
      "HEILC provides 24/7 proactive infrastructure monitoring, guaranteed SLA response times, model drift detection, continuous data ingestion and retraining pipelines, and cloud scaling support to ensure your enterprise AI applications maintain enterprise-grade reliability and top accuracy as user demand expands.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/6">
      <div className="max-w-5xl mx-auto px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <HelpCircle className="text-teal" size={18} />
            <span className="section-label">TECHNICAL KNOWLEDGE BASE</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px,5vw,64px)", lineHeight: 1 }}
            className="text-white mb-4"
          >
            FREQUENTLY ASKED <span className="text-gradient">QUESTIONS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-sm leading-relaxed"
          >
            Everything you need to know about partnering with HEILC for custom AI products, model fine-tuning, security compliance, and enterprise engineering.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl overflow-hidden border border-white/8 hover:border-teal/30 transition-all duration-300"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-teal uppercase">
                      {faq.category}
                    </span>
                    <h3 className="text-white font-semibold text-base md:text-lg pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-teal/20 border-teal/40 text-teal" : "text-white/40"
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-white/5 text-white/60 text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
