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
  VideoOff,
  Mic,
  MicOff,
  Grid3x3,
  UserPlus,
  PhoneOff,
} from "lucide-react";

// AXA demo always uses Max Müller's policies — never the real user's profile
const AXA_DEMO_POLICY_TYPES = ["electronics", "haftpflicht", "hausrat"];

// Inspection capture cadence. Gemini Live's wire format for video is JPEG frames
// (no video/* mime support on realtimeInput), so 3fps is a practical sweet spot
// between visual fidelity for the agent and token cost. Default is 1fps elsewhere.
const INSPECTION_FPS = 3;

// Time (ms) after successful finalize_claim before we auto-hang-up.
// Gives the agent enough time for the 48h closing speech + "Auf Wiederhören."
const POST_FINALIZE_HANGUP_MS = 15_000;

function formatTime(n: number) {
  const m = Math.floor(n / 60)
    .toString()
    .padStart(2, "0");
  const s = (n % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function IosCallScreen({ sessionId }: { sessionId: string }) {
  const router = useRouter();

  const claim = useQuery(api.claims.bySession, { sessionId });
  const currentUser = useQuery(api.users.currentUser);
  const endCallMutation = useMutation(api.claims.endCall);
  const markVisualInspectionDone = useMutation(
    api.claims.markVisualInspectionDone
  );

  const { handleToolCall } = useToolBridge(sessionId);

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  // Optimistic flip the moment the agent calls request_visual_inspection,
  // before the Convex round-trip flips claim.visualInspectionRequested.
  const [optimisticInspectionRequested, setOptimisticInspectionRequested] =
    useState(false);
  const [inspectionHint, setInspectionHint] = useState<string | undefined>();

  const transcriptRef = useRef<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalizedRef = useRef(false);
  const hasConnectedRef = useRef(false);

  // Fetch Gemini token
  useEffect(() => {
    fetch("/api/gemini/ephemeral-token")
      .then((r) => r.json())
      .then((d) => {
        if (d.key) setApiKey(d.key);
      })
      .catch(console.error);
  }, []);

  // Navigate to claim summary (or home if no sessionId)
  const goToSummary = useCallback(() => {
    router.push(`/axa/claim/${sessionId}`);
  }, [router, sessionId]);

  const onToolCall = useCallback(
    async (call: {
      id: string;
      name: string;
      args: Record<string, unknown>;
    }) => {
      // Activate the pulsing video button optimistically — the Convex flag
      // (claim.visualInspectionRequested) takes a round-trip to flip.
      if (call.name === "request_visual_inspection") {
        setOptimisticInspectionRequested(true);
        if (call.args.hint) setInspectionHint(call.args.hint as string);
      }
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
              await endCallMutation({ claimId: claim._id }).catch(
                console.error
              );
            }
            goToSummary();
          }, POST_FINALIZE_HANGUP_MS);
        }
      }

      return result;
    },
    [handleToolCall, claim?._id, endCallMutation, goToSummary]
  );

  const userLanguage = (currentUser?.language ?? "en") as "de" | "en";

  const { state, isVideoActive, connect, disconnect, startVideo, stopVideo } =
    useGeminiLive({
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
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setSeconds(0);
        timerRef.current = setInterval(() => setSeconds((n) => n + 1), 1000);
      }
      if (s === "ended" || s === "error") {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
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
    if (autoEndTimerRef.current) {
      clearTimeout(autoEndTimerRef.current);
      autoEndTimerRef.current = null;
    }
    // Release the camera before tearing down the WS so the MediaRecorder
    // closes cleanly. Do NOT mark inspection completed here — call ending
    // is not the same as the user finishing the inspection.
    if (isVideoActive) {
      await stopVideo().catch(console.error);
    }
    disconnect();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
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

  // Inspection state machine:
  //   button hidden               (no request yet, or already completed)
  //        │ agent: request_visual_inspection
  //        ▼
  //   PULSING green button (animate-ping)
  //        │ user taps
  //        ▼
  //   ┌─────────────────────────────┐
  //   │ getUserMedia → camera ON    │
  //   │ frames @ INSPECTION_FPS → AI│
  //   │ button = solid red (stop)   │
  //   └─────────────────────────────┘
  //        │ user taps stop
  //        ▼
  //   stopVideo() + markVisualInspectionDone() → button hides for rest of call
  const inspectionRequested =
    optimisticInspectionRequested || claim?.visualInspectionRequested;
  const inspectionCompleted = claim?.visualInspectionCompleted ?? false;
  const showInspectionButton =
    inspectionRequested && !inspectionCompleted && state === "connected";

  const handleVideoToggle = async () => {
    if (isVideoActive) {
      await stopVideo().catch(console.error);
      await markVisualInspectionDone({ sessionId }).catch(console.error);
      return;
    }
    if (!videoRef.current) return;
    try {
      await startVideo(videoRef.current, INSPECTION_FPS);
    } catch (e) {
      // Permission denied / camera busy — leave the button in pulse mode so
      // the user can retry. Surface the error to the console for debugging.
      console.error("[IosCallScreen] startVideo failed:", e);
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
      {/* Full-screen camera preview behind iOS controls. Always rendered (not
          display:none) so iOS Safari keeps decoding frames into the canvas
          capture pipeline — display:none pauses the video pipeline on iOS,
          which would feed black JPEGs to Gemini and break visual inspection. */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover z-0 ${
          isVideoActive ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Subtle dark gradient over the camera so iOS chrome stays legible */}
      {isVideoActive && (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      )}

      {/* Status bar area */}
      <div className="relative z-10 h-14" />

      {/* Contact info — hidden once camera is live (FaceTime-style takeover) */}
      {!isVideoActive && (
        <div className="relative z-10 flex-1 flex flex-col items-center px-8 pt-8">
          <div className="w-24 h-24 rounded-full bg-[#3A3A3C] flex items-center justify-center mb-6">
            <span className="text-white text-4xl font-light select-none">
              A
            </span>
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
      )}
      {isVideoActive && <div className="relative z-10 flex-1" />}

      {/* Inspection hint — shown only while the button is pulsing */}
      {showInspectionButton && !isVideoActive && (
        <div className="relative z-10 flex justify-center pb-4 px-6">
          <p className="text-white/90 text-[13px] text-center max-w-xs">
            {inspectionHint ??
              "Tippen Sie auf das Kamera-Symbol, um den Schaden zu zeigen."}
          </p>
        </div>
      )}

      {/* Top action buttons */}
      <div className="relative z-10 flex justify-center gap-10 pb-10">
        <IosTopButton
          label="Lautsprecher"
          active={speakerOn}
          onClick={() => setSpeakerOn((s) => !s)}
        >
          <Volume2 className="w-6 h-6" strokeWidth={1.8} />
        </IosTopButton>

        {showInspectionButton ? (
          <IosTopButton
            label={isVideoActive ? "Kamera aus" : "Kamera"}
            active={isVideoActive}
            pulse={!isVideoActive}
            onClick={handleVideoToggle}
          >
            {isVideoActive ? (
              <VideoOff className="w-6 h-6" strokeWidth={1.8} />
            ) : (
              <Video className="w-6 h-6" strokeWidth={1.8} />
            )}
          </IosTopButton>
        ) : (
          <IosTopButton label="FaceTime" disabled>
            <Video className="w-6 h-6" strokeWidth={1.8} />
          </IosTopButton>
        )}

        <IosTopButton
          label="Stumm"
          active={muted}
          onClick={() => setMuted((m) => !m)}
        >
          {muted ? (
            <MicOff className="w-6 h-6" strokeWidth={1.8} />
          ) : (
            <Mic className="w-6 h-6" strokeWidth={1.8} />
          )}
        </IosTopButton>
      </div>

      {/* Bottom row */}
      <div
        className="relative z-10 flex justify-around items-center px-8"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 32px)",
        }}
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
  label,
  children,
  active,
  disabled,
  pulse,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  pulse?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {pulse && (
          <div className="absolute -inset-1 rounded-full bg-[#34C759]/60 animate-ping" />
        )}
        <button
          onClick={onClick}
          disabled={disabled}
          className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-colors
            ${pulse ? "bg-[#34C759] text-white shadow-[0_0_24px_rgba(52,199,89,0.55)]" : active ? "bg-white text-[#1C1C1E]" : "bg-[#2C2C2E] text-white"}
            ${disabled ? "opacity-35 cursor-not-allowed" : "active:brightness-75"}`}
        >
          {children}
        </button>
      </div>
      <span className="text-[11px] text-[#8E8E93]">{label}</span>
    </div>
  );
}

function IosBottomButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button className="w-16 h-16 rounded-full bg-[#2C2C2E] flex items-center justify-center active:brightness-75 transition-all">
        {children}
      </button>
      <span className="text-[11px] text-[#8E8E93]">{label}</span>
    </div>
  );
}
