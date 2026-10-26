"use client";
import { requestPrivacyChoices } from "@/lib/privacy/consent";

/** Re-opens the privacy-choices banner so consent can be changed any time. */
export default function PrivacyChoicesButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={requestPrivacyChoices}>
      Privacy choices
    </button>
  );
}
