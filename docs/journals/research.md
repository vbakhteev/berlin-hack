## 2026-04-25 — next-research.md brief

**Brief executed:** Agent behavior audit vs. PLAN.md §5 + §17

**Shipped:**
- system-prompt.ts step 3: match_policy urgency line added ('as soon as you have a hypothesis, do not wait')
- tool-schemas.ts check_coverage: rewritten to imperative ('Call this immediately after match_policy returns, before any more questions')
- policyTemplates.ts electronics: 'most common claim' + receipt-before-finalizing reminder
- policyTemplates.ts auto: roadside tone cue ('be calm, brief, reassuring')
- docs/agent-test-script.md: created — full MacBook cracked-screen walkthrough, 7 tool calls, post-call state table

**Finding:** Product agent had already strengthened step 4 (check_coverage before facts) in commit b361d9f — no conflict, both changes complement each other.

**Open:** No blockers. All 4 DOD items complete. Status report written to docs/agent-messages/2026-04-25-research-to-konstantin-done.md.


---

## 2026-04-25 — next-research-2 brief complete

**Brief:** Customer guidance scripts for Lina — per-policy fallback lines and scaffolds.

**Shipped:**
- `docs/customer-guidance-scripts.md`: full guidance scripts for electronics, auto, pet, bike — primary questions with know/don't-know branches, customer scaffolds, edge cases, wrong-policy handlers
- `convex/policyTemplates.ts`: all 4 `voiceAgentContext` fields enriched with `GUIDANCE SCAFFOLDS` sections covering the key "I don't know" scenarios, edge cases, and empathetic handling rules

**Quality bar hit:** Scripts written at senior German claims handler register — warm, specific, no bureaucratic "please provide." Scaffold lines tested against the bad/good examples from the brief.

**Commits:** 63e054d, ad93f75

**Status report:** docs/agent-messages/2026-04-25-research-to-konstantin-guidance-done.md
