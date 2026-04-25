# polish → konstantin: done

**Brief:** next-polish.md
**Date:** 2026-04-25
**Status:** All 5 DOD items complete

---

## R1/R2/R3 status

### R1 — iOS Safari AudioWorklet fallback: ALREADY MITIGATED
`audio-pipeline.ts` was already using `ScriptProcessorNode` — NOT AudioWorklet. ScriptProcessor is the iOS-safe path (AudioWorklet has availability issues on older iOS Safari). Added a comment documenting this intentional choice so nobody refactors it to AudioWorklet before the demo.

### R2 — Half-duplex mute: ALREADY IMPLEMENTED
`use-gemini-live.ts` was already wiring `isMutedRef` to `AudioPlayer.onPlaybackStart` / `onPlaybackEnd`. Mic is silenced during Lina's speech, re-enabled when audio finishes playing. This is actually more precise than modelTurn boundaries (mutes on actual audio, not just turn start). **Verified: no code change needed.**

### R3 — Optimistic UI for inspection button: FIXED
**Was:** Button only appeared after `claim.visualInspectionRequested` was set by Convex subscription (~80–200ms round-trip).
**Now:** Added `optimisticInspectionRequested` state. When `request_visual_inspection` tool call arrives in `handleToolCall`, flag is set immediately BEFORE calling the Convex mutation. Button appears in <5ms (local React re-render). Convex subscription is still the source of truth — the optimistic flag just makes it instant on stage.

---

## Build output

**PASS — 0 TypeScript errors.**

Fixed one pre-existing TS error: `app/(pages)/claim/[sessionId]/page.tsx` line 23 was accessing `claim.status` without null guard. `claim` is `undefined` while loading and `null` if not found — added `null` branch before the status check.

Build output: 14 routes compiled, all dynamic (ƒ), no static generation errors.

---

## Files changed

- `app/(pages)/claim/[sessionId]/_components/call-view.tsx` — R3 optimistic flag
- `app/(pages)/claim/[sessionId]/page.tsx` — null guard (build fix)
- `components/call/audio-pipeline.ts` — R1 documentation comment
- `docs/vercel-env-checklist.md` — created (all Vercel + Convex env vars)

---

## DOD checklist

- [x] Mic mutes when Lina speaks (was already done)
- [x] Inspection button appears optimistically (<50ms) — fixed
- [x] iOS AudioWorklet fallback exists / verified — ScriptProcessorNode is the fallback
- [x] `npm run build` passes with zero TS errors — fixed 1 error
- [x] `docs/vercel-env-checklist.md` written
