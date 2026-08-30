export default function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.heilc.com";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "HEILC",
    alternateName: "HEILC AI & Digital Transformation Agency",
    url: baseUrl,
    logo: `${baseUrl}/icon.png`,
    description:
      "HEILC builds AI-powered products, custom machine learning applications, and enterprise software that prove capability.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://twitter.com/heilc",
      "https://linkedin.com/company/heilc",
      "https://github.com/heilc",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "HEILC",
    description:
      "Where Human Intelligence Meets the Future. HEILC builds AI-powered products that prove capability.",
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: "en-US",
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${baseUrl}/#service`,
    name: "HEILC — AI & Digital Transformation Agency",
    url: baseUrl,
    image: `${baseUrl}/icon.png`,
    description:
      "Specializing in Custom AI Products, Generative AI Solutions, Enterprise Software Engineering, and Digital Transformation.",
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Digital Transformation",
      "Enterprise Software Development",
      "Generative AI",
      "Cloud Solutions",
      "Retrieval-Augmented Generation (RAG)",
      "LLM Fine-Tuning",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "HEILC Services & AI Offerings",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom AI Product Engineering",
            description:
              "End-to-end design, development, and deployment of custom AI-powered web applications and software.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Enterprise Generative AI & RAG Architecture",
            description:
              "Private LLM integration, custom RAG pipelines, and autonomous AI agents for enterprise automation.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Digital Transformation & System Modernization",
            description:
              "Modernizing enterprise legacy platforms into scalable, cloud-native, AI-first architecture.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Intelligence on Demand",
            description:
              "Dedicated senior AI engineering pods and strategic technical leadership for high-impact innovation.",
          },
        },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "What custom AI and digital transformation solutions does HEILC engineer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HEILC specializes in end-to-end artificial intelligence engineering, custom machine learning model development, Retrieval-Augmented Generation (RAG) architecture, private LLM fine-tuning, autonomous agent orchestration, and full-stack enterprise digital transformation.",
        },
      },
      {
        "@type": "Question",
        name: "How does HEILC ensure data privacy, security, and IP protection?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We deploy private models inside your dedicated cloud environment (AWS, GCP, or Azure), ensuring zero third-party data leakage, full SOC2/HIPAA compliance readiness, end-to-end data encryption, and complete customer ownership of trained model weights and codebases.",
        },
      },
      {
        "@type": "Question",
        name: "What is the typical development timeline for an enterprise AI MVP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our agile engineering pods deliver fully functional custom AI prototypes and MVPs in as little as 3 to 6 weeks. Following initial deployment, we iterate rapidly in bi-weekly sprints—scaling from proof-of-concept validation to high-availability production deployment.",
        },
      },
      {
        "@type": "Question",
        name: "Can HEILC integrate custom AI models with existing enterprise legacy systems?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Our modernization team designs cloud-native microservices, custom RESTful and GraphQL API bridges, and event-driven data architectures that seamlessly connect cutting-edge AI models with legacy ERPs, CRMs, and databases.",
        },
      },
      {
        "@type": "Question",
        name: "How does HEILC's 'Intelligence on Demand' pod model operate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Intelligence on Demand provides senior cross-functional AI engineering teams—including AI architects, machine learning engineers, full-stack developers, and UI/UX strategists—working directly alongside your internal leadership.",
        },
      },
      {
        "@type": "Question",
        name: "How does HEILC optimize artificial intelligence inference latency and operational API costs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We implement advanced semantic caching, vector database indexing, model quantization, intelligent routing between fast local open-source LLMs and frontier APIs, and prompt token pruning to cut operational spend by up to 60%.",
        },
      },
      {
        "@type": "Question",
        name: "What ongoing maintenance, SLAs, and model monitoring does HEILC provide post-deployment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HEILC provides 24/7 proactive infrastructure monitoring, guaranteed SLA response times, model drift detection, continuous data ingestion and retraining pipelines, and cloud scaling support.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}
