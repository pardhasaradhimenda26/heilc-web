import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import AccountDashboard from "@/components/auth/AccountDashboard";

export const metadata: Metadata = {
  title: "Your account",
  description: "Your HEILC profile, requests, privacy choices and data rights.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <PageShell>
      <AccountDashboard />
    </PageShell>
  );
}
