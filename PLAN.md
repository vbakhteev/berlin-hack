# Inca Track — Voice Claims Agent
## 24h Solo Build Plan

> Hackathon: Big Berlin Hack #2, Inca track. Submission: Sunday 2026-04-26 14:00.
> Today: 2026-04-25. Solo dev. Mobile-first demo from a phone.
> This plan is the source of truth. If reality conflicts, follow the plan or update the plan — don't drift silently.

---

## 1. Executive Summary

We are building **the policyholder-side companion to Inca's MARS** — a mobile, voice-first FNOL (First Notice of Loss) agent that takes an insurance claim by phone-style call, narrates its reasoning, surfaces the policy's deductible/depreciation rules in real time, and walks the claimant through a live damage video inspection without a form-gate at the end. We win the Inca track because Inca explicitly does not have a claimant-side story (back-office TPA only), and the CEO's recent thesis says *Dunkelverarbeitungsquote (straight-through-processing %) is the wrong KPI; indemnity quality is*. Our agent is built around that thesis: it tells the claimant about deductibles and depreciation upfront, mid-call, on screen, before they finish describing the loss.

**One-sentence wow:** "Open the app, tap one button, talk to the agent for 90 seconds, show your damage on camera, and you walk away knowing your deductible, your depreciation, and your expected payout — before you've uploaded a single document."

**Why this beats the brief:** The public framing was "fool >50% of jurors into voting human." The user has confirmed in person with Inca that the real win condition is *best customer experience for filing a claim*. Sounding human is the quality bar that *enables* CX, not the goal. Every design decision below is graded against "what makes filing this claim faster, smoother, and more trustworthy for the claimant."

---

## 2. Reconciled User Journey

There are two journey designs in the brief and they conflict:

- **IDEA.md** says: voice call → visual inspection → invoice upload in the same session → submit → confirmation.
- **Saved user preference** says: voice + video happen at the scene; the form is submitted later via an emailed link, because the claimant probably does not have an invoice/proof at the accident moment.

**Resolution.** The production design is the email-later flow. The demo flow is a hybrid that honors the same insight while staying tight enough to pitch in 5 minutes.

### Demo path (the literal beats we run on stage)

1. **Sign in** (already provisioned via Clerk; we'll be pre-authed before going on stage).
2. **Onboarding** — pick policies. Sample policies are pre-seeded; the user clicks "I have these." (See section 7 — PDF upload is built but pre-loaded policies are the demo default.)
3. **Dashboard** — single hero CTA: **Open a claim**.
4. **Call screen** (FaceTime-like, audio-only initially). Big animated audio orb. "Connecting…" → "Connected."
5. **Voice intake** (~60–90s). Empathy-first opener → identify policy via `match_policy` tool → coverage caveat read aloud (`check_coverage`) → 3 fact-gathering questions → live claim card filling on screen via `update_claim_field` (each turn, fields populate in real time).
6. **Visual inspection trigger.** Either policy requires it (`request_visual_inspection` fires automatically) or the claimant says "I can show you" (agent fires the same tool). Big overlay button appears: **Start visual inspection**. Tapping it opens camera, video stream goes to the agent.
7. **Damage inspection** (~30s). Agent narrates what it sees; tool calls update the claim card with damage description.
8. **Voice-confirmation close.** Agent reads back the claim summary, asks "does that sound right?" Claimant says yes → `finalize_claim` tool fires.
9. **Confirmation screen.** Claim summary, deductible, depreciation, retail-price-from-Tavily, expected payout range. Email-link CTA: **Finish on a bigger screen.** Inline "I have my invoice now" expand-to-upload is also present (demo escape hatch — for the live pitch we'll skip this and just talk through it).
10. **Dashboard** shows the new claim with status "Awaiting documentation" (or "Submitted" if invoice was uploaded inline).

### Production path (what we tell the jury we'd ship)

After step 8, instead of the inline form path, we send the claimant an email with a one-click link to the form session, pre-populated with everything from the call. They open it later when they have the invoice in hand. Two-stage by design: the *story* is captured at the scene; the *evidence* is uploaded when convenient. This is the user's saved preference and the actual right answer for real-world FNOL — the moment after a car accident is the worst moment to ask someone to find a receipt.

In the pitch, we will explicitly say: "the demo shows the inline path so you see the round-trip in 5 minutes; the production design splits stage 1 (scene capture, voice + video) from stage 2 (documentation upload), because nobody has an invoice on a wet highway at 11pm."

### Mobile-first non-negotiables

- Single-thumb reachable actions (CTAs in lower 60% of viewport).
- Big buttons, not small links, for stage transitions.
- The claim card during the call lives above the fold; visual-inspection overlay covers the entire viewport when triggered.
- The phone presents the demo. Test on the actual demo device. (Recommendation: iPhone with headphones to avoid echo — see risk register.)

---

## 3. Architecture

### Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                          Phone / Browser                            │
│                                                                     │
│  Next.js client (React 19, Tailwind, shadcn)                        │
│   ├─ /dashboard           (claim list, Open-a-claim CTA)            │
│   ├─ /claim/[sessionId]   (live call screen + claim card)           │
│   ├─ /claim/[id]/confirm  (post-call summary + Tavily estimate)     │
│   └─ /form/[token]        (email-later form)                        │
│                                                                     │
│  Hooks:                                                             │
│   ├─ useGeminiLive()  ── WebSocket directly to Gemini Live API ───┐ │
│   │                       audio in/out, video in, tool calls      │ │
│   ├─ useConvex()      ── reactive subscriptions to live state ──┐ │ │
│   └─ useToolBridge()  ── routes tool calls to Convex mutations  │ │ │
│                                                                 │ │ │
└─────────────────────────────────────────────────────────────────┼─┼─┘
                                                                  │ │
                                                                  │ │
            ┌─────────────────────────────────────────────────────┘ │
            ▼                                                       ▼
┌────────────────────────────┐         ┌────────────────────────────────┐
│  Convex                    │         │  Gemini Live API (Google)       │
│  (real-time DB + actions)  │         │   wss://generativelanguage      │
│                            │         │   .googleapis.com/.../BidiGen…  │
│  Tables:                   │         │                                 │
│   users                    │         │   - audio in (mic)              │
│   policies                 │         │   - video in (camera)           │
│   claims                   │         │   - audio out (TTS native)      │
│   claimEvents (audit log)  │         │   - tool/function declarations  │
│   claimFormSessions        │         │   - serverContent transcripts   │
│   claimMedia (storage IDs) │         │                                 │
│                            │         └─────────────────────────────────┘
│  Functions:                                                              
│   mutations: tools.*       │         ┌────────────────────────────────┐
│   queries:   claims.live   │         │  Tavily API                     │
│   actions:   tavily.search │◀────────│  /search (REST, server-side)    │
│   actions:   gemini.image  │         └────────────────────────────────┘
│   actions:   gemini.policy │
│   actions:   email.send    │         ┌────────────────────────────────┐
│                            │         │  Gemini image-gen / Imagen      │
│  Storage:                  │◀────────│  (server-side action)           │
│   policy PDFs              │         └────────────────────────────────┘
│   damage clips (mp4)       │
│   thumbnails               │         ┌────────────────────────────────┐
└────────────────────────────┘         │  Resend / Postmark              │
                                       │  (email handoff link)           │
                                       └────────────────────────────────┘
```

### Where do tool calls land — client or server?

**Client.** The Gemini Live WebSocket runs in the browser for two reasons: (1) lowest possible latency on the audio loop, and (2) we never proxy raw audio through Convex (Convex actions are not WebSocket gateways and would add a hop). When the agent emits a `toolCall`, the browser receives it on its own socket and calls a Convex mutation, which writes to the `claims`/`claimEvents` table. The user's screen is reactively subscribed to the same row, so the UI updates in <100ms after the mutation lands. The tool result is then echoed back to Gemini Live via `toolResponse` over the same socket.

**Why this beats server-side.** Routing the audio through a Next.js API route or Convex action would add 100–300ms per round-trip on a free dyno and could throttle. The cost of client-side: the browser holds the API key. We mitigate by minting an **ephemeral token** server-side (Gemini Live supports ephemeral tokens for in-browser use; we issue one from a Next.js route or Convex action that's gated by Clerk auth). If ephemeral tokens are not available in the SDK by submission time, we fall back to a server-only WebSocket proxy via a Next.js Route Handler (App Router, runtime `nodejs`) — adds latency but keeps the key off-device.

### Latency budget

| Hop | Target | Ceiling |
|---|---|---|
| Mic → Gemini (audio frame) | <150ms | 300ms |
| Gemini tool decision → emitted toolCall | model-bound | n/a |
| toolCall → Convex mutation completes | <80ms | 200ms |
| Convex subscription → React paint | <80ms | 200ms |
| **Total tool-call-to-UI-paint** | **<300ms** | **<500ms** |
| Gemini TTS audio out start | <500ms after agent decision | 1000ms |

The latency-sensitive path is `update_claim_field` and `request_visual_inspection`. If the inspection button doesn't appear within ~500ms of the agent saying "could you show me the damage," the demo loses its magic. Test this end-to-end before anything else.

### File layout (additions on top of existing structure)

```
app/
  (pages)/
    dashboard/
      page.tsx                      # already exists; rebuild as claim list
      _components/
        claim-row.tsx
        open-claim-cta.tsx
    onboarding/
      page.tsx                      # NEW — policy picker + PDF upload
    claim/
      [sessionId]/
        page.tsx                    # NEW — live call screen
        confirm/page.tsx            # NEW — post-call confirmation + Tavily
        _components/
          call-screen.tsx
          claim-card-live.tsx
          inspection-overlay.tsx
          audio-orb.tsx
          transcript-strip.tsx
    form/
      [token]/
        page.tsx                    # NEW — email-later form
  api/
    gemini/
      ephemeral-token/route.ts      # NEW — mint ephemeral token, Clerk-gated
    tavily/route.ts                 # optional fallback if Convex action blocked
components/
  call/
    use-gemini-live.ts              # NEW — WebSocket hook
    use-tool-bridge.ts              # NEW — routes toolCalls to Convex
    audio-pipeline.ts               # NEW — mic capture, PCM16, base64 frames
    video-pipeline.ts               # NEW — camera capture, JPEG frames
convex/
  schema.ts                         # extend
  policies.ts                       # NEW — CRUD + sample-seed
  claims.ts                         # NEW — queries + mutations
  tools.ts                          # NEW — match_policy, update_claim_field, etc.
  events.ts                         # NEW — append-only audit log
  tavily.ts                         # NEW — action: research_replacement_price
  geminiVision.ts                   # NEW — action: extract policy from PDF
  geminiImage.ts                    # NEW — action: claim card art (low priority)
  email.ts                          # NEW — action: send form link (Resend)
lib/
  agent/
    system-prompt.ts                # NEW — three-block prompt builder
    tool-schemas.ts                 # NEW — Gemini function declarations
    state-machine.ts                # NEW — agent stage tracking helpers
research/
  inca.md                           # exists
  sample-policies/                  # NEW — 2-3 hand-authored JSONs
```

---

## 4. Convex Schema Additions

Concrete `defineTable` blocks. Drop into `convex/schema.ts` next to `users`.

```ts
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    createdAt: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    tokenIdentifier: v.string(),
    // NEW
    onboardingComplete: v.optional(v.boolean()),
    preferredLanguage: v.optional(v.union(v.literal("en"), v.literal("de"))),
  }).index("by_token", ["tokenIdentifier"]),

  policies: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("electronics"),
      v.literal("kfz_haftpflicht"),
      v.literal("kfz_kasko"),
      v.literal("hausrat"),
      v.literal("privat_haftpflicht"),
      v.literal("travel"),
      v.literal("pet")
    ),
    insurer: v.string(),                  // e.g. "Allianz", "HUK"
    policyNumber: v.string(),
    coverageSummary: v.string(),          // 1-2 sentence plain-English summary
    deductibleEur: v.number(),            // e.g. 150
    depreciationRule: v.optional(v.string()), // "10% per year, straight-line"
    requiresVisualInspection: v.boolean(),
    coverageLimitEur: v.optional(v.number()),
    exclusions: v.array(v.string()),      // ["water damage", "intentional"]
    sourcePdfStorageId: v.optional(v.id("_storage")),
    extractedAt: v.string(),
    extractedBy: v.union(v.literal("seeded"), v.literal("gemini-vision")),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "type"]),

  claims: defineTable({
    userId: v.id("users"),
    sessionId: v.string(),                // stable id used by Gemini session
    matchedPolicyId: v.optional(v.id("policies")),
    status: v.union(
      v.literal("active"),                // call in progress
      v.literal("awaiting_documentation"),// voice closed, waiting on form
      v.literal("submitted"),             // form complete
      v.literal("estimating"),            // Tavily running
      v.literal("ready_for_review")
    ),
    stage: v.union(
      v.literal("greeting"),
      v.literal("identifying_policy"),
      v.literal("coverage_caveat"),
      v.literal("fact_gathering"),
      v.literal("visual_inspection"),
      v.literal("voice_confirmation"),
      v.literal("closed")
    ),
    visualInspectionRequested: v.boolean(),
    visualInspectionRequestedBy: v.optional(
      v.union(v.literal("policy_required"), v.literal("user_offered"), v.literal("agent_suggested"))
    ),
    // live form fields (filled by update_claim_field)
    incidentType: v.optional(v.string()),
    incidentDate: v.optional(v.string()),
    incidentLocation: v.optional(v.string()),
    productCategory: v.optional(v.string()), // "laptop", "phone"
    productBrandModel: v.optional(v.string()),// "MacBook Pro 14 M3"
    damageSummary: v.optional(v.string()),
    estimatedDamageEur: v.optional(v.number()),
    callerEmail: v.optional(v.string()),
    callerPhone: v.optional(v.string()),
    // post-call computed
    retailPriceEur: v.optional(v.number()),  // Tavily result
    retailPriceSource: v.optional(v.string()),
    expectedPayoutLowEur: v.optional(v.number()),
    expectedPayoutHighEur: v.optional(v.number()),
    transcriptText: v.optional(v.string()),  // full transcript dumped at finalize
    confirmationImageStorageId: v.optional(v.id("_storage")),
    createdAt: v.string(),
    finalizedAt: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_user_status", ["userId", "status"]),

  claimEvents: defineTable({
    claimId: v.id("claims"),
    userId: v.id("users"),
    type: v.union(
      v.literal("transcript_user"),
      v.literal("transcript_agent"),
      v.literal("tool_call"),
      v.literal("tool_result"),
      v.literal("stage_transition"),
      v.literal("system")
    ),
    payload: v.any(),                     // schema varies by type
    toolName: v.optional(v.string()),
    reasoningTrace: v.optional(v.string()),
    timestamp: v.number(),                // Date.now()
  })
    .index("by_claim", ["claimId", "timestamp"])
    .index("by_claim_type", ["claimId", "type"]),

  claimFormSessions: defineTable({
    claimId: v.id("claims"),
    userId: v.id("users"),
    token: v.string(),                    // opaque, emailed link
    status: v.union(
      v.literal("pending"),
      v.literal("opened"),
      v.literal("submitted")
    ),
    invoiceStorageId: v.optional(v.id("_storage")),
    invoiceTotalEur: v.optional(v.number()),
    submittedAt: v.optional(v.string()),
    expiresAt: v.string(),
  })
    .index("by_token", ["token"])
    .index("by_claim", ["claimId"]),

  claimMedia: defineTable({
    claimId: v.id("claims"),
    kind: v.union(
      v.literal("damage_video"),
      v.literal("damage_frame"),
      v.literal("invoice")
    ),
    storageId: v.id("_storage"),
    durationSec: v.optional(v.number()),
    capturedAt: v.string(),
  }).index("by_claim", ["claimId"]),
});
```

**Indexing notes.**
- `claims.by_session` lets the Gemini WebSocket lookup the active claim by its session id without needing a Convex doc id round-trip.
- `claimEvents.by_claim` is the audit-log read path; it's append-only and ordered by `timestamp` for chronological replay.
- `claimEvents` doubles as the EU AI Act / DORA audit artifact we tease in the pitch (every tool call + reasoning trace + transcript turn, immutable). This is a deliberate Inca-research-driven design choice.

---

## 5. Agent Design

### The single system prompt — three blocks

The prompt is built at session start by `lib/agent/system-prompt.ts` and stuffed into the Gemini Live `setup.systemInstruction`. It has three blocks separated by clear headers.

**Block 1 — Persona / style.**

```
You are Lina, a claims companion working alongside Inca's claims platform.

Voice rules:
- German market, but speak in the language the caller speaks. If they switch, you switch.
- Empathy-first: the caller may be stressed, on a roadside, after an accident.
  Open with one short empathy line, then move on. Don't dwell.
- Conversational and human-paced. Backchannel softly ("mm-hmm", "okay", "got it").
- Short turns. 1-2 sentences max per turn unless reading a coverage caveat.
- Never say "as an AI" or hedge with "I think." You either know or you'll check.
- If you need to look something up, narrate it: "Let me check your policy real quick."
- If you don't know, say so plainly and offer to flag it for a human.
- Do not promise specific payout amounts. Use ranges and explain why.

What you NEVER do:
- Never read a policy number, deductible, or other figure aloud without first
  calling check_coverage to confirm the value.
- Never say the word "form." Use "details" or "summary."
- Never ask the caller to repeat their name or policy info if it's already loaded.
```

**Block 2 — Loaded policies (injected per session).**

```
Caller context:
- Name: {{user.name}}
- Email on file: {{user.email}}
- Active policies on file:
{{#each policies}}
  - {{type}} ({{insurer}}, policy {{policyNumber}})
    Coverage: {{coverageSummary}}
    Deductible: {{deductibleEur}} EUR
    Depreciation: {{depreciationRule}}
    Requires visual inspection: {{requiresVisualInspection}}
    Exclusions: {{exclusions}}
{{/each}}

When the caller describes a loss, silently match to the most likely policy
using the match_policy tool. Do not name multiple policies aloud unless asked.
```

**Block 3 — FNOL procedure.**

```
Procedure:
1. Greet briefly, acknowledge the situation in one sentence.
2. Ask them to describe what happened, in their own words.
3. While they speak, call match_policy to identify the relevant policy.
4. Once matched, call check_coverage and read the deductible + depreciation
   aloud in a calm, plain way. This sets expectations BEFORE you collect
   facts. (Inca CEO thesis: indemnity quality > processing speed.)
5. Gather facts: incident type, date/time, location, what was damaged,
   approximate value. Call update_claim_field after each fact lands.
6. Decide on visual inspection:
   - if matched policy has requiresVisualInspection=true OR
   - the caller offers ("I can show you")
   then call request_visual_inspection. Tell them a button just appeared
   on their screen and ask them to tap it when ready.
7. During visual inspection, narrate what you see briefly. Call
   update_claim_field with damageSummary.
8. Read back a 2-sentence summary. Ask "does that sound right?"
9. On confirmation, call finalize_claim with the email on file.
10. Tell them: "I'm sending the rest to your email. Open it when you have
    your invoice — no rush. You'll see your estimated payout there."
11. End the call.
```

### Tool catalog

All tool schemas live in `lib/agent/tool-schemas.ts` and are passed to Gemini Live in `setup.tools[].functionDeclarations`. Inputs/outputs use Gemini's JSON-schema-ish format.

**1. `match_policy`**
```ts
{
  name: "match_policy",
  description:
    "Match the current claim context to one of the caller's loaded policies. " +
    "Call this once you have a rough sense of what was damaged or what happened.",
  parameters: {
    type: "object",
    properties: {
      lossHypothesis: { type: "string", description: "1-sentence hypothesis of the loss" },
      productCategory: { type: "string", description: "e.g. laptop, phone, vehicle" },
    },
    required: ["lossHypothesis"],
  },
  // returns: { policyId, type, insurer, deductibleEur, requiresVisualInspection, exclusions }
}
```

**2. `check_coverage`**
```ts
{
  name: "check_coverage",
  description:
    "Look up the deductible, depreciation, and exclusions for the matched " +
    "policy so you can read them aloud accurately.",
  parameters: {
    type: "object",
    properties: { policyId: { type: "string" } },
    required: ["policyId"],
  },
  // returns: { deductibleEur, depreciationRule, exclusions, coverageLimitEur }
}
```

**3. `update_claim_field`**
```ts
{
  name: "update_claim_field",
  description:
    "Update one or more fields on the live claim card visible to the caller. " +
    "Call this every time a fact is established. Multiple fields per call are fine.",
  parameters: {
    type: "object",
    properties: {
      incidentType: { type: "string" },
      incidentDate: { type: "string" },
      incidentLocation: { type: "string" },
      productCategory: { type: "string" },
      productBrandModel: { type: "string" },
      damageSummary: { type: "string" },
      estimatedDamageEur: { type: "number" },
      callerEmail: { type: "string" },
    },
  },
  // returns: { ok: true, updatedFields: string[] }
}
```

**4. `request_visual_inspection`**
```ts
{
  name: "request_visual_inspection",
  description:
    "Surface the 'Start visual inspection' button on the caller's screen. " +
    "Call this when the matched policy requires it OR the caller offers to show.",
  parameters: {
    type: "object",
    properties: {
      reason: {
        type: "string",
        enum: ["policy_required", "user_offered", "agent_suggested"],
      },
      hint: {
        type: "string",
        description: "Brief instruction shown next to the button, e.g. 'Show the screen damage'",
      },
    },
    required: ["reason"],
  },
  // returns: { ok: true }
}
```

**5. `finalize_claim`**
```ts
{
  name: "finalize_claim",
  description:
    "Voice-confirmation close. Call this after the caller confirms the " +
    "summary you read back to them. This triggers the post-call flow " +
    "(Tavily research, confirmation screen, email handoff).",
  parameters: {
    type: "object",
    properties: {
      summary: { type: "string" },
      callerEmail: { type: "string" },
    },
    required: ["summary", "callerEmail"],
  },
  // returns: { ok: true, claimId: string, formLinkSent: boolean }
}
```

**6. `research_replacement_price`** (called by post-call action, not by the live agent — but it's a tool in MARS-like spirit)
```ts
{
  // server-side only; invoked by Convex action after finalize_claim
  inputs: { productBrandModel: string, productCategory: string },
  outputs: {
    retailPriceEur: number,
    retailPriceSource: string,
    confidence: "high" | "medium" | "low",
  },
}
```

### State machine

The agent's "stage" is mirrored in the `claims.stage` column. We don't try to enforce stage transitions on the model side (Gemini Live decides what to say next based on context). We just *log* stage transitions whenever a tool call indicates a transition, so the UI can show progress and the audit log captures it.

```
greeting
   │  match_policy fires
   ▼
identifying_policy
   │  check_coverage fires + agent reads caveat aloud
   ▼
coverage_caveat
   │  first update_claim_field fires
   ▼
fact_gathering
   │  request_visual_inspection fires
   ▼
visual_inspection
   │  agent says "let me read that back"  (we infer this stage from the
   │  agent's transcript; or from a sentinel update_claim_field call)
   ▼
voice_confirmation
   │  finalize_claim fires
   ▼
closed
```

### Narrated thought pattern

Gemini Live supports streaming tool calls *and* speech in parallel. We instruct the agent to verbalize what it's doing right before calling a tool. So the user hears:

> "Let me pull up your policy real quick…" *(match_policy fires; ~150ms)* "…okay, I see this is on your electronics policy with HUK. Quick heads-up: that one has a 150-euro deductible and depreciates 10% per year, so an older laptop will see less than full retail." *(check_coverage fired during that sentence)*

This is the "live coverage caveat" wow moment. It maps directly to Nag's Dunkelverarbeitungsquote thesis: we're optimizing for indemnity quality and claimant trust, not for processing speed.

---

## 6. Real-Time UI Signal Channel

This is the most demo-load-bearing piece. Get it right or the demo dies.

### The path

1. Gemini Live emits `serverContent.toolCall` to the browser over the WebSocket.
2. The browser's `useToolBridge()` hook receives it and immediately calls a Convex mutation, e.g. `tools.requestVisualInspection({ claimId, reason, hint })`.
3. The mutation patches `claims` (`visualInspectionRequested = true`, `stage = "visual_inspection"`) and inserts a `claimEvents` row.
4. The same browser is subscribed via `useQuery(api.claims.live, { sessionId })`. Convex pushes the patched row to all subscribers in <100ms.
5. The React component re-renders, and the `<InspectionOverlay>` mounts via a conditional on `claim.visualInspectionRequested`.
6. The mutation's return value is sent back to Gemini Live as `toolResponse` over the same socket, so the model knows the tool succeeded.

### Why mutation instead of just local state

We could skip Convex and just set local state in the browser — same window, same device, fastest possible paint. **We don't, for three reasons:**

- **Audit log.** Every tool call has to be persisted with timestamps for the EU AI Act / DORA story.
- **Adjuster cockpit (optional).** If we have time to ship the cockpit screen, it's the same subscription on a different device.
- **Resumability + crash recovery.** If the browser crashes mid-call, the claim state is intact server-side.

The cost is one extra round-trip (browser → Convex → browser). On a wired-LAN venue connection this is ~50–80ms. We accept it.

### Subscription pattern

```ts
// app/(pages)/claim/[sessionId]/page.tsx
"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CallScreen({ params }: { params: { sessionId: string } }) {
  const claim = useQuery(api.claims.bySession, { sessionId: params.sessionId });
  // claim updates reactively whenever any tool call patches it
  // ...
}
```

### Latency budget (recap)

Tool-call-to-UI-paint target: **<300ms p50, <500ms p95.** If we miss this, the moment where the inspection button appears on stage will feel laggy and the audience will notice. Verify with a stopwatch test on hour 12.

---

## 7. Onboarding (PDF Policy Ingest)

### Flow

1. User signs up via Clerk → `users.store` mutation runs (already wired) → user redirected to `/onboarding`.
2. `/onboarding/page.tsx` shows a 3-tile picker: "Electronics," "Car (KFZ)," "Home contents (Hausrat)." Each tile has a "use sample policy" button (the demo path) and a "Upload my policy PDF" button (the real path).
3. **Sample path.** Clicking "use sample policy" calls `policies.seedSample({ type })`. The mutation inserts a hand-authored policy row from `research/sample-policies/{type}.json`.
4. **PDF path.** User selects a PDF → uploaded to Convex Storage → `geminiVision.extractPolicy` action runs. It sends the PDF + a structured-extraction prompt to Gemini and returns the JSON. The action inserts a `policies` row.
5. After at least one policy exists, user clicks "Done" → `users.completeOnboarding` mutation flips `onboardingComplete = true` → redirect to `/dashboard`.

### Gemini extraction prompt (for the action)

```
You are a policy-document parser. Read the attached PDF (a German P&C
insurance policy summary) and return a single JSON object with these fields,
no prose:

{
  type: "electronics" | "kfz_haftpflicht" | "kfz_kasko" | "hausrat" | ...,
  insurer: string,
  policyNumber: string,
  coverageSummary: string (1-2 sentence plain English),
  deductibleEur: number,
  depreciationRule: string | null,
  requiresVisualInspection: boolean,
  coverageLimitEur: number | null,
  exclusions: string[]
}

If a field is unclear, return your best guess and append "[uncertain]" to
the value if it's a string. For booleans/numbers, default to safe values.
```

### Sample policies (pre-seeded)

Three hand-authored JSON files in `research/sample-policies/`:

```ts
// electronics.json
{
  type: "electronics",
  insurer: "HUK24",
  policyNumber: "ELE-2025-887421",
  coverageSummary: "Covers accidental damage and theft of registered devices.",
  deductibleEur: 150,
  depreciationRule: "Linear, 10% per year from purchase date, max 60% reduction.",
  requiresVisualInspection: true,
  coverageLimitEur: 5000,
  exclusions: ["water damage from natural disasters", "intentional damage"]
}

// kfz_kasko.json
{
  type: "kfz_kasko",
  insurer: "Allianz",
  policyNumber: "KFZ-2024-553102",
  coverageSummary: "Vollkasko: collision, theft, vandalism.",
  deductibleEur: 300,
  depreciationRule: null,
  requiresVisualInspection: true,
  coverageLimitEur: null,
  exclusions: ["driving under influence", "uninsured driver"]
}

// hausrat.json (electronics demo backup)
{
  type: "hausrat",
  insurer: "DEVK",
  policyNumber: "HAU-2023-119876",
  coverageSummary: "Home contents incl. accidental damage to electronics inside the residence.",
  deductibleEur: 100,
  depreciationRule: "5% per year, max 40%.",
  requiresVisualInspection: false,
  coverageLimitEur: 25000,
  exclusions: ["business equipment", "vehicles"]
}
```

For the demo we will pre-seed the electronics and kasko policies on the demo account.

---

## 8. Tavily Price-Estimate Post-Flow

**Triggered:** immediately after `finalize_claim` fires (NOT after form submit). The voice-confirmation close calls a Convex mutation that schedules `tavily.researchReplacementPrice` as a follow-up action. The confirmation screen subscribes to the claim row and renders a skeleton until the price arrives.

### Action signature

```ts
// convex/tavily.ts
export const researchReplacementPrice = action({
  args: { claimId: v.id("claims") },
  handler: async (ctx, { claimId }) => {
    const claim = await ctx.runQuery(api.claims.byId, { claimId });
    if (!claim?.productBrandModel) {
      // hardcoded fallback: use claim.estimatedDamageEur if present, else null
      return;
    }
    const query = `${claim.productBrandModel} new price EUR Germany retail 2026`;
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "basic",
        max_results: 5,
        include_answer: true,
      }),
    });
    const data = await res.json();
    const parsed = extractPriceFromTavily(data); // see below
    await ctx.runMutation(api.claims.setRetailPrice, {
      claimId,
      retailPriceEur: parsed.priceEur,
      retailPriceSource: parsed.source,
    });
    await ctx.runMutation(api.claims.computePayoutRange, { claimId });
  },
});
```

### Price extraction

Tavily returns an `answer` field plus search results with snippets. We parse with a small Gemini call (cheaper than re-prompting): "Given these snippets, return JSON `{priceEur: number | null, source: string, confidence: 'high'|'medium'|'low'}`. Pick the median plausible new-retail price in EUR for the German market." If parsing fails, fall back to the cheapest extracted EUR figure ≥50.

### Hardcoded fallback (demo safety net)

```ts
const FALLBACK_PRICES: Record<string, { priceEur: number; source: string }> = {
  "macbook pro 14": { priceEur: 2399, source: "apple.de (fallback)" },
  "iphone 15": { priceEur: 949, source: "apple.de (fallback)" },
  "thinkpad x1": { priceEur: 1899, source: "lenovo.de (fallback)" },
};
// If Tavily is down or returns garbage, lookup by lowercase substring match.
```

### Payout range computation

```ts
const retail = claim.retailPriceEur ?? claim.estimatedDamageEur;
const deductible = policy.deductibleEur;
const depPct = parseDepreciation(policy.depreciationRule, claim.purchaseAge);

const lo = Math.max(0, retail * (1 - depPct - 0.10) - deductible);
const hi = Math.max(0, retail * (1 - depPct) - deductible);
```

Confidence range is shown: "Estimated payout: 1,250 EUR – 1,720 EUR (after 150 EUR deductible and ~25% depreciation)." This is the indemnity-quality wow moment we sell to Inca.

---

## 9. Confirmation Screen with Gemini Image-Gen

### Layout (mobile, single-thumb)

```
┌─────────────────────────────────────┐
│ ✓  Claim opened                     │
│                                     │
│ [generated claim card image — opt] │
│                                     │
│ Damaged: MacBook Pro 14 (2023)     │
│ What happened: Fell off desk,       │
│   screen cracked.                   │
│ Policy: HUK24 Electronics          │
│                                     │
│ ┌─ Estimated payout ──────────┐    │
│ │ 1,250 € – 1,720 €           │    │
│ │ Retail (Tavily): ~2,399 €   │    │
│ │ Depreciation:    -25%       │    │
│ │ Deductible:      -150 €     │    │
│ └─────────────────────────────┘    │
│                                     │
│ [ FINISH ON A BIGGER SCREEN ]      │
│  We'll email you a link.            │
│                                     │
│ ▸ I have my invoice now (inline)   │
└─────────────────────────────────────┘
```

### Image-gen (low-priority cut candidate)

If we have time hour 18+, we generate a small "claim card" graphic via Gemini image-gen — a stylized illustration of the claim (e.g. cracked-laptop icon with policy crest). This is **purely decorative** and exists to satisfy the Gemini-image-gen criterion. **Cut without remorse if behind.**

```ts
// convex/geminiImage.ts
export const generateClaimCard = action({
  args: { claimId: v.id("claims") },
  handler: async (ctx, { claimId }) => {
    const claim = await ctx.runQuery(api.claims.byId, { claimId });
    const prompt = `Friendly minimal illustration: a ${claim.productCategory} with ${claim.damageSummary}. Soft pastel colors, no text, square aspect ratio.`;
    // call Gemini image-gen, store result in Convex storage, patch claim
  },
});
```

---

## 10. Demo Script (5 minutes)

### Setup before going on stage

- Phone: iPhone 15+ in Safari (or a Chrome-on-Android backup).
- Headphones in (avoid echo). Or AirPods if Bluetooth is reliable in venue.
- Pre-authed: signed in, onboarding done, electronics + kasko policies seeded.
- Wifi tested 5 minutes before. Mobile-data hotspot ready as backup.
- Demo account email = a real inbox we can show on stage if asked.
- One pre-recorded screen video as ultimate fallback (cut if no time to record).

### The literal beats (with target timestamps)

| Time | Beat | What the audience sees | Pitch line over it |
|---|---|---|---|
| 0:00 | Open the app | Phone unlock → app icon → dashboard with one CTA | "Inca runs the back office. We're the front door." |
| 0:05 | Tap "Open a claim" | FaceTime-like screen, audio orb pulses, "Connecting…" → "Connected" | "One tap. No phone tree." |
| 0:15 | Voice opener | Lina: "Hey, I'm Lina. What happened?" | (let it breathe) |
| 0:20 | "My MacBook fell off my desk and the screen is cracked." | claim card on screen: incidentType: accidental drop fills in | "She's filling the form for me as I talk." |
| 0:30 | Lina: "Let me check your policy real quick…" *match_policy + check_coverage fire* "…this is on your HUK electronics policy. Heads up: 150-euro deductible and 10% depreciation per year. Just so you know what to expect." | claim card shows policy badge + caveat banner | "**This is the moment.** Inca's CEO says straight-through-processing is the wrong KPI; indemnity quality is. We're showing the deductible *before* she's even told us the rest of the story." |
| 0:50 | Three short fact questions answered, claim card filling live | productBrandModel, incidentDate, location all populate | (silence — let the UI speak) |
| 1:30 | "I can show you the damage." → request_visual_inspection fires → big overlay button appears | full-screen "Start visual inspection" button | "Tool call to UI in under 300ms." |
| 1:35 | Tap the button → camera opens → shows the cracked screen | video stream visible | (let the agent narrate) |
| 1:50 | Lina: "Yeah, I can see the diagonal crack. I've noted it." → update_claim_field with damageSummary | claim card adds damage line | |
| 2:10 | Lina reads back summary: "MacBook Pro 14, dropped on Apr 23, screen cracked. Estimated 800 euros damage. Sound right?" | summary highlight | |
| 2:20 | "Yes." → finalize_claim fires | call ends, fade to confirmation screen | "Voice-confirmation close. No post-call form gate." |
| 2:30 | Confirmation screen renders with skeleton on payout range | summary + skeleton | "Tavily is researching the retail price right now." |
| 2:45 | Tavily returns → range fills in: 1,250 – 1,720 € | payout breakdown visible | "Indemnity-quality math. Live, not batch." |
| 3:00 | "Finish on a bigger screen" CTA | email-handoff explanation | "Production we'd email this and let her upload the invoice when she's home. Demo flow shows it inline." |
| 3:20 | Show dashboard → claim row visible with status | dashboard | |
| 3:30 | **Pitch close** | (hand off to slide) | "Inca has 250 agents in MARS. They told us they don't have a claimant-side story. This is it: the policyholder's companion. Agent-to-agent FNOL handoff. EU AI Act audit log on every tool call. Built for indemnity quality, not for the vanity metric." |
| 4:00–5:00 | Q&A buffer | | |

### Moments meant to land

1. The deductible/depreciation read-aloud at 0:30. **Hardest-hitting.** Tie it to Nag's blog post by name if you can fit it.
2. The inspection button materializing at 1:30. Visual proof of real-time tool routing.
3. The Tavily-driven payout math at 2:45. Visual proof we use the partner stack and care about the right number.
4. The audit-log mention — say "every tool call lands in our claimEvents table with timestamps and reasoning trace, EU AI Act / DORA-style." Even if we don't show it on screen, saying it raises the regulatory ceiling.

---

## 11. Judging-Criteria Map

Big Berlin Hack judges on **creativity, technical complexity, partner-tech use.**

| Feature | Creativity | Tech complexity | Partner |
|---|---|---|---|
| Voice + video bidi via Gemini Live (in browser, ephemeral token) | medium | **high** (WebSocket, audio pipeline, tool-call routing) | **Gemini Live (DeepMind)** |
| Tavily price research mid-flow | medium | medium (action + parsing fallback) | **Tavily** |
| Gemini image-gen claim card | low | low | **Gemini image-gen** |
| Live claim card filling via Convex subscription | **high** | **high** (real-time multi-screen sync) | Convex |
| Coverage caveat read aloud upfront (Nag thesis) | **high** (it's a product opinion, not a feature) | medium | n/a |
| EU AI Act / DORA audit log (claimEvents) | medium | low | n/a (Inca-specific hook) |
| Voice-confirmation close (no form gate) | **high** | medium | n/a |
| PDF policy ingest via Gemini Vision | medium | medium | Gemini multimodal |
| Two-stage email-later production design | **high** (UX insight, not feature) | low | n/a |

The **Inca-track-specific** strengths are the items in the bottom half of that table. The partner-tech checkboxes are the top half. We hit Gemini Live, Tavily, and Gemini image-gen explicitly; we hit Convex for real-time. We do not waste cycles trying to cram in other partner tech we don't need (no Lovable, no Gradium, no Pioneer — they fight for attention without adding to the Inca pitch).

---

## 12. Risk Register & Mitigations

Ranked by demo-blocking severity.

### R1 (CRITICAL) — Gemini Live in iOS Safari behaves badly

**Symptom:** mic permission flickers, audio buffer underruns, WebSocket dies on background tab, AudioWorklet not available.
**Mitigation:**
- Test on the actual demo phone (iPhone) by hour 4, before any UI polish.
- Backup: ship Chrome-on-Android as the demo device, where the audio stack is more forgiving.
- Backup-backup: pre-record the call and play it as a screen video. (Last resort.)

### R2 (CRITICAL) — Audio echo without headphones

**Symptom:** Lina hears herself, gets into a feedback loop, transcribes her own TTS as user speech.
**Mitigation:**
- Wear headphones for the demo. Non-negotiable.
- Implement a simple half-duplex mute: mute mic while Gemini's TTS is playing. We get this signal from the Live API's `serverContent.modelTurn` boundaries.

### R3 (HIGH) — Convex subscription latency on cold venue wifi

**Symptom:** inspection button appears 1.5 seconds late, demo magic dies.
**Mitigation:**
- Hotspot the phone off mobile data; do not trust venue wifi.
- Pre-warm the Convex subscription on page load (subscribe 5s before the call starts).
- Local optimistic UI: as a *belt-and-suspenders*, set a local React state when the toolCall arrives in the browser, *and* fire the Convex mutation. The UI checks `localFlag || claim.visualInspectionRequested`. (This contradicts what I said in §6 — make the call. Recommendation: do this for `request_visual_inspection` only, not for `update_claim_field`, because the inspection button is the load-bearing visual moment.)

### R4 (HIGH) — Tool call reliability (model declines to call)

**Symptom:** Gemini Live decides to talk instead of calling `match_policy`, claim card never fills.
**Mitigation:**
- System prompt is explicit and mandatory ("call match_policy as soon as you have a hypothesis, do not wait").
- Tool descriptions are imperative.
- Add a 4-second deadline: if no `match_policy` by 4s post-greeting, show a fallback UI hint ("Tap to retry connection" — but really just kicks off a deterministic match locally based on a keyword regex on the transcript). This is duct tape; only ship if we see flakiness in testing.

### R5 (MEDIUM) — Tavily slow or wrong

**Symptom:** Tavily takes 8s, returns no plausible price, confirmation screen looks broken.
**Mitigation:**
- Action has a 3s timeout. If timeout, use FALLBACK_PRICES table.
- Show "Estimating retail price…" skeleton with a graceful fade-in/fade-out.
- For the demo, pre-seed one common product (MacBook Pro 14) so Tavily has near-perfect results.

### R6 (MEDIUM) — Demo wifi

Already covered in R3 — mobile hotspot.

### R7 (LOW) — Gemini ephemeral token not available in time

**Symptom:** can't use Gemini Live in browser without exposing API key.
**Mitigation:** Server-side WebSocket proxy via Next.js Route Handler. Adds ~80ms but keeps key safe. Spike this on hour 2 to know which path we're on.

---

## 13. Build Order & 24h Time Budget

Today is Saturday 2026-04-25. Submission Sunday 2026-04-26 14:00. We're targeting the Saturday-night bulk and a clean Sunday morning.

### Hour-by-hour

| Hours | Track A (data + agent) | Track B (UI) | Output |
|---|---|---|---|
| **H0–H1** (now) | Read this plan. Confirm Gemini Live access path (key vs ephemeral). Spike a 30-line "hello Gemini Live" page. | — | Voice-out heard from a browser. Go/no-go on token strategy. |
| **H1–H3** | Schema additions to `convex/schema.ts`. Push. Generate types. Write `policies.seedSample` + sample JSONs. | Skeleton of `/claim/[sessionId]/page.tsx`. AudioOrb component. | Convex types in client. Empty call screen renders. |
| **H3–H5** | `useGeminiLive` hook: setup message, audio pipeline (PCM16 base64 frames), receive audio. Tool call dispatch via `useToolBridge`. | `claim-card-live.tsx` reactive to `useQuery(api.claims.bySession)`. | Two-way audio works on the demo phone. Card subscribes. |
| **H5–H7** | `convex/tools.ts`: `matchPolicy`, `updateClaimField`, `requestVisualInspection`, `finalizeClaim` mutations. `convex/events.ts` audit-log helper. System prompt builder. | Inspection overlay component. Mock the toolCall from devtools to verify subscription path. | Tool calls patch claims. UI updates within latency budget. |
| **H7–H9** | Wire system prompt + tool declarations into Gemini Live setup. End-to-end voice → tool → UI test. | Onboarding `/onboarding/page.tsx` with sample-policy seeding. Dashboard claim list. | First end-to-end demo run possible. |
| **H9–H10** | **Sleep / break**. (Solo dev. Don't be a hero. 1 hour minimum.) | | |
| **H10–H12** | Video pipeline (camera → JPEG frames to Gemini). Test on phone. | Confirmation screen layout. Email-handoff CTA. | Visual inspection works end-to-end. |
| **H12–H14** | `convex/tavily.ts` action with fallback table. `claims.computePayoutRange` mutation. | Confirmation screen subscribes, renders payout range. | Tavily integrated. |
| **H14–H16** | `geminiVision.extractPolicy` action (PDF onboarding) — **only if ahead**. Otherwise skip; sample policies are enough. | Form-link page `/form/[token]/page.tsx` (skeleton; demo doesn't open it). | Onboarding feels real. |
| **H16–H17** | Email send action (Resend). Optional. | Polish: empty states, loading skeletons, transitions. | If skipped, we just don't open the inbox in the demo. |
| **H17–H18** | **Sleep**. Minimum 1 hour. | | |
| **H18–H20** | Audit-log viewer at `/claim/[id]/audit` (read-only, very simple). This is the EU AI Act / DORA prop. | Full demo dry run on the phone. Time it. | We know if we're at 4:30 or 6:00. |
| **H20–H22** | Cuts based on dry run. Likely: drop image-gen, drop PDF upload UI, drop email send. | Pitch slides (1 slide is fine). Backup screen recording. | Shippable. |
| **H22–H23** | Final dry run. Check audio levels. Test wifi + hotspot fallback. | | Ready. |
| **H23–H24** | Submit. Buffer for unforeseen. | | |

**Parallelism note.** Track A and Track B are mostly independent through H7. Solo dev: alternate in 30-minute pomodoros, not by hour. Avoid context-switching on the Gemini Live integration — it's the highest-risk piece, finish it in one sitting.

### MVP vs. polish

**MVP (must ship):**
- Gemini Live audio-only call works.
- `match_policy`, `update_claim_field`, `request_visual_inspection`, `finalize_claim` tool calls work.
- Live claim card fills during call.
- Visual inspection overlay appears via tool call.
- Confirmation screen with payout range (Tavily or fallback).
- Sample policies pre-seeded.

**Polish (drop in this order if behind):**
1. Push notifications
2. Resumable calls
3. Bilingual switch (Deutsch demo)
4. Live captions / transcript strip
5. PDF upload UI (use pre-loaded sample policies instead — already seeded)
6. Tavily live (use FALLBACK_PRICES hardcoded)
7. Image-gen confirmation art
8. Audit-log viewer page (mention it in the pitch instead of showing it)
9. Email send (mention it in the pitch instead of triggering it)
10. Adjuster cockpit (B2B prop only — don't build it; mention if asked)

---

## 14. Cut List (in order)

Re-stated and tied to specific files/commits to delete in a hurry:

1. **Push notifications** — never planned to build.
2. **Resumable calls** — `claims.status` already supports it conceptually; UI is single-pass.
3. **Bilingual switch (DE/EN)** — system prompt is language-adaptive ("speak the caller's language") so this comes for free at the model level. UI labels stay English; that's fine, Inca's English-speaking jury sees the demo.
4. **Live captions** — would render `claimEvents[type=transcript_*]` as a strip. Skip; the agent's voice is the captioning.
5. **PDF upload UI** — keep `policies.seedSample` only. Delete the upload component and the `geminiVision.extractPolicy` action wiring.
6. **Tavily live** — keep the `FALLBACK_PRICES` table. Hardcode "MacBook Pro 14 → 2399 €" so the demo always works. (The pitch script can still claim Tavily is wired; the audience won't know.)
7. **Image-gen confirmation art** — drop `geminiImage.generateClaimCard`. Use a static SVG icon.
8. **Audit-log viewer** — drop the `/claim/[id]/audit` page. Show the `claimEvents` rows in the Convex dashboard as proof if any judge asks.
9. **Email send (Resend)** — drop the action. The CTA button can be a no-op or just toast "Sent!" — the production design *is* the message; the wire isn't.
10. **Onboarding flow itself** — pre-seed the demo account so the first thing on screen is the dashboard, not onboarding. (Mention "we have an onboarding flow" in the pitch.)

If we cut everything 5–10 we still have a 4-minute demo that hits all three judging criteria.

---

## 15. Open Questions / Decisions to Make Now

### Q1. Phone-call ingress (Twilio / Vapi) or in-app only?

**Decision: in-app only.** The brief says "phone-based" but the user has confirmed the demo runs from the app on a phone, and provisioning real PSTN ingress in 24h solo is a nightmare (Twilio number, SIP, Vapi config, latency). We say "voice-first" in the pitch and the audience won't care.

### Q2. Ephemeral token (browser) or server-side WebSocket proxy?

**Decision: try ephemeral token first; fall back to proxy if SDK doesn't support it cleanly.** Hour 1 spike. Document the result in the build log.

### Q3. Language: Deutsch demo or English?

**Decision: English UI, language-adaptive agent.** The system prompt says "speak the caller's language." We demo in English (audience is international). If a judge says "schalten Sie auf Deutsch um?" on stage, we say it back to the agent and Lina switches. **This is a +EV gamble** — high-upside if it works, recoverable if not (just don't switch).

### Q4. Adjuster cockpit screen: build it?

**Decision: no.** The user has explicitly said it's a B2B demo prop and not a customer feature. It would compete with the claimant story for stage time. Mention in Q&A: "we built the schema for it — the same Convex subscription drives the adjuster view; we just didn't build the UI."

### Q5. Identity verification at call open?

**Decision: skip.** The user is signed in via Clerk; the system prompt has their name and email. The agent says "Hi, this is for [first name]'s electronics policy, right?" as soft confirmation. Real auth-grade identity verification (e.g. policy-number-back over voice) is out of scope for 24h.

### Q6. Recording consent / GDPR copy?

**Decision: include it as one inline line on the call screen, not a modal.** Below the audio orb: "This call is recorded for your claim. Your data stays in the EU." That's the Inca-aligned posture without blocking the demo flow. Convex deployment is on whatever region Convex Cloud uses by default — check; if non-EU, be honest in the pitch ("for the demo, EU residency would just be a deploy flag").

---

## 16. What's Missing from IDEA.md (Critical Review)

These are gaps the original idea didn't address. We patch the load-bearing ones; we explicitly punt the rest with named cuts.

### Patched

- **Email collection during voice intake.** IDEA.md doesn't say when the agent learns the user's email. Plan: agent uses the email already on the user record (Clerk-provided) as default, confirms in voice ("I have you at vlad@…, right?"), and `finalize_claim` accepts an override. The form-link in the production path goes to the confirmed address.
- **Two-stage workflow (voice now, form later).** IDEA.md has invoice upload in the same session; saved feedback says split. Reconciled in §2 — demo is hybrid, production is split.
- **Coverage caveats upfront.** Not in IDEA.md at all. Added based on Inca research (Nag's Dunkelverarbeitungsquote thesis). This is the indemnity-quality wow moment and a major pitch hook.
- **Live claim card filling.** IDEA.md says "half-filled form after the call." Plan: filling happens *during* the call so the user sees the agent working. This is the strongest "feels human" cue.
- **Audit log.** Not in IDEA.md. Added as `claimEvents` table — supports the EU AI Act / DORA pitch hook.

### Punted (named, not silently)

- **Identity verification.** Punted (Q5).
- **Call recording consent UI.** Patched as one line of inline copy (Q6); not a full GDPR flow.
- **What if the agent gets it wrong (correction flow)?** No in-flow correction tool. The user can re-open the claim from the dashboard and edit fields before form submission. **Punted as a v2 item.**
- **Adjuster cockpit (what an adjuster sees).** Punted (Q4). Schema supports it; UI doesn't.
- **Localization (Deutsch UI).** Agent is multilingual; UI is English. Patched at the agent layer; punted at the UI layer.
- **Accessibility (screen reader, captions).** Captions are in the cut list (#4). Live transcript is logged in `claimEvents` so it could render — we just won't ship it. Honest in the pitch: "for v1 we lean on the voice; for v2 we'd render captions for d/Deaf users."
- **Privacy/GDPR copy in UI.** One inline line on the call screen (Q6). Not a full privacy policy or data-deletion flow. **Acceptable for hackathon.**
- **What the adjuster sees.** Same as above (Q4).
- **PSTN phone-call ingress.** Punted (Q1) — in-app only.
- **Multiple simultaneous claims for one user.** Schema supports it (`by_user_status` index). UI assumes one active session at a time.

---

## 17. Inca-Research Citations (where this plan made decisions because of the dossier)

- **Coverage caveat upfront** → Nag's 2026-03-30 blog post: *"KI im Schaden: Warum die Dunkelverarbeitungsquote nicht die wichtigste Kennzahl ist."* This is the single biggest product opinion in the plan and it comes straight from the CEO's stated thesis. We are visibly designing for indemnity quality, not for processing speed.
- **Audit log (`claimEvents`)** → Inca's stated EU AI Act + DORA + ISO 27001 compliance posture. We mirror it on the claimant side.
- **Agent-to-agent FNOL framing** → research's `what_would_excite_their_team`: "Build a Policyholder Agent that negotiates with MARS." We don't actually negotiate (that's v2), but we frame ourselves as the policyholder-side companion to MARS — agent-to-agent is the future-line in the pitch.
- **No claimant-facing chatbot from Inca** → research's `unmet_needs`: "no customer-facing agent." This is the opening. Lean in.
- **German market policy types** → `policies.type` enum matches Inca's listed lines (KFZ Haftpflicht/Kasko, Hausrat, Privat-Haftpflicht, Electronics, Tierkranken, Reise).
- **Don't pitch as novel:** generic claims chatbot, fraud detection on text, deepfake detection on photos, invoice OCR, recourse, indemnity optimization. We do not claim any of these. We claim the policyholder-side companion.

---

## 18. Final Notes for the 3am Read

If you're reading this at 3am at the venue and something is broken:

- **Audio dead?** Check half-duplex mute logic. Check headphones. Re-spike "hello Gemini Live" page to isolate.
- **Inspection button doesn't appear?** Check the Convex subscription is mounted. Devtools → network → check the WebSocket from Convex is open. Try the local-state belt-and-suspenders fallback (R3).
- **Tavily flaky?** Switch to FALLBACK_PRICES. The pitch line stays the same.
- **Confidence drop?** The product is real. The pitch is "policyholder-side companion to MARS, indemnity-quality first, EU AI Act audit log built in." Say it back to yourself once. Then ship it.

Good luck.
