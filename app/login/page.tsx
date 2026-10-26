import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import LoginView from "@/components/auth/LoginView";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to HEILC to send requests, generate proposals and talk to the HEILC assistant.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <PageShell>
      <div className="max-w-md mx-auto px-6 pt-36 pb-24">
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <LoginView />
        </div>
      </div>
    </PageShell>
  );
}
