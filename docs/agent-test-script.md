# Lina Agent Test Script — MacBook Pro Cracked Screen

Reference transcript for the ideal Lina voice conversation.
Based on PLAN.md §10 beats 0:20–2:20.

---

## Setup

- Caller has an **electronics policy** (HUK24, ELE-2025-887421)
- Device: MacBook Pro 14, purchased ~2 years ago
- Incident: Fell off desk, screen cracked

---

## Transcript

**[CALL CONNECTS — ~0:05]**

> **Lina:** "Hey, I'm Lina. I'm sorry to hear something happened — tell me what's going on."

**[Caller: "My MacBook Pro 14 fell off my desk and the screen is cracked."]**

---

**[Lina internally: hypothesis = accidental drop, electronics. Calls match_policy immediately.]**

```
TOOL CALL: match_policy
args: {
  lossHypothesis: "Laptop fell and screen cracked — accidental drop",
  productCategory: "laptop"
}
RESULT: { policyId: "ELE-2025-887421", type: "electronics", insurer: "HUK24", deductibleEur: 150, requiresVisualInspection: true }
```

---

**[Lina immediately calls check_coverage before asking anything else.]**

```
TOOL CALL: check_coverage
args: { policyId: "ELE-2025-887421" }
RESULT: { deductibleEur: 150, depreciationRule: "Linear, 10% per year from purchase date, max 60% reduction.", exclusions: [...], coverageLimitEur: 5000 }
```

> **Lina:** "Okay, I can see this is on your HUK24 electronics policy. Quick heads-up before we go further: there's a 150-euro deductible, and depreciation applies at 10% per year — so a two-year-old laptop would see about 20% off the replacement value. Just so you know what to expect."

---

**[Fact-gathering — calls update_claim_field after each fact]**

> **Lina:** "When did this happen?"

**[Caller: "This morning, around 9am."]**

```
TOOL CALL: update_claim_field
args: { incidentType: "accidental drop", incidentDate: "2026-04-25" }
RESULT: { ok: true, updatedFields: ["incidentType", "incidentDate"] }
```

> **Lina:** "And where were you — home, office?"

**[Caller: "At home, in my home office."]**

```
TOOL CALL: update_claim_field
args: { incidentLocation: "home office", productBrandModel: "MacBook Pro 14" }
RESULT: { ok: true, updatedFields: ["incidentLocation", "productBrandModel"] }
```

> **Lina:** "Any idea what the repair might cost, or what you paid for it originally?"

**[Caller: "I paid around 2,400 euros for it two years ago."]**

```
TOOL CALL: update_claim_field
args: { estimatedDamageEur: 800, productCategory: "laptop" }
RESULT: { ok: true, updatedFields: ["estimatedDamageEur", "productCategory"] }
```

---

**[Visual inspection — policy requires it]**

> **Lina:** "I'll need to take a quick look at the damage — a button just appeared on your screen. Tap 'Start visual inspection' when you're ready, and show me the cracked screen."

```
TOOL CALL: request_visual_inspection
args: { reason: "policy_required", hint: "Show the cracked screen clearly" }
RESULT: { ok: true }
```

**[Caller taps button, holds up MacBook to camera]**

> **Lina:** "Yeah, I can see the diagonal crack across the upper-right corner. That's clearly an impact crack — I've noted it."

```
TOOL CALL: update_claim_field
args: { damageSummary: "Diagonal impact crack across upper-right quadrant of display panel, consistent with accidental drop." }
RESULT: { ok: true, updatedFields: ["damageSummary"] }
```

---

**[Voice-confirmation close]**

> **Lina:** "Okay, let me read that back. MacBook Pro 14, dropped this morning at home, diagonal screen crack — estimated damage around 800 euros, covered under your HUK24 electronics policy. Does that sound right?"

**[Caller: "Yes, that's right."]**

```
TOOL CALL: finalize_claim
args: {
  summary: "MacBook Pro 14 dropped at home on 2026-04-25, resulting in a diagonal impact crack on the screen. Estimated damage: 800 EUR. Covered under HUK24 electronics policy ELE-2025-887421.",
  callerEmail: "caller@example.com",
  requiredUploads: [
    { id: "invoice", title: "Purchase invoice", description: "Original receipt or invoice for the MacBook Pro.", required: true },
    { id: "damage_photo", title: "Damage photo", description: "Clear photo of the cracked screen.", required: true }
  ]
}
RESULT: { ok: true, claimId: "...", formLinkSent: true }
```

> **Lina:** "All set. I'm sending the rest to your email — open it when you have your invoice handy, no rush. You'll see your estimated payout there too. Take care."

---

## Expected post-call state

| Field | Value |
|---|---|
| `incidentType` | accidental drop |
| `incidentDate` | 2026-04-25 |
| `incidentLocation` | home office |
| `productBrandModel` | MacBook Pro 14 |
| `productCategory` | laptop |
| `damageSummary` | Diagonal impact crack across upper-right quadrant |
| `estimatedDamageEur` | 800 |
| `matchedPolicyId` | ELE-2025-887421 |
| `status` | awaiting_documentation |
| `stage` | closed |

## Tool call order (verified sequence)

1. `match_policy` — immediately on first damage description
2. `check_coverage` — before any more questions
3. `update_claim_field` × 3 — as facts land
4. `request_visual_inspection` — because policy requires it
5. `update_claim_field` — damage summary from visual
6. `finalize_claim` — after caller confirms

Total: 7 tool calls. All 5 tool types exercised.
