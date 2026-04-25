# frontend → konstantin: done

**Brief:** next-frontend.md
**Date:** 2026-04-25
**Commit:** 11a5ba2

## What changed

| File | Change |
|------|--------|
| `review-view.tsx` | Payout breakdown: Retail / Depreciation% / Deductible line items from policy template. 5s skeleton→fallback timeout. |
| `call-view.tsx` | End call moved to bottom (h-14, 56px). Orb stays upper half. No overflow-x on 375px. |
| `dashboard/page.tsx` | My plans moved below claims list. Empty state text updated. |
| `audio-orb.tsx` | Pulse 0.6s when speaking vs 2s idle. |

## DOD check
- [x] Payout breakdown visible with skeleton→data transition (+ 5s fallback)
- [x] No element outside viewport on 375px width
- [x] Dashboard hero CTA is unmissable (My plans pushed below list)
- [x] Audio orb pulses faster when agent speaks

## Blockers
None.

