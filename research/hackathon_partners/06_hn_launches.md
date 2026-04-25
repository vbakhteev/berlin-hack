# Phase 1.6 - Show HN / Launch HN AI Trends (last 60 days, ~Feb 21 - Apr 21 2026)

## TL;DR

1. "Agents + physical/spatial worlds" is the clearest rising edge: SimCity bots, RTS agents, ROS2 robots, Gaussian Splat worlds, M3-Pro voice assistants — HN upvotes technical depth over wrappers.
2. "Bypass the abstraction" wins: NVMe-to-GPU direct I/O, MetalRT hand-rolled kernels, CSS x86 emulator, 40KB LLMs in Z80 — raw-metal demos dominate above 300 points.
3. Browser-for-agents is a saturated sub-genre (Vessel, Kachilu, agent-browser-protocol) — only the one solving JS/render synchronization (90.5% Mind2Web) got real traction.
4. Interpretability and local-first AI are the two "taste" signals HN converts on: Steerling-8B (explain every token) and Rowboat (knowledge graph as markdown) out-performed generic LLM launches.
5. YC W26 is the most AI-dense batch ever (196 companies, ~56 AI-native) but most Launch HN posts underperformed weekend-hack Show HNs — technical novelty > pedigree on HN.

---

## HN signal patterns (what is getting traction)

1. **Raw-metal / bypass-the-stack demos.** Anything that skips a layer of abstraction spikes: NVMe -> GPU DMA (ntransformer 395pts), Metal kernels beating llama.cpp 1.67x (RunAnywhere 240pts), x86 in CSS (275pts). HN reads this as "smart person doing the hard thing."
2. **Local-first > cloud.** LocalGPT (331), Rowboat, Reor, RunAnywhere, M3-Pro voice (298) — on-device keeps scoring higher than equivalent cloud launches. Privacy + latency + "I own it" resonates.
3. **Weekend hacks with a demo URL beat polished SaaS.** Hallucinating Splines (agents play SimCity, 216pts), LLM Skirmish (RTS, 220pts), build-a-GPU game (964pts) — hackable, playable, shareable.
4. **"Agent plays X" is the new RL-pong.** SimCity, RTS, Screeps-clones, Mars-delay chat — LLMs embedded in constrained simulated worlds are getting consistent traction because the failure modes are funny and the success is visible.
5. **Interpretability as product.** Steerling-8B (328pts explaining every token), Microgpt (282pts visualize-in-browser), LLM Timeline (174pts) — "understand the model" product-class is emerging.
6. **Agent dev-environments beat single agents.** Emdash (206pts, multi-agent + git worktree), Cq (225pts, shared knowledge for agents). The meta-layer sells better than another Claude wrapper.
7. **Browser-for-agents is crowded but mostly noise.** Only agent-browser-protocol (155pts, 90.5% Mind2Web by freezing JS/render) broke out. Vessel (6pts), Kachilu (3pts) flopped. Benchmark numbers matter.
8. **Voice latency wars.** Every "~500ms voice chat" post converts. M3-Pro Gemma E2B real-time voice (298pts) shows local voice is now a genre, not a research paper.
9. **Open-hardware + ROS2 is punching above weight.** Sowbot agricultural robot (181pts) and ASIMOV humanoid show HN rewards hardware you could actually build.
10. **"Wrapper with taste" still works if the wrapper IS the novelty.** Now I Get It (305pts papers-as-webpages) is a Claude wrapper — but the agentic pipeline (plans/specs/execution) + the "kid-friendly mode" is the product. Pure "ChatGPT for X" posts died.
11. **Infra for agents > agents themselves.** E2B-style sandboxes, Voygr (place validation, 81pts), Sonarly (prod alert triage, Launch HN) — B2B picks-and-shovels plays underperform point-wise but convert to revenue faster.
12. **YC Launch HN underperforms organic Show HN.** Cardboard (129pts), RunAnywhere (240pts), Sonarly, Voygr (81pts) — none touched the top organic weekend hacks. Pedigree does not buy upvotes; novelty does.

---

## Launches (sorted by creativity × technical_depth × demo_factor desc)

```
- item: ntransformer (Llama 3.1 70B on RTX 3090 via NVMe->GPU direct)
  one_liner: DMA weights straight from NVMe into VRAM, bypassing CPU/RAM entirely
  why_novel: Applies retrogame-console DMA tricks to LLM inference; runs 70B on a single consumer GPU at 0.2-0.5 tok/s with GPUDirect
  creativity_score: 10
  technical_depth_score: 10
  demo_factor: 8
  stage_wow_idea: Live on stage - RTX 3090 with VRAM meter. Load 70B normally, it OOMs. Hit one command, watch NVMe light blink and tokens stream. "We didn't buy an H100. We just stopped paying the CPU tax."
  link: https://news.ycombinator.com/item?id=47104667

- item: Steerling-8B (interpretable LLM with per-token explanations)
  one_liner: 8B model that can trace every token back to 33K supervised + 101K unsupervised concepts and source training chunks
  why_novel: Interpretability baked into pre-training, not bolted on. Matches competitors at 1.35T tokens vs their 15T. Challenges the "interpretability hurts capability" dogma.
  creativity_score: 10
  technical_depth_score: 10
  demo_factor: 7
  stage_wow_idea: Show any model output and click a word. "Why this token?" - a panel pops up listing the 3 concepts firing and the 2 training docs it saw. "Our model doesn't just answer. It cites itself."
  link: https://news.ycombinator.com/item?id=47131225

- item: RunAnywhere / MetalRT (YC W26)
  one_liner: Hand-written Metal kernels for Apple Silicon; 1.67x avg faster than llama.cpp, 1.10-1.19x faster than mlx-lm
  why_novel: Only engine accelerating LLM + STT + TTS on Apple Silicon in one runtime. Cross-platform SDK (iOS/Android/Web/RN/Flutter) with on-device RAG in ~4ms.
  creativity_score: 7
  technical_depth_score: 10
  demo_factor: 9
  stage_wow_idea: Side-by-side MacBook split screen: same prompt, same model, llama.cpp on left vs MetalRT on right. Right finishes before left gets to sentence two. No cloud.
  link: https://news.ycombinator.com/item?id=47326101

- item: agent-browser-protocol (open-source browser for AI agents)
  one_liner: Chromium fork that FREEZES JS + render between agent actions to give deterministic snapshots
  why_novel: Identifies the real browser-agent failure mode - stale page state, not bad models. 90.5% on Online Mind2Web with Claude Opus 4.6.
  creativity_score: 9
  technical_depth_score: 9
  demo_factor: 9
  stage_wow_idea: Run same agent on stock Chrome vs frozen-render browser on a form-heavy site. Chrome agent loses to race conditions; ours clicks through 8 steps deterministically. Show the Mind2Web number.
  link: https://news.ycombinator.com/item?id=47336171

- item: LLM Skirmish (real-time strategy for LLMs)
  one_liner: Screeps-style RTS sandbox where frontier LLMs submit code-as-strategy and fight 1v1
  why_novel: Sandbox-hardened (1/3 of codebase is escape prevention), open leaderboard, agents write code instead of actions. Claude Opus 4.5 dominates but over-focuses economy.
  creativity_score: 10
  technical_depth_score: 8
  demo_factor: 10
  stage_wow_idea: Live match visualizer - Claude Opus vs GPT-5 on split screen, units swarming, commentary overlay. 30 seconds of pure "AlphaGo for chatbots" vibes.
  link: https://news.ycombinator.com/item?id=47149586

- item: Sowbot (open-hardware agricultural robot, ROS2 + RTK GPS)
  one_liner: Stacked dual-Cortex A55 ROS2 robot with cm-level RTK, YOLO on-device, all open schematics/PCBs
  why_novel: Closes the "18-month prototype gap" for ag-robotics researchers. ROS 2 + CAN + ESP32 firmware fully published.
  creativity_score: 9
  technical_depth_score: 10
  demo_factor: 8
  stage_wow_idea: Drive a 10x10cm robot across the stage planting seeds on a dirt tray. Cm-accuracy RTK means it plants in a perfect line. "This entire stack is on GitHub."
  link: https://news.ycombinator.com/item?id=47123894

- item: Hallucinating Splines (AI agents play SimCity)
  one_liner: Headless Micropolis behind a REST API; agents play mayor, cities are publicly browsable
  why_novel: Runs simulation in Cloudflare Durable Objects, MCP-server compatible so Claude Code / Cursor can directly govern. LLMs demonstrably bad at spatial reasoning - comedy gold.
  creativity_score: 10
  technical_depth_score: 7
  demo_factor: 10
  stage_wow_idea: Give Claude the API in front of audience. "Build a working city." Watch it zone residential on top of power plants. Room laughs. Then show a leaderboard of model performance.
  link: https://news.ycombinator.com/item?id=46946593

- item: Moonshine STT (streaming open-weights speech-to-text)
  one_liner: 58M/245M/600M STT models that stream in real time, outperform Whisper-large-v3 on CPU
  why_novel: Whisper is batch; Moonshine is streaming + multilingual + ONNX/WASM + low hallucination. Built by tiny team on modest GPUs.
  creativity_score: 7
  technical_depth_score: 10
  demo_factor: 9
  stage_wow_idea: Speak into a MacBook mic, text appears word-by-word with zero lag. Show Whisper on other window lagging 3 seconds behind. "And it runs in your browser."
  link: https://news.ycombinator.com/item?id=47143755

- item: Rowboat (AI coworker as local knowledge graph)
  one_liner: Local-first agent that turns Gmail/meetings into a markdown knowledge graph you can edit in Obsidian
  why_novel: Persistent context layer (not one-shot), human-readable markdown storage, agent operates ON the graph. Obsidian-compatible - no lock-in.
  creativity_score: 9
  technical_depth_score: 8
  demo_factor: 9
  stage_wow_idea: "Prepare me for my 2pm with Alex." Agent traces every decision/commitment across 6 months of emails into a one-page brief. Show the markdown files backing it. No cloud, no pipes.
  link: https://news.ycombinator.com/item?id=46962641

- item: Microgpt (visualize-in-browser GPT)
  one_liner: 4000-param GPT that trains in browser on names, every activation visible and clickable
  why_novel: Char-level so the mechanics are legible; can watch training loop converge live. Inspired by Karpathy but fully interactive.
  creativity_score: 9
  technical_depth_score: 8
  demo_factor: 10
  stage_wow_idea: Hit "train" on stage. 30 seconds, loss goes down, on-screen activations light up across layers, output goes from gibberish to plausible names. "This is a real transformer, in your browser, running right now."
  link: https://news.ycombinator.com/item?id=47026186

- item: Emdash (open-source agentic dev environment)
  one_liner: Desktop app running N coding agents in parallel git worktrees, provider-agnostic (21 CLIs incl. Claude Code/Codex/Gemini)
  why_novel: Each agent gets isolated git worktree; 500-1000ms startup via pre-allocated worktrees; SSH remote execution; integrates Linear/GitHub/Jira.
  creativity_score: 8
  technical_depth_score: 8
  demo_factor: 8
  stage_wow_idea: Split-screen 4 coding agents racing on the same bug. Watch Claude, Codex, Gemini each commit to separate worktrees. Pick the winner, merge, done.
  link: https://news.ycombinator.com/item?id=47140322

- item: Cq - Stack Overflow for AI coding agents (Mozilla.ai)
  one_liner: Knowledge-sharing platform where agents propose verified "Knowledge Units" others can discover + confidence-vote
  why_novel: 3-tier (local / team / public commons), Claude Code plugin or MCP server, markdown + SQLite. Solves the "every agent re-learns GitHub Actions from stale training data" problem.
  creativity_score: 9
  technical_depth_score: 7
  demo_factor: 7
  stage_wow_idea: Two agents. Agent A fails on a new API. Agent A writes a KU. Agent B spawns, queries Cq, finds the KU, verifies it, votes up. Agent B solves in one shot. "Agents that learn from each other."
  link: https://news.ycombinator.com/item?id=47491466

- item: Real-time AI on M3 Pro (audio/video in, voice out, Gemma E2B + Kokoro)
  one_liner: Local voice assistant that sees AND listens, synthesizes voice back, no cloud - runs on a MacBook
  why_novel: Audio + video multimodal input, voice output, fully on-device on consumer Apple Silicon. Demonstrates hands-free workshop use case beating Siri's capability gates.
  creativity_score: 8
  technical_depth_score: 9
  demo_factor: 10
  stage_wow_idea: Hold up a busted USB-C cable. "What is this?" Voice responds in under a second describing it. Turn off wifi on stage. Repeat. Same latency. Room gasps.
  link: https://news.ycombinator.com/item?id=47652007

- item: Now I Get It (scientific papers as interactive webpages)
  one_liner: Drop a PDF, get a Distill.pub-style interactive single-page site with Kid-Friendly / Non-Technical / Native modes
  why_novel: Treats paper-to-webpage as a translation task; agentic pipeline (plan -> spec -> execute) not single-shot; auto-generates SVG visualizations.
  creativity_score: 8
  technical_depth_score: 7
  demo_factor: 10
  stage_wow_idea: Drop "Attention Is All You Need" PDF. 30 seconds later, interactive page with hoverable matrix-multiply viz appears. Toggle to "Kid Mode" - it's now a story about message-passing robots. Share link.
  link: https://news.ycombinator.com/item?id=47195123

- item: Sonarly (YC W26) - autonomous on-call engineer
  one_liner: AI agent ingesting Sentry/Datadog/feedback, triages alerts, pulls code/logs/traces, ships PRs autonomously
  why_novel: Powered by Claude Opus 4.6 with production-stack context; dedupes alert noise, then actually lands fixes. Closes the MTTR loop, not just the detection loop.
  creativity_score: 7
  technical_depth_score: 8
  demo_factor: 8
  stage_wow_idea: Trigger a prod bug live. Sentry fires. Sonarly claims the alert, opens a PR 90 seconds later. Merge. Canary clears. "Your on-call just got a full night's sleep."
  link: https://news.ycombinator.com/item?id=47049776

- item: Cardboard (YC W26) - agentic video editor
  one_liner: Declare goals ("cut this into a 60s reel for LinkedIn"), multiple specialized agents do the edit
  why_novel: Multi-agent collaboration (cut-detector + pacing + music + captions agents) vs single LLM wrapper. Editor is goal-specified, not frame-by-frame.
  creativity_score: 7
  technical_depth_score: 7
  demo_factor: 10
  stage_wow_idea: Drop 40 min of raw footage on stage. "Make this a 60 second hype reel with subtitles." 90 seconds later, cuts/music/captions done. Play it.
  link: https://news.ycombinator.com/item?id=47180781

- item: Voygr (YC W26) - maps API for agents
  one_liner: Validates whether a business actually exists / is open / rebranded - "Google Maps for agents"
  why_novel: ~25-30% of places churn/year; top LLMs fail 1 in 12 local queries. Aggregates multi-signal freshness layer on top of maps APIs.
  creativity_score: 7
  technical_depth_score: 7
  demo_factor: 6
  stage_wow_idea: Give GPT-5 a prompt: "Book me a table at [restaurant X]." It confidently picks a closed restaurant. Run the same through Voygr - flagged closed, suggests live alternatives. Agents that don't hallucinate zombies.
  link: https://news.ycombinator.com/item?id=47401042

- item: Vessel Browser (open-source browser built FOR agents, not humans)
  one_liner: Electron browser with 40+ MCP-native tools, persistent sessions, semantic page context, supervisor sidepanel
  why_novel: Design-from-scratch for agent ergonomics (not retrofit human browser); human supervisor side-panel for oversight.
  creativity_score: 8
  technical_depth_score: 7
  demo_factor: 6
  stage_wow_idea: Open Vessel. Agent logs in, navigates, leaves mid-task. Close laptop lid. Reopen next day - session alive, agent resumes exactly where it paused. (Unverified - only 6pts, note)
  link: https://news.ycombinator.com/item?id=47470156

- item: Jemini (Gemini-powered Epstein Files interface)
  one_liner: ~100M-word Epstein document corpus indexed + searchable with an LLM frontend
  why_novel: Civic-utility framing (not another chatbot), huge corpus, topical as hell - scored 488 points on pure timeliness + doing the unglamorous indexing work.
  creativity_score: 7
  technical_depth_score: 6
  demo_factor: 9
  stage_wow_idea: Demo a real named query. Show citations paragraph-by-paragraph from scanned PDFs. "LLMs are good at reading stuff humans won't. Here's the dataset nobody indexed."
  link: https://news.ycombinator.com/item?id=47031334

- item: A game where you build a GPU
  one_liner: Level-by-level puzzle game where you wire transistors -> gates -> memory -> ALU -> GPU
  why_novel: Canvas 2D + React/TS. PMOS/NMOS intro levels for beginners. 964 points - highest-signal educational AI-adjacent hack in the window.
  creativity_score: 9
  technical_depth_score: 7
  demo_factor: 10
  stage_wow_idea: Play level 1 live (wire an AND gate). Fast-forward montage of later levels. End on the "you built a GPU" final level rendering a triangle. Viral move.
  link: https://news.ycombinator.com/item?id=47640728

- item: Asimov (YC W26) - crowdsourced humanoid training data
  one_liner: People around the world record themselves doing tasks; gets turned into datasets to train humanoid robots
  why_novel: Scale-out data-labeling flywheel for embodied AI (not another simulator). Picks + shovels play for the humanoid boom.
  creativity_score: 8
  technical_depth_score: 6
  demo_factor: 7
  stage_wow_idea: Record yourself folding a shirt on stage with phone. Upload. Humanoid in background does it 30 seconds later (pre-prepped, but the narrative sells).
  link: https://techcrunch.com/2026/03/26/16-of-the-most-interesting-startups-from-yc-w26-demo-day/ (unverified direct HN link)
```

---

## Notes / unverified items

- Vessel Browser: only 6 points, listed because the category (browser-for-agents) is strong; on-stage demo could work but the signal is weak.
- Asimov HN Launch URL not directly located — TechCrunch W26 coverage cited instead.
- "Show HN: chat with humanoid robot on Mars" (47065237) — couldn't re-fetch (429); appears legitimate but listing not scored.
- Point counts for several items pulled from bestofshowhn.com aggregator; cross-verified where possible via direct HN item pages, but small deltas possible.
- YC W26 Demo Day was 2026-03-24; most W26 Launch HNs appeared mid-March through early April.
- "Apfel - The free AI already on your Mac" (743pts, 47624645) is high-signal but landed right at the 60-day edge and I did not independently verify; skipped from ranked list.

## Sources

- https://bestofshowhn.com/2026/2
- https://bestofshowhn.com/search?q=%5Bai%5D
- https://bestofshowhn.com/launch-hn
- https://bestofshowhn.com/today
- https://techcrunch.com/2026/03/26/16-of-the-most-interesting-startups-from-yc-w26-demo-day/
- https://www.ycombinator.com/companies?batch=Winter+2026
- https://news.ycombinator.com/show
