**Agent:** product
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25

## Mission
Own the demo flow. Make sure the 5-minute pitch script from PLAN.md §10 actually works start-to-finish.

## Context
App: localhost:3002. Submission tomorrow 14:00. Demo device: iPhone Safari.
The demo must run from a pre-authed phone — onboarding already done, electronics + kasko policies seeded.
Read PLAN.md §10 (Demo Script) and §12 (Risk Register) carefully before starting.

## Tasks (in priority order)

### 1. Write the demo flow checklist (CRITICAL)
Create `docs/demo-checklist.md` with step-by-step pre-show setup and the literal beat-by-beat script.
Include: what to tap, what Lina should say, what the audience should see, fallback if something breaks.
Base it on PLAN.md §10 but make it concrete for the actual built app (routes, button labels, etc.).

### 2. Verify onboarding → dashboard flow (HIGH)
Walk through `app/(pages)/onboarding/page.tsx` and `app/(pages)/dashboard/page.tsx`.
Answer:
- Does onboarding let you pick "Electronics" and "KFZ Kasko"?
- Does it redirect to dashboard after Done?
- Does dashboard show "Open a claim" CTA?
- Does clicking it create a claim and navigate to `/claim/[sessionId]`?

If anything is broken, fix it. These are demo-entry gates.

### 3. Verify the demo account can be pre-seeded (HIGH)
The PLAN says: "Pre-authed: signed in, onboarding done, electronics + kasko policies seeded."
Check if `users.completeOnboarding` and `users.updatePolicyTypes` exist in `convex/users.ts`.
If the demo account can be set up by just going through the onboarding UI once — confirm and document it.
If it needs a manual Convex dashboard seed — write the exact steps in `docs/demo-checklist.md`.

### 4. Pitch hook: coverage caveat timing (MEDIUM)
In `lib/agent/system-prompt.ts`, confirm the system prompt explicitly says to call `check_coverage` immediately after `match_policy` and read the deductible aloud BEFORE gathering facts.
This is the Nag thesis moment (PLAN §17). If the wording is weak, tighten it so the model is unambiguous.

## DOD
- [ ] `docs/demo-checklist.md` exists with full setup + beat script
- [ ] Onboarding → dashboard → claim creation flow verified working
- [ ] System prompt correctly orders: match → coverage caveat → fact gathering
- [ ] Pre-seed steps documented

## Status report
When done, write `docs/agent-messages/2026-04-25-product-to-konstantin-done.md` with:
- Checklist created ✅ / Flow verified ✅ / Any broken gates you fixed
