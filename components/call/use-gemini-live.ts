"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toolSchemas } from "@/lib/agent/tool-schemas";
import { AudioPipeline, AudioPlayer } from "./audio-pipeline";
import { VideoPipeline } from "./video-pipeline";

export type GeminiLiveState = "idle" | "connecting" | "connected" | "error" | "ended";

export type ToolCallPayload = {
  id: string;
  name: string;
  args: Record<string, unknown>;
};

type UseGeminiLiveOptions = {
  systemPrompt: string;
  onToolCall: (call: ToolCallPayload) => Promise<unknown>;
  onTranscript?: (text: string, role: "user" | "model") => void;
  onStateChange?: (state: GeminiLiveState) => void;
};

const GEMINI_WS_URL =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";

export function useGeminiLive({
  systemPrompt,
  onToolCall,
  onTranscript,
  onStateChange,
}: UseGeminiLiveOptions) {
  const [state, setState] = useState<GeminiLiveState>("idle");
  const [isVideoActive, setIsVideoActive] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioPipelineRef = useRef<AudioPipeline | null>(null);
  const audioPlayerRef = useRef<AudioPlayer | null>(null);
  const videoPipelineRef = useRef<VideoPipeline | null>(null);
  const isMutedRef = useRef(false);
  const stateRef = useRef<GeminiLiveState>("idle");
  const pendingToolCallsRef = useRef<Map<string, ToolCallPayload>>(new Map());
  // Tracks intentional closes so strict-mode cleanup doesn't fire onclose state update
  const intentionalCloseRef = useRef(false);

  const updateState = useCallback(
    (s: GeminiLiveState) => {
      stateRef.current = s;
      setState(s);
      onStateChange?.(s);
    },
    [onStateChange]
  );

  const sendMessage = useCallback((msg: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const sendToolResponse = useCallback(
    (id: string, name: string, result: unknown) => {
      // camelCase throughout — Gemini Live REST/WS API uses camelCase JSON
      sendMessage({
        toolResponse: {
          functionResponses: [{ id, name, response: { result } }],
        },
      });
    },
    [sendMessage]
  );

  const connect = useCallback(
    async (apiKey: string) => {
      intentionalCloseRef.current = false;
      updateState("connecting");

      const url = `${GEMINI_WS_URL}?key=${apiKey}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      const player = new AudioPlayer(24000);
      player.init();
      audioPlayerRef.current = player;

      // Half-duplex mute: silence mic while Lina is speaking to prevent echo
      player.onPlaybackStart = () => {
        isMutedRef.current = true;
      };
      player.onPlaybackEnd = () => {
        isMutedRef.current = false;
      };

      ws.onopen = () => {
        // Available models for this key (verified via ListModels):
        //   gemini-3.1-flash-live-preview
        //   gemini-2.5-flash-native-audio-latest
        sendMessage({
          setup: {
            model: "models/gemini-3.1-flash-live-preview",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: "Aoede" },
                },
              },
            },
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            tools: [{ functionDeclarations: toolSchemas }],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
        });
      };

      ws.onmessage = async (event) => {
        let data: any;
        try {
          const text =
            event.data instanceof Blob ? await event.data.text() : event.data;
          data = JSON.parse(text);
        } catch {
          return;
        }

        console.debug("[GeminiLive]", JSON.stringify(data).slice(0, 200));

        // Setup handshake complete → start mic
        if (data.setupComplete !== undefined) {
          updateState("connected");
          const pipe = new AudioPipeline();
          audioPipelineRef.current = pipe;
          try {
            await pipe.start((base64) => {
              if (!isMutedRef.current) {
                sendMessage({
                  realtimeInput: {
                    audio: { mimeType: "audio/pcm;rate=16000", data: base64 },
                  },
                });
              }
            });
          } catch (e) {
            console.error("[GeminiLive] mic start failed:", e);
            updateState("error");
          }
          return;
        }

        // Audio + transcript output
        if (data.serverContent) {
          const sc = data.serverContent;
          if (sc.modelTurn?.parts) {
            for (const part of sc.modelTurn.parts) {
              if (part.inlineData?.mimeType?.startsWith("audio/")) {
                audioPlayerRef.current?.enqueue(part.inlineData.data);
              }
              if (part.text) onTranscript?.(part.text, "model");
            }
          }
          if (sc.inputTranscription?.text)
            onTranscript?.(sc.inputTranscription.text, "user");
          if (sc.outputTranscription?.text)
            onTranscript?.(sc.outputTranscription.text, "model");
        }

        // Tool calls from model
        if (data.toolCall?.functionCalls) {
          for (const fc of data.toolCall.functionCalls) {
            const call: ToolCallPayload = {
              id: fc.id,
              name: fc.name,
              args: fc.args ?? {},
            };
            pendingToolCallsRef.current.set(fc.id, call);
            try {
              const result = await onToolCall(call);
              sendToolResponse(fc.id, fc.name, result);
            } catch (e) {
              sendToolResponse(fc.id, fc.name, { error: String(e) });
            }
          }
        }

        if (data.goAway) {
          doCleanup();
          updateState("ended");
        }
      };

      ws.onerror = (e) => {
        console.error("[GeminiLive] ws error", e);
        updateState("error");
      };

      ws.onclose = (e) => {
        console.warn("[GeminiLive] ws closed", e.code, e.reason);
        if (!intentionalCloseRef.current && stateRef.current !== "ended") {
          updateState("ended");
        }
        doCleanup();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [systemPrompt, sendMessage, sendToolResponse, updateState, onToolCall, onTranscript]
  );

  const startVideo = useCallback(
    async (videoEl: HTMLVideoElement) => {
      const pipeline = new VideoPipeline();
      videoPipelineRef.current = pipeline;
      await pipeline.start(
        videoEl,
        (base64) => {
          sendMessage({
            realtimeInput: {
              video: { mimeType: "image/jpeg", data: base64 },
            },
          });
        },
        1
      );
      setIsVideoActive(true);
    },
    [sendMessage]
  );

  const stopVideo = useCallback(() => {
    videoPipelineRef.current?.stop();
    videoPipelineRef.current = null;
    setIsVideoActive(false);
  }, []);

  const disconnect = useCallback(() => {
    doCleanup();
    updateState("ended");
  }, [updateState]);

  function doCleanup() {
    intentionalCloseRef.current = true;
    audioPipelineRef.current?.stop();
    audioPlayerRef.current?.stop();
    videoPipelineRef.current?.stop();
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close();
    }
    audioPipelineRef.current = null;
    audioPlayerRef.current = null;
    videoPipelineRef.current = null;
    wsRef.current = null;
  }

  // Cleanup on unmount — intentionalCloseRef prevents onclose from updating state
  useEffect(() => {
    return () => doCleanup();
  }, []);

  return { state, isVideoActive, connect, disconnect, startVideo, stopVideo };
}
