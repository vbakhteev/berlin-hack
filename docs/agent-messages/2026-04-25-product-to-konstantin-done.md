# Product → Konstantin: DOD Complete

**Date:** 2026-04-25
**From:** Product
**Re:** next-product.md tasks

## Checklist created ✅
`docs/demo-checklist.md` — full pre-show setup (30min + 15min + 5min before), beat-by-beat script keyed to exact app routes and button labels, fallback table for every likely failure mode.

## Flow verified ✅

### Onboarding → Dashboard
- Onboarding shows all 4 policy tiles (Electronics 💻, Car 🚗, Bike 🚲, Pet 🐾) — pick Electronics + Car for demo
- "Add N plans" → calls `updatePolicyTypes` + `completeOnboarding` → redirects to `/dashboard` ✓
- Dashboard checks `currentUser.onboardingComplete`; if false → redirects to `/onboarding` ✓

### Dashboard → Claim creation
- "Open a claim" CTA → `nanoid()` sessionId → `claims.create({ sessionId })` → `router.push(/claim/${sessionId})` ✓
- No broken gates found.

## Pre-seed ✅
No manual Convex dashboard work needed. Just go through onboarding UI once:
- Select Electronics + Car insurance → "Add 2 plans"
- `users.completeOnboarding` ✅ (convex/users.ts:83)
- `users.updatePolicyTypes` ✅ (convex/users.ts:97)
- Note: "KFZ Kasko" maps to policy template id `"auto"` (Car insurance tile)

## System prompt: coverage caveat ordering ✅ (tightened)
`lib/agent/system-prompt.ts` step 4 updated from:
> "call check_coverage and read the deductible + depreciation aloud in a calm, plain way. This sets expectations BEFORE you collect facts."

To:
> "you MUST call check_coverage immediately. Do NOT move to step 5 until you have called check_coverage and read the deductible and depreciation rule aloud. This is non-negotiable: tell the caller what they will receive BEFORE you ask them anything else. This is the indemnity-quality moment."

Step 3 also tightened: added "do not wait for them to finish describing everything."

## DOD
- [x] `docs/demo-checklist.md` exists with full setup + beat script
- [x] Onboarding → dashboard → claim creation flow verified working
- [x] System prompt correctly and unambiguously orders: match → coverage caveat → fact gathering
- [x] Pre-seed steps documented
