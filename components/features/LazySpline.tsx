"use client";
import { useEffect, useRef } from "react";

/**
 * Hero robot.
 *
 * Before: the Spline iframe was mounted only after hydration, an
 * IntersectionObserver callback and a requestIdleCallback (up to 3 s) — on the
 * live site the scene did not even start downloading until ~6.9 s, and the
 * hero showed an empty gradient until then.
 *
 * Now:
 *  1. A 22 kB still of the robot is in the server HTML, so it is on screen with
 *     the first paint.
 *  2. A tiny inline script inserts the iframe while the HTML is still being
 *     parsed — before React has loaded — so the 1.5 MB scene downloads in
 *     parallel with the app instead of after it.
 *  3. When the scene has loaded (plus ~1 s for Spline to build and draw it),
 *     a CSS crossfade swaps still → live, so there is no pop-in.
 *  4. Off-screen, the iframe is hidden so it stops rendering and scrolling the
 *     rest of the page stays smooth.
 * Visitors with reduced motion or a data-saver/2G connection keep the still.
 */
export default function LazySpline({ src, title }: { src: string; title: string }) {
  const stageRef = useRef<HTMLDivElement>(null);

  // The script below is a static string: it only reads `src`/`title`, which
  // are compile-time constants passed by Hero.
  const boot = `(function(){try{
var s=document.getElementById('robot-stage');if(!s||s.querySelector('iframe'))return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var c=navigator.connection||{};if(c.saveData||/(^|-)2g/.test(c.effectiveType||''))return;
function go(){if(s.querySelector('iframe'))return;var f=document.createElement('iframe');
f.src=${JSON.stringify(src)};f.title=${JSON.stringify(title)};f.tabIndex=-1;f.setAttribute('aria-hidden','true');
f.setAttribute('allow','autoplay');
f.onload=function(){setTimeout(function(){s.setAttribute('data-live','true')},1000)};
s.querySelector('[data-robot-frame]').appendChild(f);}
var fast=c.effectiveType==='4g'||(!c.effectiveType&&innerWidth>=768);
if(fast)go();else if(document.readyState==='complete')go();else addEventListener('load',go,{once:true});
}catch(e){}})();`;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const frame = stage.querySelector("iframe");
        if (frame) frame.style.visibility = entry.isIntersecting ? "visible" : "hidden";
      },
      { rootMargin: "100px" },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="robot-stage"
      ref={stageRef}
      aria-hidden="true"
      className="robot-stage absolute inset-0 z-0 pointer-events-none"
      suppressHydrationWarning
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- needs to be in the
          server HTML at full priority, without a client-side loader. */}
      <img
        className="robot-poster"
        src="/assets/robot-poster.webp"
        srcSet="/assets/robot-poster-sm.webp 560w, /assets/robot-poster.webp 924w"
        sizes="(orientation: landscape) 71vh, 100vw"
        alt=""
        width={924}
        height={1305}
        fetchPriority="high"
        decoding="async"
      />
      {/* React never renders children here; the inline script owns this node. */}
      <div
        data-robot-frame
        className="absolute inset-0"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: "" }}
      />
      <script dangerouslySetInnerHTML={{ __html: boot }} />
    </div>
  );
}
