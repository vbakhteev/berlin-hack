## 2026-04-25

### Session: next-frontend brief

**Commit:** 11a5ba2

**Shipped:**
- `review-view.tsx`: payout breakdown now shows Retail (Tavily), Depreciation %, Deductible as line items derived from policy template. Loading skeleton falls back to 'Calculating estimate…' after 5s.
- `call-view.tsx`: End call button moved to bottom of screen (h-14 = 56px, well above 48px min). Orb stays in upper half. Layout uses `overflow-x-hidden` + `min-w-0` — no horizontal scroll on 375px.
- `dashboard/page.tsx`: 'My plans' moved below claims list so hero CTA is uninterrupted. Empty state text matches brief.
- `audio-orb.tsx`: Middle ring pulse animates at 0.6s when `isSpeaking`, 2s when idle.

**Blockers:** None.

