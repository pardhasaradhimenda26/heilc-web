/**
 * JSON-LD graph builders. Every node uses a stable @id so nodes reference each
 * other instead of duplicating data, which is what Google's parser and answer
 * engines both prefer.
 *
 * Rule applied throughout: no aggregateRating, no review counts, no awards and
 * no client logos, because none of those are verifiable for HEILC. Fabricated
 * trust signals are a manipulative-markup violation.
 */

import {
  BUSINESS_LOCATION,
  CONTACT_EMAIL,
  OG_IMAGE,
  SAME_AS,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "./site";
import { LOCAL_BUSINESS_ID, ORGANIZATION_ID, WEBSITE_ID } from "./seo";
import { SERVICES, type Service } from "./content/services";
import { FAQS, type FaqItem } from "./content/faq";
import { FOUNDERS, type TeamMember } from "./content/team";
import { CASE_STUDIES, type CaseStudy } from "./content/case-studies";
import { wordCount, type Article } from "./content/insights";

const LOGO_URL = absoluteUrl("/assets/heilc-logo.png");
const OG_URL = absoluteUrl(OG_IMAGE.url);

const ORG_DESCRIPTION =
  "HEILC is an AI and digital transformation agency that builds custom AI products, machine learning models, and enterprise software — from evaluation harness through to production deployment.";

export function personSchema(member: TeamMember) {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/about#${member.slug}`,
    name: member.name,
    jobTitle: member.jobTitle,
    description: member.bio,
    url: absoluteUrl("/about"),
    worksFor: { "@id": ORGANIZATION_ID },
    knowsAbout: member.focus,
    // sameAs is emitted only when verified profile URLs exist.
    ...(member.sameAs.length > 0 ? { sameAs: member.sameAs } : {}),
  };
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    legalName: "HEILC",
    alternateName: "HEILC AI & Digital Transformation Agency",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      caption: "HEILC logo",
    },
    image: OG_URL,
    description: ORG_DESCRIPTION,
    email: CONTACT_EMAIL,
    founder: FOUNDERS.map((f) => ({ "@id": `${SITE_URL}/about#${f.slug}` })),
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS_LOCATION.addressLocality,
      addressRegion: BUSINESS_LOCATION.addressRegion,
      addressCountry: BUSINESS_LOCATION.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: CONTACT_EMAIL,
      availableLanguage: ["English"],
      areaServed: "Worldwide",
      url: absoluteUrl("/contact"),
    },
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Retrieval-Augmented Generation",
      "Large Language Model Fine-Tuning",
      "Digital Transformation",
      "Enterprise Software Engineering",
      "Cloud Infrastructure",
      "Intelligent Automation",
    ],
    sameAs: SAME_AS,
  };
}

export function localBusinessSchema() {
  return {
    "@type": "ProfessionalService",
    "@id": LOCAL_BUSINESS_ID,
    name: "HEILC — AI & Digital Transformation Agency",
    url: SITE_URL,
    image: OG_URL,
    logo: LOGO_URL,
    description: ORG_DESCRIPTION,
    email: CONTACT_EMAIL,
    parentOrganization: { "@id": ORGANIZATION_ID },
    // Locality-level only: HEILC publishes no street address.
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS_LOCATION.addressLocality,
      addressRegion: BUSINESS_LOCATION.addressRegion,
      addressCountry: BUSINESS_LOCATION.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_LOCATION.latitude,
      longitude: BUSINESS_LOCATION.longitude,
    },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Place", name: "Worldwide" },
    ],
    priceRange: "$$$$",
    sameAs: SAME_AS,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "HEILC Services",
      itemListElement: SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@id": `${SITE_URL}/services/${service.slug}#service` },
      })),
    },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: ORG_DESCRIPTION,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-US",
  };
}

export function serviceSchema(service: Service) {
  return {
    "@type": "Service",
    "@id": `${SITE_URL}/services/${service.slug}#service`,
    name: service.title,
    url: absoluteUrl(`/services/${service.slug}`),
    description: service.definition,
    serviceType: service.title,
    category: service.group === "capability" ? "Core capability" : "Build offering",
    provider: { "@id": ORGANIZATION_ID },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Place", name: "Worldwide" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl(`/services/${service.slug}`),
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} deliverables`,
      itemListElement: service.deliverables.map((d) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: d,
          provider: { "@id": ORGANIZATION_ID },
        },
      })),
    },
  };
}

/** FAQPage — answer text is byte-identical to what the page renders. */
export function faqPageSchema(items: FaqItem[] = FAQS, id = `${SITE_URL}/faq#faq`) {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function caseStudySchema(study: CaseStudy) {
  const url = absoluteUrl(`/case-studies/${study.slug}`);

  return {
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    name: study.title,
    alternateName: study.subtitle,
    url: study.liveUrl ?? url,
    ...(study.liveUrl ? { sameAs: [study.liveUrl] } : {}),
    description: study.summary,
    applicationCategory: study.applicationCategory,
    operatingSystem: "Web browser",
    image: absoluteUrl(study.image),
    author: { "@id": ORGANIZATION_ID },
    creator: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    datePublished: study.year,
    keywords: study.tags.join(", "),
    // No aggregateRating or reviews: HEILC has no verifiable review data.
  };
}

export function caseStudyArticleSchema(study: CaseStudy) {
  const url = absoluteUrl(`/case-studies/${study.slug}`);

  return {
    "@type": "CreativeWork",
    "@id": `${url}#casestudy`,
    name: `${study.title} — case study`,
    headline: `${study.title}: ${study.subtitle}`,
    url,
    description: study.metaDescription,
    about: { "@id": `${url}#software` },
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-US",
    image: absoluteUrl(study.image),
  };
}

export function articleSchema(article: Article) {
  const url = absoluteUrl(`/insights/${article.slug}`);
  const author = FOUNDERS.find((f) => f.slug === article.authorSlug);

  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.standfirst,
    url,
    mainEntityOfPage: url,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    inLanguage: "en-US",
    keywords: article.tags.join(", "),
    image: OG_URL,
    wordCount: wordCount(article),
    author: author
      ? { "@id": `${SITE_URL}/about#${author.slug}` }
      : { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function webPageSchema({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) {
  const url = absoluteUrl(path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    inLanguage: "en-US",
  };
}

/**
 * Wraps nodes in a single @graph document. One script tag, one context,
 * cross-referenced ids — the shape validators handle most cleanly.
 */
export function graph(nodes: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}

/** Nodes present on every page. */
export function baseGraphNodes() {
  return [
    organizationSchema(),
    websiteSchema(),
    localBusinessSchema(),
    ...FOUNDERS.map(personSchema),
  ];
}

export { CASE_STUDIES, FAQS, FOUNDERS, SERVICES };
