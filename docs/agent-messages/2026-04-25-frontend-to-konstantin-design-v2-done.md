# frontend → konstantin: design-v2-done

**Brief:** next-dennis-2.md
**Date:** 2026-04-25
**Commit:** 5c612b5 (local only, not pushed)

## What changed

| File | Change |
|------|--------|
| `app/page.tsx` | Full redesign: white bg, black text, green-700 CTA, gray secondary. Removed audio orb. Added 3-step visual flow (Talk → Show → Payout). |
| `app/globals.css` | Added Inca CSS tokens: --inca-bg, --inca-text, --inca-green, --inca-green-accent, --inca-muted |

## DOD check
- [x] Landing page: white bg, black text, green CTAs (bg-green-700 / hover:bg-green-800)
- [x] globals.css tokens updated
- [x] Build passes (tsc clean)
- [x] Committed locally, NOT pushed

## Design decisions
- 3-step horizontal flow replaces the orb as the hero visual — cleaner for B2B, explains the product in 3 icons
- Feature pills: bg-green-50 / border-green-200 / text-green-800 (Tailwind built-ins matching #166534 family)
- Secondary CTA: bg-gray-100 / text-gray-700 — no border, clean minimal
- Safe-area-inset-top/bottom on header and footer
