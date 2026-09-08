"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Defers the Spline 3D iframe until the browser is idle and the section is
 * on screen. The iframe is a third-party embed of several hundred kilobytes;
 * mounting it during initial render pushed out LCP and blocked the main
 * thread. A CSS gradient stands in until it loads, so the hero never shifts.
 */
export default function LazySpline({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Never load the embed for visitors who asked for reduced motion.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      const run = () => setShouldLoad(true);
      if ("requestIdleCallback" in window) {
        idleHandle = window.requestIdleCallback(run, { timeout: 3000 });
      } else {
        timeoutHandle = setTimeout(run, 1200);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          schedule();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (idleHandle !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle) clearTimeout(timeoutHandle);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 70% 35%, rgba(20,197,212,0.16) 0%, rgba(8,8,8,0) 60%), radial-gradient(circle at 25% 75%, rgba(124,92,191,0.14) 0%, rgba(8,8,8,0) 60%), #080808",
      }}
    >
      {shouldLoad && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          tabIndex={-1}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
