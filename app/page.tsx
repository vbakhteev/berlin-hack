import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/axa");

  return (
    <main className="min-h-[100dvh] bg-white flex flex-col">
      {/* Header */}
      <header
        className="flex items-center justify-between px-6"
        style={{ paddingTop: "calc(20px + env(safe-area-inset-top, 0px))" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-sm rotate-45 bg-green-700" />
          <span className="font-bold text-lg tracking-tight text-black">Inca</span>
        </div>
        <Link href="/sign-in" className="text-sm font-medium text-green-700">
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* How it works — 3-step visual */}
        <div className="flex items-center gap-2 mb-10 w-full max-w-xs">
          <Step icon="🎙" label="Talk to Lina" />
          <div className="flex-1 h-px bg-gray-200" />
          <Step icon="📷" label="Show damage" />
          <div className="flex-1 h-px bg-gray-200" />
          <Step icon="✓" label="Get payout" green />
        </div>

        {/* Copy */}
        <div className="text-center" style={{ maxWidth: 320 }}>
          <p
            className="text-xs font-semibold uppercase text-gray-400 mb-4"
            style={{ letterSpacing: "0.14em" }}
          >
            AI-powered insurance claims
          </p>
          <h1
            className="font-bold leading-tight text-black mb-4"
            style={{ fontSize: "2rem", letterSpacing: "-0.02em" }}
          >
            File a claim in{" "}
            <span className="text-green-700">90 seconds.</span>
          </h1>
          <p className="text-sm leading-relaxed text-gray-500 mb-8">
            Talk to Lina. Show the damage. Walk away knowing your deductible,
            depreciation, and expected payout — before uploading a single
            document.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["Voice-first FNOL", "Instant estimate", "EU data only"].map((label) => (
            <span
              key={label}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-800"
            >
              {label}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3" style={{ maxWidth: 320 }}>
          <Link
            href="/sign-up"
            className="w-full h-14 rounded-2xl bg-green-700 hover:bg-green-800 text-white text-base font-semibold flex items-center justify-center transition-colors"
          >
            Get started — it&apos;s free
          </Link>
          <Link
            href="/sign-in"
            className="w-full h-12 rounded-2xl bg-gray-100 text-gray-700 text-sm font-medium flex items-center justify-center transition-colors hover:bg-gray-200"
          >
            I already have an account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p
        className="text-center text-xs text-gray-400 px-6"
        style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
      >
        Berlin Hack 2026 · Powered by Gemini Live
      </p>
    </main>
  );
}

function Step({
  icon,
  label,
  green,
}: {
  icon: string;
  label: string;
  green?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-base ${
          green ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        {icon}
      </div>
      <span className={`text-[10px] font-medium ${green ? "text-green-700" : "text-gray-400"}`}>
        {label}
      </span>
    </div>
  );
}
