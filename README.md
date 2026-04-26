# Lina — Voice-First Insurance Claims Agent

**Big Berlin Hack 2026 · Inca Insurance Track**

Lina is an AI-powered FNOL (First Notice of Loss) agent that lets policyholders file insurance claims in under 90 seconds via a natural voice and video conversation — no paperwork, no hold music, no forms to fill at the scene.

---

## The Problem

Filing an insurance claim today means:

- Calling a call center and waiting on hold
- Navigating IVR menus to reach the right department
- Dictating information to an agent who types it into a legacy system
- Receiving zero transparency on deductibles or payout estimates until weeks later
- Returning home to fill out a PDF form from memory

This friction reduces claim quality (inaccurate details) and policyholder satisfaction.

## The Solution

Lina handles the entire FNOL intake in a single mobile call:

1. **Voice call** — Lina identifies the relevant policy automatically and gathers incident facts
2. **Live transparency** — deductible and depreciation rules are read aloud mid-call, before the policyholder hangs up
3. **Visual inspection** — Lina requests camera access to analyze damage on-screen
4. **Instant estimate** — automated price research provides a payout range before the call ends
5. **Async documentation** — a follow-up email link lets the policyholder upload receipts from home

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Mobile Browser (Next.js)                                       │
│                                                                 │
│  ┌─────────────────┐    WebSocket (audio + video frames)        │
│  │  IosCallScreen  │◄──────────────────────────────────────────►│
│  │  (React)        │                                            │
│  └────────┬────────┘         Google Gemini Live API             │
│           │ Convex SDK                                          │
│           │ (real-time subscriptions)                           │
│  ┌────────▼────────────────────────┐                            │
│  │  Convex Backend                 │                            │
│  │  ┌──────────┐  ┌─────────────┐  │   REST API                 │
│  │  │ claims   │  │ tools       │◄─┼──────────── Tavily         │
│  │  │ policies │  │ (mutations) │  │   (price research)         │
│  │  │ users    │  └─────────────┘  │                            │
│  │  └──────────┘                   │                            │
│  └─────────────────────────────────┘                            │
│                                                                 │
│  ┌──────────────────────┐                                       │
│  │  Clerk Auth          │  JWT verification                     │
│  └──────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
```

**Data flow during a call:**

1. User taps "Open a claim" → `claims.create()` Convex mutation
2. Browser opens WebSocket to Gemini Live API with system prompt + tool schemas
3. User speaks → Gemini processes audio, decides to call tools
4. Tool calls route through `useToolBridge` → Convex mutations (real-time DB updates)
5. Convex subscriptions push updates back to the call screen UI instantly
6. On `finalize_claim` tool call → Convex schedules a Tavily price-research action async
7. Payout range appears on confirmation screen within seconds

---

## Tech Stack

| Layer           | Technology               | Purpose                                  |
| --------------- | ------------------------ | ---------------------------------------- |
| Frontend        | Next.js 15 (App Router)  | UI, routing, API routes                  |
| Language        | TypeScript               | Type safety end-to-end                   |
| Styling         | Tailwind CSS + Shadcn/ui | Mobile-first UI components               |
| Auth            | Clerk                    | User authentication + JWT                |
| Database        | Convex                   | Real-time DB + serverless functions      |
| AI Voice        | Google Gemini Live API   | Bidirectional audio/video + tool calling |
| Web Search      | Tavily API               | Product price research                   |
| Validation      | Zod                      | Schema validation                        |
| Forms           | React Hook Form          | Post-call documentation form             |
| Package manager | Bun                      | Faster installs + dev server             |

---

## APIs & Frameworks

### Google Gemini Live API

- **Model:** `gemini-2.0-flash-live-preview-04-09`
- **Transport:** WebSocket (`wss://generativelanguage.googleapis.com/ws/...`)
- **Capabilities used:** bidirectional audio streaming, real-time video frame analysis, function/tool calling, native TTS (voice: "Kore")
- **Integration:** `components/call/use-gemini-live.ts` — manages WebSocket lifecycle, audio/video pipelines, and tool call dispatch
- **Ephemeral tokens:** server-side token endpoint at `/api/gemini/ephemeral-token` issues short-lived keys so the API key is never exposed to the browser

### Convex

- **Version:** 1.18.2
- **Used for:** real-time database (claims, users, policies), serverless mutations called by Gemini tool responses, scheduled actions (Tavily price research), file storage (video frames, uploaded invoices), Clerk webhook handler
- **Schema:** `convex/schema.ts` — tables: `users`, `claims`, `claimMedia`, `claimEvents`, `policyTemplates`

### Clerk

- **Used for:** user authentication, JWT verification in Convex, webhook events to sync users on sign-up
- **Integration:** `@clerk/nextjs` SDK + `convex/auth.config.ts` for server-side JWT validation

### Tavily

- **Endpoint:** `POST https://api.tavily.com/search`
- **Used for:** searching current retail prices for damaged products (e.g., "MacBook Pro 14 M3 price Germany 2024")
- **Integration:** `convex/tavily.ts` — called as an async Convex action after claim finalization; includes hardcoded fallback prices if search fails

---

## Gemini Tool Calling System

The agent has five tools exposed via JSON schema (`lib/agent/tool-schemas.ts`):

| Tool                        | Purpose                                                    |
| --------------------------- | ---------------------------------------------------------- |
| `match_policy`              | Identify which policy type covers the reported incident    |
| `check_coverage`            | Retrieve and read aloud deductible + depreciation rules    |
| `update_claim_field`        | Patch claim record with facts gathered during conversation |
| `request_visual_inspection` | Trigger camera overlay on mobile device                    |
| `finalize_claim`            | Confirm and close the intake; trigger price research       |

Tool responses are routed from the Gemini WebSocket through `components/call/use-tool-bridge.ts`, which calls the corresponding Convex mutation and returns the result back to Gemini within the same WebSocket message cycle.

---

## Claim State Machine

```
greeting
  → identifying_policy   (match_policy tool called)
  → coverage_caveat      (check_coverage tool called)
  → fact_gathering       (update_claim_field called 1–N times)
  → visual_inspection    (request_visual_inspection called)
  → voice_confirmation   (agent reads back summary)
  → closed               (finalize_claim called)
```

Database claim statuses: `call` → `draft` → `in_review` → `accepted` / `rejected`

---

## Payout Calculation

After `finalize_claim`, Convex computes the expected payout:

```
retail_price  = Tavily search result (or hardcoded fallback)
depreciation  = purchase_year_delta × policy.depreciationRatePerYear
                capped at policy.maxDepreciationPct
depreciated_value = retail_price × (1 - depreciation)
payout_range  = [depreciated_value - deductible × 1.05,
                 depreciated_value - deductible × 0.95]
```

Electronics example: MacBook Pro 14 (2023), retail €2399, 2 years × 10% = 20% depreciation, €150 deductible → **expected payout €1700–1769**.

---

## Project Structure

```
berlin-hack/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── (pages)/
│   │   ├── axa/
│   │   │   ├── page.tsx                # Policy dashboard
│   │   │   ├── call/page.tsx           # Live call screen
│   │   │   └── _components/            # AXA-branded UI components
│   │   ├── onboarding/page.tsx         # Policy selection
│   │   ├── form/[token]/page.tsx       # Async documentation upload
│   │   └── pitch/page.tsx              # Demo pitch screen
│   └── api/
│       └── gemini/ephemeral-token/     # Server-side Gemini token endpoint
├── components/
│   ├── call/
│   │   ├── use-gemini-live.ts          # Gemini Live WebSocket hook
│   │   ├── use-tool-bridge.ts          # Tool call → Convex mutation router
│   │   ├── audio-pipeline.ts           # Microphone capture + speaker playback
│   │   └── video-pipeline.ts           # Camera capture (3fps JPEG)
│   └── ui/                             # Shadcn/ui components
├── convex/
│   ├── schema.ts                       # Database schema
│   ├── claims.ts                       # Claim CRUD + lifecycle
│   ├── tools.ts                        # Tool call handlers (mutations)
│   ├── tavily.ts                       # Price research action
│   ├── policyTemplates.ts              # Policy definitions
│   └── users.ts                        # Clerk user sync
├── lib/
│   ├── agent/
│   │   ├── system-prompt.ts            # Lina's persona + behavior instructions
│   │   ├── tool-schemas.ts             # Gemini tool JSON schemas
│   │   └── state-machine.ts            # Claim stage transitions
│   └── axa/
│       └── mock-customer.ts            # Demo user + policy data
└── docs/                               # Internal development docs
```

---

## Setup & Installation

### Prerequisites

- Node.js 20+ or Bun 1.x
- A Convex account — [convex.dev](https://convex.dev)
- A Clerk account — [clerk.com](https://clerk.com)
- A Google AI Studio API key with Gemini Live access — [aistudio.google.com](https://aistudio.google.com)
- A Tavily API key (optional) — [tavily.com](https://tavily.com)

### 1. Clone and install

```bash
git clone https://github.com/vbakhteev/berlin-hack.git
cd berlin-hack
bun install
```

### 2. Set up Convex

```bash
npx convex dev
```

Follow the prompts to create a new Convex project. This will populate `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOYMENT` in `.env.local`.

### 3. Set up Clerk

1. Create a project at [clerk.com](https://clerk.com)
2. Under **JWT Templates**, create a new template and select **Convex**
3. Copy the issuer URL — add it as `CLERK_JWT_ISSUER_DOMAIN` in your Convex dashboard environment variables
4. Copy the publishable and secret keys into `.env.local`
5. Under **Webhooks**, add your Convex HTTP actions URL as the endpoint:
   `https://<your-convex-deployment>.convex.site/clerk-webhook`

### 4. Configure environment variables

Create `.env.local` with:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud
CONVEX_DEPLOYMENT=dev:<your-deployment>

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Google Gemini
GEMINI_API_KEY=AIza...

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

In your **Convex dashboard** environment variables, also set:

```
CLERK_WEBHOOK_SECRET=whsec_...     # From Clerk webhook setup
TAVILY_API_KEY=tvly-...            # Optional, enables live price search
```

### 5. Run

In two separate terminals:

```bash
# Terminal 1 — Convex backend
npx convex dev

# Terminal 2 — Next.js frontend
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

```bash
bun run dev       # Start Next.js dev server (Turbopack)
bun run build     # Production build
bun run start     # Start production server
bun run lint      # ESLint
npx convex dev    # Run Convex backend in watch mode
npx convex deploy # Deploy Convex functions to production
```

---

## Demo User

The app ships with a pre-configured demo user (Max Müller) for the AXA demo flow. After signing in, navigate to `/axa` to see the policy dashboard, then tap **Open a claim** to start a voice session with Lina.

Supported policy types in the demo:

- Electronics (laptop, phone, tablet)
- Car / motor vehicle
- Bicycle
- Pet insurance

---

## License

MIT
