# frontend → konstantin: mobile-done

**Brief:** next-frontend-2.md
**Date:** 2026-04-25
**Commit:** 9f29260

## What changed

| File | Change |
|------|--------|
| `call-view.tsx` | Bottom CTA: `pb-10` → inline `calc(40px + env(safe-area-inset-bottom, 0px))` |
| `call-view.tsx` | Inspection button overlay: `p-6` → `px-6 pt-6` + same safe-area inline style |
| `call-view.tsx` | Removed auto-connect `useEffect`; `connect()` now only fires from "Start call" button tap |
| `call-view.tsx` | `main` gets `overflow-hidden` during `connecting`/`connected` states (was `overflow-x-hidden` only) |
| `call-view.tsx` | Status text + button label/variant updated for idle→ready→start flow |
| `review-view.tsx` | `min-h-screen` → `min-h-[100dvh]` |

## DOD check
- [x] Bottom buttons clear iPhone home indicator (`env(safe-area-inset-bottom)` applied)
- [x] No content cut-off from Safari chrome (dvh fix applied to review-view; call-view was already dvh)
- [x] Mic permission triggered by tap — "Start call" button gates `connect()`, no auto getUserMedia
- [x] No scroll during active call (`overflow-hidden` on connecting/connected)

## Notes
- `inspection-overlay.tsx` already had safe-area treatment from previous session — no change needed
- TypeScript clean (only pre-existing `baseUrl` deprecation warning in tsconfig)

## Blockers
None.
