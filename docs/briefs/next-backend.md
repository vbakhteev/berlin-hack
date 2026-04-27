**Agent:** backend
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25

## Mission
Verify and harden the Convex backend so the demo doesn't break mid-stage.

## Context
Convex deployment: first-reindeer-581. Schema is synced. All mutations exist.
The live demo runs on localhost:3002, phone presents on stage tomorrow 14:00.

## Your files
- `convex/schema.ts`
- `convex/tools.ts` — matchPolicy, checkCoverage, updateClaimField, requestVisualInspection, finalizeClaim
- `convex/claims.ts` — bySession, create, computePayoutRange, setRetailPrice
- `convex/tavily.ts` — researchReplacementPrice action + FALLBACK_PRICES
- `convex/users.ts`
- `convex/policyTemplates.ts`

## Tasks (in priority order)

### 1. Verify finalizeClaim triggers Tavily (CRITICAL)
Open `convex/tools.ts` → `finalizeClaim` mutation.
After it sets `status: "in_review"` and `stage: "closed"`, it MUST schedule `api.tavily.researchReplacementPrice`.
Check if this is happening. If not, add:
```ts
await ctx.scheduler.runAfter(0, api.tavily.researchReplacementPrice, { claimId: claim._id });
```
Then open `convex/tavily.ts` → `researchReplacementPrice`. Make sure it calls `ctx.runMutation(api.claims.computePayoutRange, { claimId })` at the end.

### 2. Verify computePayoutRange math (HIGH)
Open `convex/claims.ts` → `computePayoutRange`. The formula should be:
```ts
const retail = claim.retailPriceEur ?? claim.estimatedDamageEur;
const deductible = policy.deductibleEur;  // from policyTemplates
const depPct = parseDepreciation(policy.depreciationRule, ...);
const lo = Math.max(0, retail * (1 - depPct - 0.1) - deductible);
const hi = Math.max(0, retail * (1 - depPct) - deductible);
```
If `matchedPolicyType` is a string key (not a Convex doc id), look up via `POLICY_TEMPLATES`. Make sure this doesn't throw on missing policy.

### 3. FALLBACK_PRICES safety net (HIGH)
In `convex/tavily.ts`: if `TAVILY_API_KEY` env var is missing or the fetch fails, ensure it falls back to `FALLBACK_PRICES` instead of throwing. The demo MUST show a payout range even if Tavily is down.
Wrap the fetch in try/catch and on any error call `getFallbackPrice(claim.productBrandModel)`.

### 4. Confirm bySession query returns full claim (MEDIUM)
`convex/claims.ts` → `bySession` — confirm it returns ALL fields including `expectedPayoutLowEur`, `expectedPayoutHighEur`, `retailPriceEur`, `retailPriceSource`, `matchedPolicyType`.

## DOD
- [ ] finalizeClaim schedules Tavily action
- [ ] computePayoutRange produces non-null lo/hi for MacBook Pro 14
- [ ] Tavily failure falls back gracefully to FALLBACK_PRICES
- [ ] bySession returns payout fields

## Status report
When done, write `docs/agent-messages/2026-04-25-backend-to-konstantin-done.md` with:
- Each fix made (file:line, what changed)
- Payout range output for MacBook Pro 14 / deductible 150 / 10%/yr depreciation / 2yr old
