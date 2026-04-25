# Tavily — Infrastructure Partner Research

**TL;DR**
1. Tavily is the purpose-built web-search/extract/crawl/research API for AI agents — 180ms p50, 99.99% SLA, 1M+ devs, $25M Series A (Aug 2025). ([tavily.com](https://tavily.com))
2. Five endpoints now GA: `/search`, `/extract`, `/crawl`, `/map`, `/research` — with a first-class MCP server (`mcp.tavily.com`) that Claude/Cursor/Windsurf speak natively. ([docs.tavily.com](https://docs.tavily.com), [github.com/tavily-ai/tavily-mcp](https://github.com/tavily-ai/tavily-mcp))
3. Last 90 days (Jan–Apr 2026): `/research` went GA, `exact_match` param, `fast` / `ultra-fast` search depth, `tvly` CLI, `@tavily/ai-sdk` for Vercel AI SDK v5, Cursor MCP Marketplace listing, Nebius infra migration, Nvidia AI-Q Blueprint integration, OpenClaw built-in. ([docs.tavily.com/changelog](https://docs.tavily.com/changelog))
4. Unique angle vs Exa/SerpAPI/Perplexity: Tavily returns clean, LLM-context-ready chunks with citations and a managed multi-angle research workflow — not raw SERPs (SerpAPI), not neural embedding discovery (Exa), not a pre-baked answer (Perplexity Sonar). It's the "RAG-ready building block" API. ([humai.blog](https://www.humai.blog/ai-search-apis-compared-tavily-vs-exa-vs-perplexity/))
5. Free tier: 1,000 credits/mo, no card; PAYG at $0.008/credit; `/search` basic = 1 credit, `/research pro` = 15–250 credits dynamic. Hackathon-friendly. ([tavily.com/pricing](https://tavily.com/pricing), [docs.tavily.com/documentation/api-credits](https://docs.tavily.com/documentation/api-credits))

---

- **what_it_does**: Tavily is a secure, real-time web-data API purpose-built for AI agents and RAG pipelines. Instead of returning raw SERPs, it ships LLM-ready snippets + extracted markdown + citations with sub-200ms p50 latency. The API surface spans reactive search, bulk URL extraction, site crawling, sitemap discovery, and a fully managed multi-step "deep research" endpoint. It's now standard RAG plumbing inside LangChain, Vercel AI SDK, IBM watsonx, Databricks MCP Marketplace, Cursor, Claude Desktop, and Nvidia's AI-Q Blueprint. ([tavily.com](https://tavily.com))

- **primary_sdk_capabilities**:
  - `POST /search` — basic (1 credit) or advanced (2 credits); new `search_depth: fast | ultra-fast` for voice/trading; `exact_match`, `include_favicon`, `include_images`, time-range, domain allow/block, country targeting. ([docs.tavily.com/changelog](https://docs.tavily.com/changelog))
  - `POST /extract` — markdown + images from any URL, 1 credit per 5 URLs basic / 2 credits advanced. ([docs.tavily.com/documentation/api-credits](https://docs.tavily.com/documentation/api-credits))
  - `POST /crawl` — depth/breadth/path-filter site crawl; custom timeout; combines map + extract costs. ([docs.tavily.com](https://docs.tavily.com))
  - `POST /map` — sitemap/structure discovery, 1 credit / 10 pages (2 w/ instructions).
  - `POST /research` — GA Jan 2026, multi-angle workflow → structured report w/ inline citations; `model=mini` 4–110 credits, `model=pro` 15–250 credits dynamic. ([tavily.com/blog/what-tavily-shipped-in-january-26](https://www.tavily.com/blog/what-tavily-shipped-in-january-26))
  - `GET /usage`, `X-Project-ID` header for multi-project cost allocation. ([docs.tavily.com/changelog](https://docs.tavily.com/changelog))
  - **Tavily MCP server** at `https://mcp.tavily.com/mcp/` — OAuth or API-key, exposes `tavily-search`, `tavily-extract`, `tavily-map`, `tavily-crawl`. ([github.com/tavily-ai/tavily-mcp](https://github.com/tavily-ai/tavily-mcp))
  - SDKs: `tavily-python`, `@tavily/core`, `@tavily/ai-sdk` (Vercel AI SDK v5 — Jan 2026), `tvly` CLI (March 2026) w/ REPL + Claude Code/Cursor compat.
  - Enterprise: `POST /generate-keys`, `POST /deactivate-keys`, `GET /key-info` (March 2026).

- **whats_newly_possible** (last 90 days, Jan–Apr 2026):
  - Deep-research in one call with citations (`/research` GA Jan 2026) — no more hand-rolled multi-step agent loops for report generation. ([tavily.com/blog/what-tavily-shipped-in-january-26](https://www.tavily.com/blog/what-tavily-shipped-in-january-26))
  - `ultra-fast` search_depth → viable for voice agents + realtime UIs (previously Tavily was "accurate but slow" vs Serper).
  - Native Vercel AI SDK v5 tools: `tavilySearch`, `tavilyExtract`, `tavilyCrawl`, `tavilyMap` drop-in for any v5 agent.
  - Cursor MCP Marketplace entry (Feb 2026) — one-click install inside Cursor agents. ([tavily.com/blog/what-we-shipped-february-2026](https://www.tavily.com/blog/what-we-shipped-february-2026))
  - Generative UI Research Canvas (LangChain + Tako + CopilotKit) — turns `/research` output into an interactive drill-down surface.
  - OpenClaw onboarding built-in (March 2026). Nvidia AI-Q Blueprint retrieval layer. JetBrains live integration.
  - `tvly` CLI — terminal-native search/extract/crawl/research w/ JSON output, pipeable into shell workflows.
  - Source-linked image retrieval in `/search` (diagrams + charts, not just stock imagery).
  - `exact_match` for compliance/legal precision (Feb 2026).
  - Domain governance at org/key level (allow/block lists enforced centrally — Jan 2026).

- **integration_footprint**:
  - **Auth**: Bearer `tvly-…` API key. Remote MCP also supports OAuth — no key in URL.
  - **Pricing**: Free "Researcher" = 1,000 credits/mo, no card. PAYG = $0.008/credit. Project plan = 4,000 credits/mo. Enterprise = custom. **Students free.** ([tavily.com/pricing](https://tavily.com/pricing))
  - **Credits per call**: search 1–2, extract 1 per 5 URLs (basic), research 4–250 dynamic.
  - **Install**: `pip install tavily-python` / `npm i @tavily/core` / `npx tavily-mcp@latest` / `brew`-style `tvly` CLI.
  - **Latency**: 180ms p50; `ultra-fast` mode available for voice.
  - **SLA**: 99.99% uptime (Enterprise).

- **killer_demo_angle**: The Tavily team leans forward for **agentic workflows that show off `/research` + MCP + Generative UI together** — e.g. an agent that takes an ambiguous business question, fans out multi-angle search automatically (auto-parameters), returns a structured cited report, and renders a live interactive canvas the user can drill into. Bonus points for anything voice-native using `ultra-fast` mode, or anything that uses Tavily as a secure grounding layer against prompt injection / PII leakage (their security story is part of the pitch). Multi-project `X-Project-ID` tenant isolation also resonates with their enterprise push.

- **combinability**:
  - **DeepMind (Gemini 3 / AI Studio)**: Tavily as grounding layer → Gemini synthesizes; pair `/research` with Gemini's long-context window for multi-document reports.
  - **Lovable**: Lovable generates the app UI, Tavily `/search` + `/extract` powers any live-data feature (competitor tracker, news dash, lead enricher) — drop in via `@tavily/ai-sdk`.
  - **Gradium** (*unverified — no public product found to confirm the pairing surface*): if Gradium is the eval/RL harness partner, use Tavily to generate grounded training traces for retrieval agents.
  - **Entire** (*unverified — likely Entire.app orchestration*): Tavily crawl/map → Entire workflow steps for scheduled data pipelines.
  - **Pioneer by Fastino**: Fastino task-specific small models for extraction/classification + Tavily for live retrieval → cheap, fast agentic loops where Fastino does the reasoning and Tavily does the I/O.
  - **Aikido** (security): Tavily's PII/prompt-injection filtering + Aikido's code-security scans = a "safe agent" demo — Aikido verifies generated code, Tavily verifies web inputs.

- **anti_patterns** (avoid — Tavily team sees these daily):
  - "Chatbot that searches the web" — boring, every hackathon submission does this.
  - Generic RAG over PDFs that just happens to also call `/search` once.
  - Using Tavily as a SerpAPI replacement (raw links, no extraction, no research) — that's leaving 90% of the API on the table.
  - Wrapping `/search` in another LLM call to synthesize, when `/research` already does it with citations.
  - Single-endpoint demos — the team wants to see the *combo* (research + crawl + MCP + UI).

- **quick_start_path** (fastest to working demo):
  1. Grab free API key at [app.tavily.com](https://app.tavily.com) (no card, 1,000 credits).
  2. For Claude/Cursor demos: add `https://mcp.tavily.com/mcp/?tavilyApiKey=tvly-…` as a remote MCP — you now have search/extract/map/crawl tools in your agent in 30 seconds.
  3. For app code: `npm i @tavily/core @tavily/ai-sdk` (or `pip install tavily-python`); for Vercel AI SDK v5 agents it's a one-import drop-in.
  4. For the killer demo: call `POST /research` with `model=pro`, feed the structured cited output into the LangChain/CopilotKit Generative UI Research Canvas, and you've got a differentiated submission in a few hours.
  5. CLI exploration: `npx -y tavily-mcp@latest` or install `tvly` CLI for terminal-native iteration and JSON piping.

---

**Sources**
- [tavily.com](https://tavily.com)
- [docs.tavily.com](https://docs.tavily.com) and [changelog](https://docs.tavily.com/changelog)
- [docs.tavily.com/documentation/api-credits](https://docs.tavily.com/documentation/api-credits)
- [docs.tavily.com/documentation/mcp](https://docs.tavily.com/documentation/mcp)
- [github.com/tavily-ai/tavily-mcp](https://github.com/tavily-ai/tavily-mcp)
- [github.com/tavily-ai/tavily-python](https://github.com/tavily-ai/tavily-python)
- Blog: [March 2026](https://www.tavily.com/blog/what-tavily-shipped-in-march-26), [February 2026](https://www.tavily.com/blog/what-we-shipped-february-2026), [January 2026](https://www.tavily.com/blog/what-tavily-shipped-in-january-26), [Auto-Parameters](https://www.tavily.com/blog/rethinking-tool-calling-introducing-tavily-auto-parameters)
- Comparison: [humai.blog Tavily vs Exa vs Perplexity](https://www.humai.blog/ai-search-apis-compared-tavily-vs-exa-vs-perplexity/)

**Unverified flags**
- Gradium and Entire pairing surfaces — no authoritative product pages confirmed; suggestions above are plausible-fit guesses, not validated integrations.
- Exact dollar amount of "Project" plan tier not displayed on pricing page at time of fetch.
