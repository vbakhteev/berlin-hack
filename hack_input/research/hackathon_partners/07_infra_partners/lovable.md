# Lovable (lovable.dev) — Infrastructure Partner Research

**Research date:** 2026-04-21 · For: Big Berlin Hack 2026

## TL;DR (5 lines)

1. Lovable is an agentic "chat-to-app" builder on Claude Opus 4.7 that now ships a full-stack platform — **Lovable Cloud** (Postgres DB, OAuth auth, Edge Functions, storage, custom domain, SSL) — not just a frontend generator.
2. In the last 90 days it got: Claude Opus 4.7 (Apr 17), **code execution + file generation** (PDF/Excel/PPT from chat, Mar 19), **project-wide AI visual edits**, **comments + @Lovable agent threads**, **cross-project `@` references** (Feb 23), **in-app domain purchase w/ auto DNS/SSL**, **Aikido AI pentesting** as a native shared connector.
3. MCP is first-class: **personal connectors** (Notion, Linear, Jira/Confluence, n8n, PostHog, Amplitude, Sanity, Hex, Polar, Granola, Miro, + custom MCP servers) feed the agent context while building; **shared connectors** (Slack, Twilio, Linear, Telegram, Contentful, Twitch, GitLab, S3, Aikido) become callable capabilities in the deployed app.
4. No public REST API to *drive* Lovable from outside (the platform-as-IDE is the product). But Lovable apps can expose their own APIs via Edge Functions; Zuplo is the recommended gateway.
5. Pricing: free tier + Pro $25/mo (100 credits/mo + 5/day rolling) + Teams $30+/mo. No published hackathon-credit program — partnership-based, requires direct ask via `lovable.dev/partners`. (unverified — no Big Berlin Hack specific page found)

---

- **what_it_does:**
Lovable is an agentic AI app builder ("vibe coding"): you chat, the agent generates and iterates a React/TypeScript/Tailwind project, multi-file, with full-stack scaffolding via Lovable Cloud (Postgres, auth, storage, Edge Functions) — then one-click publishes to a `*.lovable.app` domain or a custom domain purchased in-app. The agent runs on Claude Opus 4.7, has Plan Mode (reasoning before editing), Agent Mode (autonomous edits across files + tests + verification), Chat Mode (planning w/o edits), and Dev Mode (hand-edit code inside the IDE). It feels less like a site generator and more like a pair-programmer that owns the whole stack. Source: `https://lovable.dev`, `https://lovable.dev/blog/lovable-2-0`.

- **primary_sdk_capabilities:**
  - **Full-stack codegen**: multi-file React + TS + Tailwind projects; agent explores codebase, runs tests, verifies (`https://lovable.dev/guides/claude-vs-lovable-ai-platform-comparison`)
  - **Lovable Cloud backend** (built on Supabase): Postgres DB, row-level security, auth (Email + Google + Apple OAuth), Edge Functions (JS/TS serverless), file storage, secrets manager, region choice (Americas/EU/APAC). (`https://docs.lovable.dev/integrations/supabase`, changelog Feb 23 2026)
  - **GitHub sync**: two-way code sync so devs can hand-edit, push PRs
  - **In-app domain purchase**: registration + DNS + SSL automated (changelog Apr 2 2026)
  - **Visual edit mode**: click any element (including DB/API-bound dynamic content) and restyle — now free within daily limits
  - **Code execution & generated artifacts**: run code in-chat, output PDF, XLSX, PPTX, CSV (changelog Apr 2 2026, blog Mar 19 2026)
  - **Shared connectors (callable from deployed apps)**: Slack, Twilio, Telegram, Linear, Twitch, Contentful, GitLab, AWS S3, Stripe, Resend, Aikido pentesting, plus direct API-integration of any REST endpoint via Edge Functions + secrets (1000 req/min per connector per project)
  - **Personal connectors (MCP context for agent)**: Notion, Linear, Atlassian (Jira/Confluence), n8n (400+ tools), PostHog, Amplitude, Miro, Sanity, Hex, Polar, Granola, Confidence, Custom MCP servers — the agent reads real PRDs/tickets/designs to ground generation
  - **Workspace Knowledge**: shared rules applied across all projects in a workspace (March 11 2026 blog)
  - **Security Center + Aikido pentesting**: secrets overview, centralized vulnerability scans, publishing controls that block critical-vuln deploys; Aikido agent runs live pentests and generates SOC2/ISO-ready reports (100 Aikido credits per pentest through Jun 2026)
  - **Browser perf profiling**: Core Web Vitals, CPU/memory profiles, long tasks inside the IDE (changelog Apr 2 2026)
  - **Multiplayer + comments**: up to 20 workspace users, in-preview annotations, `@Lovable` tag routes to agent (Lovable 2.0)

- **whats_newly_possible (last ~90 days):**
  - **Apr 17, 2026** — Claude Opus 4.7 available (flagship agent upgrade) (`https://lovable.dev/blog`)
  - **Apr 2, 2026** — code execution + PDF/Excel/PPT generation from chat; `@Lovable` comment threads; in-app domain purchase with automated DNS/SSL; Aikido, GitLab, AWS S3 added as shared connectors; Hex, Confidence, PostHog added as MCP personal connectors; browser perf profiler; Cmd+K command palette redesign (`https://docs.lovable.dev/changelog`)
  - **Mar 24, 2026** — AI pentesting launches platform-wide (`https://lovable.dev/blog/announcing-pentesting`); Test/Live environment split deprecated for new projects
  - **Mar 19, 2026** — spreadsheet→app conversion, document generation, non-technical handoff workflow (blog)
  - **Mar 16, 2026** — Twitch/Twilio/Linear/Telegram/Contentful shared connectors; Polar + Sanity MCP; **custom authentication emails from your own domain** w/ auto SPF/DKIM/DMARC; Nano Banana 2 (Gemini 3.1 Flash Image) for fast image gen; Workspace Knowledge; audit logs (changelog)
  - **Mar 11, 2026** — Workspace Knowledge feature (shared agent rules across projects)
  - **Mar 5, 2026** — engineering post: LLM provider load balancer handling billions of tokens/min with prompt-cache preservation (signals serious infra)
  - **Feb 23, 2026** — **Cross-project `@` referencing** (reuse implementations from other projects); Slack connector; Granola + Amplitude MCP; Claude Opus 4.6 free upgrade; Cloud region selection; non-code deployments (secrets/storage push without rebuild)
  - **Feb 5, 2026** — Claude Opus 4.6 rollout
  - Agent now tests authenticated edge functions while logged in; understands TS projects with IDE-level code intel; generates logos/favicons/OG images on request

- **integration_footprint (zero-to-deployed):**
  1. Go to `https://lovable.dev`, sign up (free tier, no card). Forever-free plan exists.
  2. Prompt the agent describing the app — it generates the project within seconds. Iterate via chat or visual edits.
  3. (Optional) Settings → Connectors → **Personal connectors** to attach MCP servers (Notion, Linear, custom) so the agent reads your PRD/tickets as context.
  4. Ask agent to "add authentication" → Google/Apple OAuth wired via Lovable Cloud. Ask to "add a database for X" → Postgres tables materialize with RLS. Ask to "integrate Stripe" → Edge Function + secret prompt.
  5. (Optional) GitHub sync → edit locally, push back.
  6. Click **Publish** → app goes live on `*.lovable.app` immediately. Custom domain purchase/connect is in-app (auto DNS + SSL).
  7. (Optional) Run Aikido pentest before shipping; vulnerabilities surface in Security view with agent-assisted fixes.

  **Pricing / credits:**
  - Free forever plan (limited daily credits, no card)
  - Pro: **$25/mo**, 100 monthly credits + 5 daily rolling (up to 150/mo), usage-based Cloud + AI, custom domains, no Lovable badge
  - Teams/Business: **$30-$50/mo** shared across users, SSO, audit logs
  - Enterprise: platform-fee, volume credits, SCIM, custom connectors
  - Students: **50% off Pro** (verification)
  - Hackathon credits: **no public program** — must go through `https://lovable.dev/partners` → Hackathon/community sponsorship category. Referral: 10 credits each side. (unverified — no BBH-specific page; recommend confirming with Lovable BD at the event)
  - Current promo (as of 2026-04-21): **"Promo credits 2x until Apr 30"** on homepage

- **killer_demo_angle — what makes the Lovable team lean forward:**
  - **Agent-shaped apps, not form-shaped apps** — a product whose UX changes based on agent state, real-time data, or user identity. Lovable's visual edits now work on *dynamic DB/API content*, so demos that showcase "AI-built UIs reshape themselves based on data" hit their roadmap.
  - **MCP-grounded generation**: pull a Notion/Linear/Confluence doc via MCP and have the agent build the exact app described — live, on stage. This is the flagship differentiator they're selling against Anthropic's Claude Design launch (Apr 17).
  - **Full-stack in under 5 minutes** — start empty, end with auth + DB + custom domain + published. Prove Lovable Cloud is not a toy: seed data, show RLS working, show Google login working.
  - **Agent-assisted security**: ship the app, run Aikido pentest on stage, fix findings via agent, re-publish — the "secure-by-default vibe-coded app" narrative (responds directly to their March 2026 API-flaw press).
  - **Multi-project composition**: use cross-project `@` references to stitch together two Lovable apps into one product — shows their workspace story maturing.
  - **Custom MCP server**: bring your own domain data as MCP, show the agent building a *deeply domain-specific* app no generic builder could produce.

- **combinability with other Big Berlin Hack partners:**
  - **Aikido** — *native* — already a shared connector. Any demo that shows "vibe-code, pentest, fix, ship" is basically their launch story. (`https://docs.lovable.dev/integrations/aikido`)
  - **Tavily** — Lovable agents can call any API via Edge Functions + secrets → wire Tavily web search as a live data tool inside the generated app. Perfect for demos needing "fresh web context" inside a Lovable-built app.
  - **Pioneer by Fastino** — small, fast task-specific models invoked from Lovable Edge Functions for enrichment/classification inside generated apps. Good latency story.
  - **DeepMind / Gemini** — already plumbed (Nano Banana 2 image-gen landed Mar 16). Use Gemini via Edge Functions for multimodal features in the generated app.
  - **Entire** — if Entire provides structured knowledge/agents, expose it as a **custom MCP server** → the Lovable agent grounds generation in Entire's data. This is the highest-signal pairing for Lovable's roadmap.
  - **Gradium** — similar pattern: expose Gradium tooling as custom MCP personal connector so the Lovable agent becomes Gradium-aware during build. (unverified Gradium capabilities)

- **anti_patterns — what exhausts the Lovable team:**
  - Marketing/landing pages, portfolio sites, Linktree clones — their homepage literally lists these as "what you can build," meaning they've seen 10,000 of them.
  - Basic CRUD todo / notes / habit-tracker apps — the demo graveyard.
  - "I built a SaaS clone of [existing product]" — no novel mechanic, just a re-skin.
  - Frontend-only prototypes (HTML/CSS brochure with lorem ipsum) — they want Cloud usage: real DB rows, real auth, real Edge Functions.
  - Demos where the AI was clearly only used for styling — the agent needs to be doing architectural work (data models, auth flows, API integrations).
  - "Chat UI wrapper around GPT" — they compete with Claude Design, they don't want another chatbot.
  - Apps that ignore the multiplayer/workspace story when the demo is inherently collaborative.
  - Anything requiring custom native code or mobile SDKs (React Native not native; mobile is wrapped PWA territory).

- **quick_start_path (fastest to a hackathon-worthy demo):**
  1. Sign up at `https://lovable.dev` (free, no card). Grab any available promo/partnership credits — ask Lovable BD at the event.
  2. Immediately attach ONE personal MCP connector that grounds the domain (Notion doc w/ your PRD, or a custom MCP server exposing your hackathon team's data). Settings → Connectors → Personal connectors.
  3. First prompt: "Build an app that does X for user Y. Use Lovable Cloud for auth (Google sign-in) and a Postgres table for Z. Add an Edge Function that calls [Tavily/Pioneer/etc]." — this forces the agent to use Cloud + external API in one shot (credits-efficient).
  4. Use visual edits for styling tweaks (they're free within daily limits, cheap iteration).
  5. Add `@Lovable` comments on any broken UI element — the agent's "Try to fix" loop is the fastest debug path.
  6. Before demo: run **Aikido pentest** via shared connector, show the Security view, flex the enterprise-grade narrative.
  7. Purchase a custom domain in-app for $10-15; DNS/SSL is automatic. Publish. You now have `yourdemo.com` live.
  8. Open source the project by pushing to GitHub via built-in sync — judges can inspect.

---

## Sources (cited)

- Homepage & pricing: `https://lovable.dev`, `https://lovable.dev/pricing`
- Docs home, Integrations, Changelog: `https://docs.lovable.dev`, `https://docs.lovable.dev/integrations/introduction`, `https://docs.lovable.dev/changelog`
- Supabase / Lovable Cloud: `https://docs.lovable.dev/integrations/supabase`, `https://lovable.dev/faq/backend/supabase`
- MCP blog: `https://lovable.dev/blog/mcp-servers`
- Lovable 2.0 blog: `https://lovable.dev/blog/lovable-2-0`
- Blog index: `https://lovable.dev/blog`
- Aikido integration: `https://docs.lovable.dev/integrations/aikido`, `https://lovable.dev/blog/announcing-pentesting`, `https://www.aikido.dev/partners/aikido-lovable`
- Partners: `https://lovable.dev/partners`
- Anthropic + Lovable webinar: `https://www.anthropic.com/webinars/production-ready-use-cases-lovable`
- Community events: `https://community-events.lovable.app/`
- Zuplo API-gateway pattern: `https://zuplo.com/blog/add-api-gateway-to-lovable-project`
- March 2026 API security incident (context): `https://startupfortune.com/lovables-api-flaw-exposed-private-project-data-from-the-66-billion-ai-app-builder-used-by-nvidia-and-microsoft-teams/`

**Unverified / assumptions flagged:**
- No Big Berlin Hack-specific partnership page or credit allocation found publicly. Hackathon credits appear to be negotiated directly via `lovable.dev/partners`.
- No public REST API for driving Lovable externally (i.e. no "create project via API"). Lovable's IDE is the only entry point; external access comes via GitHub sync or MCP servers the agent reads.
- Custom component library import from npm is implicit (agent can install packages) but not called out as a first-class primitive.
- Pricing for specific Cloud usage (Edge Function invocations, DB storage, bandwidth) not fully enumerated — listed as "usage-based" on the pricing page.
- Gradium / Entire / Pioneer combinability is inferred from Lovable's MCP + Edge Function patterns; their specific SDKs not researched in this doc.
