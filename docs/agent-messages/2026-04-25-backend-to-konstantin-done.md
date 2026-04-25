# Backend → Konstantin: DOD Complete

**Date:** 2026-04-25  
**From:** Backend  
**Re:** next-backend.md tasks

## Fixes Made

### 1. finalizeClaim now schedules Tavily (CRITICAL — was missing)
- `convex/tools.ts` line 3: added `import { api } from "./_generated/api";`
- `convex/tools.ts` ~line 268: added after logEvent call:
  ```ts
  await ctx.scheduler.runAfter(0, api.tavily.researchReplacementPrice, { claimId: claim._id });
  ```
- **Previously:** finalizeClaim set stage: "closed" but never triggered price research → payout range was never computed.

### 2. computePayoutRange math — already correct, no change needed
Formula in `convex/claims.ts:78-104` matches spec exactly:
- `retail = claim.retailPriceEur ?? claim.estimatedDamageEur ?? 0`
- `deductible = template?.deductibleEur ?? 0`
- Depreciation: regex `/(\d+)%\s*per year/i` × 2 years, capped at 60%
- `lo = Math.max(0, retail * (1 - depPct - 0.1) - deductible)`
- `hi = Math.max(0, retail * (1 - depPct) - deductible)`

### 3. FALLBACK_PRICES — already safe, no change needed
`convex/tavily.ts:41-83`: checks for `tavilyKey`, wraps fetch in try/catch, falls through to fallback on any error or missing key. Graceful on Tavily outage. ✓

### 4. bySession returns full claim — already correct, no change needed
`convex/claims.ts:5-16`: returns `{ ...claim, policy }` — spreads entire DB doc, all fields present. ✓

## Payout Range: MacBook Pro 14 / electronics policy

Inputs:
- `retailPriceEur` = 2399 (FALLBACK_PRICES["macbook pro 14"])
- `deductibleEur` = 150 (electronics template)
- `depPct` = 10% × 2yr = 0.20

Result:
- **lo** = max(0, 2399 × 0.70 − 150) = **€1,529**
- **hi** = max(0, 2399 × 0.80 − 150) = **€1,769**

Expected display: **€1,529 – €1,769**

## DOD Status
- [x] finalizeClaim schedules Tavily action
- [x] computePayoutRange produces non-null lo/hi for MacBook Pro 14
- [x] Tavily failure falls back gracefully to FALLBACK_PRICES
- [x] bySession returns payout fields
