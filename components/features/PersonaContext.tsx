"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { CHOICES_EVENT, readSiteChoices } from "@/lib/privacy/consent";

export type Persona = "startup" | "enterprise" | "student" | null;

/** Where the active persona came from, strongest first. */
export type PersonaSource = "profile" | "region" | "default";

interface DetectionData {
  country: string;
  city: string;
  region: string;
  timezone: string;
  detectedPersona: string;
  reason: string;
  latitude?: number;
  longitude?: number;
}

interface PersonaContextType {
  persona: Persona;
  source: PersonaSource;
  detectionData: DetectionData | null;
  isAutoDetected: boolean;
  /** Visitor has allowed region-based personalisation. */
  personalisationAllowed: boolean;
}

const PersonaContext = createContext<PersonaContextType>({
  persona: null,
  source: "default",
  detectionData: null,
  isAutoDetected: false,
  personalisationAllowed: false,
});

const CACHE_KEY = "heilc-detection-data";
const CACHE_TIME_KEY = "heilc-persona-time";
const DAY = 24 * 60 * 60 * 1000;

/**
 * Three persona engines — startup, enterprise, student — chosen by:
 *   1. the signed-in visitor's own onboarding answer, else
 *   2. their region, but only if they allowed personalisation, else
 *   3. nothing (neutral default content).
 *
 * Region comes from our own hosting's request headers via /api/detect: no
 * third-party IP lookup, no GPS prompt, and nothing stored on our side
 * (DPDP s.6(1) — only what the purpose needs).
 */
export function PersonaProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [allowed, setAllowed] = useState(false);
  const [detectionData, setDetectionData] = useState<DetectionData | null>(null);

  const detect = useCallback(async () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const at = Number(localStorage.getItem(CACHE_TIME_KEY) || 0);
      if (cached && Date.now() - at < DAY) {
        setDetectionData(JSON.parse(cached));
        return;
      }
    } catch {
      // ignore unreadable cache
    }
    try {
      const res = await fetch("/api/detect", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as DetectionData;
      setDetectionData(data);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      } catch {}
    } catch {
      // Detection is a nicety; failure leaves default content.
    }
  }, []);

  useEffect(() => {
    const apply = () => {
      const ok = Boolean(readSiteChoices()?.personalisation);
      setAllowed(ok);
      if (ok) void detect();
      else setDetectionData(null);
    };
    apply();
    window.addEventListener(CHOICES_EVENT, apply);
    return () => window.removeEventListener(CHOICES_EVENT, apply);
  }, [detect]);

  let persona: Persona = null;
  let source: PersonaSource = "default";
  if (profile?.persona) {
    persona = profile.persona;
    source = "profile";
  } else if (allowed && detectionData) {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    persona = detectionData.detectedPersona as Persona;
    if (isMobile && persona === "enterprise") persona = "startup";
    source = "region";
  }

  return (
    <PersonaContext.Provider
      value={{
        persona,
        source,
        detectionData: allowed ? detectionData : null,
        isAutoDetected: source === "region",
        personalisationAllowed: allowed,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export const usePersona = () => useContext(PersonaContext);
