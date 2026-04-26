"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useGeminiLive, LINA_VOICES } from "@/components/call/use-gemini-live";
import { useToolBridge } from "@/components/call/use-tool-bridge";
import { buildSystemPrompt } from "@/lib/agent/system-prompt";
import { MOCK_CUSTOMER } from "@/lib/axa/mock-customer";
import {
  Volume2,
  Video,
  Mic,
  MicOff,
  Grid3x3,
  UserPlus,
  PhoneOff,
} from "lucide-react";

// AXA demo always uses Max Müller's policies — never the real user's profile
const AXA_DEMO_POLICY_TYPES = ["electronics", "haftpflicht", "hausrat"];

// Time (ms) after successful finalize_claim before we auto-hang-up.
// Gives the agent enough time for the 48h closing speech + "Auf Wiederhören."
const POST_FINALIZE_HANGUP_MS = 15_000;

function formatTime(n: number) {
  const m = Math.floor(n / 60).toString().padStart(2, "0");
  const s = (n % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function IosCallScreen({ sessionId }: { sessionId: string }) {
  const router = useRouter();

  const claim = useQuery(api.claims.bySession, { sessionId });
  const currentUser = useQuery(api.users.currentUser);
  const endCallMutation = useMutation(api.claims.endCall);

  const { handleToolCall } = useToolBridge(sessionId);

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);

  const transcriptRef = useRef<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalizedRef = useRef(false);
  const hasConnectedRef = useRef(false);

  // Fetch Gemini token
  useEffect(() => {
    fetch("/api/gemini/ephemeral-token")
      .then((r) => r.json())
      .then((d) => { if (d.key) setApiKey(d.key); })
      .catch(console.error);
  }, []);

  // Navigate to claim summary (or home if no sessionId)
  const goToSummary = useCallback(() => {
    router.push(`/axa/claim/${sessionId}`);
  }, [router, sessionId]);

  const onToolCall = useCallback(
    async (call: { id: string; name: string; args: Record<string, unknown> }) => {
      if (call.name === "finalize_claim") {
        call.args.transcriptText = transcriptRef.current.join("\n");
      }

      const result = await handleToolCall(call);

      // Only navigate after a SUCCESSFUL finalize — {ok: false} means agent must keep going
      if (call.name === "finalize_claim" && !finalizedRef.current) {
        const res = result as { ok: boolean } | null;
        if (res?.ok === true) {
          finalizedRef.current = true;
          // Give agent time for closing speech, then auto-hang-up
          autoEndTimerRef.current = setTimeout(async () => {
            disconnect();
            if (claim?._id) {
              await endCallMutation({ claimId: claim._id }).catch(console.error);
            }
            goToSummary();
          }, POST_FINALIZE_HANGUP_MS);
        }
      }

      return result;
    },
    [handleToolCall, claim?._id, endCallMutation, goToSummary]
  );

  const userLanguage = ((currentUser?.language) ?? "de") as "de" | "en";

  const { state, connect, disconnect } = useGeminiLive({
    systemPrompt: currentUser
      ? buildSystemPrompt({
          name: MOCK_CUSTOMER.fullName,
          email: currentUser.email,
          activePolicyTypes: AXA_DEMO_POLICY_TYPES,
          language: userLanguage,
        })
      : "You are Lina, a helpful AXA insurance claims assistant.",
    voiceName: LINA_VOICES[userLanguage],
    onToolCall,
    onTranscript: (text, role) => {
      const prefix = role === "user" ? "[Anrufer]: " : "[AXA]: ";
      const lines = transcriptRef.current;
      const last = lines[lines.length - 1];
      if (last?.startsWith(prefix)) {
        lines[lines.length - 1] = last.trimEnd() + " " + text.trim();
      } else {
        lines.push(prefix + text);
      }
    },
    onStateChange: (s) => {
      if (s === "connected") {
        setSeconds(0);
        timerRef.current = setInterval(() => setSeconds((n) => n + 1), 1000);
      }
      if (s === "ended" || s === "error") {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        // If the WS dropped after a successful finalize (e.g. goAway), navigate to summary
        if (s === "ended" && finalizedRef.current) {
          goToSummary();
        }
      }
    },
  });

  // Auto-connect once key + user are ready
  useEffect(() => {
    if (apiKey && currentUser && state === "idle" && !hasConnectedRef.current) {
      hasConnectedRef.current = true;
      connect(apiKey).catch(console.error);
    }
  }, [apiKey, currentUser, state, connect]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoEndTimerRef.current) clearTimeout(autoEndTimerRef.current);
    };
  }, []);

  const handleEnd = async () => {
    // Cancel pending auto-end timer — user is taking over
    if (autoEndTimerRef.current) { clearTimeout(autoEndTimerRef.current); autoEndTimerRef.current = null; }
    disconnect();
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (claim?._id) {
      await endCallMutation({ claimId: claim._id }).catch(console.error);
    }
    // Go to summary if claim was filed, otherwise back to home
    if (finalizedRef.current) {
      goToSummary();
    } else {
      router.push("/axa");
    }
  };

  const statusLine =
    state === "connecting"
      ? "Verbinde …"
      : state === "connected"
      ? formatTime(seconds)
      : state === "ended"
      ? "Anruf beendet"
      : state === "error"
      ? "Verbindungsfehler"
      : "Klingelt …";

  return (
    <div
      className="fixed inset-0 flex flex-col select-none"
      style={{ backgroundColor: "#1C1C1E" }}
    >
      {/* Status bar area */}
      <div className="h-14" />

      {/* Contact info */}
      <div className="flex-1 flex flex-col items-center px-8 pt-8">
        <div className="w-24 h-24 rounded-full bg-[#3A3A3C] flex items-center justify-center mb-6">
          <span className="text-white text-4xl font-light select-none">A</span>
        </div>

        <p className="text-white text-[28px] font-light tracking-tight text-center">
          AXA Kundenservice
        </p>
        <p className="text-[#8E8E93] text-[15px] mt-1 text-center">
          (Inka) powered by AXA
        </p>
        <p
          className={`text-[17px] mt-6 tabular-nums font-light ${
            state === "error" ? "text-[#FF453A]" : "text-[#8E8E93]"
          }`}
        >
          {statusLine}
        </p>
      </div>

      {/* Top action buttons */}
      <div className="flex justify-center gap-10 pb-10">
        <IosTopButton label="Lautsprecher" active={speakerOn} onClick={() => setSpeakerOn((s) => !s)}>
          <Volume2 className="w-6 h-6" strokeWidth={1.8} />
        </IosTopButton>

        <IosTopButton label="FaceTime" disabled>
          <Video className="w-6 h-6" strokeWidth={1.8} />
        </IosTopButton>

        <IosTopButton label="Stumm" active={muted} onClick={() => setMuted((m) => !m)}>
          {muted
            ? <MicOff className="w-6 h-6" strokeWidth={1.8} />
            : <Mic className="w-6 h-6" strokeWidth={1.8} />}
        </IosTopButton>
      </div>

      {/* Bottom row */}
      <div
        className="flex justify-around items-center px-8"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 32px)" }}
      >
        <IosBottomButton label="Ziffernfeld">
          <Grid3x3 className="w-7 h-7 text-white" strokeWidth={1.8} />
        </IosBottomButton>

        <button
          aria-label="Anruf beenden"
          onClick={handleEnd}
          className="w-20 h-20 rounded-full bg-[#FF3B30] flex items-center justify-center active:scale-95 active:brightness-90 transition-all shadow-lg"
        >
          <PhoneOff className="w-9 h-9 text-white" strokeWidth={2} />
        </button>

        <IosBottomButton label="Anruf hinzufügen">
          <UserPlus className="w-7 h-7 text-white" strokeWidth={1.8} />
        </IosBottomButton>
      </div>
    </div>
  );
}

function IosTopButton({
  label, children, active, disabled, onClick,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-[72px] h-[72px] rounded-full flex items-center justify-center transition-colors
          ${active ? "bg-white text-[#1C1C1E]" : "bg-[#2C2C2E] text-white"}
          ${disabled ? "opacity-35 cursor-not-allowed" : "active:brightness-75"}`}
      >
        {children}
      </button>
      <span className="text-[11px] text-[#8E8E93]">{label}</span>
    </div>
  );
}

function IosBottomButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button className="w-16 h-16 rounded-full bg-[#2C2C2E] flex items-center justify-center active:brightness-75 transition-all">
        {children}
      </button>
      <span className="text-[11px] text-[#8E8E93]">{label}</span>
    </div>
  );
}
