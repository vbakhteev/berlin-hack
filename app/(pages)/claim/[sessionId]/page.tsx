"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { AudioOrb } from "./_components/audio-orb";
import { ClaimCardLive } from "./_components/claim-card-live";
import { InspectionOverlay } from "./_components/inspection-overlay";
import { useGeminiLive } from "@/components/call/use-gemini-live";
import { useToolBridge } from "@/components/call/use-tool-bridge";
import { buildSystemPrompt } from "@/lib/agent/system-prompt";
import { Button } from "@/components/ui/button";

type PageProps = { params: Promise<{ sessionId: string }> };

export default function CallPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const router = useRouter();

  const claim = useQuery(api.claims.bySession, { sessionId });
  const currentUser = useQuery(api.users.currentUser);
  const policies = useQuery(api.policies.byUser);
  const runTavilyAction = useAction(api.tavily.researchReplacementPrice);

  const { handleToolCall } = useToolBridge(sessionId);

  const [transcript, setTranscript] = useState<{ role: string; text: string }[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inspectionHint, setInspectionHint] = useState<string | undefined>();
  const [hasConnected, setHasConnected] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [showCameraOverlay, setShowCameraOverlay] = useState(false);

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
      // Store inspection hint locally for overlay
      if (call.name === "request_visual_inspection" && call.args.hint) {
        setInspectionHint(call.args.hint as string);
      }
      const result = await handleToolCall(call);

      // After finalize, trigger Tavily and redirect
      if (call.name === "finalize_claim" && claim?._id) {
        runTavilyAction({ claimId: claim._id }).catch(console.error);
        setTimeout(() => router.push(`/claim/${sessionId}/confirm`), 2000);
      }

      return result;
    },
    [handleToolCall, claim?._id, sessionId, router, runTavilyAction]
  );

  const { state, isVideoActive, connect, disconnect, startVideo, stopVideo } = useGeminiLive({
    systemPrompt:
      currentUser && policies
        ? buildSystemPrompt(
            { name: currentUser.name, email: currentUser.email },
            policies.map((p) => ({
              type: p.type,
              insurer: p.insurer,
              policyNumber: p.policyNumber,
              coverageSummary: p.coverageSummary,
              deductibleEur: p.deductibleEur,
              depreciationRule: p.depreciationRule,
              requiresVisualInspection: p.requiresVisualInspection,
              exclusions: p.exclusions,
            }))
          )
        : "You are Lina, a helpful insurance claims assistant.",
    onToolCall,
    onTranscript: (text, role) => {
      setTranscript((prev) => [...prev.slice(-20), { role, text }]);
      if (role === "model") setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    },
    onStateChange: (s) => {
      if (s === "connected") setHasConnected(true);
    },
  });

  // Auto-connect once API key and system prompt data are ready
  useEffect(() => {
    if (apiKey && currentUser && policies !== undefined && !hasConnected && state === "idle") {
      connect(apiKey);
    }
  }, [apiKey, currentUser, policies, hasConnected, state, connect]);

  const handleEndCall = () => {
    disconnect();
    if (claim?._id && claim.stage !== "closed") {
      router.push(`/claim/${sessionId}/confirm`);
    } else {
      router.push("/dashboard");
    }
  };

  const inspectionRequested = claim?.visualInspectionRequested && !showCameraOverlay;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Visual inspection overlay — its internal videoRef is passed to startVideo */}
      <InspectionOverlay
        isActive={showCameraOverlay}
        hint={inspectionHint}
        onStartCamera={startVideo}
        onStop={() => { stopVideo(); setShowCameraOverlay(false); }}
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
              className="w-full h-16 text-base font-semibold bg-primary"
              onClick={() => setShowCameraOverlay(true)}
            >
              Start visual inspection
            </Button>
          </div>
        </div>
      )}

      {/* Main call UI */}
      <div className="flex flex-col flex-1 p-4 pb-8 max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between py-3 mb-2">
          <div>
            <p className="text-xs text-muted-foreground">
              {tokenError
                ? "GEMINI_API_KEY not set — add it to .env.local"
                : state === "connecting"
                ? "Connecting to Lina…"
                : state === "connected"
                ? "Connected · Lina is listening"
                : state === "ended"
                ? "Call ended"
                : state === "error"
                ? "Connection error"
                : "Initializing…"}
            </p>
          </div>
          <Button
            size="sm"
            variant={state === "connected" ? "destructive" : "outline"}
            onClick={handleEndCall}
            className="text-xs"
          >
            {state === "connected" ? "End call" : "Back"}
          </Button>
        </div>

        {/* Audio orb — centered */}
        <div className="flex justify-center py-8">
          <AudioOrb state={state} isSpeaking={isSpeaking} />
        </div>

        {/* Recording consent line */}
        <p className="text-xs text-center text-muted-foreground mb-4">
          This call is recorded for your claim. Your data stays in the EU.
        </p>

        {/* Live claim card */}
        <ClaimCardLive claim={claim} />

        {/* Last transcript line */}
        {transcript.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-muted text-xs">
            <span className="text-muted-foreground font-medium">
              {transcript[transcript.length - 1].role === "model" ? "Lina: " : "You: "}
            </span>
            {transcript[transcript.length - 1].text}
          </div>
        )}
      </div>
    </main>
  );
}
