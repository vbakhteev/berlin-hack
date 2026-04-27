**Agent:** polish
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25

## Mission
Vbakhteev just pushed a large update (commit c495286). Integrate his changes cleanly, check for breakage, and make sure the build stays green.

## What Vbakhteev changed
- `convex/schema.ts` — added `"call"` and `"rejected"` as valid claim status values
- `convex/claims.ts` — added `endCall` mutation, `approveClaim`/`rejectClaim` actions
- `convex/emails.ts` — new file: Resend email notifications for approve/reject
- `app/(pages)/claim/[sessionId]/page.tsx` — updated routing logic
- `app/(pages)/internal/claims/[claimId]/page.tsx` — major rewrite with TranscriptDownload
- `components/call/use-gemini-live.ts` — minor update
- `components/call/use-tool-bridge.ts` — minor update
- `components/call/video-pipeline.ts` — video recording via MediaRecorder

## Tasks

### 1. Run the build (CRITICAL)
```bash
npm run build
```
If it fails, fix TypeScript errors. Focus on:
- Any component that switches on `claim.status` — it now needs to handle `"call"` and `"rejected"` too
- `STATUS_COLORS` / `STATUS_LABELS` maps in dashboard — add entries for the new statuses

### 2. Check dashboard STATUS_COLORS/STATUS_LABELS (HIGH)
Open `app/(pages)/dashboard/page.tsx`. Find `STATUS_COLORS` and `STATUS_LABELS`.
Add:
```ts
call: "bg-blue-400",       // active call in progress
rejected: "bg-red-500",    // claim rejected
```
And labels:
```ts
call: "In call",
rejected: "Rejected",
```

### 3. Check claim page routing (HIGH)
Open `app/(pages)/claim/[sessionId]/page.tsx`.
Vbakhteev added a `"call"` status. Make sure the routing handles it — a claim in `"call"` status should show the `<CallView>`.
Add it to the condition if missing.

### 4. Verify emails.ts has RESEND_API_KEY guard (MEDIUM)
Open `convex/emails.ts`. Make sure it doesn't throw if `RESEND_API_KEY` is not set — it should log a warning and skip, not crash the action. The demo must not break if email isn't configured.

### 5. Run build again and confirm green (CRITICAL)
```bash
npm run build
```
Zero TS errors before you're done.

## DOD
- [ ] `npm run build` passes with 0 errors
- [ ] STATUS_COLORS + STATUS_LABELS updated for `"call"` and `"rejected"`
- [ ] Claim page routing handles `"call"` status
- [ ] emails.ts has graceful missing-key fallback

## Status report
Write `docs/agent-messages/2026-04-25-polish-to-konstantin-integration-done.md` when finished.
Include: build output (pass/fail) and list of files you touched.
