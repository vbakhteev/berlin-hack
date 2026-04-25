"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleGenAI, Modality } from "@google/genai";
import type { Session, LiveServerMessage } from "@google/genai";
import { toolSchemas } from "@/lib/agent/tool-schemas";
import { createAudioCapture, type AudioCapture } from "./audio-capture";
import { createAudioPlayback, type AudioPlayback } from "./audio-playback";
import { createCameraStream, type CameraStream } from "./camera-stream";
import type { ToolCallPayload } from "./types";

export type { ToolCallPayload } from "./types";

export type SessionState = "idle" | "connecting" | "connected" | "ended" | "error";

type UseLiveSessionOptions = {
  systemPrompt: string;
  onToolCall: (call: ToolCallPayload) => Promise<unknown>;
  onTranscript?: (text: string, role: "user" | "model") => void;
  onStateChange?: (state: SessionState) => void;
};

type UseLiveSessionReturn = {
  state: SessionState;
  connect: (apiKey: string) => Promise<void>;
  disconnect: () => void;
  setMuted: (muted: boolean) => void;
  isMuted: boolean;
  startVideo: (videoEl: HTMLVideoElement) => Promise<void>;
  stopVideo: () => void;
  isVideoActive: boolean;
};

export function useLiveSession({
  systemPrompt,
  onToolCall,
  onTranscript,
  onStateChange,
}: UseLiveSessionOptions): UseLiveSessionReturn {
  const [state, setState] = useState<SessionState>("idle");
  const [isMuted, setIsMutedState] = useState(false);
  const [isVideoActive, setIsVideoActiveState] = useState(false);

  // Refs for mutable objects
  const sessionRef = useRef<Session | null>(null);
  const audioCaptureRef = useRef<AudioCapture | null>(null);
  const audioPlaybackRef = useRef<AudioPlayback | null>(null);
  const cameraStreamRef = useRef<CameraStream | null>(null);
  const intentionalCloseRef = useRef(false);
  const manualMuteRef = useRef(false);
  const stateRef = useRef<SessionState>("idle");

  // Callback refs to avoid stale closures
  const onToolCallRef = useRef(onToolCall);
  onToolCallRef.current = onToolCall;
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;

  const updateState = useCallback((s: SessionState) => {
    stateRef.current = s;
    setState(s);
    onStateChangeRef.current?.(s);
  }, []);

  function doCleanup() {
    intentionalCloseRef.current = true;
    audioCaptureRef.current?.stop();
    audioCaptureRef.current = null;
    audioPlaybackRef.current?.close();
    audioPlaybackRef.current = null;
    cameraStreamRef.current?.stop();
    cameraStreamRef.current = null;
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch {
        // ignore close errors
      }
    }
    sessionRef.current = null;
  }

  const connect = useCallback(
    async (apiKey: string) => {
      intentionalCloseRef.current = false;
      updateState("connecting");

      try {
        const ai = new GoogleGenAI({ apiKey });

        // Initialize audio playback before connecting so it's ready for first audio
        const playback = createAudioPlayback();
        await playback.init();
        audioPlaybackRef.current = playback;

        const session = await ai.live.connect({
          model: "gemini-3.1-flash-live-preview",
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Aoede" },
              },
            },
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            tools: [{ functionDeclarations: toolSchemas }],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
          callbacks: {
            onopen: () => {
              console.debug("[LiveSession] WebSocket connected");
            },

            onmessage: (msg: LiveServerMessage) => {
              console.debug(
                "[LiveSession]",
                JSON.stringify(msg).slice(0, 200)
              );

              // Handle server content (audio + transcripts)
              if (msg.serverContent?.modelTurn?.parts) {
                for (const part of msg.serverContent.modelTurn.parts) {
                  if (part.inlineData?.data) {
                    audioPlaybackRef.current?.enqueue(part.inlineData.data);
                  }
                }
              }

              // Handle interruption — clear queued audio
              if (msg.serverContent?.interrupted) {
                audioPlaybackRef.current?.clear();
              }

              // Handle input transcription
              if (msg.serverContent?.inputTranscription?.text) {
                onTranscriptRef.current?.(
                  msg.serverContent.inputTranscription.text,
                  "user"
                );
              }

              // Handle output transcription
              if (msg.serverContent?.outputTranscription?.text) {
                onTranscriptRef.current?.(
                  msg.serverContent.outputTranscription.text,
                  "model"
                );
              }

              // Handle tool calls
              if (msg.toolCall?.functionCalls) {
                for (const fc of msg.toolCall.functionCalls) {
                  const call: ToolCallPayload = {
                    id: fc.id ?? "",
                    name: fc.name ?? "",
                    args: (fc.args as Record<string, unknown>) ?? {},
                  };

                  onToolCallRef
                    .current(call)
                    .then((result) => {
                      sessionRef.current?.sendToolResponse({
                        functionResponses: [
                          {
                            id: fc.id,
                            name: fc.name,
                            response: { result },
                          },
                        ],
                      });
                    })
                    .catch((e) => {
                      sessionRef.current?.sendToolResponse({
                        functionResponses: [
                          {
                            id: fc.id,
                            name: fc.name,
                            response: { error: String(e) },
                          },
                        ],
                      });
                    });
                }
              }

              // Handle goAway — server is about to disconnect
              if (msg.goAway) {
                doCleanup();
                updateState("ended");
              }
            },

            onerror: (e: ErrorEvent) => {
              console.error("[LiveSession] WebSocket error", e);
              if (!intentionalCloseRef.current) {
                updateState("error");
              }
            },

            onclose: (e: CloseEvent) => {
              console.warn("[LiveSession] WebSocket closed", e.code, e.reason);
              if (
                !intentionalCloseRef.current &&
                stateRef.current !== "ended"
              ) {
                updateState("ended");
              }
              doCleanup();
            },
          },
        });

        sessionRef.current = session;

        // Half-duplex mute: silence mic while Lina is speaking to prevent
        // echo from triggering Gemini's VAD and causing false interruptions
        playback.onPlaybackStart = () => {
          audioCaptureRef.current?.setMuted(true);
        };
        playback.onPlaybackEnd = () => {
          if (!manualMuteRef.current) {
            audioCaptureRef.current?.setMuted(false);
          }
        };

        const capture = createAudioCapture();
        capture.onChunk = (base64) => {
          sessionRef.current?.sendRealtimeInput({
            audio: { data: base64, mimeType: "audio/pcm;rate=16000" },
          });
        };
        await capture.start();
        audioCaptureRef.current = capture;

        updateState("connected");
      } catch (e) {
        console.error("[LiveSession] connect failed:", e);
        doCleanup();
        updateState("error");
      }
    },
    [systemPrompt, updateState]
  );

  const disconnect = useCallback(() => {
    doCleanup();
    updateState("ended");
  }, [updateState]);

  const setMuted = useCallback((muted: boolean) => {
    manualMuteRef.current = muted;
    audioCaptureRef.current?.setMuted(muted);
    setIsMutedState(muted);
    if (muted && sessionRef.current) {
      sessionRef.current.sendRealtimeInput({ audioStreamEnd: true });
    }
  }, []);

  const startVideo = useCallback(async (videoEl: HTMLVideoElement) => {
    if (cameraStreamRef.current) return;
    const camera = createCameraStream();
    cameraStreamRef.current = camera;
    camera.onFrame = (base64) => {
      sessionRef.current?.sendRealtimeInput({
        video: { data: base64, mimeType: "image/jpeg" },
      });
    };
    await camera.start(videoEl);
    setIsVideoActiveState(true);
  }, []);

  const stopVideo = useCallback(() => {
    cameraStreamRef.current?.stop();
    cameraStreamRef.current = null;
    setIsVideoActiveState(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => doCleanup();
  }, []);

  return {
    state,
    connect,
    disconnect,
    setMuted,
    isMuted,
    startVideo,
    stopVideo,
    isVideoActive,
  };
}
