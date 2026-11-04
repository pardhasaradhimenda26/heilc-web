"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/supabase/config";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<void> | null = null;
function load(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error("turnstile"));
    };
    document.head.appendChild(s);
  });
  return loading;
}

export type TurnstileHandle = { reset: () => void };

/**
 * Cloudflare Turnstile — a free, privacy-friendly bot check (no puzzles for
 * most people). Renders nothing unless NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 */
const Turnstile = forwardRef<TurnstileHandle, { onToken: (token: string | null) => void }>(
  function Turnstile({ onToken }, ref) {
    const el = useRef<HTMLDivElement>(null);
    const id = useRef<string | null>(null);
    const cb = useRef(onToken);
    cb.current = onToken;

    useImperativeHandle(ref, () => ({
      reset: () => {
        cb.current(null);
        if (id.current && window.turnstile) window.turnstile.reset(id.current);
      },
    }));

    useEffect(() => {
      if (!TURNSTILE_SITE_KEY) return;
      let cancelled = false;
      load()
        .then(() => {
          if (cancelled || !el.current || !window.turnstile) return;
          id.current = window.turnstile.render(el.current, {
            sitekey: TURNSTILE_SITE_KEY,
            theme: "dark",
            size: "flexible",
            callback: (t: string) => cb.current(t),
            "expired-callback": () => cb.current(null),
            "error-callback": () => cb.current(null),
          });
        })
        .catch(() => cb.current(null));
      return () => {
        cancelled = true;
        if (id.current && window.turnstile) window.turnstile.remove(id.current);
        id.current = null;
      };
    }, []);

    if (!TURNSTILE_SITE_KEY) return null;
    return <div ref={el} className="min-h-[65px]" />;
  },
);

export default Turnstile;
