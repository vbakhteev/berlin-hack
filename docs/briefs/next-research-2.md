**Agent:** research
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25

## Mission
Write per-policy customer guidance scripts for Lina. Goal: when a caller is vague or doesn't know what to say, Lina has specific fallback lines and scaffolds to guide them through the claim. This is the single most important thing that makes Lina feel like a real claims agent vs. a dumb form.

## Context
Read `convex/policyTemplates.ts` and `lib/agent/system-prompt.ts` before starting.
We have 4 policy types: electronics, auto, pet, bike.
The current system prompt tells Lina WHAT to ask but not HOW to guide when the customer is lost.

## The gap we're filling
Current step 5 in the prompt: "Gather facts: incident type, date/time, location, what was damaged, approximate value."
Too thin. Lina needs: specific questions per policy type + what to say when customer says "I don't know" or gives vague answers.

## Your output
Write `docs/customer-guidance-scripts.md` with this structure for EACH of the 4 policy types:

```
## [Policy Type]

### Primary questions (in order)
1. Question → what Lina says if customer knows the answer (just confirm + move on)
2. Question → what Lina says if customer is unsure ("I don't know exactly...")
3. ...

### Customer scaffolds
- If customer doesn't know the device model: "..."
- If customer doesn't know the purchase date: "..."
- If customer is unsure whether they have coverage: "..."
- [add others specific to the policy type]

### Edge cases Lina must handle
- [e.g. "caller mentions theft but didn't file a police report yet"]
- [e.g. "caller thinks it might be covered but it's in the exclusions list"]
- [e.g. "caller has two policies and the loss could fall under both"]

### Wrong-policy graceful handler
What Lina says if the caller's loss type doesn't match any active policy.
```

## Quality bar
These scripts must sound like a real, empathetic insurance agent — not a bureaucrat.
The scaffold lines especially must be warm and specific. Example:
- BAD: "Please provide the device model."
- GOOD: "No worries — just flip it over and there should be a sticker on the back with the model name."

Real insurance domain knowledge matters here. Think about what a senior claims handler at a German insurer would actually say on a call. Use that register.

## After writing the scripts
Also update `convex/policyTemplates.ts` — add or improve the `voiceAgentContext` field for each policy type to incorporate the key scaffolds and edge cases from your scripts. Commit as `[research] enhanced policy voiceAgentContext with customer guidance`.

## DOD
- [ ] `docs/customer-guidance-scripts.md` exists with all 4 policy types fully written
- [ ] Each policy has: primary questions, scaffolds for "I don't know", edge cases, wrong-policy handler
- [ ] `policyTemplates.ts` voiceAgentContext updated and committed

## Status report
Write `docs/agent-messages/2026-04-25-research-to-konstantin-guidance-done.md` when finished.
Paste the 3 best scaffold lines you wrote (the ones that sound most human).
