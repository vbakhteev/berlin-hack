# research → konstantin: done

**Brief:** next-research.md
**Date:** 2026-04-25
**Status:** All 4 DOD items complete

---

## What was missing and what I fixed

### 1. System prompt — step 3 (CRITICAL, fixed)
**Missing:** "call match_policy as soon as you have a hypothesis" urgency was absent; step 3 just said "call match_policy to identify the relevant policy."
**Fixed:** Step 3 now reads: "call match_policy as soon as you have a hypothesis — do not wait for them to finish describing everything."
Note: step 4 had already been strengthened by the product agent (check_coverage must happen before gathering facts — non-negotiable). Both are now correct.

### 2. Tool schema — check_coverage (HIGH, fixed)
**Missing:** Description was passive ("so you can read them aloud accurately").
**Fixed:** Now imperative: "Call this immediately after match_policy returns — before asking the caller any more questions. Read the deductible and depreciation values aloud. This MUST happen before you gather further facts."

### 3. Policy templates voiceAgentContext (HIGH, fixed)
**Electronics:** Added "This is the most common claim type" framing and "always confirm whether the caller has their purchase receipt before finalizing — it is required for reimbursement."
**Auto:** Added roadside tone cue: "The caller may be on a roadside or in a stressful post-accident situation — be calm, brief, and reassuring. Move quickly through the facts."

### 4. Agent test script (MEDIUM, created)
**Created:** `docs/agent-test-script.md` — full MacBook Pro 14 cracked-screen walkthrough.
Shows exact tool calls in order: match_policy → check_coverage → update_claim_field ×3 → request_visual_inspection → update_claim_field → finalize_claim.
Includes post-call expected state table and verified 7-call sequence.

---

## 3 most important lines added to the system prompt

1. `"3. While they speak, call match_policy as soon as you have a hypothesis — do not wait for them to finish describing everything."`
2. `"4. Once matched, you MUST call check_coverage immediately. Do NOT move to step 5 until you have called check_coverage and read the deductible and depreciation rule aloud..."` *(strengthened by product agent, confirmed correct)*
3. `"This is non-negotiable: tell the caller what they will receive BEFORE you ask them anything else. This is the indemnity-quality moment."`

---

## DOD checklist

- [x] System prompt has all mandatory lines
- [x] All 5 tool descriptions are imperative
- [x] policyTemplates voiceAgentContext is rich (electronics + auto improved)
- [x] `docs/agent-test-script.md` exists
