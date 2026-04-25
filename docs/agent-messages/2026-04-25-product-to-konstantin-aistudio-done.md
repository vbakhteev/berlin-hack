# Product → Konstantin: AI Studio Test Scenarios Done

**Date:** 2026-04-25
**From:** Product
**Re:** next-product-2.md — AI Studio test scenarios

## DOD

- [x] `docs/ai-studio-test-scenarios.md` created
- [x] Section 1: 6-step Google AI Studio setup instructions (including note on simulated tool calls)
- [x] Section 2: All 4 scenarios written with full turn-by-turn test scripts
- [x] Each scenario has "What to watch for" checklist + "Red flags" list
- [x] Section 3: Full flat system prompt for Max (max@demo.de) with electronics + auto policies filled in

## Scenarios summary

| # | Policy | Scenario | Key test |
|---|--------|----------|----------|
| 1 | Electronics 💻 | Cracked laptop screen | Caller vague on model/purchase date — Lina scaffolds |
| 2 | Auto 🚗 | Fender bender, roadside | Caller stressed, unsure on police/other driver — calm guidance |
| 3 | Pet 🐾 | Dog ingested unknown item | No diagnosis yet — Lina doesn't block; no visual inspection |
| 4 | Bike 🚲 | Stolen, not locked | Exclusion path — empathy-first, no finalize_claim |

## Notes

- Scenarios 3 and 4 require different policy setups (pet/bike). Doc notes this and tells Fabian to re-run onboarding.
- Section 3 system prompt is complete and copy-pasteable — all template variables filled from policyTemplates.ts.
- Tool call expectations are documented per turn so Fabian knows exactly what to watch for in the AI Studio transcript.

## Commit

`068b0c7 [product] ai-studio test scenarios: 4 FNOL scripts + flat system prompt for Max`
