
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
