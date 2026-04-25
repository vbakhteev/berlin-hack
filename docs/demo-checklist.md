# Demo Checklist — Berlin Hack Inca Track
**Submission:** 2026-04-26 14:00 | **Demo device:** iPhone Safari | **Demo duration:** ~4 min

---

## PRE-SHOW SETUP (do these before you walk on stage)

### 30 min before
- [ ] iPhone fully charged (>80%)
- [ ] AirPods / headphones charged and in ears — non-negotiable for echo prevention
- [ ] Mobile hotspot active on iPhone (do NOT trust venue wifi)
- [ ] Laptop tethered to phone hotspot

### 15 min before
- [ ] Open Safari on iPhone → navigate to `localhost:3002` (or prod URL)
- [ ] Sign in with demo account (use a real inbox you can show on stage)
- [ ] If not onboarded: go through onboarding → select **Electronics (💻)** + **Car insurance (🚗)** → tap "Add 2 plans" → confirm you land on dashboard
- [ ] Confirm dashboard shows: name, "Open a claim" button, "My plans" button
- [ ] Confirm "My plans" shows Electronics and Car insurance selected
- [ ] Back to dashboard — this is where you start the demo
- [ ] Kill all other Safari tabs
- [ ] Set iPhone brightness to max
- [ ] Do not disturb: ON

### 5 min before
- [ ] Screen mirror or camera aim set up so audience can see phone
- [ ] Do a 30s dry run: tap "Open a claim" → confirm call screen loads → end call → back to dashboard
- [ ] Reset: navigate to dashboard, back to fresh state

---

## BEAT-BY-BEAT DEMO SCRIPT

### Beat 0 — 0:00 | Open the app
**You tap:** nothing yet (phone already on dashboard)
**Audience sees:** Dashboard — "Welcome back [Name]" + "Open a claim" hero button
**Say:** "Inca runs the back office. We're building the front door — the policyholder-side companion to MARS."

---

### Beat 1 — 0:05 | Start the claim
**You tap:** **"Open a claim"** button
**Audience sees:** FaceTime-like call screen, pulsing AudioOrb, "Connecting…" → "Connected"
**Say:** "One tap. No phone tree."

---

### Beat 2 — 0:15 | Lina greets
**Lina says:** "Hey, I'm Lina — I'm here to help you with your claim. What happened?"
**Say:** (let it breathe, don't over-talk)

---

### Beat 3 — 0:20 | Describe the incident
**You say into phone:** "My MacBook Pro fell off my desk and the screen is cracked."
**Audience sees:** Claim card fields start filling live — `incidentType: accidental drop`, `productCategory: laptop`
**Say:** "She's filling the form as I talk."

---

### Beat 4 — 0:30 | THE KEY MOMENT — coverage caveat
**Lina does:** calls `match_policy` → calls `check_coverage` (internal, ~200ms)
**Lina says:** "Let me check your policy real quick… okay, this is your HUK24 electronics policy. Just so you know before we go further: there's a 150-euro deductible, and depreciation applies at 10% per year, so a 2-year-old laptop would see about 20% off retail."
**Audience sees:** Claim card shows policy badge, deductible/depreciation banner
**Say:** "**This is the moment.** Inca's CEO says straight-through-processing is the wrong KPI — indemnity quality is. We're showing the deductible before she's even finished describing the story."

---

### Beat 5 — 0:50 | Fact gathering (live card filling)
**Lina asks:** 3 short questions (date, location, approx value)
**You answer naturally**
**Audience sees:** `productBrandModel`, `incidentDate`, `incidentLocation`, `estimatedDamageEur` fill in real time
**Say:** (silence — let the UI speak)

---

### Beat 6 — 1:30 | Visual inspection trigger
**You say OR Lina triggers:** "I can show you the damage." / Policy requires inspection → `request_visual_inspection` fires
**Audience sees:** Full-screen **"Start visual inspection"** button overlay appears
**Say:** "Tool call to UI in under 300ms."

---

### Beat 7 — 1:35 | Show the damage
**You tap:** "Start visual inspection"
**Audience sees:** Camera opens, video stream visible (show phone screen / a prop laptop screen)
**Say:** (let the agent narrate)
**Lina says:** "Yeah, I can see the diagonal crack across the lower left — I've noted that."
**Audience sees:** `damageSummary` fills in on claim card

---

### Beat 8 — 2:10 | Voice-confirmation close
**Lina says:** "Okay — MacBook Pro 14, dropped on April 23rd, screen cracked. Estimated around 800 euros damage. Does that sound right?"
**You say:** "Yes."
**`finalize_claim` fires** → call ends → transition to confirmation screen
**Say:** "Voice-confirmation close. No post-call form gate."

---

### Beat 9 — 2:30 | Confirmation screen + payout skeleton
**Audience sees:** Summary card + payout range skeleton loading
**Say:** "Tavily is researching the retail price right now."

---

### Beat 10 — 2:45 | Payout range populates
**Audience sees:** "Estimated payout: **€1,529 – €1,769**" with breakdown (retail ~2,399, depreciation -20%, deductible -150)
**Say:** "Indemnity-quality math. Live, not batch. Not a number we made up — sourced from Tavily, or our hardcoded fallback if Tavily is down. Either way, the claimant walks away knowing their number."

---

### Beat 11 — 3:00 | Email-handoff explanation
**Say:** "In production, we'd email this link and let her upload the invoice when she's home. Nobody has a receipt on a wet highway at 11pm. The scene capture and the form submission are intentionally two separate stages."

---

### Beat 12 — 3:20 | Back to dashboard
**You tap:** back → dashboard
**Audience sees:** Claim row visible with status badge
**Say:** (nothing — visual close)

---

### Beat 13 — 3:30 | Pitch close
**Say:** "Inca has 250 agents in MARS. They told us they don't have a claimant-side story. This is it: the policyholder's companion. Agent-to-agent FNOL handoff. EU AI Act audit log on every tool call — every tool call, reasoning trace, and transcript turn lands in our claimEvents table with timestamps. Built for indemnity quality, not for the vanity metric."

---

### 4:00 – 5:00 | Q&A buffer

**Likely questions:**
- "Is Lina a real AI?" → "Gemini Live — Google's bidirectional multimodal model — running in the browser, sub-300ms tool-call-to-UI latency."
- "Do you actually call Tavily?" → "Yes. If Tavily is down we have a hardcoded fallback table so the demo always shows a number."
- "Where's the adjuster side?" → "Same Convex subscription drives both views. We built the schema; we didn't build the adjuster UI in 24h."
- "GDPR?" → "For the demo, there's a one-line consent copy on the call screen. Production: data residency is a deploy flag on Convex Cloud."

---

## PRE-SEED STEPS (for demo account)

The demo account just needs to go through onboarding **once**. No manual Convex dashboard work required.

1. Sign in via Clerk
2. If redirected to `/onboarding`: select **Electronics (💻)** + **Car insurance (🚗)**
3. Tap "Add 2 plans" → lands on `/dashboard`
4. Done — account is pre-seeded. `users.activePolicyTypes` is now `["electronics", "auto"]`

> **KFZ Kasko note:** The policy template id is `"auto"` (displayed as "Car insurance 🚗"). This is the Allianz KFZ policy. When the brief says "kasko + electronics," select those two tiles.

If you need to re-seed (e.g. demo account policies got cleared):
- Go to `/plans` from dashboard → toggle policies → save

---

## FALLBACK PLANS

| What broke | What to do |
|------------|-----------|
| Lina doesn't connect | Wait 5s. Reload. If still broken, switch to screen recording fallback. |
| Lina talks but doesn't call tools | Say "Let me check your policy" — sometimes narration primes the model. If persists, proceed verbally and use the pre-filled claim card from a previous session. |
| Inspection button doesn't appear | The button is also triggered by the local `visualInspectionRequested` flag — it should still appear. If not, say "she's just triggered the visual inspection" and open camera manually from UI. |
| Tavily times out | FALLBACK_PRICES kicks in automatically for MacBook Pro 14 → €2,399. Payout range still shows. No action needed. |
| Demo wifi dies | Switch to mobile hotspot (should already be on). |
| Total failure (app down) | "Let me show you the architecture instead" → explain the tool-call-to-UI flow with the system diagram. The pitch is still the pitch. |
