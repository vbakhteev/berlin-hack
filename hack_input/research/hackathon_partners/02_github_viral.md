# Phase 1 / Agent 1.2 — GitHub Viral Repos (Last 60 Days)

_Window: ~2026-02-21 → 2026-04-21. Sources: GitHub trending feeds, shareuhack weekly trending digests, star-history.com, ByteByteGo/NocoBase roundups, Hacker News (BitNet), and aggregators._

## TL;DR (5 lines)
1. **World simulators went real-time**: LingBot-World (Jan 29) + HY-World 2.0 (Apr 16) + HunyuanWorld-Voyager ship sub-second interactive 3D scene generation on commodity GPUs — first legitimate Genie-3-class open source.
2. **Agent skills became the new abstraction**: nuwa-skill sparked a "persona distillation" wave (>20K combined stars across person-named skill repos); Hermes Agent (Nous Research) added 32K stars in one week hitting 65K+ total by Apr 13.
3. **Swarm simulation hit mainstream**: MiroFish spawns 1M autonomous agents for emergent-behavior prediction, pulled 33K+ stars + $4.1M funding in <10 days.
4. **On-device foundation stack matured**: BitNet.cpp (1-bit LLMs, 100B on CPU, HN #1), MiniCPM-o 4.5 (Gemini-2.5-Flash-level full-duplex multimodal on phone), VoxCPM2 (tokenizer-free 30-language TTS), MOSS-TTS-Nano (0.1B TTS on CPU).
5. **Diffusion advanced on two fronts**: Wan2.2 MoE video model (best-in-class open cinematic video) and Lyra 2.0 / SV4D 2.0 / HY-World-Mirror pushing 3D/4D generation into usable-in-production territory.

---

## Repos (sorted by creativity × technical_depth × demo_factor, descending)

```yaml
- item: LingBot-World
  one_liner: Real-time interactive open world simulator — type/steer and it generates a playable 3D scene at 16 FPS with <1s latency.
  why_novel: 28B MoE diffusion transformer with action adapters + distilled block-causal attention + diffusion forcing; first OSS peer to Google Genie 3; minute-long temporal memory.
  creativity_score: 10
  technical_depth_score: 10
  demo_factor: 10
  stage_wow_idea: Type "cyberpunk Berlin alley, rain" — live-generated world appears on stage; presenter walks an avatar through it with WASD, then shouts "add a dragon" and it spawns mid-scene.
  link: https://github.com/Robbyant/lingbot-world

- item: MiroFish
  one_liner: Swarm-intelligence engine that spawns up to 1M autonomous agents with personalities + social graphs to simulate emergent futures.
  why_novel: Built on CAMEL-AI OASIS; converts any document into a knowledge graph, then spawns thousands of LLM-personas with memory, follows, likes, reposts; emergent behaviour instead of task-orchestration.
  creativity_score: 10
  technical_depth_score: 9
  demo_factor: 10
  stage_wow_idea: Paste tonight's hackathon prompt into MiroFish — within 30s, 10k digital Berliners start tweeting about it on a live social graph, and a predicted "winner" emerges from voting dynamics.
  link: https://github.com/666ghj/MiroFish

- item: HY-World 2.0 (Tencent HunyuanWorld)
  one_liner: Multi-modal world model that outputs editable 3D meshes + Gaussian Splats from text, images, or video.
  why_novel: Ships actual game-engine-ready 3D assets (Unreal/Unity importable), not just renders; unifies reconstruction and generation in one foundation model; released 2026-04-16.
  creativity_score: 9
  technical_depth_score: 10
  demo_factor: 10
  stage_wow_idea: Show an iPhone photo of the hackathon venue; 20 seconds later an explorable 3D mesh of that exact room is rotating in a Unity viewport on the big screen.
  link: https://github.com/Tencent-Hunyuan/HY-World-2.0

- item: Hermes Agent (Nous Research)
  one_liner: Self-improving personal agent that writes and refines its own skills after every task; "agent that grows with you".
  why_novel: Implements DSPy + GEPA (Genetic Evolution Prompt Architecture, ICLR 2026 Oral) as a closed-loop self-evolution system; cross-session user-memory model; worktree parallelism and remote $5-VPS backend in v0.8.
  creativity_score: 9
  technical_depth_score: 9
  demo_factor: 9
  stage_wow_idea: Ask Hermes to book a Berlin currywurst tour — it struggles the first time, then replays with a freshly-written skill file and nails it in seconds. Show the diff of the skill it just wrote about itself.
  link: https://github.com/NousResearch/hermes-agent

- item: Genesis
  one_liner: Pythonic generative physics engine — 10–80× faster than Isaac Gym; generates 4D physical worlds from prompts for robotics training.
  why_novel: 24-month, 20-lab collab; pure-Python physics kernel that's faster than CUDA-coded Isaac; converts language prompts into full simulations (envs + reward fns + robot policies + camera motion).
  creativity_score: 9
  technical_depth_score: 10
  demo_factor: 9
  stage_wow_idea: "Generate a kitchen where a humanoid pours coffee" — 15s later a physics-accurate sim is playing, with the robot's RL policy visibly converging in a side panel.
  link: https://github.com/Genesis-Embodied-AI/Genesis

- item: Wan2.2
  one_liner: State-of-the-art open video generation model using Mixture-of-Experts diffusion, trained on 1.5B videos + 10B images.
  why_novel: First MoE applied to video diffusion denoising (A14B two-expert design); cinematic quality rivaling closed commercial models; underpins LingBot-World's backbone.
  creativity_score: 8
  technical_depth_score: 10
  demo_factor: 10
  stage_wow_idea: Prompt-to-film in ~60 seconds: "first-person ride through a Berlin U-Bahn tunnel at night" renders live on screen while the presenter explains the architecture.
  link: https://github.com/Wan-Video/Wan2.2 [UNVERIFIED exact URL — confirm via github.com/Wan-Video]

- item: HunyuanWorld-Voyager
  one_liner: Interactive RGBD video generator conditioned on camera input; exports point-cloud videos directly to 3D formats.
  why_novel: Ultra-long-range world model with native 3D reconstruction baked in; single pass produces both visuals and geometry; aimed at VR/gaming/sim.
  creativity_score: 9
  technical_depth_score: 9
  demo_factor: 9
  stage_wow_idea: Move a virtual camera through a prompt-generated scene; on the second screen show a live point-cloud export dropping into Blender.
  link: https://github.com/Tencent-Hunyuan/HunyuanWorld-Voyager

- item: MiniCPM-o 4.5 (OpenBMB)
  one_liner: 9B end-to-end multimodal model with full-duplex live streaming on a phone — vision, speech, video, all real-time.
  why_novel: Open weights matching Gemini 2.5 Flash on vision+speech; true full-duplex (talks + listens simultaneously) on-device; released early Feb 2026.
  creativity_score: 8
  technical_depth_score: 9
  demo_factor: 10
  stage_wow_idea: Presenter holds up a phone — the phone carries on a live video conversation about the room, interrupts itself when the presenter starts talking, and describes a t-shirt in the crowd.
  link: https://github.com/OpenBMB/MiniCPM-o

- item: Shannon (Keygraph)
  one_liner: Autonomous white-box AI pentester — reads your codebase, finds exploits, then actually executes them.
  why_novel: 96.15% on hint-free source-aware XBOW benchmark; only reports vulns it has proven with a live exploit; built on Claude Agent SDK; gained 21,665 stars in one month.
  creativity_score: 9
  technical_depth_score: 9
  demo_factor: 9
  stage_wow_idea: Point Shannon at a volunteer's hackathon repo live on stage — 90 seconds later it pops a shell via SQLi it discovered, with a replay video of the exploit.
  link: https://github.com/KeygraphHQ/shannon

- item: OpenClaw
  one_liner: Local-first personal AI gateway — connects LLMs to WhatsApp, Telegram, Slack, Discord, Signal, iMessage + 50 other integrations.
  why_novel: Fastest-growing OSS project in GitHub history — 0 → 346K stars in 5 months (beat React's 10-yr record by Mar 3); peak 34K stars/48h; entirely local-first privacy model.
  creativity_score: 7
  technical_depth_score: 8
  demo_factor: 10
  stage_wow_idea: Ask OpenClaw on stage to "plan my evening with the Anthropic team" — it reads Signal + iMessage context, books dinner via WhatsApp bot, adds calendar invite, posts in Slack.
  link: https://github.com/openclaw/openclaw [UNVERIFIED exact URL]

- item: BitNet (microsoft/BitNet)
  one_liner: Official inference framework for 1-bit (ternary) LLMs — runs 100B-parameter model on a single CPU at human-reading speed.
  why_novel: Weights constrained to {-1, 0, +1} (1.58-bit); 2.37×–6.17× CPU speedup, 71.9–82.2% less energy; dominated HN (#1, 370 pts) in March 2026.
  creativity_score: 8
  technical_depth_score: 10
  demo_factor: 8
  stage_wow_idea: Unplug the GPU on stage. Laptop keeps running a 70B assistant smoothly. Crowd gasps.
  link: https://github.com/microsoft/BitNet

- item: Lyra 2.0 (NVIDIA)
  one_liner: Open generative 3D world model — text/image → full scene with real geometry.
  why_novel: NVIDIA's first major open-source world-model drop under Apache 2.0; diffusion-based 3D scene generation with physically plausible occlusions; Lyra 2.0 adds multi-view coherence over Lyra 1.0.
  creativity_score: 8
  technical_depth_score: 9
  demo_factor: 9
  stage_wow_idea: Prompt a "floating market in Venice" — a walkthrough fly-over renders in real time, then pivots to a top-down editable mesh.
  link: https://github.com/nv-tlabs/lyra

- item: nuwa-skill
  one_liner: Claude Code skill that distills any public figure's mental models into an executable "perspective skill".
  why_novel: Novel methodology (6 parallel research streams + 3-predicate mental-model test) produces runnable persona skills (Jobs, Feynman, Munger, Naval...); launched a whole "persona distillation" trend.
  creativity_score: 10
  technical_depth_score: 7
  demo_factor: 9
  stage_wow_idea: Audience shouts a name (e.g., "Werner Herzog"); nuwa spins up a live skill in ~2 min and then uses it to critique the next demo on stage in Herzog's voice and thought patterns.
  link: https://github.com/alchaincyf/nuwa-skill

- item: VoxCPM2 (OpenBMB)
  one_liner: Tokenizer-free 2B-parameter TTS — 30 languages, voice design + true-to-life cloning, 48 kHz.
  why_novel: Tokenizer-free architecture (rare in TTS); "creative voice design" (describe a voice and get it) alongside clone-from-sample; predecessor VoxCPM1.5 hit #1 GitHub Trending.
  creativity_score: 8
  technical_depth_score: 9
  demo_factor: 9
  stage_wow_idea: Audience member speaks 3 seconds into a mic — a minute later they hear themselves reading the hackathon rules in fluent Japanese, Portuguese, and Klingon-styled English.
  link: https://github.com/OpenBMB/VoxCPM

- item: Browser Use (browser-use/browser-use)
  one_liner: #1 OSS browser-automation agent — wraps Playwright with an LLM interpreter for multi-tab flows.
  why_novel: 78K+ stars; spawned an ecosystem (Vercel agent-browser, Hermes integration); real form-fill + download + multi-tab persistence; now the default "browser" backend for bigger agents.
  creativity_score: 7
  technical_depth_score: 8
  demo_factor: 9
  stage_wow_idea: "Book us all Berlin airport transfers for Friday" — stage browser opens, fills 10 forms across 3 providers in parallel tabs, emails confirmations to the crowd.
  link: https://github.com/browser-use/browser-use

- item: Open Computer Use (coasty-ai)
  one_liner: 82% OSWorld-verified OS-control agent — fully open-source, auditable, production-ready.
  why_novel: First OSS to cross 80% on OSWorld Verified; "safe, auditable" design positions it as the production alternative to Anthropic Computer Use.
  creativity_score: 7
  technical_depth_score: 9
  demo_factor: 8
  stage_wow_idea: Hand it the laptop — ask it to "clean up my desktop, file the screenshots by topic" and watch it click/drag across a live macOS desktop while narrating.
  link: https://github.com/coasty-ai/open-computer-use

- item: Pipecat (pipecat-ai)
  one_liner: Open Python framework for real-time voice + multimodal conversational agents.
  why_novel: Transport-agnostic orchestration (WebRTC/SIP/Daily/LiveKit) with pluggable STT/TTS/LLM; emerging as the Twilio-of-voice-AI in 2026 open source.
  creativity_score: 7
  technical_depth_score: 8
  demo_factor: 9
  stage_wow_idea: Call a phone number on stage; a Pipecat-backed voice agent answers, sees your video via WebRTC, and walks you through a live hackathon signup.
  link: https://github.com/pipecat-ai/pipecat

- item: SV4D 2.0 (Stability AI)
  one_liner: Video-to-4D diffusion model for high-fidelity novel-view video synthesis.
  why_novel: Upgrades SV4D with sharper motion, better spatio-temporal consistency; produces coherent 4D assets (3D + time) from a single video input.
  creativity_score: 8
  technical_depth_score: 9
  demo_factor: 8
  stage_wow_idea: Film a 5-second phone clip of someone dancing; 30s later, a free-camera 4D render of that dance appears rotating around them.
  link: https://github.com/Stability-AI/generative-models

- item: Parlor (fikrikarim/parlor)
  one_liner: Fully on-device real-time multimodal AI — voice + vision convo using Gemma 4 E2B + Kokoro, no cloud.
  why_novel: End-to-end local pipeline (STT + vision + LLM + TTS) small enough to run on a MacBook in real time; demonstrates that 2026-class multimodal is a laptop problem now.
  creativity_score: 8
  technical_depth_score: 8
  demo_factor: 8
  stage_wow_idea: Turn off Wi-Fi on stage. Ask the laptop to describe what it sees through the camera; Parlor narrates the crowd in real time.
  link: https://github.com/fikrikarim/parlor

- item: Cognee (topoteretes/cognee)
  one_liner: Knowledge engine for AI agent memory in 6 lines of code — combines vector + graph + cognitive-science approaches.
  why_novel: Treats memory as an evolving graph of meaning, not a RAG dump; "memory OS" concept aligned with 2026 trend toward structured agent memory (MAGMA / EverMemOS / SimpleMem).
  creativity_score: 7
  technical_depth_score: 8
  demo_factor: 7
  stage_wow_idea: Drop a Slack export into Cognee live; 30 seconds later a visually-rendered memory graph lights up with everything the agent now "remembers" about the team.
  link: https://github.com/topoteretes/cognee

- item: NodeTool (nodetool-ai/nodetool)
  one_liner: Drag-and-drop visual builder for AI workflows and agents — connects LLMs, media generation, data, tools.
  why_novel: Full monorepo (TS backend + React frontend + Electron desktop + React Native mobile) — a true ComfyUI alternative aimed at agents, not just images; local-or-cloud runtime parity.
  creativity_score: 7
  technical_depth_score: 7
  demo_factor: 9
  stage_wow_idea: Live-wire an agent on stage (webcam → vision LLM → voice → email) in <90s by dragging five nodes together. It then emails the audience a summary of their reactions.
  link: https://github.com/nodetool-ai/nodetool

- item: MOVA (OpenMOSS)
  one_liner: Scalable synchronized video + audio generation foundation model.
  why_novel: Joint video-audio diffusion with learned cross-modal synchronization — addresses the "silent AI video" problem head-on; open weights.
  creativity_score: 8
  technical_depth_score: 8
  demo_factor: 8
  stage_wow_idea: "Film of a street musician in Kreuzberg at dusk" — video + matching street ambience + a plausible violin line render together, lip-synced on a close-up.
  link: https://github.com/OpenMOSS/MOVA
```

---

## Ranking rationale
Score = creativity × technical_depth × demo_factor. Top cluster (score ≥ 810):
1. LingBot-World (1000)
2. MiroFish (900)
3. HY-World 2.0 (900)
4. Wan2.2 (800)
5. MiniCPM-o 4.5 (720)

These five are the strongest candidates if the hackathon goal is **maximum visual/auditory stage impact with live, interactive demos**.

## Notes on unverifiable / cautious claims
- OpenClaw exact GitHub URL — aggregators hint at a rebrand history; confirm org slug before cloning.
- Wan2.2 exact repo URL — widely referenced as `Wan-Video/Wan2.2` but not directly hit in this pass. [UNVERIFIED]
- Star counts cited are from third-party aggregators (shareuhack weekly, star-history blog, ByteByteGo); verify live on star-history.com before pitching numbers on stage.
- Several recent papers (MAGMA, EverMemOS, GAM) are compelling but lack clearly-starred standalone repos — excluded in favor of production-ready candidates like Cognee.

## Sources
- [GitHub Trending Weekly 2026-04-13 (Hermes, persona distillation)](https://www.shareuhack.com/en/posts/github-trending-weekly-2026-04-13)
- [GitHub Open Source Weekly 2026-03-18 (BitNet, browser agents)](https://www.shareuhack.com/en/posts/github-trending-weekly-2026-03-18)
- [Top AI GitHub Repositories in 2026 (ByteByteGo)](https://blog.bytebytego.com/p/top-ai-github-repositories-in-2026)
- [Top 20 AI Projects on GitHub to Watch in 2026 (NocoBase)](https://medium.com/@nocobase/top-20-ai-projects-on-github-to-watch-in-2026-not-just-openclaw-909b3bae62f6)
- [OpenClaw surpasses React (star-history)](https://www.star-history.com/blog/openclaw-surpasses-react-most-starred-software/)
- [LingBot-World release coverage (MarkTechPost)](https://www.marktechpost.com/2026/01/30/robbyant-open-sources-lingbot-world-a-real-time-world-model-for-interactive-simulation-and-embodied-ai/)
- [MiroFish swarm simulation writeup](https://agentnativedev.medium.com/mirofish-swarm-intelligence-with-1m-agents-that-can-predict-everything-114296323663)
- [Shannon pentester writeup](https://cybersecuritynews.com/shannon-ai-pentesting-tool/)
- [BitNet.cpp on GitHub Trending](https://aitoolly.com/ai-news/article/2026-03-15-microsoft-unveils-bitnetcpp-the-official-inference-framework-for-1-bit-llms-on-github-trending)
- [HY-World 2.0 announcement (Tencent)](https://github.com/Tencent-Hunyuan/HY-World-2.0)
- [Genesis physics engine announcement (HN)](https://news.ycombinator.com/item?id=42457213)
