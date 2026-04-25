# backend → konstantin: claim lifecycle audit done

**Brief:** next-backend-2.md  
**Commit:** 7499abb

## DOD checklist

- [x] Tavily fires after every completed call (via finalizeClaim or endCall — one clear path)
- [x] Status lifecycle documented in claims.ts
- [x] Email actions don't crash without RESEND_API_KEY
- [x] byUser query returns "call" status claims

---

## Status lifecycle map (added to top of convex/claims.ts)

```
"call"      – created by claims.create; active voice call in progress
    ↓ (whichever fires first — exactly one schedules Tavily)
"draft"     – via tools.finalizeClaim (AI tool call): sets finalizedAt + schedules Tavily
              OR via claims.endCall (frontend on call end): schedules Tavily only when
              finalizedAt is absent (i.e. finalizeClaim did not run during the call)
    ↓
"in_review" – via claims.submit (user submits draft form)
    ↓
"accepted"  – via claims.approveClaim (admin action, sends approval email)
"rejected"  – via claims.rejectClaim (admin action, sends rejection email)
```

---

## Findings per task

### Task 1 — Tavily after endCall (CRITICAL, FIXED)

**Bug:** `endCall` patched `status: "draft"` directly without scheduling Tavily. If the AI
never called `finalizeClaim` during the session (early hangup, network drop, etc.), the claim
would sit in "draft" with no `retailPriceEur` and no payout range.

**Fix:** `endCall` now reads the claim first. If `finalizedAt` is absent (finalizeClaim did not
run), it schedules `api.tavily.researchReplacementPrice` itself. If `finalizedAt` is present,
Tavily was already scheduled by `finalizeClaim` — no duplicate scheduling.

Convex mutations are serialized so there is no race between the two paths.

### Task 2 — Status lifecycle comment

Written as a block comment at the top of `convex/claims.ts` (lines 1–14).

Notable: `setStatus` intentionally omits `"call"` from its union — that status is only ever
set on creation via `claims.create` and should never be restored once a call ends.

### Task 3 — Email guard (already correct, verified)

`sendEmail` helper in `convex/emails.ts:14-17`:
```ts
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.warn("RESEND_API_KEY not set — skipping email to", to);
  return;   // ← early return, no throw
}
```
Guard is in the helper, so both `sendApprovalEmail` and `sendRejectionEmail` inherit it
automatically. No crash without the key. ✅

### Task 4 — byUser returns "call" claims (already correct, verified)

`byUser` queries with `.withIndex("by_user")` and `.collect()` — no status filter.
All statuses including `"call"` are returned, so the dashboard shows an in-progress call. ✅
