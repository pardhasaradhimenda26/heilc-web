"use client";
/**
 * Browser-side consent state.
 *
 * - Site choices: whether the visitor allows personalisation (IP-based region
 *   detection and remembering their persona). Essential storage only records
 *   the choice itself.
 * - Pending account consent: captured in the sign-in panel *before* any data
 *   reaches an identity provider, then written to consent_log after sign-in.
 */
import { PRIVACY_NOTICE_VERSION } from "@/lib/site";
import type { NoticeLanguage } from "./notice";

const SITE_KEY = "heilc:privacy-choices";
const PENDING_KEY = "heilc:pending-account-consent";
export const CHOICES_EVENT = "heilc:privacy-choices";
export const OPEN_CHOICES_EVENT = "heilc:open-privacy-choices";

/** Ask the (lazily mounted) banner to open, even if it hasn't mounted yet. */
export function requestPrivacyChoices() {
  (window as unknown as { __heilcOpenChoices?: boolean }).__heilcOpenChoices = true;
  window.dispatchEvent(new Event(OPEN_CHOICES_EVENT));
}

export function consumeChoicesRequest(): boolean {
  const w = window as unknown as { __heilcOpenChoices?: boolean };
  const asked = Boolean(w.__heilcOpenChoices);
  w.__heilcOpenChoices = false;
  return asked;
}

export interface SiteChoices {
  personalisation: boolean;
  version: string;
  at: string;
}

function safeGet(store: "local" | "session", key: string): string | null {
  try {
    return (store === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function safeSet(store: "local" | "session", key: string, value: string | null) {
  try {
    const s = store === "local" ? localStorage : sessionStorage;
    if (value === null) s.removeItem(key);
    else s.setItem(key, value);
  } catch {
    // Storage blocked; the choice simply is not remembered.
  }
}

export function readSiteChoices(): SiteChoices | null {
  const raw = safeGet("local", SITE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SiteChoices;
    return parsed.version === PRIVACY_NOTICE_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSiteChoices(personalisation: boolean) {
  const value: SiteChoices = {
    personalisation,
    version: PRIVACY_NOTICE_VERSION,
    at: new Date().toISOString(),
  };
  safeSet("local", SITE_KEY, JSON.stringify(value));
  if (!personalisation) {
    // Withdrawal must stop processing: drop anything derived from it.
    safeSet("local", "heilc-detection-data", null);
    safeSet("local", "heilc-persona", null);
    safeSet("local", "heilc-persona-time", null);
  }
  window.dispatchEvent(new CustomEvent(CHOICES_EVENT, { detail: value }));
}

export interface PendingConsent {
  version: string;
  language: NoticeLanguage;
  at: string;
}

export function savePendingConsent(language: NoticeLanguage) {
  const value: PendingConsent = {
    version: PRIVACY_NOTICE_VERSION,
    language,
    at: new Date().toISOString(),
  };
  safeSet("local", PENDING_KEY, JSON.stringify(value));
}

export function readPendingConsent(): PendingConsent | null {
  const raw = safeGet("local", PENDING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingConsent;
  } catch {
    return null;
  }
}

export function clearPendingConsent() {
  safeSet("local", PENDING_KEY, null);
}

/** Drafts survive the OAuth round-trip so nobody retypes a request. */
export function saveDraft(key: string, value: unknown) {
  safeSet("session", `heilc:draft:${key}`, JSON.stringify(value));
}

export function readDraft<T>(key: string): T | null {
  const raw = safeGet("session", `heilc:draft:${key}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearDraft(key: string) {
  safeSet("session", `heilc:draft:${key}`, null);
}
