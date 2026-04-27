**Agent:** research
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25
**⚠️ IMPORTANT: DO NOT git push. Commit locally only.**

## Mission
Improve the conversational logic in the system prompt. Not voice/TTS — purely the content layer: how Lina asks questions, transitions between topics, and keeps the conversation natural for each policy type.

The goal: Lina should feel like a real insurance claims handler on the phone — not a form being read aloud.

## Read first
- `lib/agent/system-prompt.ts` — current prompt
- `convex/policyTemplates.ts` — per-policy context
- `docs/customer-guidance-scripts.md` — guidance scripts from last brief

## What to improve

### 1. Natural conversation flow (not Q&A ping-pong)
Current FNOL procedure reads like a checklist. Real claims handlers don't say "What is the date of the incident?" — they say "When did this happen?" and if the caller says "just now" they say "okay, so today around [time] — got it."

Rewrite step 5 so Lina:
- Groups related questions naturally ("Tell me a bit more about the device — what make and model, and roughly when did you get it?")
- Confirms facts conversationally as they land ("Got it — MacBook Pro 14, bought early 2023")
- Moves on without making it feel like an interview

### 2. Per-policy opening lines
After `check_coverage` fires and Lina reads the deductible, she transitions into fact-gathering. This transition line is critical — it sets the tone.

Write a specific transition line for each policy type that feels natural:

- **Electronics:** After reading deductible → "Alright, tell me a bit more about what happened — what kind of device is it?"
- **Auto:** After reading deductible → "Okay. First — are you somewhere safe right now?" (roadside empathy before facts)
- **Pet:** After reading deductible → "Got it. Is [pet name] with you, or are you on the way to the vet?"
- **Bike:** After reading deductible → "Okay. Walk me through what happened — when did you last see it?"

Add these as specific instructions in the FNOL PROCEDURE step 4→5 transition.

### 3. Handling silence / short answers
When a caller just says "yes" or "I don't know" or goes quiet — Lina needs natural responses.
Add a short section to the prompt:

```
HANDLING SHORT OR VAGUE ANSWERS:
- If caller says "I don't know": offer a simpler version of the question or a range ("Was it this year? Last year?")
- If caller says "yes" or "mm": confirm what you understood and move on ("Perfect — so [fact]. And...")  
- If caller goes quiet: one soft prompt ("Take your time — no rush.")
- Never repeat the same question twice. Rephrase or offer a default.
```

### 4. Closing warmth
Step 11 ("End the call warmly") is too vague. Write a specific closing line per policy:
- Electronics: "You're all set — I hope you get it sorted quickly."
- Auto: "Drive safe when you're ready to go. Take care."
- Pet: "I hope [pet name] feels better soon."
- Bike: "Sorry this happened — hope your day gets better from here."

Add these as examples to step 11.

## Output
Update `lib/agent/system-prompt.ts` with all improvements.
Commit as `[research] improve conversational logic in system prompt`.
**DO NOT git push.**

## DOD
- [ ] Step 5 rewritten as natural conversation, not checklist
- [ ] Per-policy transition lines added (step 4→5)
- [ ] "Handling short answers" section added
- [ ] Per-policy closing lines added
- [ ] Committed locally, NOT pushed

## Status report
Write `docs/agent-messages/2026-04-25-research-to-konstantin-prompt-v2-done.md`.
Paste the new step 4→5 transition lines for all 4 policies.
