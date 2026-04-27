**Agent:** backend
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25

## Mission
Vbakhteev added an `endCall` mutation and changed claim status flow. Make sure Tavily price research still fires correctly in his new flow, and that the claim lifecycle is consistent end-to-end.

## Context
Read commit c495286 diff carefully before starting.
Key changes: new `endCall` mutation in `convex/claims.ts`, new statuses `"call"` and `"rejected"`, `convex/emails.ts` with approve/reject actions.

## Tasks

### 1. Verify Tavily still fires after endCall (CRITICAL)
Open `convex/claims.ts` → `endCall` mutation.
Check: does it call `finalizeClaim` or does it bypass it?
The Tavily scheduler (`ctx.scheduler.runAfter(0, api.tavily.researchReplacementPrice, ...)`) must fire somewhere in the call-end flow.

If `endCall` transitions to `"draft"` without going through `finalizeClaim` in `convex/tools.ts`, then Tavily never fires and the payout range is empty on the confirmation screen.

Fix: either have `endCall` schedule Tavily directly, OR ensure `finalizeClaim` (the Convex mutation called by the tool bridge) is always called before `endCall`.

### 2. Claim status flow audit (HIGH)
Map out the full status lifecycle:
`"call"` → [what transitions exist?] → `"draft"` → `"in_review"` → `"accepted"` / `"rejected"`

Write the map as a comment at the top of `convex/claims.ts`. Make sure every status transition is intentional and nothing gets stuck.

Specifically: what moves a claim from `"call"` to `"draft"`? Is it `endCall`? `finalizeClaim`? Both? There should be exactly one path.

### 3. approveClaim / rejectClaim email guard (MEDIUM)
Open `convex/emails.ts`. The `approveClaim` and `rejectClaim` actions send emails via Resend.
Confirm: if `RESEND_API_KEY` env var is missing, the action logs a warning and continues — it does NOT throw. Polish already added this guard but double-check it's actually in the handler logic, not just a comment.

### 4. Schema consistency check (MEDIUM)
`convex/schema.ts` now has `"call"` and `"rejected"` as status values.
Make sure ALL queries and mutations that filter by status handle these new values correctly.
Specifically: `claims.byUser` — does it return `"call"` status claims? It should (so the dashboard shows an active call).

## DOD
- [ ] Tavily fires after every completed call (via finalizeClaim or endCall — one clear path)
- [ ] Status lifecycle documented in claims.ts
- [ ] Email actions don't crash without RESEND_API_KEY
- [ ] byUser query returns "call" status claims

## Status report
Write `docs/agent-messages/2026-04-25-backend-to-konstantin-lifecycle-done.md` when finished.
Include the status lifecycle map you wrote.
