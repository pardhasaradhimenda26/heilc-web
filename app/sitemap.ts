import { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { SERVICES } from "@/lib/content/services";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { ARTICLES } from "@/lib/content/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = ([
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/case-studies"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/insights"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.6 },
  ] as const).map((entry) => ({ ...entry, lastModified: now }));

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = CASE_STUDIES.map((study) => ({
    url: absoluteUrl(`/case-studies/${study.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: absoluteUrl(`/insights/${article.slug}`),
    lastModified: new Date(article.dateModified),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes, ...articleRoutes];
}
