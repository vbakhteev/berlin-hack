# research → konstantin: guidance-done

**Status:** Done ✓  
**Brief:** next-research-2.md  
**Date:** 2026-04-25

## What shipped

- `docs/customer-guidance-scripts.md` — per-policy customer guidance scripts for all 4 policy types (electronics, auto, pet, bike)
- `convex/policyTemplates.ts` — `voiceAgentContext` fields enriched with GUIDANCE SCAFFOLDS section for each policy

## Commits
- `63e054d` [research] enhanced policy voiceAgentContext with customer guidance
- `ad93f75` [research] customer guidance scripts for all 4 policy types

## DOD check
- [x] `docs/customer-guidance-scripts.md` exists with all 4 policy types fully written
- [x] Each policy has: primary questions, scaffolds for "I don't know", edge cases, wrong-policy handler
- [x] `policyTemplates.ts` voiceAgentContext updated and committed

## 3 best scaffold lines (most human)

1. **Electronics — device model unknown:**
   "No worries at all — just flip it over. There's usually a label on the back with the model name, or you can find it in Settings → About. If you can't get it right now, 'black iPhone, maybe a 14' is enough to start."

2. **Pet — pre-existing concern:**
   "Don't worry about figuring that out right now. The vet's records will show when the condition was first diagnosed — that's what the claims team will look at. Your job now is to focus on getting [pet name] the care they need."

3. **Bike — theft without a certified lock:**
   "I have to be honest with you: theft coverage requires the bike to have been secured with a certified lock. If it was unlocked, that's excluded under the policy. I know that's not what you want to hear right now — I'll still take your details in case there are mitigating circumstances."
