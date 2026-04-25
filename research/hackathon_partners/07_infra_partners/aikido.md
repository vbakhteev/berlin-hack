# Aikido Security — Infra Partner Brief (Big Berlin Hack, 2026-04-21)

## TL;DR
1. Aikido is a unified AppSec platform (SAST/SCA/DAST/CSPM/IaC/secrets/malware/container/runtime) with a free tier covering 10 repos / 2 users — fully usable for hackathons [unverified exact limits].
2. **They ship an official MCP server (`@aikidosec/mcp`)** that drops into Claude Code, Cursor, Copilot, Codex CLI, Gemini CLI, JetBrains AI, Mistral Vibe and OpenCode, exposing tools like `aikido_full_scan`, `aikido_sast_scan`, `aikido_secrets_scan` — i.e. your agent can scan its own generated code in-loop.
3. **Aikido Infinite** (launched Feb 26 2026) is continuous autonomous AI pentesting with real exploit validation + AutoFix PRs; **Aikido × Lovable** (Mar 24 2026) already pentests vibe-coded apps at $100/test; **Aikido Endpoint** (launched yesterday, Apr 20 2026) blocks risky packages / IDE extensions / AI skills on dev machines.
4. For runtime: **Zen Firewall** (OSS `@aikidosec/firewall`) auto-instruments OpenAI, Anthropic, Mistral, Bedrock, Google GenAI, Vercel AI SDK — tracks models/tokens/cost and emits an AI-BOM. Note: Zen does *not yet* block prompt injection (explicitly stated).
5. They have a REST public API (access token auth, start scans / export issues / SBOM / webhooks) + open-source **SafeChain** CLI wrapping npm/yarn/pnpm/pip against hallucinated packages ("slopsquatting") with a 48h min-age rule.

---

- **what_it_does:** Aikido is the "security HQ" for dev teams — one dashboard rolling up SAST, SCA (deps), secrets, malware, IaC, container images, licenses/SBOM, CSPM, DAST, API scanning, continuous AI pentesting (Infinite), and runtime protection (Zen). Built on Opengrep + an AI reachability engine that claims ~95 percent false-positive reduction. In 2026 they've pivoted hard into AI-security: scanning AI-generated code as it lands (MCP), validating exploitability with autonomous agents (Infinite), protecting the developer endpoint against AI-delivered supply-chain attacks, and instrumenting LLM SDKs at runtime.

- **primary_sdk_capabilities:**
  - **MCP Server** — `npx -y @aikidosec/mcp`, stdio transport, auth via `AIKIDO_API_KEY` (Personal Access Token from `app.aikido.dev/settings/integrations/ide/mcp`). Exposed tools include `aikido_full_scan`, `aikido_sast_scan`, `aikido_secrets_scan`. Works in Claude Code, Cursor, GitHub Copilot (env var must be `COPILOT_MCP_AIKIDO_API_KEY`), Codex CLI, Gemini CLI, JetBrains AI, Mistral Vibe, OpenCode, Windsurf, Kiro. IDE plugin auto-writes rules into every repo so the LLM calls the MCP during generation.
  - **Public REST API** (`apidocs.aikido.dev`) — Bearer token auth; endpoints include `POST startdomainscan`, `GET exportissues`, `GET listopenissuegroups`, `GET exportcoderepolicenses` (SBOM), `GET exportcontainerrepolicenses`, `GET listciscans`, container repo CRUD, webhooks `addwebhook`/`listwebhooks`.
  - **Zen Firewall** — `npm install --save-exact @aikidosec/firewall` (Node), one-line init. Protects against SQLi/NoSQLi, command injection, SSRF, path traversal, prototype pollution, JS injection, IDOR (opt-in), bots. Auto-instruments `openai` 4/5/6, `@anthropic-ai/sdk`, `@mistralai/mistralai`, `@aws-sdk/client-bedrock-runtime`, `ai` (Vercel), `@google/genai` — tracks model, tokens, cost. Generates **AI Bill of Materials** inventorying every LLM service the app talks to (contact-support gated to enable by default). AGPL + commercial dual license.
  - **SafeChain (OSS)** — curl-install'd shell wrapper for `npm`/`yarn`/`pnpm`/`npx`/`pip`. Intercepts installs, checks against **Aikido Intel** threat feed, enforces 48h min package age. 200k+ weekly downloads. No token required.
  - **Aikido Endpoint** — MDM-deployed lightweight agent that blocks risky npm/PyPI/Maven/NuGet packages, VS Code extensions, browser plugins, and AI-agent skill-marketplace installs. Launched Apr 20 2026.
  - **Aikido Infinite** — continuous autonomous pentesting agents that chain multi-step attacks (injection, broken access, SSRF, auth, business-logic), validate exploitability live, and emit AutoFix PRs. Triggered per release.
  - **AutoFix Agent** — one-click PR generation; deterministic for simple fixes, agentic for complex; users can refine fixes in natural language via "AI-Powered Fix Prompts."
  - **IDE plugins** — VS Code, Cursor, Windsurf, Kiro, JetBrains, Eclipse; inline PR comments; full-scan mode added Q1 2026.
  - **AI SAST** (new product line distinct from classic SAST, shipped 2026) — AI reachability engine + Opengrep rules, 15+ languages. Aikido also open-sourced **Opengrep rules for PromptPwnd** (prompt-injection-in-CI/CD detection).

- **whats_newly_possible (last 90 days, ~Jan 21 → Apr 21 2026):**
  - **Apr 20 2026 — Aikido Endpoint** launches: device-level blocking of risky packages/IDE-extensions/browser-plugins/AI-skill-marketplace installs with a 48h min-age rule. [verified via GlobeNewswire press release]
  - **Mar 27 2026 — telnyx PyPI compromise disclosure** (teampcp / canisterworm) — active threat-intel content.
  - **Mar 24 2026 — Aikido × Lovable** integration: one-click pentest on vibe-coded Lovable apps ($100/scope), "Try Fix All" button inside Lovable.
  - **Mar 17 2026 — PromptPwnd** disclosure completed: new class of prompt-injection-in-GitHub-Actions/GitLab-CI bugs hitting Gemini CLI, Claude Code Actions, OpenAI Codex Actions, GitHub AI Inference. Aikido ships free detection in `app.aikido.dev` + open-source Opengrep rules.
  - **Mar 12 2026** — "How Security Teams Fight Back Against AI-Powered Hackers" (framing content).
  - **Feb 26 2026 — Aikido Infinite** GA: continuous AI pentesting with exploit validation + AutoFix. Found 7 CVEs in Coolify, SSRFs in Astro.
  - **Q1 2026 changelog headline items:** "Talk to Aikido" conversational UI for AutoFix/Pentest/Threat-Model; Alibaba Cloud CSPM; Dep Upgrade Analysis; Eclipse IDE plugin; AI Pentest Preview; Kubernetes image scanning; Interactive VM Reachability Diagrams; IDE full-scan.
  - **Q2 2026 (so far):** Ship & Container Reachability; AI-Powered Fix Prompts (refine AutoFix in natural language).
  - Aikido MCP + IDE plugins rolled from preview into GA coverage across 8+ AI assistants in this window.

- **integration_footprint:**
  - **Auth:** Personal Access Token created at `https://app.aikido.dev/settings/integrations/ide/mcp`. Same token works for MCP, public REST API, and CI.
  - **API surface:** MCP (stdio, `npx -y @aikidosec/mcp`) for agentic code scans; REST (`apidocs.aikido.dev`) for dashboard/SBOM/scan orchestration; npm packages `@aikidosec/firewall` and `@aikidosec/mcp`; bash/ps1 installer for SafeChain. Webhooks supported.
  - **Pricing:** Free forever tier (10 repos / 2 users / 250k Zen req/mo — limits [unverified]); Basic/Pro/Advanced/Enterprise paid; 30 percent startup discount. **Aikido for Students** is the full 12-in-1 platform free with a `.edu` email — this is the cleanest hackathon on-ramp if any teammate has a student email.
  - **Hackathon creds:** No explicit public hackathon-credits program found. Playbook: (a) free tier + student accounts, or (b) ping Aikido DevRel on X/LinkedIn pre-event — they are active community-posters and co-ran the Lovable launch live demo, so they are friendly to hackathon partnerships. [unverified whether bespoke credits will be offered for Big Berlin Hack]
  - **Deploy friction:** near-zero. `npx -y @aikidosec/mcp` + token = MCP live in ~30 sec. `npm i @aikidosec/firewall` + one-line require = runtime protection. SafeChain = single curl command.

- **killer_demo_angle (what makes the Aikido team lean forward — this is "AI-security theater on stage"):**
  - **"Watch the agent try to hack itself, live."** Build a simple web app with Claude Code / Cursor + Aikido MCP, push to GitHub, trigger Aikido Infinite on the deployed preview. On-stage split screen: left side = the dev agent coding, middle = Aikido's pentest agent attacking it in a real browser window (they already do live agent-terminal streaming), right = AutoFix PR opening automatically. This mirrors their own Dec 15 2025 demo format and the Lovable March 24 launch — it is exactly the shape they showcase.
  - **"Slopsquatting defeat."** Have Claude Code hallucinate a fake package (`unused-imports` vs. real `eslint-plugin-unused-imports`). With SafeChain installed, the install is blocked mid-stream and Aikido Intel flashes the reason. Aikido published a blog on this — they love seeing it demoed.
  - **"PromptPwnd live."** Show a GitHub Actions workflow where a malicious issue comment hijacks a Copilot/Codex agent and exfiltrates `GITHUB_TOKEN` — then show Aikido's Opengrep rule catching it on PR #2. Very fresh (disclosed 2025-12-04, final update 2026-03-17).
  - **"Vibe-app pentest."** Generate a Supabase-backed app with Lovable or v0, enable the Aikido connector, pentest, one-click Try Fix All. Shows off Aikido × Lovable + Aikido's $100/pentest model.
  - **"AI Bill of Materials."** Instrument an agent with Zen; on stage, show a live ledger of every OpenAI/Anthropic/Bedrock call with model + tokens + cost + anomaly alert — then demonstrate a token-exfil spike being flagged. Hits the California SB 53/AB 489 runtime-guardrails narrative Aikido is already marketing.

- **combinability:**
  - **+ DeepMind / Gemini:** Use Gemini as the coding agent; Aikido MCP auto-scans its output; Infinite pentests the deploy. Aikido already ships a `gemini-cli-mcp` install guide — DeepMind will recognize the flow.
  - **+ Lovable:** Already a shipped integration (Mar 24 2026). Lovable app → Aikido pentest → fix-in-Lovable. Zero glue needed. Strongest combo.
  - **+ Gradium:** If Gradium is grading/benchmarking code, Aikido provides the adversarial ground-truth (real exploits, not lint). Score = "does it survive Aikido Infinite?"
  - **+ Entire:** [unverified what Entire does] — if it's an agent-orchestration layer, wrap every agent tool-call with Zen to get per-agent AI-BOM + token tracking.
  - **+ Tavily:** Tavily's search results are untrusted input. Pipe Tavily output through Zen's prompt-flow rules and the PromptPwnd Opengrep ruleset; demo an agent that googles something malicious and Aikido catches it.
  - **+ Pioneer by Fastino:** Fastino is small/fast models — host Fastino as the AutoFix reviewer that narrates Aikido findings in plain English, or as a guardrail classifier in front of an LLM, with Zen tracking calls.

- **anti_patterns (DON'T do these — boring to them):**
  - "Connect Aikido to a GitHub repo and screenshot the dashboard findings." — They see this every day. No AI layer = no story.
  - "Show a SAST report PDF." — Zero judge excitement.
  - "Build yet another dependency scanner." — they already are the scanner; compete and you lose.
  - "Prompt-injection detection as a standalone research poster." — Zen *doesn't yet* cover prompt injection in-product; they're looking for demos that extend them here, not duplicate research.
  - Long setup before a finding appears. Their on-stage bar is: vulnerability visible within 60 seconds.

- **quick_start_path (≤10 minutes to a working demo):**
  1. `pnpm create vite my-vibe-app` + ship to Vercel/Fly (or just use Lovable for the vibe-coded angle).
  2. Sign up at `app.aikido.dev` with GitHub; free tier, connect repo, pick the demo repo if privacy matters.
  3. Settings → Integrations → IDE → MCP → create Personal Access Token.
  4. In `.claude/mcp.json` (or Cursor/Copilot equivalent):
     ```json
     { "mcpServers": { "aikido": {
         "type": "stdio",
         "command": "npx",
         "args": ["-y", "@aikidosec/mcp"],
         "env": { "AIKIDO_API_KEY": "<token>" }
     }}}
     ```
  5. In the Node backend: `npm i --save-exact @aikidosec/firewall` and require it at the top of `server.js` — instant Zen + LLM tracking.
  6. `curl -fsSL https://github.com/AikidoSec/safe-chain/releases/latest/download/install-safe-chain.sh | sh` for the slopsquatting demo.
  7. In Aikido dashboard → Infinite → run pentest on the deployed URL. Watch agent terminal live.
  8. For stage: pre-seed a vulnerable route (e.g. unauth `/api/notes/:id`) so Infinite finds something in under 60 s.

---

### Sources
- https://www.aikido.dev (homepage, product nav)
- https://help.aikido.dev/mcp/aikido-mcp (MCP overview)
- https://help.aikido.dev/ai-and-dev-tools/aikido-mcp (MCP integration)
- https://help.aikido.dev/ai-and-dev-tools/aikido-mcp/github-copilot (exact JSON config)
- https://help.aikido.dev/mcp/github-copilot, /gemini-cli-mcp, /mistral-vibe-mcp, /opencode-mcp
- https://apidocs.aikido.dev/ (REST API)
- https://github.com/AikidoSec/firewall-node (Zen OSS)
- https://www.npmjs.com/package/@aikidosec/firewall (blocked by 403 for us but confirmed via GH README)
- https://github.com/AikidoSec/safe-chain (SafeChain OSS)
- https://help.aikido.dev/zen-firewall/zen-features/tracking-ai-llm-usage-with-zen-firewall (LLM tracking + AI-BOM)
- https://www.aikido.dev/blog/introducing-aikido-infinite (Infinite, 2026-02-26)
- https://www.aikido.dev/blog/lovable-aikido-pentesting (2026-03-24)
- https://www.aikido.dev/blog/promptpwnd-github-actions-ai-agents (disclosed 2025-12-04, updated 2026-03-17)
- https://www.aikido.dev/blog/slopsquatting-ai-package-hallucination-attacks
- https://www.aikido.dev/blog/owasp-top-10-agentic-applications (2025-12-10)
- https://www.aikido.dev/blog/ai-pentesting-demo (2025-12-15)
- https://www.globenewswire.com/news-release/2026/04/20/3276846/0/en/Aikido-Security-Launches-Endpoint-Protection-for-Developer-Devices-as-Software-Supply-Chain-Attacks-Hit-Unprecedented-Scale.html (Endpoint launch)
- https://www.aikido.dev/code/static-code-analysis-sast (AI SAST)
- https://www.aikido.dev/aikido-for-students (free student access)
- https://www.aikido.dev/pricing (free tier exists; exact limits [unverified])
- https://help.aikido.dev/changelog (Q1/Q2 2026 feature roll-up)
- https://help.aikido.dev/ai-and-dev-tools/how-aikido-uses-ai
- https://thenewstack.io/aikido-self-securing-software/ (third-party coverage)

### Unverified / gaps
- Exact free-tier numerical limits (repo/user/scan caps) — pricing page hides them behind interactive UI.
- Whether Aikido offers bespoke hackathon credits for Big Berlin Hack — no public program found; DM DevRel.
- MCP tool inventory beyond the three observed in the Copilot config (`aikido_full_scan`, `aikido_sast_scan`, `aikido_secrets_scan`) — the server likely exposes more; npmjs page was 403 in our fetch.
- Rate limits on public REST API — referenced in docs but values not extracted.
- Zen prompt-injection coverage — explicitly listed as "not covered" as of the current README; watch for a roadmap item.
