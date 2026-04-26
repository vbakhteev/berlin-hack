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
  src,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  opacity: number;
  loop?: boolean;
  src?: string;
}) {
  return (
    <video
      ref={videoRef}
      src={src}
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

      {/* ── Background: organic dark zones (top band + left col + lower-right) + scattered specks + fine grain ── */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        {/* Base green */}
        <div className="absolute inset-0" style={{ background: "#1c3820" }} />

        {/* Organic dark zone shapes — SVG paths with heavy Gaussian blur = soft, flowing edges */}
        <svg
          width="100%" height="100%"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, display: "block" }}
        >
          <defs>
            <filter id="bz1" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="88" />
            </filter>
            <filter id="bz2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="58" />
            </filter>
          </defs>

          {/* Zone A: top dark band — wavy lower boundary, deeper on left */}
          <path
            d="M 0,0 L 1920,0 L 1920,300 Q 1580,390 1200,260 Q 830,140 490,310 Q 230,410 0,440 Z"
            fill="rgba(0,0,0,0.63)"
            filter="url(#bz1)"
          />
          {/* Zone B: left dark column — full height, soft right edge */}
          <path
            d="M 0,0 L 195,0 Q 170,290 148,550 Q 126,780 100,1080 L 0,1080 Z"
            fill="rgba(0,0,0,0.70)"
            filter="url(#bz2)"
          />
          {/* Zone C: lower-right dark cluster — wavy upper boundary */}
          <path
            d="M 1920,700 Q 1690,590 1460,690 Q 1255,790 1040,670 Q 890,610 830,850 Q 770,1040 990,1080 L 1920,1080 Z"
            fill="rgba(0,0,0,0.62)"
            filter="url(#bz1)"
          />
          {/* Zone D: top-right corner shadow */}
          <ellipse cx="1840" cy="70" rx="270" ry="170" fill="rgba(0,0,0,0.44)" filter="url(#bz1)" />
          {/* Zone E: left-edge mid deepening */}
          <ellipse cx="75" cy="700" rx="170" ry="300" fill="rgba(0,0,0,0.40)" filter="url(#bz2)" />

          {/* Scattered dark specks — organic dots spread across lighter zones */}
          <g fill="rgba(0,0,0,0.52)">
            <circle cx="370" cy="220" r="2.2" /><circle cx="500" cy="172" r="1.9" /><circle cx="630" cy="245" r="2.5" />
            <circle cx="785" cy="193" r="1.7" /><circle cx="925" cy="235" r="2.1" /><circle cx="1065" cy="182" r="1.8" />
            <circle cx="1195" cy="252" r="2.3" /><circle cx="1355" cy="205" r="1.6" /><circle cx="1500" cy="225" r="2.0" />
            <circle cx="1660" cy="178" r="1.9" /><circle cx="1810" cy="248" r="2.1" />

            <circle cx="275" cy="515" r="2.3" /><circle cx="415" cy="575" r="1.8" /><circle cx="565" cy="505" r="2.1" />
            <circle cx="725" cy="595" r="2.4" /><circle cx="885" cy="535" r="1.9" /><circle cx="1025" cy="605" r="2.0" />
            <circle cx="1205" cy="525" r="2.2" /><circle cx="1375" cy="585" r="1.7" /><circle cx="1565" cy="515" r="2.3" />
            <circle cx="1745" cy="575" r="1.8" /><circle cx="1875" cy="505" r="2.0" />

            <circle cx="235" cy="735" r="2.1" /><circle cx="395" cy="815" r="1.9" /><circle cx="555" cy="765" r="2.4" />
            <circle cx="715" cy="875" r="1.8" /><circle cx="865" cy="795" r="2.2" /><circle cx="1005" cy="855" r="1.7" />
            <circle cx="190" cy="935" r="2.0" /><circle cx="345" cy="975" r="1.8" /><circle cx="485" cy="915" r="2.3" />
            <circle cx="645" cy="992" r="1.9" /><circle cx="805" cy="955" r="2.1" />

            <circle cx="158" cy="405" r="1.9" /><circle cx="315" cy="665" r="2.0" /><circle cx="755" cy="445" r="2.2" />
            <circle cx="1095" cy="695" r="1.8" /><circle cx="1435" cy="435" r="2.0" /><circle cx="1715" cy="395" r="1.9" />
            <circle cx="475" cy="365" r="2.1" /><circle cx="1605" cy="765" r="1.8" /><circle cx="955" cy="765" r="2.0" />
            <circle cx="1275" cy="725" r="2.2" /><circle cx="1495" cy="675" r="1.7" /><circle cx="1725" cy="645" r="2.1" />
          </g>
          {/* Larger bright-green specks for variance */}
          <g fill="rgba(85,165,65,0.28)">
            <circle cx="585" cy="395" r="3.8" /><circle cx="1085" cy="335" r="3.2" />
            <circle cx="785" cy="715" r="4.0" /><circle cx="365" cy="845" r="3.5" />
            <circle cx="1445" cy="565" r="3.6" /><circle cx="1265" cy="815" r="3.3" />
            <circle cx="925" cy="485" r="3.0" /><circle cx="1625" cy="465" r="3.4" />
          </g>
        </svg>

        {/* Fine grain texture */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, display: "block", opacity: 0.42 }}>
          <defs>
            <filter id="grain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.96 1.00"
                numOctaves="4" seed="11" stitchTiles="stitch" result="t" />
              <feColorMatrix type="matrix"
                values="0 0 0 0.36 -0.10
                        0 0 0 0.68  0.04
                        0 0 0 0.36 -0.10
                        0 0 0 4.6 -1.95"
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
            <ConvexVideo videoRef={leftCallRef} opacity={callActive ? 1 : 0} loop src="/videos/left-call.mp4" />
            <ConvexVideo videoRef={leftSummaryRef} opacity={summaryActive ? 1 : 0} />
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
            borderRadius: "8%",
          }} />

          {/* Video clipped to screen area of iPhone 15 Pro mockup.
              Screen area measured from 1419×2796 source:
              left≈6%, top≈3.5%, width≈88%, height≈93% */}
          <video ref={rightCallRef} src="/videos/right-call.mp4" muted playsInline loop style={{
            position: "absolute",
            left: "8.5%", top: "4.8%", width: "83%", height: "90.5%",
            objectFit: "cover",
            borderRadius: "8%",
            opacity: callActive ? 1 : 0,
            transition: "opacity 0.6s ease",
          }} />
          <video ref={rightSummaryRef} muted playsInline style={{
            position: "absolute",
            left: "8.5%", top: "4.8%", width: "83%", height: "90.5%",
            objectFit: "cover",
            borderRadius: "8%",
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
