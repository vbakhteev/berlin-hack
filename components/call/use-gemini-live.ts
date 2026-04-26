"use client";
// v2
import { useCallback, useEffect, useRef, useState } from "react";
import { toolSchemas } from "@/lib/agent/tool-schemas";
import { AudioPipeline, AudioPlayer } from "./audio-pipeline";
import { VideoPipeline } from "./video-pipeline";

export type GeminiLiveState =
  | "idle"
  | "connecting"
  | "connected"
  | "error"
  | "ended";

export type ToolCallPayload = {
  id: string;
  name: string;
  args: Record<string, unknown>;
};

// Locked voices per language — change only in a dedicated voice-review session, not during bug fixes.
// DE: Charon — deep, flat, monotone. Validated golden state.
// EN: Kore — firm, neutral female. Validated for English calls.
export const LINA_VOICES = {
  de: "Charon",
  en: "Kore",
} as const;

type UseGeminiLiveOptions = {
  systemPrompt: string;
  voiceName?: string;
  onToolCall: (call: ToolCallPayload) => Promise<unknown>;
  onTranscript?: (text: string, role: "user" | "model") => void;
  onStateChange?: (state: GeminiLiveState) => void;
};

const GEMINI_WS_URL =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";

// 200ms of PCM16 silence at 16kHz — used to open the first user turn
// so Gemini generates the proactive greeting.
function makeSilenceB64(ms: number): string {
  const bytes = new Uint8Array(Math.floor((16000 * ms) / 1000) * 2); // zeros
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}
const SILENCE_200MS = makeSilenceB64(200);

export function useGeminiLive({
  systemPrompt,
  voiceName = "Charon",
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
      // Diagnostic: surface the call site when the call ends so we can
      // tell whether it was goAway, ws.onclose, disconnect(), or something else.
      if (s === "ended" || s === "error") {
        console.warn(
          `[GeminiLive] state -> ${s}\n` + new Error().stack
        );
      }
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

      ws.onopen = () => {
        sendMessage({
          setup: {
            model: "models/gemini-3.1-flash-live-preview",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName },
                },
              },
            },
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            tools: [{ functionDeclarations: toolSchemas }],
            // Manual VAD — auto-VAD ignores proactive activityEnd triggers.
            // We implement RMS-based VAD in the mic callback instead.
            realtimeInputConfig: {
              automaticActivityDetection: { disabled: true },
            },
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

        // Truncated debug for noisy audio chunks; full dump for tool/control messages.
        if (data.toolCall || data.goAway || data.serverContent?.turnComplete) {
          console.warn("[GeminiLive] CONTROL MSG", JSON.stringify(data));
        } else {
          console.debug("[GeminiLive]", JSON.stringify(data).slice(0, 200));
        }

        if (data.setupComplete !== undefined) {
          updateState("connected");
          audioPlayerRef.current?.playDialToneAndCrackle();

          // VAD state — shared between mic callback and Lina's playback handlers.
          // enabled starts false: ambient noise must not re-trigger greetings before
          // Lina has spoken. Set to true only after her first turn finishes.
          const vad = {
            active: false,
            enabled: false,
            timer: null as ReturnType<typeof setTimeout> | null,
          };

          // Half-duplex: mute mic while Lina speaks, flush pending user turn if any
          player.onPlaybackStart = () => {
            isMutedRef.current = true;
            if (vad.active) {
              if (vad.timer) {
                clearTimeout(vad.timer);
                vad.timer = null;
              }
              vad.active = false;
              sendMessage({ realtimeInput: { activityEnd: {} } });
            }
          };
          player.onPlaybackEnd = () => {
            isMutedRef.current = false;
            vad.enabled = true; // greeting done — start listening to the caller
          };

          const pipe = new AudioPipeline();
          audioPipelineRef.current = pipe;

          try {
            await pipe.start((base64) => {
              if (isMutedRef.current) return;

              sendMessage({
                realtimeInput: {
                  audio: { mimeType: "audio/pcm;rate=16000", data: base64 },
                },
              });

              // RMS-based VAD — detect speech onset and offset
              const bytes = Uint8Array.from(atob(base64), (c) =>
                c.charCodeAt(0)
              );
              const pcm = new Int16Array(bytes.buffer);
              let sumSq = 0;
              for (let i = 0; i < pcm.length; i++) {
                sumSq += (pcm[i] / 32768) ** 2;
              }
              const rms = Math.sqrt(sumSq / pcm.length);

              if (!vad.enabled) return; // don't trigger turns during greeting sequence

              if (rms > 0.02) {
                // Speech detected
                if (!vad.active) {
                  vad.active = true;
                  sendMessage({ realtimeInput: { activityStart: {} } });
                }
                if (vad.timer) {
                  clearTimeout(vad.timer);
                  vad.timer = null;
                }
              } else if (vad.active && !vad.timer) {
                // Silence after speech — 300ms is enough to distinguish end-of-turn
                // from a natural mid-sentence pause. Gemini processing adds another
                // 500-1500ms so the total felt latency stays conversational.
                vad.timer = setTimeout(() => {
                  vad.active = false;
                  vad.timer = null;
                  sendMessage({ realtimeInput: { activityEnd: {} } });
                }, 300);
              }
            });
          } catch (e) {
            console.error("[GeminiLive] mic start failed:", e);
            updateState("error");
            return;
          }

          // Proactive greeting trigger: simulate caller picking up but not speaking.
          // activityStart → 200ms silence → activityEnd → Gemini greets.
          // 250ms delay lets the server register the audio stream first.
          // firstResponseNotBefore (set in playDialToneAndCrackle) holds playback
          // until ~600ms after the pickup click (~10s), so Lina speaks right on pickup.
          setTimeout(() => {
            sendMessage({ realtimeInput: { activityStart: {} } });
            sendMessage({
              realtimeInput: {
                audio: {
                  mimeType: "audio/pcm;rate=16000",
                  data: SILENCE_200MS,
                },
              },
            });
            setTimeout(() => {
              sendMessage({ realtimeInput: { activityEnd: {} } });
            }, 300);
          }, 250);

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
            }
          }
          if (sc.inputTranscription?.text)
            onTranscript?.(sc.inputTranscription.text, "user");
          if (sc.outputTranscription?.text)
            onTranscript?.(sc.outputTranscription.text, "model");
          // End-of-turn signal — only now is it safe to unmute the mic and
          // re-enable VAD. Without this, transient queue drains during a
          // single turn would fire onPlaybackEnd mid-utterance, unmute the
          // mic, and feed Lina's own audio (post-imperfect-echo-cancel) back
          // through manual VAD as bogus activityStart/End events.
          if (sc.turnComplete || sc.generationComplete || sc.interrupted) {
            audioPlayerRef.current?.markTurnComplete();
          }
        }

        // Tool calls from model
        if (data.toolCall?.functionCalls) {
          // The audio turn is implicitly over once the model invokes a tool —
          // unblock onPlaybackEnd in case turnComplete won't arrive separately.
          audioPlayerRef.current?.markTurnComplete();
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
          console.warn(
            "[GeminiLive] goAway received",
            JSON.stringify(data.goAway)
          );
          // Mark intentional immediately so ws.onclose (which fires right after goAway)
          // doesn't double-trigger updateState("ended") or stop the audio player.
          intentionalCloseRef.current = true;
          // 1000ms head start: in-flight audio chunks from Gemini need time to arrive
          // before we check isBusy. Without this, the gap between utterances reads as
          // isBusy=false and the call terminates while Lina is mid-sentence.
          setTimeout(() => {
            const drainThenCleanup = () => {
              if (audioPlayerRef.current?.isBusy) {
                setTimeout(drainThenCleanup, 150);
              } else {
                doCleanup();
                updateState("ended");
              }
            };
            drainThenCleanup();
          }, 1000);
        }
      };

      ws.onerror = (e) => {
        console.error("[GeminiLive] ws error", e);
        updateState("error");
      };

      ws.onclose = (e) => {
        const wasIntentional = intentionalCloseRef.current;
        console.warn("[GeminiLive] ws closed", {
          code: e.code,
          reason: e.reason,
          wasClean: e.wasClean,
          intentional: wasIntentional,
        });

        if (wasIntentional) {
          // goAway or user disconnect owns cleanup — don't touch audio player
          wsRef.current = null;
          return;
        }

        // Unexpected close: end the call cleanly. We do NOT auto-reconnect:
        // Gemini Live sessions are not resumable by default, so a "reconnect"
        // would open a fresh session with no memory of the prior conversation
        // — the user would experience the call restarting from scratch with
        // a fresh greeting. Better to surface the failure and let them retry.
        if (stateRef.current !== "ended") {
          doCleanup();
          updateState("ended");
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      systemPrompt,
      sendMessage,
      sendToolResponse,
      updateState,
      onToolCall,
      onTranscript,
    ]
  );

  const startVideo = useCallback(
    async (videoEl: HTMLVideoElement, fps: number = 1) => {
      if (videoPipelineRef.current) return;
      const pipeline = new VideoPipeline();
      videoPipelineRef.current = pipeline;
      let frameCount = 0;
      await pipeline.start(
        videoEl,
        (base64) => {
          frameCount += 1;
          // Diagnostic: surface frame size + cadence so we can verify frames
          // aren't black (a real ~640x480 JPEG @ q=0.7 is ~20-40KB; black is ~3KB).
          const kb = Math.round((base64.length * 3) / 4 / 1024);
          if (frameCount <= 3 || frameCount % 10 === 0) {
            console.debug(`[VideoPipeline] frame #${frameCount} sent (~${kb}KB)`);
          }
          sendMessage({
            realtimeInput: {
              video: { mimeType: "image/jpeg", data: base64 },
            },
          });
        },
        fps
      );
      setIsVideoActive(true);
    },
    [sendMessage]
  );

  const stopVideo = useCallback(async () => {
    const result = videoPipelineRef.current
      ? await videoPipelineRef.current.stopAndGetBlob()
      : null;
    videoPipelineRef.current = null;
    setIsVideoActive(false);
    return result;
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
    setIsVideoActive(false);
  }

  useEffect(() => {
    return () => doCleanup();
  }, []);

  return { state, isVideoActive, connect, disconnect, startVideo, stopVideo };
}
