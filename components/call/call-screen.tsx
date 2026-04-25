"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useLiveSession } from "@/components/call/use-live-session";
import { useToolBridge } from "@/components/call/use-tool-bridge";
import { buildSystemPrompt } from "@/lib/agent/system-prompt";
import { ClaimCardLive } from "@/app/(pages)/claim/[sessionId]/_components/claim-card-live";
import { AudioOrb } from "@/app/(pages)/claim/[sessionId]/_components/audio-orb";
import { CameraIcon, MicIcon, MicOffIcon, PhoneOffIcon } from "lucide-react";

interface CallScreenProps {
  sessionId: string;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function CallScreen({ sessionId }: CallScreenProps) {
  const router = useRouter();

  const claim = useQuery(api.claims.bySession, { sessionId });
  const currentUser = useQuery(api.users.currentUser);
  const runTavilyAction = useAction(api.tavily.researchReplacementPrice);

  const { handleToolCall } = useToolBridge(sessionId);
  const saveGpsLocation = useMutation(api.claims.saveGpsLocation);
  const endCallMutation = useMutation(api.claims.endCall);

  const transcriptLinesRef = useRef<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<GeolocationCoordinates | null>(
    null
  );
  const [showVideoButton, setShowVideoButton] = useState(false);
  const [inspectionHint, setInspectionHint] = useState<string | undefined>();
  const [hasConnected, setHasConnected] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setGpsCoords(pos.coords),
      () => {},
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    fetch("/api/gemini/ephemeral-token")
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (d.key) setApiKey(d.key);
        else throw new Error(d.error ?? "No key");
      })
      .catch((e) => {
        console.error("Token error:", e);
        setTokenError(String(e));
      });
  }, []);

  const onToolCall = useCallback(
    async (call: {
      id: string;
      name: string;
      args: Record<string, unknown>;
    }) => {
      if (call.name === "request_visual_inspection") {
        setShowVideoButton(true);
        if (call.args.hint) setInspectionHint(call.args.hint as string);
      }
      if (call.name === "finalize_claim") {
        call.args.transcriptText = transcriptLinesRef.current.join("\n");
      }
      const result = await handleToolCall(call);
      if (call.name === "finalize_claim" && claim?._id) {
        runTavilyAction({ claimId: claim._id }).catch(console.error);
        setTimeout(() => router.push(`/claim/${sessionId}`), 2000);
      }
      return result;
    },
    [handleToolCall, claim?._id, sessionId, router, runTavilyAction]
  );

  const {
    state,
    isVideoActive,
    connect,
    disconnect,
    startVideo,
    stopVideo,
    setMuted,
    isMuted,
  } = useLiveSession({
    systemPrompt: currentUser
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

  useEffect(() => {
    if (state !== "connected") return;
    const start = Date.now();
    const timer = setInterval(
      () => setCallDuration(Math.floor((Date.now() - start) / 1000)),
      1000
    );
    return () => clearInterval(timer);
  }, [state]);

  const handleEndCall = async () => {
    if (isVideoActive) stopVideo();
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
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${isVideoActive ? "" : "hidden"}`}
        autoPlay
        playsInline
        muted
      />
      {!isVideoActive && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
      )}

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        {!isVideoActive && (
          <>
            <p className="text-white/60 text-sm font-medium">Lina</p>
            <p className="text-white/40 text-xs mt-1">
              {state === "connected"
                ? formatDuration(callDuration)
                : state === "connecting"
                  ? "Connecting…"
                  : state === "idle"
                    ? "Ready"
                    : state === "ended"
                      ? "Call ended"
                      : state === "error"
                        ? "Connection error"
                        : ""}
            </p>
            <div className="mt-8">
              <AudioOrb state={state} isSpeaking={isSpeaking} />
            </div>
            <p className="text-white/30 text-xs mt-4">
              This call is recorded for your claim
            </p>

            {state === "connected" && (
              <div className="mt-6 w-full max-w-sm">
                <ClaimCardLive claim={claim} />
              </div>
            )}
          </>
        )}

        {(showVideoButton || claim?.visualInspectionRequested) &&
          !isVideoActive && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 mt-8 max-w-sm">
              <p className="text-white text-sm text-center">
                {inspectionHint || "Tap the camera button to show the damage"}
              </p>
            </div>
          )}
      </div>

      <div
        className="relative z-20"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px))" }}
      >
        {state === "idle" ? (
          <div className="flex justify-center py-8">
            <button
              onClick={() => apiKey && connect(apiKey)}
              disabled={!apiKey || !currentUser}
              className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center disabled:opacity-50"
            >
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-6 py-6 px-4 bg-black/30 backdrop-blur-xl">
            <button
              onClick={() => setMuted(!isMuted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isMuted ? "bg-white" : "bg-white/20"
              }`}
            >
              {isMuted ? (
                <MicOffIcon className="text-black" />
              ) : (
                <MicIcon className="text-white" />
              )}
            </button>

            <button
              onClick={handleEndCall}
              className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center"
            >
              <PhoneOffIcon className="text-white" />
            </button>

            {(showVideoButton || claim?.visualInspectionRequested) && (
              <div className="relative">
                {!isVideoActive && (
                  <div className="absolute -inset-1 rounded-full bg-green-500/50 animate-ping" />
                )}
                <button
                  onClick={() => {
                    if (isVideoActive) {
                      stopVideo();
                    } else if (videoRef.current) {
                      startVideo(videoRef.current);
                    }
                  }}
                  className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                    isVideoActive ? "bg-blue-500" : "bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                  }`}
                >
                  <CameraIcon className="text-white" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
