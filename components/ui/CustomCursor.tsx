"use client";
import { useEffect, useRef } from "react";

/**
 * The custom cursor previously ran an uncancelled requestAnimationFrame loop
 * for the lifetime of the page and bound mouseenter/mouseleave to every anchor
 * and button present at mount. That was continuous main-thread work (it showed
 * up as Total Blocking Time) and it missed any element rendered later.
 *
 * Now: the loop only runs while the ring is still catching up to the pointer,
 * hover state uses event delegation so late-rendered links work too, and
 * everything is torn down on unmount. Skipped on touch/coarse pointers and
 * when the visitor prefers reduced motion.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let ringX = 0;
    let ringY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let frame: number | null = null;

    const step = () => {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;

      // Settled: stop the loop instead of spinning every frame forever.
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        frame = null;
        return;
      }

      ringX += dx * 0.12;
      ringY += dy * 0.12;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      frame = requestAnimationFrame(step);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      if (frame === null) frame = requestAnimationFrame(step);
    };

    const INTERACTIVE = "a, button, [role='button'], input, select, textarea, summary";

    const onOver = (e: Event) => {
      const target = e.target as Element | null;
      if (target?.closest?.(INTERACTIVE)) ring.classList.add("hovered");
    };
    const onOut = (e: Event) => {
      const target = e.target as Element | null;
      if (target?.closest?.(INTERACTIVE)) ring.classList.remove("hovered");
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
    </>
  );
}
