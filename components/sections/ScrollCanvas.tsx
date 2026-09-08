"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TOTAL_FRAMES = 120;
const CHUNK_SIZE = 30;

export default function ScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const text1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [0, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.45, 0.55], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.6, 0.72, 0.82], [0, 1, 0]);
  const text4Opacity = useTransform(scrollYProgress, [0.85, 0.92, 1], [0, 1, 1]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    if (window.innerWidth < 768) return;

    const frames: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    framesRef.current = frames;
    let loadedCount = 0;

    const loadChunk = (start: number) => {
      const end = Math.min(start + CHUNK_SIZE, TOTAL_FRAMES);
      for (let i = start; i < end; i++) {
        const img = new Image();
        img.src = `/frames/frame_${String(i + 1).padStart(3, "0")}.jpg`;
        img.onload = () => {
          frames[i] = img;
          loadedCount++;
          if (loadedCount === CHUNK_SIZE && start === 0) {
            setLoaded(true);
            drawFrame(0);
          }
          if (loadedCount >= TOTAL_FRAMES) setLoaded(true);
        };
      }
    };

    loadChunk(0);
    setTimeout(() => loadChunk(CHUNK_SIZE), 1000);
    setTimeout(() => loadChunk(CHUNK_SIZE * 2), 2500);
    setTimeout(() => loadChunk(CHUNK_SIZE * 3), 4000);
  }, []);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const frame = framesRef.current[index];
    if (!canvas || !ctx || !frame) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (isMobile) return;
    const unsub = scrollYProgress.on("change", (v) => {
      const frameIndex = Math.min(
        Math.floor(v * TOTAL_FRAMES),
        TOTAL_FRAMES - 1
      );
      drawFrame(frameIndex);
    });
    return unsub;
  }, [scrollYProgress, isMobile]);

  if (isMobile) return null;

  return (
    <div ref={containerRef} className="relative" style={{ height: "600vh" }}>
      {/* Sticky canvas */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 bg-[#080808] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border border-teal border-t-transparent rounded-full animate-spin" />
              <p className="text-white/55 text-xs tracking-widest">LOADING</p>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/20 pointer-events-none" />

        {/* Text overlays */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div style={{ opacity: text1Opacity }} className="text-center">
            <p className="text-white/60 text-sm tracking-widest uppercase mb-2">01 — INTELLIGENCE</p>
            <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px,8vw,96px)" }} className="text-white">
              WHERE HUMAN INTELLIGENCE
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div style={{ opacity: text2Opacity }} className="text-center">
            <div style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px,8vw,96px)" }} className="text-white">
              MEETS THE FUTURE
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div style={{ opacity: text3Opacity }} className="text-center">
            <div
              style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(64px,12vw,140px)" }}
              className="text-gradient font-bold"
            >
              HEILC
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none">
          <motion.div style={{ opacity: text4Opacity }} className="text-center">
            <p className="text-white/60 text-sm tracking-widest uppercase">Scroll to explore ↓</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
