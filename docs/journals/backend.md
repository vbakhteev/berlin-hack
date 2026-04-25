
## 2026-04-25

**Session:** Backend demo-hardening pass

**Shipped:**
- `convex/tools.ts`: Added `import { api }` + `ctx.scheduler.runAfter(0, api.tavily.researchReplacementPrice, { claimId })` in `finalizeClaim` — this was the only missing piece; without it payout range was never computed after claim finalized.

**Verified (no change needed):**
- `computePayoutRange` math correct; MacBook Pro 14 → €1,529–€1,769
- Tavily fallback already safe (try/catch + FALLBACK_PRICES)
- `bySession` returns all payout fields via `{ ...claim, policy }`

**Status:** All 4 DOD items green. Demo should show payout range post-finalize.
