import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
// import ScrollCanvas from "@/components/sections/ScrollCanvas";
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
import ChatBot from "@/components/features/ChatBot";
import PersonaModal from "@/components/features/PersonaModal";

export default function Home() {
  return (
    <main className="bg-bg min-h-screen">
      <Navbar />
      <Hero />
      {/* <ScrollCanvas /> */}
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
      <Footer />
      <ChatBot />
      <PersonaModal />
    </main>
  );
}
