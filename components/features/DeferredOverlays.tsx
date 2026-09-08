"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * The chat launcher and persona modal are interaction overlays, not page
 * content — nothing a crawler needs and nothing visible above the fold. They
 * were hydrating alongside the rest of the page and adding to Total Blocking
 * Time, so they now load once the browser is idle (or on first interaction,
 * whichever comes first).
 */
const ChatBot = dynamic(() => import("./ChatBot"), { ssr: false });
const PersonaModal = dynamic(() => import("./PersonaModal"), { ssr: false });

export default function DeferredOverlays() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    const activate = () => setReady(true);

    if ("requestIdleCallback" in window) {
      idleHandle = window.requestIdleCallback(activate, { timeout: 2500 });
    } else {
      timeoutHandle = setTimeout(activate, 1500);
    }

    // Do not make an interested visitor wait for idle.
    window.addEventListener("pointerdown", activate, { once: true });
    window.addEventListener("keydown", activate, { once: true });

    return () => {
      if (idleHandle !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle) clearTimeout(timeoutHandle);
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <ChatBot />
      <PersonaModal />
    </>
  );
}
