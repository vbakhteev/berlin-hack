# Entire — Infrastructure Partner Research

## TL;DR (5 lines)
1. Entire (entire.io, NOT entire.dev) is Thomas Dohmke's (ex-GitHub CEO) new company — launched Feb 2026 with a $60M seed at $300M valuation led by Felicis; 15 people, "assembly line for the era of agents."
2. "Agent-human collaboration" here means Git-native observability + resumability for coding agents — not a chat UI or approval-workflow product. The platform layer is a Git-compatible database + semantic reasoning layer + AI-native UI (UI still forthcoming).
3. Shipping product today is **Checkpoints**, an open-source (MIT) CLI that hooks into coding agents (Claude Code, Codex, Cursor, Copilot CLI, Gemini CLI, OpenCode, Factory AI Droid) and records full session transcripts/prompts/tool-calls/token usage as versioned metadata on a side branch `entire/checkpoints/v1`.
4. Killer primitive: `entire rewind` / `entire resume <branch>` — any commit becomes a resumable agent save-point across teammates and agents. This is the hackathon hook.
5. No public SDK yet — the "API" is the CLI + the on-disk checkpoint format on a side Git branch. You extend it by reading that branch or by adding agent hooks (agent-specific config dirs like `.claude/settings.json`, `.codex/hooks.json`).

---

- **what_it_does:**
  Entire is building a developer platform for the age where agents — not humans — produce most code. Their thesis (per Dohmke in The New Stack): traditional Git + PR review is the shipping bottleneck, because PRs show diffs without the reasoning that produced them, and agents emit far more context than humans can review. Entire's answer is a three-layer platform: (1) a from-scratch Git-compatible database that unifies code, intent, constraints, and reasoning; (2) a universal semantic-reasoning layer for multi-agent coordination via a "context graph"; (3) an AI-native dev-lifecycle UI (not yet released). The first visible product is **Checkpoints**, a Git-native observability/resumability layer: every agent session (Claude Code, Codex, Cursor, Gemini, Copilot, OpenCode, Factory AI Droid) is captured as a structured checkpoint object keyed to the commit SHA, stored on a separate `entire/checkpoints/v1` branch so code history stays clean. You can `entire rewind` a commit and its agent state together, or `entire resume <branch>` and pick up where a teammate's agent left off. It is MIT-licensed and building in the open on Discord + GitHub Discussions. [[The New Stack](https://thenewstack.io/thomas-dohmke-interview-entire/), [entire.io](https://entire.io), [entire.io announcement](https://entire.io/news/former-github-ceo-thomas-dohmke-raises-60-million-seed-round)]

- **primary_sdk_capabilities:**
  - `entire enable [--agent <name>]` — installs agent-specific hooks into the repo (Claude Code via `.claude/settings.json`, Codex via `.codex/hooks.json`, Cursor via `.cursor/hooks.json`, Copilot via `.github/hooks/entire.json`, OpenCode via `.opencode/plugins/entire.ts`).
  - `entire status` — inspect current live session.
  - `entire rewind` — restore code + session state to a previous checkpoint (not just `git reset`; brings the agent's context back).
  - `entire resume <branch>` — switch branches and rehydrate the agent's session metadata (cross-user / cross-agent handoff).
  - `entire configure` — post-install agent/setting management.
  - `entire clean` / `entire doctor` — GC and repair stuck sessions.
  - `--checkpoint-remote github:org/repo` — push session metadata to a separate repo (team-wide shared agent memory). [[github.com/entireio/cli](https://github.com/entireio/cli)]
  - **Data surface (de-facto API):** append-only Git branch `entire/checkpoints/v1` containing structured checkpoint objects (transcript, prompts, files touched, token usage, tool calls) keyed to commit SHAs. Anyone can `git fetch` this branch and build on it — search, analytics, replay, compliance, coaching tools. [UNVERIFIED: a formal SDK/REST API has not shipped; the public contract is the CLI + the branch format.]
  - Install: `brew install --cask entire` · `curl -fsSL https://entire.io/install.sh | bash` · `scoop install entire/cli` · `go install github.com/entireio/cli/cmd/entire@latest`.
  - Two channels: `stable`, `nightly`.

- **whats_newly_possible (last 90 days):**
  - **Feb 10, 2026:** Entire launches; $60M seed at $300M valuation (reportedly largest dev-tool seed ever). Checkpoints CLI goes open source same day. [[TechCrunch](https://techcrunch.com/2026/02/10/former-github-ceo-raises-record-60m-dev-tool-seed-round-at-300m-valuation/), [GeekWire](https://www.geekwire.com/2026/former-github-ceo-launches-new-developer-platform-with-huge-60m-seed-round/)]
  - Multi-agent session capture expanded from initial Claude Code + Gemini CLI to **also** Codex, Cursor, Copilot CLI, OpenCode, Factory AI Droid (per current README).
  - `--checkpoint-remote` flag enables team-shared agent memory via a separate repo — net new as of this release cycle.
  - Company says full platform (DB + reasoning layer + UI) rolls out later in 2026. Headcount doubling 15 → 30+.

- **integration_footprint:**
  - **Auth:** none required for the CLI itself. Uses your existing Git remote credentials to push the metadata branch; optional `--checkpoint-remote` targets any GitHub repo you can push to.
  - **Pricing:** Entire CLI is MIT-licensed, free. Company business model [UNVERIFIED but per TNS interview]: open-source core + hosted premium service.
  - **Hackathon creds:** none published. They're an "Infrastructure Partner" on the Big Berlin Hack page but no dedicated track/prize/API-key program visible. [UNVERIFIED — ask onsite; most likely they'll hand out swag, Discord invites, and maybe mentor you on Checkpoints integration rather than supply API tokens.] [[luma.com/bigberlinhack](https://luma.com/bigberlinhack)]

- **killer_demo_angle:**
  The team is shipping a tool about **agent context capture + resumability + semantic reasoning across sessions**. The thing that makes Dohmke lean forward is anything that turns the `entire/checkpoints/v1` branch from a passive audit log into a *live substrate for multi-agent coordination*. Concretely:
  - **"Git-native agent memory bus":** Multiple agents (Claude Code writing features, Codex writing tests, Cursor refactoring) commit in parallel; build a small service that reads the shared `entire/checkpoints/v1` branch and surfaces "agent A decided X because Y at SHA Z" so agent B stops re-deriving it — measurable token savings.
  - **"Replay-driven agent eval":** Take the checkpoint transcript + final diff and auto-generate a deterministic regression test suite — directly attacks Dohmke's stated vision of "removing the human review step and replacing it with agent-based testing/compliance checking." [[The New Stack](https://thenewstack.io/thomas-dohmke-interview-entire/)]
  - **"Intent-PR":** A PR reviewer UI that shows the checkpoint (why) next to the diff (what), and lets a reviewer agent approve or challenge the *intent*, not the tokens.
  - **"Checkpoint search / RAG over team's agent history":** every prompt/transcript across the org indexed so the next agent retrieves "we already tried that approach in SHA abc123."
  All four are building *with* Entire's grain (they explicitly call out context loss, review bottleneck, and multi-agent coordination as their problem set).

- **combinability:**
  - **+ DeepMind (Gemini):** Gemini CLI is already a first-class Entire-supported agent. Demo: use Gemini for generation and its multimodal reasoning to *interpret* checkpoints (screenshots, diagrams) and produce human-readable PR narratives from raw session data.
  - **+ Lovable:** Lovable generates apps; pipe every Lovable session through Checkpoints so non-coders who prompt Lovable get a Git-native, reviewable, *rewind-able* audit trail — a very strong "enterprise-ready Lovable" story.
  - **+ Gradium:** Voice agent that lets you *speak* to your checkpoint history ("why did we add the rate limiter last Tuesday?") and replay it. Gradium voice → Entire checkpoint retrieval → agent answers with grounded context.
  - **+ Tavily:** Agents call Tavily for live research; Checkpoints records the query + result in the transcript, so future agents see "we researched X on date Y and got Z" — compounding research memory per repo.
  - **+ Pioneer by Fastino:** Fine-tune small self-training models on your team's checkpoint corpus (every agent decision + outcome) — turn your repo's agent history into custom behavioral models per codebase.
  - **+ Aikido:** Security scanner reads the checkpoint transcript and flags *prompt-injected* or *untrusted-tool-call* sessions before the diff even lands; "supply-chain security for the agent era" story.

- **anti_patterns:**
  - Generic "agent marketplace" — Dohmke's whole pitch is that the *platform layer under* agents is missing; a marketplace is the opposite level of the stack.
  - "AutoGPT for X" / "chat that runs agents" — Entire explicitly is *not* a chat UI and is *not* an orchestration/approval UX layer; pitching them that is a mismatch.
  - Pure CI/CD wrappers. They're building a new DB + reasoning layer, not plumbing.
  - Anything that stores context *outside* Git (proprietary DB, SaaS vault). They chose Git branches on purpose — swimming against that is tone-deaf.
  - Another "code review tool" for humans. Dohmke literally wants to *remove* the human review step. Build the replacement, not a prettier PR viewer.
  - "LLM judge rates PRs" without using checkpoint context — misses the whole point (context > diff).

- **quick_start_path:**
  1. `brew tap entireio/tap && brew install --cask entire` (or `curl -fsSL https://entire.io/install.sh | bash`).
  2. In a test repo: `entire enable --agent claude-code` (or `--agent codex`, etc.). This writes hooks into `.claude/settings.json` and creates the `entire/checkpoints/v1` branch.
  3. Run your agent normally. Commit. `git log entire/checkpoints/v1` — you now have structured session JSONs.
  4. Build your hack as a consumer of that branch: `git fetch origin entire/checkpoints/v1` → parse checkpoint objects → do something novel (search, replay UI, multi-agent memory bus, test generator, security scanner, etc.).
  5. For multi-agent / team demo: use `--checkpoint-remote github:org/shared-memory` so multiple agents/teammates write to one shared branch — this is the substrate for any "collective agent brain" demo.
  6. Community: Discord + GitHub Discussions (linked from entire.io) — reach out early; 15-person team actively wants feedback shaping the roadmap. They'll probably mentor live at Big Berlin Hack.

---

### Cited Sources
- [entire.io](https://entire.io) — official site / landing
- [entire.io announcement](https://entire.io/news/former-github-ceo-thomas-dohmke-raises-60-million-seed-round)
- [entire.io/blog/hello-entire-world](https://entire.io/blog/hello-entire-world)
- [github.com/entireio/cli](https://github.com/entireio/cli) — CLI source, MIT
- [The New Stack interview with Dohmke](https://thenewstack.io/thomas-dohmke-interview-entire/)
- [TechCrunch — $60M seed](https://techcrunch.com/2026/02/10/former-github-ceo-raises-record-60m-dev-tool-seed-round-at-300m-valuation/)
- [GeekWire](https://www.geekwire.com/2026/former-github-ceo-launches-new-developer-platform-with-huge-60m-seed-round/)
- [Thomas Dohmke's X announcement](https://x.com/ashtom/status/2021255786966708280)
- [Big Berlin Hack — Luma](https://luma.com/bigberlinhack)

### Key handles
- **X:** @EntireHQ, founder @ashtom (Thomas Dohmke)
- **GitHub:** github.com/entireio
- **LinkedIn:** Thomas Dohmke — linkedin.com/in/ashtom
- **Community:** Discord + GitHub Discussions (linked from entire.io)
