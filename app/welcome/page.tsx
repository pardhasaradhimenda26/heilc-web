import type { Metadata } from "next";
import Onboarding from "@/components/auth/Onboarding";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Tell HEILC a little about yourself so the site, assistant and proposals fit you.",
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  return (
    <main id="main" className="min-h-screen bg-bg">
      <Onboarding />
    </main>
  );
}
