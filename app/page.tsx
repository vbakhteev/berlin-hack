import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main
      className="min-h-[100dvh] flex flex-col"
      style={{ background: "#0A0A0A", color: "#fff" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6"
        style={{ paddingTop: "calc(20px + env(safe-area-inset-top, 0px))" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-5 h-5 rounded-sm rotate-45"
            style={{
              background: "#0D4F3D",
              boxShadow: "0 0 10px rgba(13,79,61,0.8)",
            }}
          />
          <span className="font-bold text-lg tracking-tight">Inca</span>
        </div>
        <Link
          href="/sign-in"
          className="text-sm font-medium"
          style={{ color: "#4B916D" }}
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6">
        {/* Orb */}
        <div className="relative w-36 h-36 mb-10">
          <div
            className="absolute inset-0 rounded-full blur-2xl animate-pulse"
            style={{ background: "#0D4F3D", opacity: 0.35 }}
          />
          <div
            className="relative w-36 h-36 rounded-full flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 38% 32%, #4B916D, #0D4F3D 55%, #061a12)",
              boxShadow:
                "0 0 48px rgba(13,79,61,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            <svg width="48" height="36" viewBox="0 0 48 36" fill="none">
              <rect x="0" y="12" width="5" height="12" rx="2.5" fill="white" fillOpacity="0.55" />
              <rect x="9" y="7" width="5" height="22" rx="2.5" fill="white" fillOpacity="0.75" />
              <rect x="18" y="0" width="5" height="36" rx="2.5" fill="white" />
              <rect x="27" y="5" width="5" height="26" rx="2.5" fill="white" fillOpacity="0.75" />
              <rect x="36" y="9" width="5" height="18" rx="2.5" fill="white" fillOpacity="0.55" />
              <rect x="45" y="13" width="3" height="10" rx="1.5" fill="white" fillOpacity="0.35" />
            </svg>
          </div>
        </div>

        {/* Copy */}
        <div className="text-center" style={{ maxWidth: 320 }}>
          <p
            className="text-xs font-semibold uppercase mb-4"
            style={{ color: "#4B916D", letterSpacing: "0.14em" }}
          >
            AI-powered insurance claims
          </p>
          <h1
            className="font-bold leading-tight mb-4"
            style={{ fontSize: "2rem", letterSpacing: "-0.02em" }}
          >
            File a claim in{" "}
            <span style={{ color: "#4B916D" }}>90 seconds.</span>
          </h1>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Talk to Lina. Show the damage. Walk away knowing your deductible,
            depreciation, and expected payout — before uploading a single
            document.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { label: "Voice-first FNOL", icon: "🎙" },
            { label: "Instant estimate", icon: "⚡" },
            { label: "EU data only", icon: "🔒" },
          ].map(({ label, icon }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(13,79,61,0.18)",
                color: "#4B916D",
                border: "1px solid rgba(75,145,109,0.25)",
              }}
            >
              <span>{icon}</span>
              {label}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3" style={{ maxWidth: 320 }}>
          <Link
            href="/sign-up"
            className="w-full h-14 rounded-2xl text-white text-base font-semibold flex items-center justify-center"
            style={{
              background: "#116dff",
              boxShadow: "0 4px 28px rgba(17,109,255,0.35)",
            }}
          >
            Get started — it&apos;s free
          </Link>
          <Link
            href="/sign-in"
            className="w-full h-12 rounded-2xl text-sm font-medium flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            I already have an account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p
        className="text-center text-xs px-6"
        style={{
          color: "rgba(255,255,255,0.18)",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        Berlin Hack 2026 · Powered by Gemini Live
      </p>
    </main>
  );
}
