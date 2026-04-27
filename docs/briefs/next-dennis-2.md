**Agent:** frontend
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25
**⚠️ DO NOT git push. Commit locally only.**

## Mission: Inca design correction — landing page

The dark theme was wrong. Real Inca design is light/white, not dark.

**Inca.com actual aesthetic:**
- Background: `#FFFFFF` white (or `#F9FAFB` off-white)
- Text: `#000000` / `#111111` black headings, `#6B7280` muted body
- Accent: Forest green — use `#166534` dark green for CTAs, `#16A34A` for highlights
- Logo color: Green (match their diamond logo)
- Feel: Clean B2B professional, generous whitespace, minimal

**Redesign `app/page.tsx` — light version:**

Structure to keep, colors to flip:
- `background: #FFFFFF`
- Headline: `text-black font-bold` — black, heavy
- "90 seconds" accent: `text-green-700` (`#15803D`)
- Subtext: `text-gray-500`
- Feature pills: `bg-green-50 border border-green-200 text-green-800`
- Primary CTA "Get started": `bg-green-700 hover:bg-green-800 text-white rounded-2xl h-14`
- Secondary CTA: `bg-gray-100 text-gray-700 rounded-2xl h-12`
- Logo top-left: green diamond icon + "Inca" black bold wordmark
- Remove the audio orb from landing page — it belongs on the call screen only
- Trust line footer: `text-xs text-gray-400`

**Also update `app/globals.css`:**
```css
:root {
  --inca-bg: #FFFFFF;
  --inca-text: #111111;
  --inca-green: #166534;
  --inca-green-accent: #16A34A;
  --inca-muted: #6B7280;
}
body { background: var(--inca-bg); color: var(--inca-text); }
```

## DOD
- [ ] Landing page: white bg, black text, green CTAs
- [ ] `globals.css` tokens updated
- [ ] Build passes
- [ ] Committed locally, NOT pushed

## Status report
Write `docs/agent-messages/2026-04-25-frontend-to-konstantin-design-v2-done.md`
