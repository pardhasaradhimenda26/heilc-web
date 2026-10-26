"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AuthPanel from "./AuthPanel";
import { useAuth } from "./AuthProvider";

export default function LoginView() {
  const { enabled, ready, isMember, firstName } = useAuth();
  const [next, setNext] = useState("/");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("next");
    if (n && n.startsWith("/") && !n.startsWith("//")) setNext(n);
    if (params.get("error")) {
      setError("That sign-in did not complete. Please try again, or use another method.");
    }
  }, []);

  if (!enabled) {
    return (
      <p className="text-white/70 text-sm">
        Accounts are not switched on yet. Everything on the site is open —{" "}
        <Link href="/contact" className="text-teal underline">
          send us a message
        </Link>
        .
      </p>
    );
  }

  if (ready && isMember) {
    return (
      <div>
        <p className="text-white text-lg mb-3">You&apos;re already signed in, {firstName}.</p>
        <Link href={next} className="text-teal underline">
          Continue
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <p role="alert" className="text-red-400 text-xs mb-4">
          {error}
        </p>
      )}
      <AuthPanel next={next} />
    </>
  );
}
