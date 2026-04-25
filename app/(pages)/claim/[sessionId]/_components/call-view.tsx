"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { AudioOrb } from "./audio-orb";
import { ClaimCardLive } from "./claim-card-live";
import { InspectionOverlay } from "./inspection-overlay";
import { useGeminiLive } from "@/components/call/use-gemini-live";
import { useToolBridge } from "@/components/call/use-tool-bridge";
import { buildSystemPrompt } from "@/lib/agent/system-prompt";
import { Button } from "@/components/ui/button";

export function CallView({ sessionId }: { sessionId: string }) {
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
  const [gpsCoords, setGpsCoords] = useState<GeolocationCoordinates | null>(null);
  const [inspectionHint, setInspectionHint] = useState<string | undefined>();
  const [hasConnected, setHasConnected] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [showCameraOverlay, setShowCameraOverlay] = useState(false);
  // R3 belt-and-suspenders: show inspection button immediately on tool call, before Convex round-trip
  const [optimisticInspectionRequested, setOptimisticInspectionRequested] = useState(false);

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

  const onToolCall = useCallback(
    async (call: { id: string; name: string; args: Record<string, unknown> }) => {
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

      // After finalize, trigger Tavily and redirect
      if (call.name === "finalize_claim" && claim?._id) {
        runTavilyAction({ claimId: claim._id }).catch(console.error);
        setTimeout(() => router.push(`/claim/${sessionId}`), 2000);
      }

      return result;
    },
    [handleToolCall, claim?._id, sessionId, router, runTavilyAction]
  );

  const { state, isVideoActive, connect, disconnect, startVideo, stopVideo } = useGeminiLive({
    systemPrompt:
      currentUser
        ? buildSystemPrompt({
            name: currentUser.name,
            email: currentUser.email,
            activePolicyTypes: currentUser.activePolicyTypes ?? [],
          })
        : "You are Lina, a helpful insurance claims assistant.",
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
      if (s === "connected") setHasConnected(true);
    },
  });

  // Auto-connect once API key and system prompt data are ready
  useEffect(() => {
    if (apiKey && currentUser && !hasConnected && state === "idle") {
      connect(apiKey);
    }
  }, [apiKey, currentUser, hasConnected, state, connect]);

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
      router.push("/dashboard");
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

  const inspectionRequested = (claim?.visualInspectionRequested || optimisticInspectionRequested) && !showCameraOverlay;

  const statusText = tokenError
    ? "GEMINI_API_KEY not set — add it to .env.local"
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
    <main className="min-h-[100dvh] bg-background flex flex-col overflow-x-hidden">
      {/* Visual inspection overlay */}
      <InspectionOverlay
        isActive={showCameraOverlay}
        hint={inspectionHint}
        onStartCamera={startVideo}
        onStop={handleStopCamera}
        onEndCall={handleEndCall}
      />

      {/* Inspection button overlay (appears when tool fires but camera not yet open) */}
      {inspectionRequested && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-end p-6">
          <div className="w-full max-w-lg mx-auto space-y-4">
            <p className="text-white text-center font-medium">
              {inspectionHint ?? "Show the damage to Lina"}
            </p>
            <Button
              size="lg"
              className="w-full h-14 text-base font-semibold bg-primary"
              onClick={() => setShowCameraOverlay(true)}
            >
              Start visual inspection
            </Button>
          </div>
        </div>
      )}

      {/* Upper: status + orb + claim card */}
      <div className="flex flex-col flex-1 px-4 pt-4 max-w-lg mx-auto w-full min-w-0">
        {/* Status line */}
        <div className="py-3 mb-2">
          <p className="text-xs text-muted-foreground">{statusText}</p>
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

      {/* Bottom CTA — min 48px, inside bottom 60% of viewport */}
      <div className="px-4 pb-10 pt-4 max-w-lg mx-auto w-full">
        <Button
          size="lg"
          className="w-full h-14 text-base"
          variant={state === "connected" ? "destructive" : "outline"}
          onClick={handleEndCall}
        >
          {state === "connected" ? "End call" : "Back"}
        </Button>
      </div>
    </main>
  );
}
