**Agent:** polish
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25

## Mission
Kill the R1/R2/R3 risks from PLAN.md §12. The demo dies if these aren't solved.

## Context
Demo device: iPhone Safari. App: localhost:3002 (will be on Vercel for demo).
Read PLAN.md §12 (Risk Register) before starting.
R1 = iOS Safari Gemini Live compatibility. R2 = echo/feedback loop. R3 = Convex latency on stage.

## Tasks (in priority order)

### 1. R2: Half-duplex mute (CRITICAL)
Open `components/call/use-gemini-live.ts`. Find where `serverContent.modelTurn` boundaries come in from the WebSocket.
When Gemini starts speaking (modelTurn starts), mute the mic input.
When Gemini stops (modelTurn ends / turnComplete), re-enable mic.
This prevents Lina from hearing herself and transcribing her own TTS as user speech.
The `isMutedRef` already exists — wire it to the modelTurn boundaries.

### 2. R3: Optimistic UI for inspection button (CRITICAL)
Open `app/(pages)/claim/[sessionId]/_components/call-view.tsx`.
Find where `showCameraOverlay` state is set. Currently it only shows when `claim.visualInspectionRequested` (Convex subscription).
Add a belt-and-suspenders: when `request_visual_inspection` tool call arrives in `handleToolCall`, set `showCameraOverlay = true` IMMEDIATELY (local state), before the Convex mutation even returns.
This makes the button appear in <50ms on stage instead of waiting for the Convex round-trip.

### 3. R1: iOS Safari AudioWorklet fallback (HIGH)
Open `components/call/audio-pipeline.ts`. Check if AudioWorklet is used.
If yes, add a feature-detect: if `AudioWorklet` is not in `window.AudioContext.prototype` (older iOS), fall back to a `ScriptProcessor`-based pipeline.
If the audio pipeline already has a fallback, verify it works and document it.

### 4. Vercel deploy check (HIGH)
Check `next.config.ts` and `package.json` for any build issues.
Run: `npm run build` (or `bun run build`) — does it compile cleanly?
If there are TypeScript errors, fix them. The build must be green before demo.
After clean build, note what env vars need to be set in Vercel for production:
- `GEMINI_API_KEY`
- `TAVILY_API_KEY` (via Convex env, not Next.js)
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
Write these to `docs/vercel-env-checklist.md`.

### 5. GDPR inline line on call screen (LOW)
In `call-view.tsx`, below the audio orb, add one small line of text:
`"This call is recorded for your claim. Your data stays in the EU."`
Use `text-xs text-muted-foreground text-center`. No modal, no blocker.

## DOD
- [ ] Mic mutes when Lina speaks
- [ ] Inspection button appears optimistically (<50ms)
- [ ] iOS AudioWorklet fallback exists or verified working
- [ ] `npm run build` passes with zero TS errors
- [ ] `docs/vercel-env-checklist.md` written

## Status report
When done, write `docs/agent-messages/2026-04-25-polish-to-konstantin-done.md` with:
- R1/R2/R3 status: fixed / mitigated / still open
- Build output (pass/fail, error count if any)
