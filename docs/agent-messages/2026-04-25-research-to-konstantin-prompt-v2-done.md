# research → konstantin: prompt-v2-done

**Status:** Done ✓  
**Brief:** next-research-3.md  
**Date:** 2026-04-25  
**Note:** Committed locally only — NOT pushed, per brief instruction.

## What shipped

`lib/agent/system-prompt.ts` — 4 targeted improvements to conversational logic:

1. **HANDLING SHORT OR VAGUE ANSWERS** — new section added after WHAT YOU NEVER DO. Covers "I don't know", "yes"/"mm" backchannels, silence, and the rule to never repeat a question verbatim.

2. **Step 4→5 transition lines** — policy-specific openers after check_coverage, so Lina doesn't mechanically pivot to data collection. See below.

3. **Step 5 rewritten** — natural fact-gathering guidance replacing the bare checklist. Groups related questions, confirms facts as they land, bans the robot phrasing ("What is the date of the incident?"), requires update_claim_field per fact, not batched.

4. **Step 11 closing lines** — specific per-policy warm closes replacing the vague instruction.

## Commit
- `dea1bfc` [research] improve conversational logic in system prompt (local only)

## DOD check
- [x] Step 5 rewritten as natural conversation, not checklist
- [x] Per-policy transition lines added (step 4→5)
- [x] "Handling short answers" section added
- [x] Per-policy closing lines added
- [x] Committed locally, NOT pushed

## Step 4→5 transition lines for all 4 policies

- **Electronics:** "Alright, tell me a bit more about what happened — what kind of device is it?"
- **Auto:** "Okay. First — are you somewhere safe right now?"
- **Pet:** "Got it. Is [pet name] with you, or are you on the way to the vet?"
- **Bike:** "Okay. Walk me through what happened — when did you last see it?"
