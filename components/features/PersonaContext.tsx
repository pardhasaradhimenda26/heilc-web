"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

export type Persona = "startup" | "enterprise" | "student" | null;

interface DetectionData {
  country: string;
  city: string;
  region: string;
  timezone: string;
  language: string;
  referrer: string;
  detectedPersona: string;
  reason: string;
  signals: {
    fromLinkedIn: boolean;
    fromGitHub: boolean;
    isEnterpriseCountry: boolean;
    isStartupEcosystem: boolean;
  };
  latitude?: number;
  longitude?: number;
}

interface PersonaContextType {
  persona: Persona;
  setPersona: (p: Persona) => void;
  detectionData: DetectionData | null;
  isAutoDetected: boolean;
  autoDetecting: boolean;
  behaviorScore: number;
  trackBehavior: (action: string) => void;
  refineLocation: () => Promise<void>;
  isRefining: boolean;
}

const PersonaContext = createContext<PersonaContextType>({
  persona: null,
  setPersona: () => {},
  detectionData: null,
  isAutoDetected: false,
  autoDetecting: true,
  behaviorScore: 0,
  trackBehavior: () => {},
  refineLocation: async () => {},
  isRefining: false,
});

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>(null);
  const [detectionData, setDetectionData] = useState<DetectionData | null>(null);
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [autoDetecting, setAutoDetecting] = useState(true);
  const [behaviorScore, setBehaviorScore] = useState(0);
  const [isRefining, setIsRefining] = useState(false);

  const behaviorMap: Record<string, number> = {
    viewed_services: 10,
    viewed_case_studies: 15,
    opened_chatbot: 20,
    scrolled_fast: -5,
    scrolled_slow: 10,
    time_on_capabilities: 15,
    clicked_enterprise_service: 25,
    clicked_contact: 30,
  };

  const trackBehavior = (action: string) => {
    const score = behaviorMap[action] || 0;
    setBehaviorScore((prev) => {
      const newScore = prev + score;
      if (newScore > 50 && !isAutoDetected) setPersonaState("enterprise");
      else if (newScore > 25 && !isAutoDetected) setPersonaState("startup");
      return newScore;
    });
  };

  const setPersona = (p: Persona) => {
    setPersonaState(p);
    if (p) {
      localStorage.setItem("heilc-persona", p);
      localStorage.setItem("heilc-persona-time", Date.now().toString());
    }
  };

  const refineLocation = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }
    setIsRefining(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      const geoRes = await fetch(
        `https://api.bigdatacloud.com/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      if (!geoRes.ok) throw new Error("Failed to fetch reverse geocode data");

      const geoData = await geoRes.json();

      setDetectionData((prev) => {
        const updatedData: DetectionData = {
          country: geoData.countryCode || prev?.country || "IN",
          city: geoData.city || geoData.locality || geoData.principalSubdivision || prev?.city || "Unknown City",
          region: geoData.principalSubdivision || prev?.region || "Unknown Region",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || prev?.timezone || "Asia/Kolkata",
          language: navigator.language || prev?.language || "en-IN",
          referrer: prev?.referrer || "direct",
          detectedPersona: prev?.detectedPersona || "startup",
          reason: "Refined via GPS/Signal",
          signals: {
            fromLinkedIn: prev?.signals?.fromLinkedIn || false,
            fromGitHub: prev?.signals?.fromGitHub || false,
            isEnterpriseCountry: [
              "US","GB","DE","JP","SG","AU","CA","FR",
            ].includes(geoData.countryCode || ""),
            isStartupEcosystem: ["IN","NG","BR","ID"].includes(geoData.countryCode || ""),
          },
          latitude,
          longitude,
        };

        localStorage.setItem("heilc-detection-data", JSON.stringify(updatedData));

        // Re-evaluate persona based on country code
        let finalPersona = updatedData.detectedPersona as Persona;
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        const isLargeScreen = typeof window !== "undefined" && window.innerWidth > 1440;

        const enterpriseCountries = [
          "US", "GB", "DE", "JP", "SG", "AU", "CA", "FR", "NL", "SE", "CH", "AE",
        ];
        const startupCountries = [
          "IN", "NG", "BR", "ID", "PK", "BD", "PH", "VN", "KE", "EG", "ZA",
        ];

        if (enterpriseCountries.includes(updatedData.country)) {
          finalPersona = "enterprise";
        } else if (startupCountries.includes(updatedData.country)) {
          finalPersona = "startup";
        }

        if (isMobile && finalPersona === "enterprise") finalPersona = "startup";
        if (isLargeScreen && updatedData.signals?.isStartupEcosystem) finalPersona = "startup";

        setPersonaState(finalPersona);
        localStorage.setItem("heilc-persona", finalPersona || "");
        localStorage.setItem("heilc-persona-time", Date.now().toString());
        setIsAutoDetected(true);

        return updatedData;
      });
    } catch (err) {
      console.warn("Could not refine location:", err);
    } finally {
      setIsRefining(false);
    }
  }, []);

  useEffect(() => {
    const autoDetect = async () => {
      const savedPersona = localStorage.getItem("heilc-persona");
      const savedDataStr = localStorage.getItem("heilc-detection-data");
      const savedTime = localStorage.getItem("heilc-persona-time");
      const isRecent =
        savedTime && Date.now() - parseInt(savedTime) < 24 * 60 * 60 * 1000;

      const checkGeoPermissionAndRefine = () => {
        if (typeof navigator !== "undefined" && navigator.permissions && navigator.permissions.query) {
          navigator.permissions.query({ name: "geolocation" as PermissionName }).then((result) => {
            if (result.state === "granted") {
              refineLocation();
            }
          });
        }
      };

      if (savedPersona && savedDataStr && isRecent) {
        setPersonaState(savedPersona as Persona);
        try {
          setDetectionData(JSON.parse(savedDataStr));
          setIsAutoDetected(true);
        } catch (e) {
          console.warn("Could not parse saved detection data:", e);
        }
        setAutoDetecting(false);
        checkGeoPermissionAndRefine();
        return;
      }

      let data: DetectionData | null = null;
      try {
        const res = await fetch("/api/detect");
        if (res.ok) {
          data = await res.json();
        }
      } catch (err) {
        console.warn("Local detect API failed:", err);
      }

      // If we are running locally (which returns Chennai, IN) or the detect API failed,
      // let's fetch a public IP geolocation service client-side (no permission prompt required!)
      const isDefaultOrFailed = !data || (data.city === "Chennai" && data.country === "IN");
      if (isDefaultOrFailed) {
        try {
          let ipData: any = null;
          const ipRes = await fetch("https://ipapi.co/json/");
          if (ipRes.ok) {
            ipData = await ipRes.json();
          } else {
            const backupRes = await fetch("https://freeipapi.com/api/json");
            if (backupRes.ok) {
              const backupData = await backupRes.json();
              ipData = {
                country: backupData.countryCode,
                city: backupData.cityName,
                region: backupData.regionName,
                timezone: backupData.timeZone,
                latitude: backupData.latitude,
                longitude: backupData.longitude,
              };
            }
          }

          if (ipData && !ipData.error) {
            const countryCode = ipData.country || ipData.country_code || "IN";
            const updatedData: DetectionData = {
              country: countryCode,
              city: ipData.city || "Unknown City",
              region: ipData.region || ipData.region_code || "Unknown Region",
              timezone: ipData.timezone || "Asia/Kolkata",
              language: navigator.language || "en-IN",
              referrer: document.referrer || "direct",
              detectedPersona: data?.detectedPersona || "startup",
              reason: "Auto-detected by IP",
              signals: {
                fromLinkedIn: document.referrer.includes("linkedin"),
                fromGitHub: document.referrer.includes("github"),
                isEnterpriseCountry: ["US","GB","DE","JP","SG","AU","CA","FR"].includes(countryCode),
                isStartupEcosystem: ["IN","NG","BR","ID"].includes(countryCode),
              },
              latitude: ipData.latitude,
              longitude: ipData.longitude,
            };

            data = updatedData;
          }
        } catch (e) {
          console.warn("Public IP geolocation failed:", e);
        }
      }

      // Fallback if both failed
      if (!data) {
        data = {
          country: "IN",
          city: "Chennai",
          region: "TN",
          timezone: "Asia/Kolkata",
          language: "en-IN",
          referrer: "direct",
          detectedPersona: "startup",
          reason: "Fallback Default",
          signals: {
            fromLinkedIn: false,
            fromGitHub: false,
            isEnterpriseCountry: false,
            isStartupEcosystem: true,
          }
        };
      }

      setDetectionData(data);
      localStorage.setItem("heilc-detection-data", JSON.stringify(data));

      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const isLargeScreen = typeof window !== "undefined" && window.innerWidth > 1440;

      let finalPersona: Persona = data.detectedPersona as Persona;

      // Re-evaluate persona based on actual country
      const enterpriseCountries = ["US", "GB", "DE", "JP", "SG", "AU", "CA", "FR", "NL", "SE", "CH", "AE"];
      const startupCountries = ["IN", "NG", "BR", "ID", "PK", "BD", "PH", "VN", "KE", "EG", "ZA"];

      if (enterpriseCountries.includes(data.country)) {
        finalPersona = "enterprise";
      } else if (startupCountries.includes(data.country)) {
        finalPersona = "startup";
      }

      if (isMobile && finalPersona === "enterprise") finalPersona = "startup";
      if (isLargeScreen && data.signals?.isStartupEcosystem) finalPersona = "startup";

      setPersonaState(finalPersona);
      localStorage.setItem("heilc-persona", finalPersona || "");
      localStorage.setItem("heilc-persona-time", Date.now().toString());
      setIsAutoDetected(true);

      checkGeoPermissionAndRefine();
      setAutoDetecting(false);
    };

    autoDetect();
  }, [refineLocation]);

  return (
    <PersonaContext.Provider
      value={{
        persona,
        setPersona,
        detectionData,
        isAutoDetected,
        autoDetecting,
        behaviorScore,
        trackBehavior,
        refineLocation,
        isRefining,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export const usePersona = () => useContext(PersonaContext);
