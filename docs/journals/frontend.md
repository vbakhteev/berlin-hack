## 2026-04-25

### Session: next-frontend brief

**Commit:** 11a5ba2

**Shipped:**
- `review-view.tsx`: payout breakdown now shows Retail (Tavily), Depreciation %, Deductible as line items derived from policy template. Loading skeleton falls back to 'Calculating estimate…' after 5s.
- `call-view.tsx`: End call button moved to bottom of screen (h-14 = 56px, well above 48px min). Orb stays in upper half. Layout uses `overflow-x-hidden` + `min-w-0` — no horizontal scroll on 375px.
- `dashboard/page.tsx`: 'My plans' moved below claims list so hero CTA is uninterrupted. Empty state text matches brief.
- `audio-orb.tsx`: Middle ring pulse animates at 0.6s when `isSpeaking`, 2s when idle.

**Blockers:** None.


## 2026-04-25 — next-frontend-2: iOS Safari mobile fixes

**Brief:** next-frontend-2.md | **Commit:** 9f29260

### Shipped
- **Safe area insets:** Bottom CTA div now uses `calc(40px + env(safe-area-inset-bottom, 0px))` inline style. Same treatment on inspection button overlay. `inspection-overlay.tsx` already had it.
- **Viewport height:** `review-view.tsx` changed from `min-h-screen` to `min-h-[100dvh]`. `call-view.tsx` was already on `100dvh`.
- **Mic on tap (critical iOS fix):** Removed auto-connect `useEffect` that was calling `connect(apiKey)` without a user gesture. `connect()` now only fires from the "Start call" button tap. Added `handleStartCall`, updated button label/variant/disabled logic, and status text shows "Ready — tap Start call" when idle+ready.
- **No-scroll during call:** `main` switches from `overflow-x-hidden` to `overflow-hidden` when state is `connecting` or `connected`.

### Notes
TypeScript clean. All 4 DOD items satisfied.
