**Agent:** frontend
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25

## Mission
Fix mobile Safari specifics so the demo works flawlessly on an iPhone. Fabian is testing on his iPhone right now — these are the known iOS pain points.

## Context
App runs on localhost:3002 (will be Vercel for demo). Demo device: iPhone Safari.
Vbakhteev pushed video recording + new claim statuses today — build is green.

## Tasks

### 1. Safe area insets on call screen (CRITICAL)
Open `app/(pages)/claim/[sessionId]/_components/call-view.tsx`.
The bottom CTA buttons must clear the iPhone home indicator.
Add `pb-safe` or `padding-bottom: env(safe-area-inset-bottom)` to the bottom button container.
Also check `inspection-overlay.tsx` — the full-screen camera overlay needs the same treatment.

### 2. Viewport height fix for iOS Safari (CRITICAL)
iOS Safari's 100vh includes the browser chrome — content gets cut off.
Find any `min-h-screen` or `h-screen` usage in the call screen components.
Replace with `min-h-[100dvh]` (dynamic viewport height — supported on iOS 15.4+).
Check: `call-view.tsx`, `inspection-overlay.tsx`, `review-view.tsx`.

### 3. Audio permission prompt timing (HIGH)
On iOS Safari, `getUserMedia` for mic must be triggered by a direct user gesture.
Open `call-view.tsx`. Find where the Gemini Live connection starts.
Make sure the mic access is requested only AFTER the user taps "Start call" — not on page load.
If there's any `useEffect` that calls `getUserMedia` automatically, move it behind the tap handler.

### 4. Prevent scroll during call (MEDIUM)
When the call screen is active, the page should not scroll (it looks broken on mobile).
Add `overflow-hidden` to the call screen root element while a call is in `"call"` or `"connecting"` state.

## DOD
- [ ] Bottom buttons clear iPhone home indicator
- [ ] No content cut-off from Safari chrome (dvh fix applied)
- [ ] Mic permission triggered by tap, not on load
- [ ] No scroll during active call

## Status report
Write `docs/agent-messages/2026-04-25-frontend-to-konstantin-mobile-done.md` when finished.
