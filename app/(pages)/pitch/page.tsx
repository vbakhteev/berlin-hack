"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const T_INTRO_END = 5;
const T_CALL_END = 105;
const T_SUMMARY_END = 115;
const T_TOTAL = 120;

type Stage = "idle" | "intro" | "call" | "summary" | "closing";

function getStage(elapsed: number): Stage {
  if (elapsed < T_INTRO_END) return "intro";
  if (elapsed < T_CALL_END) return "call";
  if (elapsed < T_SUMMARY_END) return "summary";
  return "closing";
}

// Convex clip: corners stay at the outer rectangle, all 4 sides bow outward.
// Applied to an inner div with inset: -5%, so the content bleeds 5% on each side.
// In objectBoundingBox coords of the inner div (which is 110% of outer):
// outer corners land at 5/110 ≈ 0.045 from each edge of inner box.
const CONVEX_PATH =
  "M 0.045,0.045 Q 0.5,0 0.955,0.045 Q 1,0.5 0.955,0.955 Q 0.5,1 0.045,0.955 Q 0,0.5 0.045,0.045 Z";

function ConvexVideo({
  videoRef,
  opacity,
  loop,
  placeholder,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  opacity: number;
  loop?: boolean;
  placeholder: string;
}) {
  return (
    <>
      <video
        ref={videoRef}
        muted
        playsInline
        loop={loop}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          opacity,
          transition: "opacity 0.6s ease",
        }}
      />
      {/* Placeholder shown when no src */}
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          paddingBottom: "12px",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      >
        <span style={{ color: "white", fontSize: "0.65rem", fontFamily: "monospace" }}>
          {placeholder}
        </span>
      </div>
    </>
  );
}

export default function PitchPage() {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const leftCallRef = useRef<HTMLVideoElement>(null);
  const rightCallRef = useRef<HTMLVideoElement>(null);
  const leftSummaryRef = useRef<HTMLVideoElement>(null);
  const rightSummaryRef = useRef<HTMLVideoElement>(null);

  const stage: Stage = playing ? getStage(elapsed) : "idle";

  useEffect(() => {
    if (!playing) return;
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const s = Math.min((now - startRef.current) / 1000, T_TOTAL);
      setElapsed(s);
      if (s < T_TOTAL) rafRef.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing]);

  useEffect(() => {
    if (stage === "call") {
      leftCallRef.current?.play().catch(() => {});
      rightCallRef.current?.play().catch(() => {});
    }
    if (stage === "summary") {
      leftCallRef.current?.pause();
      rightCallRef.current?.pause();
      leftSummaryRef.current?.play().catch(() => {});
      rightSummaryRef.current?.play().catch(() => {});
    }
    if (stage === "closing") {
      leftSummaryRef.current?.pause();
      rightSummaryRef.current?.pause();
    }
  }, [stage]);

  const showVideos = stage === "intro" || stage === "call" || stage === "summary";
  const callActive = stage === "call" || stage === "intro";
  const summaryActive = stage === "summary";
  const closingActive = stage === "closing";

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#0c160c" }}
    >
      {/* SVG defs for convex clip */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <clipPath id="convex" clipPathUnits="objectBoundingBox">
            <path d={CONVEX_PATH} />
          </clipPath>
        </defs>
      </svg>

      {/* ── Background: dark green grain + soft brightness variation (matches inca.com) ── */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        {/* Layer 1: base */}
        <div className="absolute inset-0" style={{ background: "#162816" }} />
        {/* Layer 2: gentle brightness variation — large, low-opacity, heavily overlapping */}
        <div className="absolute inset-0" style={{
          background: [
            "radial-gradient(ellipse 70% 60% at 22% 36%, rgba(36,74,22,0.28) 0%, transparent 100%)",
            "radial-gradient(ellipse 65% 55% at 74% 54%, rgba(38,76,24,0.30) 0%, transparent 100%)",
            "radial-gradient(ellipse 55% 45% at 84% 16%, rgba(30,64,18,0.20) 0%, transparent 100%)",
            "radial-gradient(ellipse 60% 50% at 12% 74%, rgba(28,60,16,0.22) 0%, transparent 100%)",
            "radial-gradient(ellipse 50% 55% at 46% 88%, rgba(26,56,15,0.18) 0%, transparent 100%)",
            "radial-gradient(ellipse 55% 45% at 58% 22%, rgba(24,54,14,0.16) 0%, transparent 100%)",
          ].join(", "),
        }} />
        {/* Layer 3: fine grain — the "pixelated" texture */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, display: "block", opacity: 0.22 }}>
          <defs>
            <filter id="grain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.55 0.60"
                numOctaves="3" seed="4" stitchTiles="stitch" result="t" />
              <feColorMatrix type="matrix"
                values="0 0 0 0 0.04
                        0 0 0 0 0.14
                        0 0 0 0 0.04
                        0 0 0 1.8 -0.4"
                in="t" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      {/* ── Inca logo — top left, always ── */}
      <div className="absolute top-7 left-8 z-50" style={{
        opacity: stage !== "idle" ? 1 : 0,
        transition: "opacity 1.2s ease",
      }}>
        <Image src="/inca-logo.avif" alt="inca" width={88} height={30}
          style={{ filter: "invert(1)", objectFit: "contain" }} />
      </div>

      {/* ── Start button ── */}
      {stage === "idle" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <button
            onClick={() => { startRef.current = null; setElapsed(0); setPlaying(true); }}
            style={{
              padding: "14px 36px", borderRadius: "999px", color: "white",
              fontSize: "1rem", fontWeight: 500, cursor: "pointer",
              background: "rgba(255,255,255,0.1)", letterSpacing: "0.04em",
              border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(10px)",
            }}
          >
            ▶&nbsp;&nbsp;Play Demo
          </button>
        </div>
      )}

      {/* ── Video layout ── */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{
          justifyContent: "space-evenly",
          paddingTop: "64px",
          paddingBottom: "20px",
          opacity: showVideos ? 1 : 0,
          transition: "opacity 0.9s ease",
        }}
      >
        {/* ── Left: person on phone — SQUARE, all 4 sides convex ── */}
        <div style={{
          flex: "0 0 auto",
          height: "min(86vh, calc(100vh - 84px))",
          aspectRatio: "1 / 1",
          position: "relative",
          overflow: "visible",
          // Very soft white-green glow
          filter: [
            "drop-shadow(0 3px 10px rgba(180,230,180,0.18))",
            "drop-shadow(0 12px 36px rgba(160,215,160,0.12))",
          ].join(" "),
        }}>
          {/* Underlight — green glow beneath the panel */}
          <div style={{
            position: "absolute",
            inset: "-15%",
            bottom: "-25%",
            background: "radial-gradient(ellipse 80% 40% at 50% 95%, rgba(30,80,20,0.28) 0%, transparent 70%)",
            filter: "blur(18px)",
            zIndex: -1,
          }} />
          {/* Inner div bleeds 5% on each side so convex bulge is visible */}
          <div style={{
            position: "absolute",
            inset: "-5%",
            clipPath: "url(#convex)",
            background: "#1a2a1a",
            overflow: "hidden",
          }}>
            <ConvexVideo videoRef={leftCallRef} opacity={callActive ? 1 : 0} loop placeholder="left-call.mp4" />
            <ConvexVideo videoRef={leftSummaryRef} opacity={summaryActive ? 1 : 0} placeholder="left-summary.mp4" />
          </div>
        </div>

        {/* ── Right: iPhone 15 Pro mockup ── */}
        <div style={{
          flex: "0 0 auto",
          height: "min(86vh, calc(100vh - 84px))",
          aspectRatio: "1419 / 2796",
          position: "relative",
        }}>
          {/* Underlight */}
          <div style={{
            position: "absolute", inset: "-20%", bottom: "-30%",
            background: "radial-gradient(ellipse 70% 35% at 50% 95%, rgba(25,70,16,0.22) 0%, transparent 70%)",
            filter: "blur(16px)", zIndex: -1,
          }} />

          {/* Dark backing */}
          <div style={{
            position: "absolute",
            left: "8%", top: "3.8%", width: "84%", height: "92.4%",
            background: "#0a0a0a",
            borderRadius: "10%",
          }} />

          {/* Video clipped to screen area of iPhone 15 Pro mockup.
              Screen area measured from 1419×2796 source:
              left≈6%, top≈3.5%, width≈88%, height≈93% */}
          <video ref={rightCallRef} src="/videos/right-call.mp4" muted playsInline loop style={{
            position: "absolute",
            left: "8.5%", top: "4.8%", width: "83%", height: "90.5%",
            objectFit: "cover",
            borderRadius: "10%",
            opacity: callActive ? 1 : 0,
            transition: "opacity 0.6s ease",
          }} />
          <video ref={rightSummaryRef} muted playsInline style={{
            position: "absolute",
            left: "8.5%", top: "4.8%", width: "83%", height: "90.5%",
            objectFit: "cover",
            borderRadius: "10%",
            opacity: summaryActive ? 1 : 0,
            transition: "opacity 0.6s ease",
          }} />

          {/* iPhone frame — truly topmost, filter on img itself (not parent) */}
          <img
            src="/iphone15-pro-black.webp"
            alt=""
            style={{
              position: "absolute", inset: 0, zIndex: 10,
              width: "100%", height: "100%",
              objectFit: "fill",
              mixBlendMode: "multiply",
              pointerEvents: "none",
              filter: [
                "drop-shadow(0 3px 10px rgba(180,230,180,0.18))",
                "drop-shadow(0 12px 36px rgba(160,215,160,0.12))",
              ].join(" "),
            }}
          />
        </div>
      </div>

      {/* ── Closing screen ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center"
        style={{
          gap: "20px",
          opacity: closingActive ? 1 : 0,
          transition: "opacity 1s ease",
          pointerEvents: closingActive ? "auto" : "none",
        }}
      >
        <Image src="/inca-logo.avif" alt="inca" width={140} height={48}
          style={{ filter: "invert(1)", objectFit: "contain" }} />
        <p style={{
          color: "rgba(255,255,255,0.78)",
          fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)",
          fontWeight: 400, letterSpacing: "0.015em",
          textAlign: "center", lineHeight: 1.6, maxWidth: "400px",
        }}>
          Your customers think it&apos;s a human.<br />
          Your accountant knows it&apos;s not.
        </p>
      </div>
    </div>
  );
}
