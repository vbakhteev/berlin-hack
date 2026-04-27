**Agent:** product
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25

## Mission
Write 4 ready-to-use test scenarios for Google AI Studio so Fabian can immediately test Lina's agent behavior without touching code. Each scenario covers one policy type and specifically tests the "customer guidance" path — where the caller is vague or doesn't know what to say.

## Context
Read `lib/agent/system-prompt.ts` and `convex/policyTemplates.ts`.
Fabian will open Google AI Studio (aistudio.google.com), paste in the system prompt, and run these as live conversations.

## Your output
Write `docs/ai-studio-test-scenarios.md` with:

### Section 1: How to set up in Google AI Studio
Step-by-step (max 6 steps):
1. Go to aistudio.google.com
2. Select Gemini 2.0 Flash Live (or similar live model)
3. Where to paste the system prompt
4. How to start a voice conversation
5. What to enable (tool calls / function calling if relevant)

### Section 2: The 4 test scenarios

For each scenario, write:

```
## Scenario [N]: [Policy Type] — [brief description]

**Setup:**
- User's active policies for this test: [which policy tiles to select in onboarding]
- Pre-condition: paste this system prompt into AI Studio (see Section 3)

**Test script (what you say out loud):**
Line 1: "[opening line — vague or stressed, like a real caller]"
→ Lina should: [what she should do / say / which tool call should fire]

Line 2: "[follow-up — be vague on something, e.g. don't know the model]"
→ Lina should: [guide with a specific scaffold]

Line 3: "[respond to Lina's guidance]"
→ Lina should: [move to next fact or trigger inspection]

[continue for 5-7 turns until finalize_claim would fire]

**What to watch for:**
- [ ] match_policy fires before Lina finishes greeting
- [ ] check_coverage is called and deductible read aloud BEFORE any fact questions
- [ ] Lina guides when caller says "I don't know"
- [ ] Visual inspection button triggered (if applicable)
- [ ] Claim summary read back before finalizing

**Red flags (if you see these, we have a bug):**
- Lina asks for facts BEFORE reading the deductible
- Lina says "as an AI" or "I think"
- Lina asks the caller to repeat their name
- Lina never triggers inspection even though policy requires it
```

### The 4 scenarios to write:
1. **Electronics — cracked laptop screen** (caller knows what happened but is vague on the model and purchase date)
2. **Auto — fender bender** (caller is stressed, unsure if police was called, doesn't know the other driver's details)
3. **Pet — dog ate something, vet visit needed** (caller is worried, doesn't know the exact diagnosis yet)
4. **Bike — stolen from street** (caller didn't lock it properly — this is an exclusion, Lina must handle with empathy)

### Section 3: The current system prompt (flat text for AI Studio)
Generate the full system prompt as a flat string, exactly as it would be injected for a user with:
- Name: "Max"
- Email: "max@demo.de"
- Active policies: electronics + auto

Use the actual content from `lib/agent/system-prompt.ts` and `convex/policyTemplates.ts` — fill in all the template variables with real values. This is what Fabian copies directly into AI Studio.

## DOD
- [ ] `docs/ai-studio-test-scenarios.md` exists
- [ ] Setup instructions are clear and accurate for Google AI Studio
- [ ] All 4 scenarios written with full test scripts
- [ ] Each scenario has "what to watch for" and "red flags"
- [ ] Section 3 has the full flat system prompt ready to paste

## Status report
Write `docs/agent-messages/2026-04-25-product-to-konstantin-aistudio-done.md` when finished.
