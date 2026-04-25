# Phase 1.1 — Frontier Model Capability Survey (last ~60 days: 2026-02-21 → 2026-04-21)

## TL;DR
1. Real-time interactive world models crossed a usability line: Genie 3 is public (AI Ultra, Jan 29), Decart Oasis ships engine-free playable worlds, World Labs Marble generates explorable 3D worlds, and Tencent open-sourced HY-World 2.0 (Apr 15) — hackathon-ready "generate a game world from one prompt" demos are now trivial.
2. Native audio-to-audio voice agents are the new default — Gemini 3.1 Flash Live (Mar 26) and gpt-realtime-mini (Mar snapshot) both hit >90% on ComplexFuncBench Audio, enabling true live phone-call-grade agents with tool calls.
3. Robotics foundation models broke the compositional-generalization barrier: Physical Intelligence π0.7 (Apr) folds laundry on unseen hardware; Gemini Robotics-ER 1.6 (Apr 15) brought Boston Dynamics Spot to 93% gauge-reading accuracy; Figure 03 + Helix 02 ship full-body home robot control.
4. Anthropic went full agent-OS: Claude Opus 4.7 (Apr 16), Skills 2.0 (scripts + file output), Claude Computer Use Agent (Mar 23), 1M context GA (Mar 13), chat memory free-tier, and Dispatch (phone-driven remote agent control).
5. Nano Banana Pro (Gemini 3 Pro Image) renders 4K images with 94% legible text in <12s — infographic-quality slides from a prompt are now a demo primitive; pair with Veo 3.1 Ingredients + Lyria 3 Pro for single-prompt produced shorts.

---

## Items (sorted by creativity × technical_depth × demo_factor, descending)

```
- item: Genie 3 — real-time interactive world model (public)
  one_liner: Text-prompted, navigable 720p/24fps photoreal worlds with minute-scale memory and promptable events.
  why_novel: Public access launched Jan 29, 2026 to AI Ultra users in US — within our window. Adds promptable world-events (weather, new objects) that Genie 2 lacked; retains consistency for "several minutes" vs. seconds previously. Agent training + interactive demo from a single text prompt became a consumer-grade primitive.
  creativity_score: 10
  technical_depth_score: 10
  demo_factor: 10
  stage_wow_idea: Type "Berlin Tempelhof 1985, after rain, neon" on stage, then WASD-walk through the generated world live while a judge calls out new events ("add a cat on the hood") that pop in.
  link: https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/

- item: Gemini Robotics-ER 1.6 + Boston Dynamics Spot
  one_liner: Embodied-reasoning VLM with agentic vision and tool-calling that lets Spot autonomously read gauges at 93% accuracy.
  why_novel: Released Apr 15, 2026 — 6 days old at writing. Jumped instrument-reading from 23% (ER 1.5) → 86% base → 93% with agentic vision; natively calls Google Search + VLAs + third-party user functions as tools. First robot model shipped to a commercial inspection product (Boston Dynamics Orbit AIVI-Learning) within days of release.
  creativity_score: 9
  technical_depth_score: 10
  demo_factor: 10
  stage_wow_idea: Wheel a Spot (or simulated Spot over video link) on-stage, point it at a random analog pressure gauge a judge brought, narrate what it's seeing, and have it draft an email to maintenance.
  link: https://deepmind.google/blog/gemini-robotics-er-1-6/

- item: Physical Intelligence π0.7 — compositional generalist robot policy
  one_liner: VLA flow-model that recombines motor skills like words in a sentence; folded laundry on a UR5e it had never trained on.
  why_novel: Announced April 2026. First demonstrated LLM-style compositional generalization in robotics — "treat robotic skills like words." Zero-shot transfer to new hardware (UR5e bimanual) for a task (laundry folding) it had no training data for on that robot. $600M Series B closed April 2026.
  creativity_score: 10
  technical_depth_score: 10
  demo_factor: 9
  stage_wow_idea: Put a plastic tool a judge brought from home in a robot gripper; ask the robot to "use this to stir the soup in the pot" — on-stage zero-shot tool composition.
  link: https://www.humanoidsdaily.com/news/physical-intelligence-unveils-0-7-the-rise-of-compositional-generalization-in-robotics

- item: Figure 03 + Helix 02 (full-body VLA)
  one_liner: 3rd-gen home humanoid with palm cameras, 3-gram fingertip force sensing, and a VLA that drives the entire upper body + walking.
  why_novel: Figure 03 revealed October 2025 but Helix 02 full-body autonomy and home-ready build rolled out through Q1/Q2 2026. First VLA with continuous room-scale walk+manipulate blended control; tactile resolution is a step-change (3g detection → slip anticipation). Wireless charging + soft goods = actually demo-able indoors.
  creativity_score: 9
  technical_depth_score: 10
  demo_factor: 10
  stage_wow_idea: On-stage: Figure 03 walks into the audience, picks up a coffee cup a judge is holding, walks back, pours it into another cup without spilling.
  link: https://www.figure.ai/news/helix-02

- item: Decart Oasis — engine-free real-time playable world
  one_liner: End-to-end transformer generates an interactive Minecraft-like world at 20fps from keyboard input, no game engine underneath.
  why_novel: Public Oasis access (oasis.decart.ai) + continued optimization for Sohu ASIC. 20fps interactive generation on H100 still a ~6-month-old feat that no other model can match at that latency. Decart is the only player whose model serves real-time without pre-rendering. [UNVERIFIED] that specific new capabilities shipped in the last 60 days; inclusion justified by ongoing accessibility via oasis.decart.ai which competes on the "interactive" axis alongside Genie 3.
  creativity_score: 10
  technical_depth_score: 9
  demo_factor: 9
  stage_wow_idea: Have audience shout a biome ("ice volcano with giant mushrooms"), generate, then hand the controller to a judge to roam for 60 seconds while explaining latency budget.
  link: https://oasis.decart.ai/welcome

- item: World Labs Marble + World API
  one_liner: Generates and expands editable 3D worlds (meshes, Gaussian splats, depth, normals) from text/image/video/coarse layouts.
  why_novel: World API announced; $1B raise; AI-native world editing — select an object, change style, restructure whole scenes. Multi-modal inputs + stylable, combinable worlds is different from Genie's real-time viewer — Marble outputs usable 3D assets (editable Gaussian splats) engineers can import into Unreal/Unity/three.js. Within-60-day window via continued rollout.
  creativity_score: 10
  technical_depth_score: 10
  demo_factor: 8
  stage_wow_idea: Feed a 5-second phone video of the stage; 30 seconds later, walk through a 3D splat of the venue in a WebGL viewer with characters added by prompt.
  link: https://www.worldlabs.ai/blog/announcing-the-world-api

- item: Gemini 3.1 Flash Live — native audio-to-audio agent
  one_liner: Bidirectional WebSocket speech model; 90+ languages; tool-calling while talking; 90.8% on ComplexFuncBench Audio.
  why_novel: Released March 26, 2026. Consumes raw 16kHz PCM, returns raw audio — no TTS in the loop. "Death of the voice wrapper." Leading score on multi-step function calling during live conversation. Can watch camera + listen + call tools simultaneously.
  creativity_score: 8
  technical_depth_score: 10
  demo_factor: 10
  stage_wow_idea: Hand the mic to a judge for a 30-sec free-form conversation in their native language while the agent simultaneously schedules a calendar invite, books a flight, and orders a pizza — all announced by the agent mid-sentence.
  link: https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-flash-live/

- item: Nano Banana Pro (Gemini 3 Pro Image)
  one_liner: 4K native image gen with 94% legible in-image text, thinking mode, web search grounding, pro camera/lighting controls.
  why_novel: Ships 4K at 4096×4096 in <12 seconds with real-time web grounding — i.e. you can say "generate an infographic of today's AAPL stock price" and it reads the web at gen-time. Text rendering is the first model actually usable for captions/logos. Pricing $0.134/2K, $0.24/4K image (March 2026).
  creativity_score: 8
  technical_depth_score: 9
  demo_factor: 10
  stage_wow_idea: Ask judges for three cities they're from; generate a 4K custom poster with all three skylines + today's weather of each, readable text baked in, in under 30 seconds.
  link: https://deepmind.google/models/gemini-image/pro/

- item: Claude Opus 4.7 + Skills 2.0 + Computer Use + Dispatch
  one_liner: Claude as full OS agent — Opus 4.7 (Apr 16) runs Skills that execute scripts, controls your desktop, and takes mobile commands via Dispatch.
  why_novel: Opus 4.7 released April 16, 2026 (5 days ago). Skills 2.0 can run scripts + generate files, not just text. Computer Use Agent launched Mar 23, 2026 in research preview. Dispatch enables continuous mobile conversation driving a desktop agent. 1M context GA March 13 with no surcharge. Chat memory free-tier March 2026. This is a complete agent-OS stack released inside the window.
  creativity_score: 9
  technical_depth_score: 10
  demo_factor: 9
  stage_wow_idea: Text Claude from your phone "close out my laptop for demo day" — on the projector, watch Claude save files, close apps, draft an email to the team, all narrated aloud.
  link: https://www.cnbc.com/2026/03/24/anthropic-claude-ai-agent-use-computer-finish-tasks.html

- item: Gemini 3 Deep Think
  one_liner: Reasoning variant hitting 48.4% on Humanity's Last Exam and 84.6% on ARC-AGI-2 without tools.
  why_novel: Major upgrade Feb 12, 2026. HLE 48.4% and ARC-AGI-2 84.6% are both within-window SOTA jumps. Codeforces Elo 3455. Changes what's demoable — real proof-assistant / olympiad-grade reasoning in an API call.
  creativity_score: 7
  technical_depth_score: 10
  demo_factor: 8
  stage_wow_idea: Live-pull an unsolved 2026 research problem from arXiv on stage; show Deep Think producing a multi-step solution while explaining its reasoning; compare to a prior-gen baseline side-by-side.
  link: https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-deep-think/

- item: Veo 3.1 "Ingredients to Video" + Lyria 3 Pro + custom AI avatars
  one_liner: Upload up to 4 reference images (characters, objects, style), generate 60s+ 4K 9:16 videos with custom Lyria music and directable avatars.
  why_novel: Veo 3.1 update (Jan 2026) + Ingredients-to-Video and Scene Extension for >60s coherent narrative + paid preview of Veo 3.1/Fast in Gemini API with motion brush and start/end-frame interpolation. Lyria 3 Pro (Mar 25, 2026) adds 3-min track generation with structural control (verse/chorus/bridge). Single pipeline for full short-film produced in-browser.
  creativity_score: 8
  technical_depth_score: 9
  demo_factor: 10
  stage_wow_idea: Take a selfie of 4 audience members; 3 minutes later play a 60-second 9:16 music video starring all four with a custom theme song.
  link: https://blog.google/innovation-and-ai/technology/ai/veo-3-1-ingredients-to-video/

- item: HY-World 2.0 (Tencent Hunyuan, open-source world model)
  one_liner: Open-source SOTA 3D world model emitting meshes, Gaussian splats, point clouds, depth, normals from text/image/video.
  why_novel: Released Apr 15, 2026 — 6 days old. First fully open-source world model that outputs editable representations including recovered camera parameters. Open weights mean hackathon teams can fine-tune or run locally — unlike Genie 3 or Marble which are API-gated.
  creativity_score: 10
  technical_depth_score: 9
  demo_factor: 8
  stage_wow_idea: Scan the hackathon venue with a phone video in 60s; open a three.js viewer with the editable Gaussian splat; let judges click-to-edit objects.
  link: https://hyworld.dev/

- item: Sora 2 Cameos + API
  one_liner: Insert verified likeness + voice into any generated video via a 3–10s consent recording; API cost reportedly ~$0.08/video.
  why_novel: Cameo feature with verification-challenge opt-in + 95% character consistency; image-to-video in API via fal.ai/PiAPI integrations in 2026. But: OpenAI announced Sora discontinuation on March 24, 2026 with API shutdown Sept 24 — makes this a "last chance to demo" angle. [UNVERIFIED] the exact API pricing claim of $0.08/video varies by provider.
  creativity_score: 9
  technical_depth_score: 8
  demo_factor: 10
  stage_wow_idea: Record each judge's 5-second cameo at the start of the demo; drop all of them into a group-action movie sequence shown at the end of the 3-minute demo.
  link: https://openai.com/index/sora-2/

- item: gpt-realtime-mini — low-latency voice agent
  one_liner: Cheaper realtime speech-to-speech with +18.6pp instruction-following, +12.9pp tool-calling vs. the previous snapshot.
  why_novel: March 2026 audio-model update; upgraded decoder for more natural voices, Custom Voices consistency, background function-calling while talking, Cedar/Marin voices. WebRTC/WebSocket/SIP — can plug directly into Twilio or LiveKit for phone-grade agents.
  creativity_score: 7
  technical_depth_score: 8
  demo_factor: 9
  stage_wow_idea: Dial a printed phone number on stage; the audience hears a live agent resolve a multi-turn refund with tool calls including sending a Slack DM to the host mid-conversation.
  link: https://developers.openai.com/blog/updates-audio-models

- item: Suno v5.5 — Voices + Custom Models + My Taste
  one_liner: Upload your singing voice, clone it with a verification phrase, tune v5.5 with up to 3 of your own trained variants; full Suno Studio DAW.
  why_novel: Released March 27, 2026. First mainstream AI music product with voice-cloning under verification + user-trainable custom models. My Taste learns preferences over time. Suno Studio = full DAW, not just a generator. [UNVERIFIED] how long custom-model training takes end-to-end.
  creativity_score: 8
  technical_depth_score: 8
  demo_factor: 9
  stage_wow_idea: Record 30 seconds of a judge humming the melody; 2 minutes later play a full-production pop song with their voice as lead vocal.
  link: https://suno.com/blog/v5-5

- item: Tripo Smart Mesh P1.0 + Meshy 6 + Rodin Gen-2
  one_liner: AI 3D now outputs game-ready quad topology in ~2 seconds (Tripo); Rodin Gen-2 hits photoreal at 10B params; Meshy partners with Bambu Lab for 1-click-to-print.
  why_novel: Tripo Smart Mesh P1.0 launched March 2026 — "AI 3D 2.0" era of proper topology, no more decimated blob meshes. Meshy + Bambu Lab partnership puts AI → printer in one click. Rodin Gen-2's photoreal textures are a new SOTA bar. Together: text → printable physical object in minutes.
  creativity_score: 8
  technical_depth_score: 8
  demo_factor: 9
  stage_wow_idea: Audience shouts an object; generate clean-topology 3D in 2s, start a 3D print on-stage, hand the printed item to a judge before the 3-min pitch ends.
  link: https://www.3daistudio.com/blog/best-3d-model-generation-apis-2026

- item: Lyria 3 / Lyria 3 Pro
  one_liner: Text + image conditioned 3-minute song generation with tempo, lyric-timing, and song-section control; SynthID watermarked.
  why_novel: Lyria 3 Pro launched March 25, 2026. 30s → 3min tracks, intro/verse/chorus/bridge structural prompts, image conditioning for mood/style. Available in Vertex AI, Gemini app, Workspace — proper developer APIs. Safety via SynthID.
  creativity_score: 7
  technical_depth_score: 8
  demo_factor: 9
  stage_wow_idea: Show a judge's photo; generate a 2-minute theme song in their honor with structural dynamics and a key change at the bridge, all from prompt.
  link: https://deepmind.google/models/lyria/

- item: Google Antigravity — agent-first IDE
  one_liner: VS Code fork where Gemini 3 agents drive editor + terminal + browser autonomously on dedicated surfaces.
  why_novel: Announced Nov 18 2025; Gemini 3.1 Pro backend + public preview free for personal Gmail users throughout Q1/Q2 2026. Dedicated "Agents" surface for multi-task delegation with self-validation loops. Differentiates from Claude Code's CLI + TUI approach.
  creativity_score: 7
  technical_depth_score: 9
  demo_factor: 7
  stage_wow_idea: Give Antigravity "ship a working clone of the hackathon's website" — on-stage screen shows 5 parallel agents working the editor, browser, terminal, completing in minutes.
  link: https://cloud.google.com/blog/topics/developers-practitioners/agent-factory-recap-building-with-gemini-3-ai-studio-antigravity-and-nano-banana

- item: Kimi K2.6 — open-weight 1T MoE frontier catch-up
  one_liner: Moonshot's 1T-param MoE (32B active, 384 experts, MLA attention, 256K ctx, native multimodal) matching Opus 4.6-level quality on open weights.
  why_novel: Released within 2026 early cycle; open-weight architecture reaching frontier proprietary quality. MLA attention + 8-routed-of-384 experts is an architectural milestone. Useful for hackathons because you can actually self-host or fine-tune.
  creativity_score: 7
  technical_depth_score: 9
  demo_factor: 6
  stage_wow_idea: Fine-tune K2.6 on 2h of a judge's writing during day-1 of the hackathon; day-2 demo uses the model to autonomously reply to their real emails in their voice (with approval gating).
  link: https://www.latent.space/p/ainews-moonshot-kimi-k26-the-worlds

- item: ChatGPT Atlas — agentic browser + OWL architecture
  one_liner: OpenAI's Chromium-based browser with Agent Mode (WebVoyager 87%) running Chromium out-of-process; ChatGPT+Atlas+Codex merging into a single desktop app.
  why_novel: Announced unified desktop consolidation in March 2026. OWL (OpenAI Web Layer) architecture runs Chromium as a separate process — fundamentally different agent architecture from extension-based alternatives. WebVoyager 87% is top-of-class.
  creativity_score: 7
  technical_depth_score: 9
  demo_factor: 7
  stage_wow_idea: Paste a judge's LinkedIn URL; Atlas agent researches them, books a coffee on their calendar, drafts a follow-up email, and generates a personalized meeting prep doc — all without manual clicks.
  link: https://openai.com/index/building-chatgpt-atlas/

- item: ElevenLabs v3 (Eleven v3 Alpha) — expressive multilingual TTS
  one_liner: 70+ languages; voice cloning that mirrors emotional range of the source; dramatic emphasis and micro-tone control.
  why_novel: Still the realism SOTA in 2026 for narrative/audiobook uses. Complements but doesn't replace real-time models — Flash v2.5 (~75ms) for live. Pair with Cartesia Sonic 3 for speed-critical demos.
  creativity_score: 6
  technical_depth_score: 8
  demo_factor: 8
  stage_wow_idea: Clone a judge's voice from 10 seconds of audio; have the cloned voice narrate an emotional bedtime story, swapping emotions on cue from the audience.
  link: https://elevenlabs.io/blog/elevenlabs-vs-cartesia

- item: Hailuo 2.3 / Kling 2.5 — physics-first video generation
  one_liner: Hailuo 2.3 specializes in material physics (water, silk, hair inertia); Kling 2.5 handles gymnastics / combat with camera tracking.
  why_novel: Within last 60 days both models closed the physics-fidelity gap versus Veo/Sora — especially for dynamic physical interactions. API-accessible with lower latency and pricing than Sora 2. Differentiated from Veo: Hailuo dramatically better on deformable/fluid materials per comparative benchmarks.
  creativity_score: 6
  technical_depth_score: 8
  demo_factor: 8
  stage_wow_idea: Have audience shout an impossible physics scenario ("honey poured on a cat"); generate side-by-side Hailuo + Kling + Veo 3.1 + Sora 2 comparison in 60 seconds.
  link: https://medium.com/@302.AI/hailuo-2-3-vs-02-vs-kling-2-5-who-performs-better-in-6-comparisons-3d3c29ec430d

- item: HeyGen Avatar IV — diffusion-inspired audio-to-expression
  one_liner: Photoreal avatars with full-body motion, script-synced hand gestures, and micro-expressions driven by audio tone.
  why_novel: Avatar IV diffusion-inspired pipeline is best-in-class photoreal at non-enterprise pricing (as of 2026). 175+ languages translation + natural lip-sync. "Avatars perform the words" via micro-expression rather than just lip-sync.
  creativity_score: 6
  technical_depth_score: 7
  demo_factor: 9
  stage_wow_idea: Film a judge for 10 seconds; render them giving a keynote in Mandarin with perfectly synced hand gestures and tone-appropriate facial expression.
  link: https://www.heygen.com/avatars/avatar-iv

- item: Skyvern 2.0 + Browser Use — open-source web agent frameworks
  one_liner: Playwright-compatible SDK (Skyvern) + Python-native agent library (Browser Use) enabling natural-language browser automation.
  why_novel: Skyvern 2.0 hit 85.85% on WebVoyager; SDK v1+ (Python + TypeScript) shipped late Jan 2026 with local + cloud modes. Together with Browser Use, hackathon teams can self-host agentic browsers without OpenAI Atlas lock-in.
  creativity_score: 6
  technical_depth_score: 8
  demo_factor: 6
  stage_wow_idea: A swarm of 20 Skyvern agents in parallel negotiate the best deal on a product across 20 e-commerce sites live.
  link: https://github.com/Skyvern-AI/skyvern

- item: Gemini 3.1 Flash-Lite + Flash 3 (developer tier)
  one_liner: Fastest/cheapest Gemini tier — $0.25/M input, $1.50/M output, 45% faster answer gen than 2.5 Flash, 2.5× faster TTFT.
  why_novel: Released March 3, 2026 — pricing/latency step that enables always-on assistants and high-throughput agent loops. Available in Gemini CLI. Enables demos with 100+ concurrent agents that weren't latency-feasible 60 days ago.
  creativity_score: 6
  technical_depth_score: 7
  demo_factor: 6
  stage_wow_idea: Spin up 100 parallel Flash-Lite agents each reading one news site simultaneously, then aggregate to a single synthesized "world-state" dashboard.
  link: https://siliconangle.com/2026/03/03/google-launches-speedy-gemini-3-1-flash-lite-model-preview/

- item: Qwen3-Coder-Next (80B, 3B active)
  one_liner: Sparse-MoE coding model outperforming much larger DeepSeek V3.2 and Kimi K2.5 on coding benchmarks at 3B active params.
  why_novel: Early February 2026 release. Architectural efficiency: 3B active out of 80B total delivers flagship-level coding. Open weights = hackathon gold for on-device or cost-sensitive agent loops.
  creativity_score: 6
  technical_depth_score: 8
  demo_factor: 5
  stage_wow_idea: Run the model on a Mac Studio in front of the audience completing a full repo-scale refactor live, no cloud.
  link: https://magazine.sebastianraschka.com/p/a-dream-of-spring-for-open-weight
```

---

## Cross-cutting hackathon levers (ideas for the builder)
1. World-model + robotics: Genie 3 generates a training scenario, Gemini Robotics-ER 1.6 plans, π0.7 executes. End-to-end "describe a task, demo it in sim, run on a real arm." Zero other teams will attempt this.
2. Voice-native agent layer: Gemini 3.1 Flash Live + MCP tool servers = first agents that feel like phone calls. Demo in the audience's actual language.
3. Text → playable world → printable object: Genie 3 or HY-World 2.0 scene → Tripo Smart Mesh P1.0 → Bambu printer on stage.
4. Personalized mini-movie: Sora 2 Cameo + Lyria 3 Pro + Veo 3.1 Ingredients = record 5s of each judge, end demo with a custom music video starring them.
5. Compositional tool use: Claude Skills 2.0 runs scripts, generates files, then Claude Computer Use takes the file and completes a real workflow on your laptop — all triggered from Dispatch on your phone.

## Sources used (primary)
- https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/
- https://deepmind.google/blog/gemini-robotics-er-1-6/
- https://www.figure.ai/news/helix-02
- https://www.pi.website/blog/pi0
- https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-flash-live/
- https://deepmind.google/models/gemini-image/pro/
- https://blog.google/innovation-and-ai/technology/ai/veo-3-1-ingredients-to-video/
- https://deepmind.google/models/lyria/
- https://suno.com/blog/v5-5
- https://hyworld.dev/
- https://oasis.decart.ai/welcome
- https://www.worldlabs.ai/blog/announcing-the-world-api
- https://developers.openai.com/blog/updates-audio-models
- https://openai.com/index/sora-2/
- https://openai.com/index/building-chatgpt-atlas/
- https://platform.claude.com/docs/en/release-notes/overview
- https://www.cnbc.com/2026/03/24/anthropic-claude-ai-agent-use-computer-finish-tasks.html
- https://thenewstack.io/anthropic-march-2026-roundup/
- https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-deep-think/
- https://magazine.sebastianraschka.com/p/a-dream-of-spring-for-open-weight
- https://www.latent.space/p/ainews-moonshot-kimi-k26-the-worlds
- https://github.com/Skyvern-AI/skyvern
- https://www.heygen.com/avatars/avatar-iv
- https://medium.com/@302.AI/hailuo-2-3-vs-02-vs-kling-2-5-who-performs-better-in-6-comparisons-3d3c29ec430d
- https://cloud.google.com/blog/topics/developers-practitioners/agent-factory-recap-building-with-gemini-3-ai-studio-antigravity-and-nano-banana
- https://elevenlabs.io/blog/elevenlabs-vs-cartesia
- https://siliconangle.com/2026/03/03/google-launches-speedy-gemini-3-1-flash-lite-model-preview/
