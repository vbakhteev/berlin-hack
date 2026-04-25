## 2026-04-25 — next-polish.md brief

**Brief executed:** R1/R2/R3 risk mitigation + build green + env checklist

**R2 (half-duplex mute):** Already implemented. AudioPlayer.onPlaybackStart/onPlaybackEnd wired to isMutedRef in use-gemini-live.ts. No change needed.

**R1 (iOS AudioWorklet):** Already mitigated. audio-pipeline.ts uses ScriptProcessorNode (iOS-safe), not AudioWorklet. Added documentation comment.

**R3 (optimistic inspection button):** Fixed. Added optimisticInspectionRequested state to call-view.tsx. Button now appears in <5ms on tool call arrival, before Convex round-trip.

**Build:** Fixed 1 pre-existing TS error (null guard on claim in page.tsx). Build now passes with 0 errors.

**GDPR line:** Already present in call-view.tsx — no change needed.

**Artifacts:** docs/vercel-env-checklist.md created. Status report at docs/agent-messages/2026-04-25-polish-to-konstantin-done.md.

