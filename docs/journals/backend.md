
## 2026-04-25

**Session:** Backend demo-hardening pass

**Shipped:**
- `convex/tools.ts`: Added `import { api }` + `ctx.scheduler.runAfter(0, api.tavily.researchReplacementPrice, { claimId })` in `finalizeClaim` — this was the only missing piece; without it payout range was never computed after claim finalized.

**Verified (no change needed):**
- `computePayoutRange` math correct; MacBook Pro 14 → €1,529–€1,769
- Tavily fallback already safe (try/catch + FALLBACK_PRICES)
- `bySession` returns all payout fields via `{ ...claim, policy }`

**Status:** All 4 DOD items green. Demo should show payout range post-finalize.

---
## 2026-04-25 — next-backend-2 brief

**Brief:** Vbakhteev claim lifecycle / Tavily audit

### Work done
- **CRITICAL FIX:** `endCall` (convex/claims.ts) now schedules `api.tavily.researchReplacementPrice`
  when `finalizedAt` is absent — covers the case where the AI never called `finalizeClaim` during
  the session (early hangup, etc.). `finalizedAt` acts as a dedup sentinel: only one Tavily call
  per claim.
- **Status lifecycle comment** added at top of `convex/claims.ts` — full `call → draft → in_review
  → accepted/rejected` map with Tavily scheduling notes.
- **Email guard verified:** `sendEmail` helper returns early (no throw) when `RESEND_API_KEY` missing.
- **`byUser` verified:** no status filter — returns all claims including `"call"` for active dashboard.

### Commits
- `7499abb` [backend] fix: endCall schedules Tavily + status lifecycle comment

### Status
All DOD items complete. Status report → `docs/agent-messages/2026-04-25-backend-to-konstantin-lifecycle-done.md`
