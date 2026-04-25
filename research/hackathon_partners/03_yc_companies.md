# YC W26 / S25 / W25 AI Companies — Problem-Shape Survey

**Research date:** 2026-04-21 · **Agent:** 1.3 · **Batches covered:** W26 (Winter 2026, ~199 cos), S25 (Summer 2025, ~160 cos), W25 (Winter 2025, ~160 cos).

## TL;DR (5 lines)

1. The dominant YC AI thesis has collapsed into **"vertical AI employee replacing a narrow back-office role"** — dental billing, medlegal, immigration law, medspa ops, dental admin, home services, hotel front desk. W26 alone has 10+ companies shipping a headcount-replacement wedge.
2. **Agent infrastructure is the second-largest bet**: background-agent hosting (Terminal Use), orchestration (Tensol), evals/observability (Sentrial, Ashr, Canary, Confident AI), guardrails (Salus, Asteroid), agent-native browsers (Meteor, Browser Use).
3. **Voice AI moved from novelty to regulated verticals** — Medicare enrollment (careCycle), debt collection (Altur), hotel front desks (Riviera), city government (EffiGov), real-estate property managers (Wayline). Voice-first is now the fastest path to "sounds like a human" demos.
4. **The "agent economy" is getting its own financial stack**: Maven (payments infra for voice agents), Sponge, Orthogonal (agentic payments for APIs), Autumn (Stripe for AI startups). Robots-paying-robots is no longer a meme.
5. **Genuinely novel bets that break the mold**: ARC Prize Foundation (a non-profit inside YC), Ndea (Chollet's AGI lab), Pax Historia (grand-strategy AI game), Forum (regulated exchange to trade on attention), Pocket ($27M ARR AI note-taking device), DAIVIN (tankless dive gear). These are the ideas a hackathon team can actually riff on.

---

## Patterns (12)

- **Pattern 1 — Vertical "AI employee" is the default wedge.** Nearly every W26 back-office play frames itself as "AI X for Y vertical": AI front-office for dental, AI accounting, AI medical billing, AI medspa ops, AI home services, AI hotel ops, AI law firm. The wedge is headcount replacement in a narrow SMB vertical with visible CAC payback inside 6 months.
- **Pattern 2 — Voice-first AI has productized into regulated verticals.** Debt collection (Altur), Medicare/ACA enrollment (careCycle), city government (EffiGov), hospitality (Riviera), real-estate ops (Wayline). Voice is no longer a wow moment — it's a compliance play.
- **Pattern 3 — Agent infrastructure is its own stack.** W25+W26 contain an entire platform cake: hosting (Terminal Use "Vercel for background agents"), orchestration (Tensol), guardrails (Salus, Asteroid), evals (Sentrial, Ashr, Canary), fine-tuning (Augento, TrainLoop), context compression (Compresr, Token Company), quantization (Exla), inference (RunAnywhere, Piris). Parallel to web-dev stack circa 2012.
- **Pattern 4 — Agent-native browsing + computer use is the hottest capability bet.** Browser Use (W25) went viral via Manus. Meteor (S25) ships an "agent-native browser." RamAIn (W26) pitches fastest enterprise computer-use. These teams assume the model can click — the moat is reliability/teleop/eval.
- **Pattern 5 — "Cursor for X" has replaced "Copilot for X."** Stilta (Cursor for patent attorneys), Sparkles (every teammate is an engineer), EmDash (agentic dev env), Keystone (AI engineer that fixes prod bugs). The form-factor = IDE-like canvas with in-editor agents.
- **Pattern 6 — Financial rails for machine-to-machine commerce.** Maven, Sponge, Orthogonal, Autumn — payments infra for voice agents, agentic APIs, and AI startups. The bet: agents will transact autonomously and need usage-based billing + compliance shims.
- **Pattern 7 — Robotics data is the new picks-and-shovels.** Human Archive (1,000+ rigs capturing multimodal home/work data), Asimov (egocentric data across 3 continents), One Robot (world models for robot evals), Traverse (long-horizon RL envs), ShoFo (Common Crawl for video). Data collection, not models, is where YC is writing checks.
- **Pattern 8 — Defense + counter-drone + autonomous maritime quietly became a cluster.** Perseus Defense, Milliray, Seeing Systems, Splash (autonomous patrol boats), Juxta, Normal Factory. First sustained YC defense wave post-Anduril halo.
- **Pattern 9 — "AGI labs inside YC" is a real thing now.** Ndea (Chollet, $43M pre-seed), Confluence Technologies (97.9% on ARC-AGI-2), Rubric (post-training at exabyte scale), ARC Prize Foundation. YC used to route these founders to pure research — now it funds them.
- **Pattern 10 — Evaluation/observability for agents is the hottest infra sub-theme.** Sentrial (Datadog for agent reliability), Ashr (multi-modal agent tests), Canary (QA engineer that reads your codebase), Asteroid (runtime supervision), Confident AI (evals/red-team). Every batch since W25 adds 2-4 new players. Clear wedge: nobody can ship agents to prod without this.
- **Pattern 11 — Unusual takes that actually break the mold.** Pax Historia (AI grand-strategy game — play any historical moment), Forum (regulated exchange to trade on attention/virality), Misprint (stock-exchange for Pokémon cards), Doomersion (doomscroll to learn languages), Pocket ($27M-ARR dumb AI note-taking gadget), GRU Space (first hotel on the Moon). Most are consumer or consumer-financial.
- **Pattern 12 — "Dangerous physical world" AI is back.** Red Barn Robotics (autonomous weeding, 15x human speed), GrazeMate (drones that herd cattle), Servo7 (10x manual industry), Remy.Ai (dexterous warehouse), Voltair (autonomous earth-obs drones), Parametric (robotics for hazardous industries), DAIVIN (tankless dive gear). Theme: physical workers in environments humans don't want to be in.

---

## Companies (22, sorted by creativity × technical × demo)

```
- item: Pax Historia
  one_liner: AI grand-strategy game where you can play any moment in history as any actor
  why_novel: LLM as live-simulated opponent/NPC — every historical figure is a generative agent with memory; not a scripted game
  creativity_score: 10
  technical_depth_score: 8
  demo_factor: 10
  stage_wow_idea: Load "Cuban Missile Crisis, Oct 1962, you are Castro" — in 30s the audience watches Kennedy, Khrushchev, and McNamara argue in character via real-time LLM turns
  link: https://www.ycombinator.com/launches?batch=Winter+2026
```

```
- item: Pocket
  one_liner: AI note-taking wearable device — $27M ARR, 30K+ units shipped, 50% MoM growth (unverified ARR)
  why_novel: Tiny dumb hardware + always-on ambient capture + LLM summarization — proves a non-phone AI form-factor can scale
  creativity_score: 8
  technical_depth_score: 7
  demo_factor: 10
  stage_wow_idea: Hand the device to an audience member mid-talk; 30s later project a live-generated summary + action items on screen
  link: https://www.ycombinator.com/companies?batch=Winter+2026
```

```
- item: Forum
  one_liner: First regulated exchange to trade on attention (as a tradeable asset)
  why_novel: Turns virality/engagement into a derivative — novel market design married to AI-generated sentiment oracles
  creativity_score: 10
  technical_depth_score: 7
  demo_factor: 9
  stage_wow_idea: Live chart of "attention index" for a trending tweet, showing a simulated buy/sell ladder updating in real time during the demo
  link: https://www.ycombinator.com/companies?batch=Winter+2026
```

```
- item: Meteor
  one_liner: Agent-native browser — Chromium rebuilt so agents, not humans, are the first-class user
  why_novel: Instead of teaching agents to use Chrome (Browser Use), rebuilds the browser's DOM/events API for agents natively
  creativity_score: 9
  technical_depth_score: 9
  demo_factor: 9
  stage_wow_idea: Side-by-side: same agent prompt runs 4x faster and 10x cheaper vs. stock Chromium, with zero flakiness
  link: https://www.ycombinator.com/companies?batch=Summer+2025
```

```
- item: Pickle
  one_liner: Real-time AI clone for video calls — your lip-synced generative avatar replaces your camera feed
  why_novel: Real-time multimodal generative model running at ~25fps that tracks voice and animates your face simultaneously
  creativity_score: 8
  technical_depth_score: 9
  demo_factor: 10
  stage_wow_idea: Speaker walks on stage in pajamas — the projected "them" on Zoom wears a suit, lip-synced, eye contact intact
  link: https://www.ycombinator.com/companies?batch=Winter+2025
```

```
- item: Browser Use
  one_liner: Open-source library for AI agents to click/fill/navigate real web browsers (W25; 28k+ daily downloads)
  why_novel: De-facto standard for computer-use agents; open-source = every hackathon team can ship a working agent in an afternoon
  creativity_score: 8
  technical_depth_score: 8
  demo_factor: 10
  stage_wow_idea: Type "book me the cheapest flight SFO->BER next Friday" — watch the agent drive a real Kayak tab end-to-end live
  link: https://github.com/browser-use/browser-use
```

```
- item: Doomersion
  one_liner: Doomscroll to learn a language — TikTok-style feed entirely in your target language
  why_novel: Weaponizes short-form-video addiction loops for pedagogy; content is partly AI-generated + translated
  creativity_score: 9
  technical_depth_score: 6
  demo_factor: 9
  stage_wow_idea: Audience picks a language; 30s later a vertical feed auto-generates 3 Spanish reels matched to the user's level
  link: https://www.ycombinator.com/companies?batch=Winter+2026
```

```
- item: Button Computer
  one_liner: Voice-controlled wearable AI pin with native integrations to Slack/Salesforce/Email
  why_novel: Goes hard where Humane/Rabbit failed — tight enterprise integrations, not vague assistants
  creativity_score: 7
  technical_depth_score: 7
  demo_factor: 10
  stage_wow_idea: Speaker taps the pin, says "send Slack to #eng: demo going well" — message appears on screen within 2s
  link: https://www.ycombinator.com/companies?batch=Winter+2026
```

```
- item: Pinch
  one_liner: Real-time voice translation with synchronized lip movement on video calls
  why_novel: Combines real-time ASR + MT + TTS + talking-head generation at conversational latency; zero-shot voice cloning preserves speaker identity
  creativity_score: 8
  technical_depth_score: 10
  demo_factor: 10
  stage_wow_idea: Audience member speaks German on a Zoom call; the projected feed shows them speaking perfect Japanese in their own voice, mouth moving correctly
  link: https://www.ycombinator.com/companies?batch=Winter+2025
```

```
- item: Leaping AI
  one_liner: Voice AI agents that handle up to 70% of inbound calls end-to-end (unverified %)
  why_novel: Not a demo — productized call-center replacement with barge-in, objection handling, CRM write-backs; priced per-minute
  creativity_score: 6
  technical_depth_score: 8
  demo_factor: 10
  stage_wow_idea: Call a phone number live on stage; the AI handles a 90-second support interaction with natural backchanneling
  link: https://www.ycombinator.com/companies?batch=Winter+2025
```

```
- item: Red Barn Robotics
  one_liner: Autonomous weeding robot for farms — 15x faster than a human at a quarter the cost (unverified)
  why_novel: Ex-Apple hardware + computer vision on a tractor — already $5M LOIs signed for growing season
  creativity_score: 7
  technical_depth_score: 9
  demo_factor: 9
  stage_wow_idea: Mini indoor planter with real weeds + a desktop robot arm — watch it pick weeds vs. spare crops live
  link: https://techcrunch.com/2025/03/13/10-startups-to-watch-from-y-combinators-w25-demo-day/
```

```
- item: Splash
  one_liner: Autonomous patrol boats for maritime security — 200-mile test run in SF Bay, 800-mile range
  why_novel: Autonomy stack trained on marine sensor data (radar+vision+AIS fusion); defense-grade reliability as a startup
  creativity_score: 7
  technical_depth_score: 9
  demo_factor: 8
  stage_wow_idea: Mission-control screen with a live drone boat patrolling a harbor; click a contact-of-interest, the boat reroutes
  link: https://techcrunch.com/2025/03/13/10-startups-to-watch-from-y-combinators-w25-demo-day/
```

```
- item: Terminal Use
  one_liner: Vercel for background agents — deploy long-running agents like you'd deploy a web app
  why_novel: Nails the missing primitive: stateful, long-lived, multi-step agent execution with observability baked in
  creativity_score: 8
  technical_depth_score: 9
  demo_factor: 8
  stage_wow_idea: `terminal deploy agent.py`; a live dashboard shows the agent running for 20 minutes across 50 tool calls
  link: https://www.ycombinator.com/companies?batch=Winter+2026
```

```
- item: RamAIn
  one_liner: Fastest enterprise computer-use agents — drives legacy desktop+web apps via pixels+accessibility tree
  why_novel: Benchmarked faster than GPT-computer-use on legacy ERP/EHR workflows; trained on custom enterprise trajectory data
  creativity_score: 7
  technical_depth_score: 10
  demo_factor: 9
  stage_wow_idea: Split-screen: agent processes 100 SAP transactions in the time a human clicks through 5
  link: https://www.ycombinator.com/companies/ramain
```

```
- item: Mango Medical
  one_liner: Foundation models for planning orthopedic surgery
  why_novel: Vertical medical foundation model (not a wrapper) — trained on surgical planning trajectories; regulatory moat
  creativity_score: 8
  technical_depth_score: 10
  demo_factor: 7
  stage_wow_idea: Upload a CT scan, watch the model render a proposed knee-replacement plan in 3D in under 10s
  link: https://www.ycombinator.com/companies?batch=Winter+2026
```

```
- item: Ndea
  one_liner: AGI lab co-founded by François Chollet (Keras creator); $43M pre-funding (unverified)
  why_novel: Bets on program-synthesis / ARC-style abstraction over scaling transformers — a distinct research bet
  creativity_score: 9
  technical_depth_score: 10
  demo_factor: 5
  stage_wow_idea: Live ARC-AGI-2 puzzle on screen: audience tries it; then the model solves it in 3 seconds
  link: https://ndea.com
```

```
- item: Caretta
  one_liner: Real-time AI copilot for live sales calls — whispers objections, pricing, competitor info
  why_novel: Sub-second latency conversational retrieval during a live call; works on Zoom/Meet native audio stream
  creativity_score: 7
  technical_depth_score: 8
  demo_factor: 9
  stage_wow_idea: Live fake sales call on stage; Caretta panel lights up with "they just mentioned budget — here's the ROI slide"
  link: https://www.ycombinator.com/companies?batch=Winter+2026
```

```
- item: Asimov (W26)
  one_liner: Crowdsourced egocentric human-movement dataset for humanoid robot training; live across 3 continents
  why_novel: Scales the rate-limiting input for humanoids — diverse real-world multimodal trajectories, not synthetic
  creativity_score: 7
  technical_depth_score: 8
  demo_factor: 7
  stage_wow_idea: Show 3 first-person Go-Pro clips from 3 countries + resulting humanoid arm motion trained on them
  link: https://www.ycombinator.com/companies?batch=Winter+2026
```

```
- item: Maven
  one_liner: Payments infrastructure for voice agents — "Stripe for agents talking to agents"
  why_novel: First primitive for machine-initiated, machine-authorized voice-channel transactions; handles consent + compliance
  creativity_score: 8
  technical_depth_score: 7
  demo_factor: 8
  stage_wow_idea: Voice agent calls a supplier agent, negotiates a $500 invoice, and settles it — watch the ledger update live
  link: https://www.ycombinator.com/companies?batch=Winter+2026
```

```
- item: Stilta
  one_liner: Cursor for patent attorneys — IDE-style drafting env with agent-assisted claims drafting and prior-art search
  why_novel: Nails a high-priced vertical ($800+/hr labor) with an IDE-shaped product instead of chat
  creativity_score: 7
  technical_depth_score: 7
  demo_factor: 8
  stage_wow_idea: Highlight a patent claim; "find invalidating prior art" fills the side panel with 5 cited refs in 10s
  link: https://www.ycombinator.com/companies?batch=Winter+2026
```

```
- item: Sentrial
  one_liner: Datadog for agent reliability — observability, SLOs, and incident response for agentic systems
  why_novel: Bets that "agents in prod" is now real enough to need APM; tracks tool-call failures, step regressions, cost drift
  creativity_score: 6
  technical_depth_score: 8
  demo_factor: 8
  stage_wow_idea: Live dashboard: agent running in background, fault injected mid-run, alert fires + auto-rollback in under 5s
  link: https://www.ycombinator.com/companies?batch=Winter+2026
```

```
- item: CellType
  one_liner: Foundation models simulating human biology for drug discovery
  why_novel: Trains on single-cell transcriptomics at scale; predicts drug response at cell-type granularity
  creativity_score: 8
  technical_depth_score: 10
  demo_factor: 6
  stage_wow_idea: Pick a disease + a candidate molecule; watch the model render predicted cell-level response in a UMAP in 15s
  link: https://www.ycombinator.com/companies?batch=Winter+2026
```

---

## Notable bench (not scored but worth tracking)

- **Vertical AI employee wave (W26):** Patientdesk.ai, Beacon Health, Eos AI, Overdrive Health, Vector Legal, Legalos, Wayco, Arcline, FullSeam, Balance, Robby, Lance Live, Tepali, Corvera, Ventura — dental / primary care / medlegal / immigration / accounting / home services / hotel / medspa / CPG ops.
- **Voice-in-regulated-vertical wave (S25 + W25):** Altur (debt collection), careCycle (Medicare/ACA), EffiGov (city gov), Wayline (real-estate), Riviera (hotels), April (voice EA).
- **Agent infra bench:** Salus (guardrails), Tensol (orchestration), Glue (interface canvas), Carrot Labs (continuous learning), Cascade (safety for autonomous systems), Ashr, Canary, Confident AI, Asteroid, TrainLoop, Augento, Mastra, AfterQuery.
- **Inference / optimization:** RunAnywhere (on-device, 10k+ stars), Piris Labs (Cerebras-speed), Compresr, Token Company, Exla, Cumulus Labs.
- **Defense/autonomy:** Perseus Defense, Milliray, Seeing Systems, Splash, Voltair, Juxta, Normal Factory, Congruent (AV radar).
- **AGI-research bets:** ARC Prize Foundation, Ndea, Confluence Technologies, Polymath Labs, Rubric, Synthetic Sciences ("Claude Code for Science").
- **Consumer weirdos worth a look:** CodeWisp (natural-language game builder), CatchBack (digital collectible packs), Misprint (Pokémon card exchange), RealRoots (AI-matched female friendship, $782k/mo — unverified), Pingo AI (language tutor, 70% MoM — unverified), GRU Space ("first hotel on the Moon" — speculative).

---

## Caveats / unverified claims

- ARR, MoM growth, and revenue numbers above (Pocket $27M ARR, Pingo $250k/mo, RealRoots $782k/mo, Leaping AI "70% of calls") are founder-reported at Demo Day and not independently verified.
- "35% of W26 in top 20% of YC ever" is a YC-sourced claim; treat as marketing.
- Ndea $43M pre-seed is press-reported, not filed/confirmed.
- Several W26 companies launched under stealth at Demo Day; URLs may resolve to YC directory pages rather than product sites.

## Sources

- https://www.ycombinator.com/companies (directory with batch filter)
- https://www.extruct.ai/research/ycw26/ (W26 199-company deep-dive)
- https://www.extruct.ai/research/ycs25/ (S25 160-company analysis)
- https://techcrunch.com/2026/03/26/16-of-the-most-interesting-startups-from-yc-w26-demo-day/
- https://techcrunch.com/2025/09/15/the-9-most-sought-after-startups-from-yc-demo-day/ (S25)
- https://techcrunch.com/2025/03/13/10-startups-to-watch-from-y-combinators-w25-demo-day/
- https://stealthstartupspy.substack.com/p/stealth-startup-spy-215-y-combinator (W25)
- https://stealthstartupspy.substack.com/p/stealth-startup-spy-270-y-combinator (S25)
- https://www.tldl.io/blog/yc-ai-startups-2026
- https://www.thevccorner.com/p/yc-w26-demo-day-2026-complete-breakdown
