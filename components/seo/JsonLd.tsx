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
        name: "What services does HEILC provide?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HEILC provides Custom AI Product Engineering, Enterprise Generative AI & RAG Architecture, Digital Transformation & System Modernization, and Intelligence on Demand for dedicated AI engineering teams.",
        },
      },
      {
        "@type": "Question",
        name: "How does HEILC help enterprise organizations with AI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HEILC helps enterprises build secure, scalable, and compliant AI solutions—including fine-tuned LLMs, private RAG pipelines, and automated intelligence workflows integrated into legacy infrastructure.",
        },
      },
      {
        "@type": "Question",
        name: "What technologies and frameworks does HEILC specialize in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HEILC specializes in Next.js, React, TypeScript, Python, PyTorch, Anthropic Claude API, OpenAI API, Gemini API, serverless microservices, and modern cloud infrastructure.",
        },
      },
      {
        "@type": "Question",
        name: "How long does it take HEILC to deploy a custom AI product?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Depending on project scope, HEILC rapid prototyping teams can deliver functional AI MVPs and prototypes in weeks, transitioning seamlessly to enterprise production deployment.",
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
