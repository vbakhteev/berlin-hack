"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { AudioOrb } from "./audio-orb";
import { ClaimCardLive } from "./claim-card-live";
import { InspectionOverlay } from "./inspection-overlay";
import { useGeminiLive, LINA_VOICES } from "@/components/call/use-gemini-live";
import { useToolBridge } from "@/components/call/use-tool-bridge";
import { buildSystemPrompt } from "@/lib/agent/system-prompt";
import { Button } from "@/components/ui/button";

export function CallView({
  sessionId,
  onCallConcluded,
}: {
  sessionId: string;
  onCallConcluded?: () => void;
}) {
  const router = useRouter();

  const claim = useQuery(api.claims.bySession, { sessionId });
  const currentUser = useQuery(api.users.currentUser);
  const runTavilyAction = useAction(api.tavily.researchReplacementPrice);

  const { handleToolCall } = useToolBridge(sessionId);
  const saveGpsLocation = useMutation(api.claims.saveGpsLocation);
  const endCallMutation = useMutation(api.claims.endCall);
  const generateUploadUrl = useMutation(api.uploads.generateUploadUrl);
  const attachMedia = useMutation(api.claims.attachMedia);

  const transcriptLinesRef = useRef<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ambientRef = useRef<{
    ctx: AudioContext;
    source: AudioBufferSourceNode;
  } | null>(null);
  const [gpsCoords, setGpsCoords] = useState<GeolocationCoordinates | null>(
    null
  );
  const [inspectionHint, setInspectionHint] = useState<string | undefined>();
  const [hasConnected, setHasConnected] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [showCameraOverlay, setShowCameraOverlay] = useState(false);
  // R3 belt-and-suspenders: show inspection button immediately on tool call, before Convex round-trip
  const [optimisticInspectionRequested, setOptimisticInspectionRequested] =
    useState(false);
  const finalizeSucceededRef = useRef(false);

  // Request location permission before the call starts
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setGpsCoords(pos.coords),
      () => {}, // user denied — proceed without GPS
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Fetch Gemini API key
  useEffect(() => {
    fetch("/api/gemini/ephemeral-token")
      .then((r) => {
        if (!r.ok) throw new Error(`Token fetch failed: ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (d.key) setApiKey(d.key);
        else throw new Error(d.error ?? "No key returned");
      })
      .catch((e) => {
        console.error("Gemini token error:", e);
        setTokenError(String(e));
      });
  }, []);

  const startAmbient = useCallback(() => {
    const ctx = new AudioContext();
    const rate = ctx.sampleRate;
    const len = rate * 4;
    const buf = ctx.createBuffer(1, len, rate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const hum =
        Math.sin(2 * Math.PI * 60 * (i / rate)) * 0.007 +
        Math.sin(2 * Math.PI * 120 * (i / rate)) * 0.003;
      data[i] = hum + (Math.random() * 2 - 1) * 0.005;
    }
    const fade = Math.min(400, len / 4);
    for (let i = 0; i < fade; i++) {
      data[i] *= i / fade;
      data[len - 1 - i] *= i / fade;
    }
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 180;
    const gain = ctx.createGain();
    gain.gain.value = 1.0;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.loop = true;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    ambientRef.current = { ctx, source };
  }, []);

  const stopAmbient = useCallback(() => {
    try {
      ambientRef.current?.source.stop();
    } catch {}
    ambientRef.current?.ctx.close().catch(() => {});
    ambientRef.current = null;
  }, []);

  const onToolCall = useCallback(
    async (call: {
      id: string;
      name: string;
      args: Record<string, unknown>;
    }) => {
      // Store inspection hint + show button optimistically BEFORE Convex round-trip (R3 mitigation)
      if (call.name === "request_visual_inspection") {
        setOptimisticInspectionRequested(true);
        if (call.args.hint) setInspectionHint(call.args.hint as string);
      }
      // Inject accumulated transcript so the bridge can persist it
      if (call.name === "finalize_claim") {
        call.args.transcriptText = transcriptLinesRef.current.join("\n");
      }
      const result = await handleToolCall(call);

      // After finalize: trigger Tavily. Switch to ReviewView only after call ends
      // (onStateChange "ended") to avoid cutting Lina off mid-sentence.
      if (call.name === "finalize_claim" && claim?._id) {
        const ok = !(result as any)?.error;
        if (ok) {
          finalizeSucceededRef.current = true;
          runTavilyAction({ claimId: claim._id }).catch(console.error);
        }
      }

      return result;
    },
    [handleToolCall, claim?._id, sessionId, router, runTavilyAction]
  );

  const userLanguage = (currentUser?.language ?? "en") as "de" | "en";

  const { state, isVideoActive, connect, disconnect, startVideo, stopVideo } =
    useGeminiLive({
      systemPrompt: currentUser
        ? buildSystemPrompt({
            name: currentUser.name,
            email: currentUser.email,
            activePolicyTypes: currentUser.activePolicyTypes ?? [],
            language: userLanguage,
          })
        : "You are Lina, a helpful insurance claims assistant.",
      voiceName: LINA_VOICES[userLanguage],
      onToolCall,
      onTranscript: (text, role) => {
        const prefix = role === "user" ? "[User]: " : "[Lina]: ";
        const lines = transcriptLinesRef.current;
        const last = lines[lines.length - 1];
        if (last?.startsWith(prefix)) {
          lines[lines.length - 1] = last.trimEnd() + " " + text.trim();
        } else {
          lines.push(prefix + text);
        }
        if (role === "model") setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 2000);
      },
      onStateChange: (s) => {
        if (s === "connected") {
          setHasConnected(true);
          setCallSeconds(0);
          timerRef.current = setInterval(
            () => setCallSeconds((n) => n + 1),
            1000
          );
          startAmbient();
        }
        if (s === "ended" || s === "error") {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          stopAmbient();
          // Only switch to ReviewView if finalize_claim succeeded during this call
          if (s === "ended" && finalizeSucceededRef.current) {
            onCallConcluded?.();
          }
        }
      },
    });

  // Stop ambient on unmount (e.g. navigation away mid-call)
  useEffect(
    () => () => {
      stopAmbient();
    },
    [stopAmbient]
  );

  // Auto-connect removed — iOS Safari requires getUserMedia to be triggered
  // by a direct user gesture. connect() is called from the "Start call" button.

  const handleEndCall = async () => {
    // Flush any in-progress inspection recording before disconnecting
    if (showCameraOverlay) await handleStopCamera();
    disconnect();
    if (claim?._id && gpsCoords) {
      await saveGpsLocation({
        claimId: claim._id,
        latitude: gpsCoords.latitude,
        longitude: gpsCoords.longitude,
        accuracyMeters: gpsCoords.accuracy,
      }).catch(console.error);
    }
    if (claim?._id) {
      await endCallMutation({ claimId: claim._id }).catch(console.error);
      // page.tsx reacts to status change via Convex real-time query
    } else {
      router.push("/axa");
    }
  };

  const handleStopCamera = useCallback(async () => {
    const recording = await stopVideo();
    setShowCameraOverlay(false);
    if (recording && claim?._id) {
      try {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": recording.blob.type || "video/webm" },
          body: recording.blob,
        });
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        const { storageId } = await res.json();
        if (!storageId) throw new Error("Upload response missing storageId");
        await attachMedia({
          claimId: claim._id,
          storageId,
          kind: "damage_video",
          durationSec: recording.durationSec,
        });
      } catch (e) {
        console.error("[CallView] video upload failed:", e);
      }
    }
  }, [stopVideo, claim?._id, generateUploadUrl, attachMedia]);

  const inspectionRequested =
    (claim?.visualInspectionRequested || optimisticInspectionRequested) &&
    !showCameraOverlay;

  const handleStartCall = () => {
    if (apiKey) connect(apiKey);
  };

  const statusText = tokenError
    ? "GEMINI_API_KEY not set — add it to .env.local"
    : state === "idle" && apiKey && currentUser
      ? "Ready — tap Start call"
      : state === "connecting"
        ? "Connecting to Lina…"
        : state === "connected"
          ? "Connected · Lina is listening"
          : state === "ended"
            ? "Call ended"
            : state === "error"
              ? "Connection error"
              : "Initializing…";

  return (
    <main
      className={`min-h-[100dvh] bg-background flex flex-col ${state === "connecting" || state === "connected" ? "overflow-hidden" : "overflow-x-hidden"}`}
    >
      {/* Visual inspection overlay */}
      <InspectionOverlay
        isActive={showCameraOverlay}
        hint={inspectionHint}
        onStartCamera={startVideo}
        onStop={handleStopCamera}
        onEndCall={handleEndCall}
      />

      {/* Upper: status + orb + claim card */}
      <div className="flex flex-col flex-1 px-4 pt-4 max-w-lg mx-auto w-full min-w-0">
        {/* Status line */}
        <div className="py-3 mb-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{statusText}</p>
          {state === "connected" && (
            <p className="text-xs font-mono text-muted-foreground tabular-nums">
              {String(Math.floor(callSeconds / 60)).padStart(2, "0")}:
              {String(callSeconds % 60).padStart(2, "0")}
            </p>
          )}
        </div>

        {/* Audio orb — upper half */}
        <div className="flex justify-center py-8">
          <AudioOrb state={state} isSpeaking={isSpeaking} />
        </div>

        {/* Recording consent line */}
        <p className="text-xs text-center text-muted-foreground mb-4">
          This call is recorded for your claim. Your data stays in the EU.
        </p>

        {/* Live claim card */}
        <div className="flex-1 min-w-0">
          <ClaimCardLive claim={claim} />
        </div>
      </div>

      {/* Bottom CTA — min 48px, clears iPhone home indicator */}
      <div
        className="px-4 pt-4 max-w-lg mx-auto w-full"
        style={{
          paddingBottom: "calc(40px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <Button
          size="lg"
          className="w-full h-14 text-base"
          variant={
            state === "connected"
              ? "destructive"
              : state === "idle" && !!apiKey && !!currentUser
                ? "default"
                : "outline"
          }
          disabled={
            state === "connecting" ||
            (!tokenError && (!apiKey || !currentUser) && state === "idle")
          }
          onClick={
            state === "idle" && !!apiKey && !!currentUser
              ? handleStartCall
              : handleEndCall
          }
        >
          {state === "connected"
            ? "End call"
            : state === "idle" && !!apiKey && !!currentUser
              ? "Start call"
              : state === "connecting"
                ? "Connecting…"
                : "Back"}
        </Button>
      </div>
    </main>
  );
}
