**Agent:** research
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25

## Mission
Validate that Lina's voice agent behavior matches the Inca pitch story. Audit the system prompt and tool schemas against PLAN.md.

## Context
Read PLAN.md §5 (Agent Design), §17 (Inca research citations), and `lib/agent/system-prompt.ts` + `lib/agent/tool-schemas.ts`.
The demo is tomorrow at 14:00. Every word Lina says on stage is our pitch.

## Tasks (in priority order)

### 1. System prompt audit (CRITICAL)
Open `lib/agent/system-prompt.ts`. Compare the built prompt against PLAN.md §5 Block 1, 2, 3.
Check for these specific lines that MUST be present or equivalent:
- "call match_policy as soon as you have a hypothesis" — model must not wait
- "call check_coverage and read the deductible + depreciation aloud BEFORE gathering facts"
- "Never say 'as an AI'" / "Never say the word 'form'"
- The narration pattern: "Let me check your policy real quick…"

If any are missing or weak, strengthen the prompt wording. Commit as `[research] tighten system prompt`.

### 2. Tool schema audit (HIGH)
Open `lib/agent/tool-schemas.ts`. Verify all 5 tools match PLAN.md §5 tool catalog:
- `match_policy` — args: lossHypothesis (required), productCategory (optional)
- `check_coverage` — args: policyId (required)
- `update_claim_field` — args: all the claim fields (optional)
- `request_visual_inspection` — args: reason (enum), hint (optional)
- `finalize_claim` — args: summary, callerEmail

If any description is vague, rewrite it to be imperative ("Call this tool immediately when…").
Gemini follows imperative tool descriptions better than passive ones.

### 3. Policy templates voice context (HIGH)
Open `convex/policyTemplates.ts`. Each template has a `voiceAgentContext` field.
Make sure the electronics template says something like:
"This is the most common claim. Caller may have a cracked screen or water damage. Always ask if they have purchase receipt before finalizing."
And kasko: "Car damage. Caller may be at a roadside. Be calm and quick."

If `voiceAgentContext` is missing or generic, improve it.

### 4. Sample claim walkthrough (MEDIUM)
Write `docs/agent-test-script.md` — a sample transcript of an ideal Lina conversation:
- Caller says: "My MacBook Pro 14 fell off my desk, the screen is cracked."
- Show the exact tool calls Lina should make, in order, with args.
- Show what Lina should say after each tool call.
This is the reference script for testing. Base it on PLAN.md §10 beats 0:20–2:20.

## DOD
- [ ] System prompt has all mandatory lines
- [ ] All 5 tool descriptions are imperative
- [ ] policyTemplates voiceAgentContext is rich
- [ ] `docs/agent-test-script.md` exists

## Status report
When done, write `docs/agent-messages/2026-04-25-research-to-konstantin-done.md` with:
- What was missing and what you fixed
- Paste the 3 most important lines you added to the system prompt
