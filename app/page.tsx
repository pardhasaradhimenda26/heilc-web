import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import TrustedBy from "@/components/sections/TrustedBy";
import Capabilities from "@/components/sections/Capabilities";
import Services from "@/components/sections/Services";
import CaseStudies from "@/components/sections/CaseStudies";
import Testimonial from "@/components/sections/Testimonial";
import GlobeSection from "@/components/sections/GlobeSection";
import IntelligenceOnDemand from "@/components/sections/IntelligenceOnDemand";
import About from "@/components/sections/About";
import FAQ from "@/components/sections/FAQ";
import CTASection from "@/components/sections/CTASection";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";
import DeferredOverlays from "@/components/features/DeferredOverlays";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { SERVICES } from "@/lib/content/services";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { FAQS } from "@/lib/content/faq";
import {
  baseGraphNodes,
  caseStudySchema,
  faqPageSchema,
  graph,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";

const title = "HEILC — AI & Digital Transformation Agency";
const description =
  "HEILC builds custom AI products, machine learning models and enterprise software that reach production — evaluated, deployed and monitored in your own cloud.";

export const metadata: Metadata = {
  ...pageMetadata({ title, description, path: "/" }),
  // Homepage keeps the bare brand title rather than the "| HEILC" template.
  title: { absolute: title },
};

export default function Home() {
  const schema = graph([
    ...baseGraphNodes(),
    webPageSchema({ path: "/", name: title, description }),
    ...SERVICES.map(serviceSchema),
    ...CASE_STUDIES.map(caseStudySchema),
    // The homepage accordion renders every one of these answers in its HTML.
    faqPageSchema(FAQS, `${absoluteUrl("/")}#faq`),
  ]);

  return (
    <>
      <JsonLd schema={schema} />
      <Navbar />
      <main id="main" className="bg-bg min-h-screen">
        <Hero />
        <TrustedBy />
        <Capabilities />
        <Services />
        <CaseStudies />
        <Testimonial />
        <GlobeSection />
        <IntelligenceOnDemand />
        <About />
        <FAQ />
        <CTASection />
        <Contact />
      </main>
      <Footer />
      <DeferredOverlays />
    </>
  );
}
