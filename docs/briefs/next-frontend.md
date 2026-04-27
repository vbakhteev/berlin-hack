**Agent:** frontend
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25

## Mission
Polish the call screen and confirmation UI so the demo feels tight on an iPhone.

## Context
App is running on localhost:3002. Convex is live (first-reindeer-581). Clerk auth works.
The core plumbing is done — Gemini Live hook, tool bridge, claim card, inspection overlay all exist.
Submission: tomorrow 2026-04-26 14:00. Solo build. Mobile-first.

## Your files
- `app/(pages)/claim/[sessionId]/_components/call-view.tsx` — main call screen
- `app/(pages)/claim/[sessionId]/_components/audio-orb.tsx` — pulsing orb
- `app/(pages)/claim/[sessionId]/_components/claim-card-live.tsx` — live updating claim card
- `app/(pages)/claim/[sessionId]/_components/inspection-overlay.tsx` — camera trigger
- `app/(pages)/claim/[sessionId]/_components/review-view.tsx` — post-call confirmation + payout
- `app/(pages)/dashboard/page.tsx` — claim list + Open a claim CTA
- `app/(pages)/onboarding/page.tsx` — policy picker

## Tasks (in priority order)

### 1. Review-View: Payout Range Display (CRITICAL)
Open `review-view.tsx`. Find where `expectedPayoutLowEur` / `expectedPayoutHighEur` are shown.
Make sure the payout breakdown card shows:
```
Estimated payout: 1,250 € – 1,720 €
Retail (Tavily): ~2,399 €
Depreciation: -25%
Deductible: -150 €
```
Show a loading skeleton while Tavily is still running (check `claim.retailPriceEur === undefined`).
If the skeleton has been showing for >5s, show fallback text "Calculating estimate…" instead of spinning forever.

### 2. Call Screen: iOS Safari touch targets (HIGH)
Open `call-view.tsx`. Ensure:
- The "End call" / "Start inspection" buttons are in the **bottom 60% of viewport**, minimum 48px touch target.
- The audio orb is in the upper half.
- No horizontal scroll on 375px wide screen (iPhone SE size).

### 3. Dashboard: single hero CTA (MEDIUM)
`dashboard/page.tsx` should have one big "Open a claim" button front-and-center.
Claims list below it. If no claims yet, show an empty state: "No claims yet. Open your first claim above."

### 4. Audio-orb animation (MEDIUM)
`audio-orb.tsx` — make sure the pulse animation looks alive. It should pulse faster when `isSpeaking=true`.
If it's a static circle right now, add a simple CSS `animate-pulse` or keyframe scale animation.

## DOD
- [ ] Payout breakdown visible with skeleton→data transition
- [ ] No element outside viewport on 375px width
- [ ] Dashboard hero CTA is unmissable
- [ ] Audio orb pulses differently when agent speaks

## Status report
When done, write `docs/agent-messages/2026-04-25-frontend-to-konstantin-done.md` with:
- What you changed (file + one-line summary)
- Any blockers you hit
