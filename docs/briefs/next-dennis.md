**Agent:** frontend
**Model:** claude-sonnet-4-6
**From:** Konstantin
**Date:** 2026-04-25
**⚠️ DO NOT git push. Commit locally only.**

## Mission
Redesign the app to look and feel like a native Inca product. We're demoing this to Inca tomorrow at 14:00 — it should feel like it could have shipped from their design team, not from a hackathon weekend.

## Current state (from phone screenshot)
The landing page (`app/page.tsx`) is already clean — black bg, white bold headline, two buttons. Good bones. Now apply the Inca design language throughout.

## Inca brand direction
Inca is a German B2B insurtech — AI-powered claims handling. Their aesthetic:
- **Professional, trust-forward** — this is insurance, not a consumer fintech app
- **Primary color: Deep navy or dark teal** — NOT pure black. Use `#0A1628` or `#0D1F2D` as base background
- **Accent: Electric blue or teal** — `#2563EB` or `#0EA5E9` for CTAs and highlights
- **Typography: Inter or similar clean sans-serif** — already in the project likely
- **NO gradients, NO glassmorphism** — clean, flat, authoritative
- **Subtle borders** — `border-white/10` dividers, not heavy outlines
- **Logo treatment:** Top-left on every screen: small "INCA" wordmark in caps + "Claims Companion" in muted text below it

## Files to redesign (in priority order)

### 1. Landing page — `app/page.tsx`
Current: black bg, white text, two buttons.
Target:
- Background: `#0A1628` (deep navy)
- Add INCA logo top-left (text-based: "INCA" bold + "Claims" light below in muted color)
- Headline stays bold — change font weight to 800, tighten line-height
- Subtitle: slightly muted (`text-white/70`), smaller
- Primary CTA "Get started": `bg-blue-600 hover:bg-blue-500 text-white` rounded-xl, full width, h-14
- Secondary CTA "Create account": `bg-white/8 border border-white/15 text-white` rounded-xl, full width, h-14
- Add a subtle trust line below buttons: `text-xs text-white/40 text-center` — "Powered by Gemini Live · Built on Convex"

### 2. Dashboard — `app/(pages)/dashboard/page.tsx`
- Same navy background
- Top bar: "INCA" wordmark left, user avatar right
- "Open a claim" button: same blue CTA style, prominent, full-width on mobile
- Claim rows: card style with `bg-white/5 border border-white/10 rounded-xl`
- Status badges: blue for "active", green for "accepted", red for "rejected"

### 3. Onboarding — `app/(pages)/onboarding/page.tsx`
- Policy tiles: `bg-white/5 border border-white/10 rounded-2xl` with emoji large, title bold
- Selected state: `border-blue-500 bg-blue-500/10`
- "Add N plans" CTA: same blue button

### 4. Call screen — `app/(pages)/claim/[sessionId]/_components/call-view.tsx`
- Background: `#0A1628`
- Audio orb: keep the pulse, but make it blue (`bg-blue-500` core, `bg-blue-400/30` outer ring)
- Claim card: `bg-white/5 border border-white/10 rounded-2xl` — subtle, not loud
- Bottom CTA area: same button styles

### 5. Global: CSS variables in `app/globals.css`
Add at `:root`:
```css
--inca-navy: #0A1628;
--inca-blue: #2563EB;
--inca-blue-light: #3B82F6;
--inca-muted: rgba(255,255,255,0.5);
```
Update `background` default to `var(--inca-navy)`.

## Logo component
Create `components/inca-logo.tsx`:
```tsx
export function IncaLogo({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <div className="flex flex-col">
      <span className={`font-bold tracking-widest text-white ${size === "sm" ? "text-sm" : "text-base"}`}>
        INCA
      </span>
      <span className="text-xs text-white/40 tracking-wide -mt-0.5">Claims Companion</span>
    </div>
  );
}
```
Use this in landing page, dashboard header, and call screen header.

## DOD
- [ ] Landing page: navy bg, blue CTA, INCA logo
- [ ] Dashboard: consistent design, blue CTA
- [ ] Onboarding: consistent tiles with blue selected state
- [ ] Call screen: navy bg, blue orb
- [ ] `IncaLogo` component exists and used
- [ ] Build passes (`npm run build`)
- [ ] Committed locally, NOT pushed

## Status report
Write `docs/agent-messages/2026-04-25-frontend-to-konstantin-design-done.md`.
Include: which files changed + one-line description per file.
