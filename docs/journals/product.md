
## 2026-04-25

**Session:** Product demo-readiness pass

**Shipped:**
- `docs/demo-checklist.md` — full pre-show + beat-by-beat script with fallback table
- `lib/agent/system-prompt.ts` — tightened step 3 (match_policy: "do not wait") and step 4 (check_coverage: "MUST, non-negotiable, indemnity-quality moment")

**Verified (no code change):**
- Onboarding: shows all policy tiles, redirects to dashboard after completion ✓
- Dashboard: "Open a claim" creates claim + routes to `/claim/[sessionId]` ✓  
- Pre-seed: UI-only, no Convex console work needed. Select Electronics + Car → done.
- `users.completeOnboarding` and `users.updatePolicyTypes` both exist ✓

**KFZ note:** "KFZ Kasko" = policy template id `"auto"` = "Car insurance 🚗" tile in onboarding.

---

## 2026-04-25 — next-product-2 brief: AI Studio test scenarios

**Brief:** Write 4 ready-to-use Google AI Studio test scenarios for Lina's agent.

**Done:**
- Read `lib/agent/system-prompt.ts` and `convex/policyTemplates.ts` to extract real template values
- Wrote `docs/ai-studio-test-scenarios.md` with:
  - Section 1: 6-step AI Studio setup (voice model selection, system prompt paste, function calling toggle)
  - Section 2: 4 full turn-by-turn test scenarios covering electronics, auto, pet, and bike
  - Each scenario has exact lines to say, what tool calls should fire per turn, a "watch for" checklist, and a "red flags" list
  - Section 4 (bike stolen/no lock) tests the exclusion empathy path — verifies Lina handles gracefully without finalizing
  - Section 3: Full copy-pasteable flat system prompt for Max / max@demo.de with electronics + auto policies fully filled in
- Committed `068b0c7` and pushed to origin/main
- Wrote status report to `docs/agent-messages/2026-04-25-product-to-konstantin-aistudio-done.md`

**State:** DOD complete. Fabian can open AI Studio immediately and run all 4 scenarios.
