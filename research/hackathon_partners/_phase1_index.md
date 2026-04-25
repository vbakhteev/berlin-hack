# Phase 1 — Global Re-Ranked Index (Big Berlin Hack, 2026-04-21)

## TL;DR
1. Berlin/EU juries reward **substance + a novel mechanism + a 30-second stage-wow moment** on a vertical wedge — not polished chatbots, not RAG-over-PDFs, not "LangChain + Pinecone + Streamlit."
2. The ceiling moves have all happened in the last 60 days: real-time world models (Genie 3, HY-World 2.0, LingBot-World), compositional robot VLAs (π0.7, Gemini Robotics-ER 1.6), audio-to-audio agents (Gemini 3.1 Flash Live), and Claude-as-OS (Opus 4.7 + Skills 2.0 + Computer Use + Dispatch).
3. The winning archetype fuses **audible-first + physical-object-on-stage + a mechanism the jury hasn't seen**: Conductr (MIDI bandmate), GibberLink (AI-to-AI modem), HSIA (semantic injection attack), TARA (dashcam → road appraisal).
4. The most combinable Phase 1 primitives chain into one demo: **Gemini Live + Gradium voice clone + Lovable-built UI + Tavily research + Aikido pentest + Entire checkpoint replay + Genie/HY-World scene + π0.7 arm**.
5. Hard antipatterns the jury will punish: generic RAG, "ChatGPT for X" wrappers, AutoGPT recursive UIs, multi-agent debate theater, Vapi-template voice bots, Figma-only submissions, and any demo opening with "we've all been there…"

---

## 1. Top 30 items — globally re-ranked

### Rank 1 — Genie 3 (real-time interactive world model, public)
- **source_file:** 01_frontier_models.md
- **one_liner:** Text-prompted navigable 720p/24fps photoreal worlds with minute-scale memory and promptable events.
- **why_in_top_30:** EU juries reward "novel mechanism they haven't seen" (file 05) and penalize RAG/wrapper slop (file 08) — Genie 3 is the highest-ceiling primitive in the window with a built-in physical-object-on-stage moment (WASD through a text-prompted world).
- **composite score:** creativity 10 × technical 10 × demo 10 = 1000
- **stage_wow_idea:** Type "Berlin Tempelhof 1985, after rain, neon," then WASD-walk the world while a judge calls out events ("add a cat on the hood") that spawn live.
- **link:** https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/

### Rank 2 — LingBot-World
- **source_file:** 02_github_viral.md
- **one_liner:** Open-source real-time 3D world simulator — 16 FPS, <1s latency, first legitimate Genie-3-class OSS peer.
- **why_in_top_30:** OSS matters massively to EU juries (file 05 #5: observability/engineering rigor) and unlocks hackathon-scale customization Genie 3 can't (API-gated). Antipattern file 08 demands proprietary data/flywheel — self-hosting LingBot-World is that story.
- **composite score:** creativity 10 × technical 10 × demo 10 = 1000
- **stage_wow_idea:** Type "cyberpunk Berlin alley, rain" — live world appears, presenter walks avatar through it with WASD, shouts "add a dragon," it spawns mid-scene.
- **link:** https://github.com/Robbyant/lingbot-world

### Rank 3 — GibberLink
- **source_file:** 05_berlin_europe_hackathon_winners.md
- **one_liner:** Two AI voice agents on a phone call detect each other are AI, switch to a ggwave modem protocol.
- **why_in_top_30:** Literally the single most-copied stage-wow pattern of 2025 per file 05 — "reveal a live unexpected capability in the first 30 seconds." Introduces a mechanism (new AI-to-AI protocol) which file 05 #3 explicitly rewards.
- **composite score:** creativity 10 × technical 9 × demo 10 = 900
- **stage_wow_idea:** Call a pizza place. Pizza place is also AI. Both agents say "wait — are you AI too?" then switch to audible modem beeps. Both transcripts on screen.
- **link:** https://elevenlabs.io/blog/announcing-the-winners-of-the-elevenlabs-worldwide-hackathon

### Rank 4 — Conductr (Opus 4.6 MIDI bandmate)
- **source_file:** 04_sf_ny_hackathon_winners.md
- **one_liner:** Browser MIDI instrument where Claude plays bass/drums/melody live at ~15ms latency.
- **why_in_top_30:** File 05 #9 "live working code, not slides" + file 04 #7 "physical-audible in first 15 seconds." Conductr is the archetype — no slides, you HEAR the AI before you see it. Dodges every file 08 antipattern (not a chatbot, not a wrapper).
- **composite score:** creativity 10 × technical 9 × demo 10 = 900
- **stage_wow_idea:** Walk on with a MIDI keyboard, no slides. Play two chords. Claude drops drums/bass/counter-melody. Stop. Restart in a different key. The room cheers before introduction.
- **link:** https://claude.com/blog/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon

### Rank 5 — HSIA (Semantic Injection on Robot Vision)
- **source_file:** 05_berlin_europe_hackathon_winners.md
- **one_liner:** Red-team attack that corrupts internal vision-model captions on a robot without changing any pixels.
- **why_in_top_30:** UCL Great Agent Hack winner. File 05 #3: "novel protocol/mechanism" + file 05 #15: "trust/safety/red-teaming is a track, not an afterthought." New attack-surface class is jury-catnip; pairs naturally with Aikido partner.
- **composite score:** creativity 10 × technical 10 × demo 8 = 800
- **stage_wow_idea:** Bit-identical image on screen. Before attack: robot says "apple." After attack: "hand grenade." Pixels provably unchanged.
- **link:** https://towardsdatascience.com/multi-agent-arena-london-great-agent-hack-2025/

### Rank 6 — Physical Intelligence π0.7
- **source_file:** 01_frontier_models.md
- **one_liner:** VLA flow-model that recombines motor skills like words — folded laundry on a UR5e it had never trained on.
- **why_in_top_30:** First LLM-style compositional generalization in robotics. EU juries reward deep-tech + research-to-practice (file 05 #11). Dodges antipattern #4 (multi-agent theater) — it's one model doing the actual hard thing.
- **composite score:** creativity 10 × technical 10 × demo 9 = 900
- **stage_wow_idea:** Judge hands a random kitchen tool; ask the arm to "use this to stir the soup in the pot" — zero-shot tool composition on stage.
- **link:** https://www.pi.website/blog/pi0

### Rank 7 — AfterVerse (bereavement admin multi-agent)
- **source_file:** 05_berlin_europe_hackathon_winners.md
- **one_liner:** Multi-agent system that handles funeral/will/account-closure admin so families can grieve.
- **why_in_top_30:** Jury explicitly cited "real human impact + technical excellence" — file 05 #10: "genuine human-impact framing wins the room" is a BIG EU delta vs SF. Vertical wedge = exactly what file 05 #1 rewards. Team went to YC.
- **composite score:** creativity 9 × technical 8 × demo 10 = 720
- **stage_wow_idea:** Drop a death-certificate PDF on stage. 12 browser tabs open in parallel — bank, insurer, utility, Netflix, gym — cancelling each. Emotional bar "Sarah no longer has to call these 12 companies" fills up.
- **link:** https://www.ucl.ac.uk/ucl-east/news/2025/nov/hackathon-uncovers-emerging-ai-talent

### Rank 8 — HY-World 2.0 (Tencent, open-source)
- **source_file:** 01_frontier_models.md + 02_github_viral.md
- **one_liner:** Open-source SOTA 3D world model outputting editable meshes + Gaussian splats + depth + normals.
- **why_in_top_30:** First fully open-source world model emitting game-engine-ready assets — EU juries reward OSS/research-to-practice bridges (file 05 #11). Antipattern proof: not a wrapper, not RAG, real architecture story.
- **composite score:** creativity 10 × technical 9 × demo 10 = 900
- **stage_wow_idea:** iPhone photo of the venue. 20 seconds later an explorable 3D mesh of the exact room rotates in a Unity viewport on the big screen.
- **link:** https://github.com/Tencent-Hunyuan/HY-World-2.0

### Rank 9 — Gemini 3.1 Flash Live (native audio-to-audio)
- **source_file:** 01_frontier_models.md + 07/deepmind.md
- **one_liner:** Bidirectional WebSocket speech model, 90+ languages, tool-calling while talking, 90.8% on ComplexFuncBench Audio.
- **why_in_top_30:** "Death of the voice wrapper." DeepMind is headline partner — file 07/deepmind.md says their team leans forward when you exercise Live API + multimodal + combined tools in one loop. File 05 (multilingual + sovereign-AI angle) rewards 70-language coverage.
- **composite score:** creativity 8 × technical 10 × demo 10 = 800
- **stage_wow_idea:** Hand the mic to a judge; free-form conversation in their native language while the agent schedules a calendar invite, books a flight, and orders pizza mid-sentence.
- **link:** https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-flash-live/

### Rank 10 — MiroFish (1M-agent swarm simulation)
- **source_file:** 02_github_viral.md
- **one_liner:** Spawns up to 1M autonomous LLM-personas with memory + social graphs to simulate emergent futures.
- **why_in_top_30:** 33K+ stars + $4.1M in <10 days. File 05 #4 (multi-agent with legible roles) done at massive scale. Avoids file 08 antipattern #11 ("debate theater") by being simulation-as-prediction, not LLM chatroom.
- **composite score:** creativity 10 × technical 9 × demo 10 = 900
- **stage_wow_idea:** Paste the hackathon prompt into MiroFish — in 30s, 10k digital Berliners tweet about it on a live social graph; a predicted "winner" emerges from voting dynamics.
- **link:** https://github.com/666ghj/MiroFish

### Rank 11 — DeepSky (voice AI for ATC)
- **source_file:** 05_berlin_europe_hackathon_winners.md
- **one_liner:** Voice agent that talks directly to air traffic control to resolve airspace conflicts in real time.
- **why_in_top_30:** ElevenLabs Warsaw 1st. File 05 #8 "defense tech is now mainstream and wins prizes" + regulated-industry wedge + massive latency/reliability bar. Pairs natively with Gradium (sub-500ms EU voice).
- **composite score:** creativity 9 × technical 9 × demo 9 = 729
- **stage_wow_idea:** Play real ATC audio. Drone enters no-fly zone. Agent replies over voice in <1s with ICAO phraseology. Pilot on stage follows the instruction.
- **link:** https://elevenlabs.io/blog/announcing-the-winners-of-the-elevenlabs-worldwide-hackathon

### Rank 12 — Rippletide Decision Layer
- **source_file:** 04_sf_ny_hackathon_winners.md
- **one_liner:** Continuously-running multi-agent scientific discovery system using a hypergraph decision state instead of free-text.
- **why_in_top_30:** File 04 #2 + #8 "agent-as-state-machine beats agent-as-chatbot" + "evals-as-product." Also aligned with file 05 #5: EU juries reward "production-ready architecture with observability." Dodges file 08 #11 (multi-agent theater) by having legible decision substrate.
- **composite score:** creativity 9 × technical 10 × demo 9 = 810
- **stage_wow_idea:** Live zooming hypergraph on screen — nodes light up as agents propose/reject hypotheses — then show the decision trace back to the ground-truth paper.
- **link:** https://www.rippletide.com/resources/blog/winning-the-openai-codex-hackathon-moving-from-outputs-to-outcomes-the-decision-layer

### Rank 13 — Gemini Robotics-ER 1.6 + Boston Dynamics Spot
- **source_file:** 01_frontier_models.md + 07/deepmind.md
- **one_liner:** Embodied-reasoning VLM with agentic vision — lets Spot read gauges at 93% accuracy.
- **why_in_top_30:** 6 days old at writing. DeepMind partner loves this exact demo. File 05 #12 "unfair advantage tools = hardware + sensors" — hardware on stage scales applause.
- **composite score:** creativity 9 × technical 10 × demo 10 = 900
- **stage_wow_idea:** Point a Spot (or simulated Spot over video link) at a random analog pressure gauge a judge brought; narrate what it's seeing; draft an email to maintenance.
- **link:** https://deepmind.google/blog/gemini-robotics-er-1-6/

### Rank 14 — Matou-Garou (Turing-test-as-werewolf)
- **source_file:** 05_berlin_europe_hackathon_winners.md
- **one_liner:** Werewolf/Mafia party game where humans + LLM agents play together and the game is finding the AI.
- **why_in_top_30:** Mistral Paris winner. Novel game-mechanic + social/viral factor without being lame. Avoids file 08 #11 (debate theater) because the Turing-test IS the mechanic, not talking-heads orchestration.
- **composite score:** creativity 10 × technical 7 × demo 10 = 700
- **stage_wow_idea:** Pull 4 judges on stage; play 1 round live in 3 minutes. Reveal who was AI. Leaderboard shows AI has 63% win rate.
- **link:** https://mistralparishack.devpost.com/

### Rank 15 — Hermes Agent (Nous Research)
- **source_file:** 02_github_viral.md
- **one_liner:** Self-improving personal agent that writes + refines its own skills after every task.
- **why_in_top_30:** DSPy + GEPA (ICLR 2026 Oral) closed-loop self-evolution. 32K stars in one week. File 08 #E craved area: "persistent agent memory that survives restarts." Real mechanism, not theater.
- **composite score:** creativity 9 × technical 9 × demo 9 = 729
- **stage_wow_idea:** Ask Hermes to book a Berlin currywurst tour — struggles first time, replays with freshly-written skill, nails it. Show the diff of the skill it wrote about itself.
- **link:** https://github.com/NousResearch/hermes-agent

### Rank 16 — Shannon (autonomous white-box pentester)
- **source_file:** 02_github_viral.md
- **one_liner:** AI pentester that reads code, finds exploits, and actually executes them. 96.15% on XBOW.
- **why_in_top_30:** 21,665 stars in one month. File 05 #15 trust/safety track. Aikido partner is the perfect pairing — "hack yourself live." Antipattern clean: not a chatbot, reports only proven exploits.
- **composite score:** creativity 9 × technical 9 × demo 9 = 729
- **stage_wow_idea:** Point at a volunteer's hackathon repo live on stage — 90s later pop a shell via SQLi with replay video of the exploit.
- **link:** https://github.com/KeygraphHQ/shannon

### Rank 17 — Genesis (generative physics engine)
- **source_file:** 02_github_viral.md
- **one_liner:** Pure-Python physics engine 10–80× faster than Isaac Gym; text prompt → full 4D sim.
- **why_in_top_30:** Chains with π0.7/Gemini Robotics-ER for "prompt → scenario → policy" end-to-end. 24-month 20-lab collab. EU juries respect the research-to-practice arc (file 05 #11).
- **composite score:** creativity 9 × technical 10 × demo 9 = 810
- **stage_wow_idea:** "Generate a kitchen where a humanoid pours coffee" — 15s later, physics-accurate sim plays, robot's RL policy converges in a side panel.
- **link:** https://github.com/Genesis-Embodied-AI/Genesis

### Rank 18 — Pickle (real-time AI clone for video calls)
- **source_file:** 03_yc_companies.md
- **one_liner:** Real-time generative avatar at ~25fps that tracks voice + animates your face as you speak.
- **why_in_top_30:** Live multimodal generative model is demo-gold. File 04 #7 "physical-audible in first 15 seconds." Chains with Gradium for cross-lingual voice identity (file 05 #7 health-adjacent pattern + Gradium killer demo).
- **composite score:** creativity 8 × technical 9 × demo 10 = 720
- **stage_wow_idea:** Speaker walks on stage in pajamas — the projected "them" on Zoom wears a suit, lip-synced, eye contact intact.
- **link:** https://www.ycombinator.com/companies?batch=Winter+2025

### Rank 19 — ntransformer (NVMe → GPU direct, 70B on RTX 3090)
- **source_file:** 06_hn_launches.md
- **one_liner:** DMA weights straight from NVMe to VRAM, bypassing CPU/RAM entirely.
- **why_in_top_30:** HN #1 (395 pts). File 06 signal: "bypass the abstraction wins." File 05 #9 "live working code, not slides" + unfair-advantage-tools. Judges love the "smart person doing the hard thing" narrative.
- **composite score:** creativity 10 × technical 10 × demo 8 = 800
- **stage_wow_idea:** RTX 3090 with VRAM meter. Load 70B normally — OOMs. One command — NVMe light blinks, tokens stream. "We didn't buy an H100. We stopped paying the CPU tax."
- **link:** https://news.ycombinator.com/item?id=47104667

### Rank 20 — Decart Oasis (engine-free playable world)
- **source_file:** 01_frontier_models.md
- **one_liner:** End-to-end transformer generates interactive Minecraft-like world at 20fps from keyboard input — no game engine.
- **why_in_top_30:** Only model serving real-time interactive worlds at that latency; public-accessible via oasis.decart.ai. Direct pair with LingBot/Genie 3 for "text → playable world" archetype.
- **composite score:** creativity 10 × technical 9 × demo 9 = 810
- **stage_wow_idea:** Audience shouts a biome ("ice volcano with giant mushrooms"); generate; hand the controller to a judge to roam for 60s while explaining latency budget.
- **link:** https://oasis.decart.ai/welcome

### Rank 21 — Claude Opus 4.7 + Skills 2.0 + Computer Use + Dispatch
- **source_file:** 01_frontier_models.md
- **one_liner:** Claude as full OS agent — Skills run scripts, Computer Use controls desktop, Dispatch takes phone commands.
- **why_in_top_30:** 5 days old at writing. Chains directly with Entire (Git-native checkpoints), Lovable (Opus 4.7 is Lovable's engine), and Aikido MCP. Complete agent-OS stack.
- **composite score:** creativity 9 × technical 10 × demo 9 = 810
- **stage_wow_idea:** Text Claude from your phone: "close out my laptop for demo day" — on the projector, Claude saves files, closes apps, drafts an email, all narrated aloud.
- **link:** https://www.cnbc.com/2026/03/24/anthropic-claude-ai-agent-use-computer-finish-tasks.html

### Rank 22 — Jailbreak Lab (genetic-algo prompt mutation)
- **source_file:** 05_berlin_europe_hackathon_winners.md
- **one_liner:** Genetic-algorithm library that mutates and evolves adversarial prompts against LLMs automatically.
- **why_in_top_30:** UCL Great Agent Hack "Dear Grandma" track winner. File 05 #15 trust/safety as a track. Real research-grade mechanism. Clean Aikido pairing.
- **composite score:** creativity 9 × technical 10 × demo 8 = 720
- **stage_wow_idea:** Pick a target model. Watch genetic algorithm run 45s, fitness score climbing, until it finds a jailbreak. Show diff of the winning mutation.
- **link:** https://towardsdatascience.com/multi-agent-arena-london-great-agent-hack-2025/

### Rank 23 — Pax Historia (LLM grand-strategy game)
- **source_file:** 03_yc_companies.md
- **one_liner:** AI grand-strategy game where you play any moment in history as any actor; every historical figure is a generative agent.
- **why_in_top_30:** File 03 notes "unusual takes that break the mold." EU juries love research-to-practice — this is simulation-as-game. Clean audible demo.
- **composite score:** creativity 10 × technical 8 × demo 10 = 800
- **stage_wow_idea:** "Cuban Missile Crisis, Oct 1962, you are Castro" — in 30s Kennedy/Khrushchev/McNamara argue in character via real-time LLM turns.
- **link:** https://www.ycombinator.com/launches?batch=Winter+2026

### Rank 24 — Hallucinating Splines (LLMs play SimCity)
- **source_file:** 06_hn_launches.md
- **one_liner:** Headless Micropolis behind REST API; agents play mayor; cities publicly browsable via MCP.
- **view_in_top_30 why_in_top_30:** File 06 #4 "agent plays X is the new RL-pong" — the failure modes are funny, the success is visible. Perfect audience-participation vehicle. Dodges file 08 #11 because the game is the structure, not chat.
- **composite score:** creativity 10 × technical 7 × demo 10 = 700
- **stage_wow_idea:** Give Claude the API in front of audience. "Build a working city." Watch it zone residential on top of power plants. Then show a leaderboard of model performance.
- **link:** https://news.ycombinator.com/item?id=46946593

### Rank 25 — Figure 03 + Helix 02 (home humanoid)
- **source_file:** 01_frontier_models.md
- **one_liner:** 3rd-gen home humanoid with palm cameras, 3g fingertip force sensing, VLA driving walking + manipulation.
- **why_in_top_30:** First room-scale walk+manipulate VLA with tactile 3g resolution. File 05 #12 unfair-advantage-tools. If you can even simulate one via video link, applause is guaranteed.
- **composite score:** creativity 9 × technical 10 × demo 10 = 900
- **stage_wow_idea:** Figure 03 walks into the audience, picks up a coffee cup from a judge, walks back, pours it into another cup without spilling.
- **link:** https://www.figure.ai/news/helix-02

### Rank 26 — Kaizen (fitness CV trainer)
- **source_file:** 04_sf_ny_hackathon_winners.md
- **one_liner:** Fitness app using CV to track your body, with AI character trainers who yell/cheer/adapt workouts.
- **why_in_top_30:** File 04 #7 "physical-audible in first 15 seconds" — pitcher works out during demo. File 05 #12 multi-modal + sensors. Chains with Gradium voice + Gemini Live video input.
- **composite score:** creativity 8 × technical 8 × demo 10 = 640
- **stage_wow_idea:** Pitcher drops to the floor mid-demo, does burpees. Trainer counts reps, catches a form break, roasts them on stage. Audience howls.
- **link:** https://elevenlabs.io/blog/hackathons-nyc-london

### Rank 27 — Steerling-8B (interpretable-by-construction LLM)
- **source_file:** 06_hn_launches.md
- **one_liner:** 8B model that traces every token back to 33K supervised + 101K unsupervised concepts and source training chunks.
- **why_in_top_30:** HN 328 pts. File 05 #5 evals/observability + #11 research-to-practice. File 08 craved-area A (real evals) and C (context engineering). Anti-antipattern: actual mechanism, not wrapper.
- **composite score:** creativity 10 × technical 10 × demo 7 = 700
- **stage_wow_idea:** Show any model output, click a word. "Why this token?" — panel lists the 3 concepts firing + 2 training docs it saw. "Our model cites itself."
- **link:** https://news.ycombinator.com/item?id=47131225

### Rank 28 — Eyestral (accessibility vision for blind users)
- **source_file:** 05_berlin_europe_hackathon_winners.md
- **one_liner:** Multimodal vision on Mistral 7B to narrate the world in real time for visually impaired users.
- **why_in_top_30:** Mistral Paris winner. File 05 #10 "genuine human-impact framing wins the room" + file 05 #7 health-without-hype. Deployable on phone.
- **composite score:** creativity 8 × technical 9 × demo 9 = 648
- **stage_wow_idea:** Blindfold a judge, hand them a phone. They walk across the stage while the agent narrates obstacles and a friend's face in the front row.
- **link:** https://mistralparishack.devpost.com/

### Rank 29 — hamilTUMian (GPS-denied drone swarm)
- **source_file:** 05_berlin_europe_hackathon_winners.md
- **one_liner:** Search algorithms for drone swarms in GPS-denied environments, demonstrated on a quadcopter fleet.
- **why_in_top_30:** EDTH Munich 2nd + Quantum Systems prize. File 05 #8 "defense tech is now mainstream and wins prizes in EU." Real swarm-algorithmics, not prompt engineering.
- **composite score:** creativity 8 × technical 10 × demo 9 = 720
- **stage_wow_idea:** Cut the GPS signal live on stage. Swarm re-forms its search pattern using only relative positioning. Visualize coverage heatmap in real time.
- **link:** https://eurodefense.tech/munich2025-defense-tech-hackathon/

### Rank 30 — Real-time AI on M3 Pro (local voice+vision)
- **source_file:** 06_hn_launches.md
- **one_liner:** Fully local voice assistant that sees + listens + synthesizes voice back, no cloud — runs on a MacBook.
- **why_in_top_30:** HN 298 pts. File 06 #2 "local-first > cloud." File 05 #9 "live working code." Turn off wifi mid-demo is an irrefutable stage move.
- **composite score:** creativity 8 × technical 9 × demo 10 = 720
- **stage_wow_idea:** Hold up a busted USB-C cable. "What is this?" Voice responds in under a second. Turn off wifi on stage. Repeat. Same latency. Room gasps.
- **link:** https://news.ycombinator.com/item?id=47652007

---

## 2. Cross-cutting themes

### Theme 1 — Real-time interactive world models
Files: 01 (Genie 3, HY-World 2.0, Decart Oasis, World Labs Marble), 02 (LingBot-World, HunyuanWorld-Voyager, Lyra 2.0, Wan2.2). A commodity-grade hackathon primitive for the first time: text prompt → playable/walkable world → exportable 3D assets.

### Theme 2 — Embodied VLA + compositional robotics
Files: 01 (π0.7, Gemini Robotics-ER 1.6, Figure 03/Helix 02), 02 (Genesis), 03 (Red Barn, Asimov, Remy.Ai, Human Archive), 05 (hamilTUMian, Le ChatOn Vision), 06 (Sowbot). Robotics foundation models crossed compositional generalization; data-collection is the new moat.

### Theme 3 — Voice-as-instrument (audible-first demos)
Files: 01 (Gemini 3.1 Flash Live, gpt-realtime-mini, Suno v5.5, Lyria 3 Pro, ElevenLabs v3), 02 (MiniCPM-o 4.5, VoxCPM2, Parlor, Pipecat), 04 (Conductr, Kaizen, Ansr, Chattermint), 05 (GibberLink, DeepSky, Claimsio, Gaming Copilot), 07 (Gradium sub-500ms, Gemini Live). Judges hear AI before seeing it; sub-500ms cascaded is the new floor.

### Theme 4 — Agent-as-state-machine (evals-as-product)
Files: 03 (Sentrial, Ashr, Canary, Asteroid, Rippletide-inspired patterns), 04 (Rippletide Decision Layer, "Everything Claude Code" harness), 05 (FairQuote, Delego, observability-as-differentiator), 06 (Emdash, Cq), 08 craved area A. Jury fatigue with multi-agent theater; structured decision layers win.

### Theme 5 — Git-native agent memory + checkpointing
Files: 02 (Hermes self-improving, Cognee memory), 06 (Rowboat, Emdash git-worktree), 07/entire.md (Checkpoints CLI), 08 craved area D (persistent memory). Agent state as first-class version-controlled substrate.

### Theme 6 — AI security theater (red-team + pentest + MCP)
Files: 02 (Shannon), 04 (Canard Security, Molina), 05 (HSIA, Jailbreak Lab), 07/aikido.md (Infinite, PromptPwnd, SafeChain). File 05 #15 explicitly: trust/safety is a track not an afterthought. Every hackathon is now an AI-security hackathon in disguise.

### Theme 7 — Bypass-the-abstraction stage wow
Files: 01 (BitNet CPU, Kimi K2.6), 02 (BitNet, Lyra 2.0, MiniCPM-o 4.5), 06 (ntransformer, Steerling-8B, MetalRT, Moonshine, Microgpt). HN signal + EU preference for real engineering — "smart person doing the hard thing" unplugs the GPU, runs 70B on a MacBook.

### Theme 8 — Vertical wedge into regulated/emotional pain
Files: 03 (12 vertical AI employees; voice in regulated industries), 04 (CrossBeam, Due Intelligence, TARA, PostVisit), 05 (AfterVerse, FairQuote, Claimsio, DeepSky, Impli, Eyestral), 08 do-not-build #3 (generic wrappers). EU delta: human-impact framing is rewarded specifically.

### Theme 9 — Open-source world/media foundation models
Files: 01 (HY-World 2.0, Kimi K2.6, Qwen3-Coder-Next), 02 (LingBot-World, HunyuanWorld-Voyager, Wan2.2, MiniCPM-o 4.5, VoxCPM2, MOVA, SV4D 2.0, Lyra 2.0, MOSS-TTS-Nano, BitNet). You can fine-tune on Friday and ship Sunday — not possible with Genie 3/Sora 2/Veo.

### Theme 10 — MCP as the only winning abstraction
Files: 02 (Browser Use, OpenClaw), 07 (Lovable personal+shared connectors, Aikido MCP, Tavily MCP, Entire agent hooks, Pioneer endpoints), 08 do-not-build #2 (MCP is the only layer that won — 97M monthly SDK downloads). Pipe everything through MCP or be invisible.

---

## 3. The 8 most combinable primitives

### P1 — Gemini 3.1 Flash Live (voice+vision real-time)
- **What it gives you:** Bidirectional audio-to-audio WebSocket, 70-language, tool-calling while talking, video input at 1 FPS.
- **Partners touched:** DeepMind (native), Lovable (Edge Function), Gradium (co-routable for EU latency + cloning), Entire (session capture).
- **Plugs into:** Conductr-style live performance, Kaizen-style CV coaching, GibberLink-style AI-to-AI, DeepSky-style ATC.

### P2 — Gradium voice stack (STT + TTS + 10s voice clone, sub-500ms)
- **What it gives you:** TTFA 220ms p90, 237 voices, instant cloning preserving rasp/breathiness/accent, EN/FR/ES/PT/DE.
- **Partners touched:** Gradium (native), LiveKit/Pipecat (plugin), DeepMind (LLM brain), Lovable (Edge Function UI).
- **Plugs into:** Any "voice magic broken with other vendors' latency" moment — live judge voice clone on stage.

### P3 — Lovable Cloud (vibe-coded full-stack app in minutes)
- **What it gives you:** Agent-built React/TS/Tailwind + Postgres + auth + Edge Functions + custom domain + SSL; Opus 4.7 engine.
- **Partners touched:** Lovable (native), Aikido (shared connector), DeepMind (Nano Banana 2 shipped), Tavily (via Edge Function), Entire (checkpoint all builds).
- **Plugs into:** Any demo that needs a deployable product URL by Sunday 3pm — "we built and shipped this in 36 hours" proof.

### P4 — Tavily /research (deep-research endpoint with citations)
- **What it gives you:** Multi-angle fan-out search → structured cited report in one call; 180ms p50; ultra-fast mode for voice.
- **Partners touched:** Tavily (native), Lovable (ai-sdk drop-in), DeepMind (Gemini grounding), Gradium (voice-native research), Pioneer (fine-tune routing on traces).
- **Plugs into:** Any demo needing "agent researches X live, cites sources" — especially paired with a generative UI canvas.

### P5 — Aikido MCP + Infinite (AI-security theater)
- **What it gives you:** MCP-native scan tools (`aikido_full_scan`, `aikido_sast_scan`), Infinite continuous pentest with exploit validation + AutoFix PRs, Zen runtime AI-BOM.
- **Partners touched:** Aikido (native), Lovable (shipped Mar 24), all coding agents (MCP), Tavily (input sanitization).
- **Plugs into:** "Agent hacks its own code live" / PromptPwnd / slopsquatting / "vibe-code → pentest → fix → ship" loop.

### P6 — Entire Checkpoints (Git-native agent replay)
- **What it gives you:** Session transcripts/prompts/tool-calls/token usage as a side branch; `entire rewind`, `entire resume`; shared team memory via --checkpoint-remote.
- **Partners touched:** Entire (native), Claude Code/Codex/Cursor/Gemini CLI/Copilot CLI (all hooks supported), Lovable (pipe every session).
- **Plugs into:** Multi-agent memory bus, replay-driven eval generation, "why did agent X do Y at SHA Z" intent-PR.

### P7 — Pioneer self-improvement loop (Fastino)
- **What it gives you:** Baseline OSS model + continuous trace capture + auto-eval + one-shot fine-tune via prompt; GLiNER2 or Qwen/DeepSeek/Llama baselines.
- **Partners touched:** Pioneer/Fastino (native), Tavily (traces), Aikido (PII pre-filter via `fastino-pii`), DeepMind (Gemini as critic).
- **Plugs into:** "Before/after on stage without labeled data" — the model visibly gets better during the demo.

### P8 — Open-source world simulator (LingBot-World / HY-World 2.0 / Genesis)
- **What it gives you:** Self-hostable text-to-world or physics sim; exportable 3D assets (meshes, splats); no API gate.
- **Partners touched:** DeepMind (Gemini Robotics-ER plans inside the sim), Lovable (embed Gaussian-splat viewer in the app), Entire (checkpoint scene-state).
- **Plugs into:** Any Genie-3-class demo at OSS cost; chain with π0.7 for sim-to-real; or with Meshy/Tripo for sim-to-printer.

---

## 4. Antipattern filter summary (do-NOT-build list)

From file 08. Phase 3 MUST respect these:

1. **Generic RAG over PDFs** — RAG is literally being eulogized on HN (#45439997). No "upload your PDFs, chunk, embed, ask questions."
2. **"ChatGPT for [vertical]"** — pure wrappers with system prompt + OpenAI API + Tailwind. Juniors rebuild in an hour.
3. **Yet another agent framework / LangChain clone** — MCP won the war. Everything else is interchangeable.
4. **AutoGPT / BabyAGI recursive UIs** — "Task Queue + Thoughts panel" signals 18 months behind.
5. **Multi-agent debate theater** — 3-5 LLM personas "debating" with no task win. "Politeness loops."
6. **Summarize-my-Gmail / MCP hello-worlds** — default demo since protocol launched.
7. **Doc Q&A over Wikipedia / company handbook** — same as RAG but shallower.
8. **AI for SEO / marketing copy generators** — Google 2026 penalizes purely automated content.
9. **Chat-with-your-database / text-to-SQL** — hackathon staple since 2021.
10. **"AI VA that does everything"** — Lindy/MindStudio/n8n ship this; enterprise shifted to risk-tiered autonomy.
11. **Voice-cloned Vapi/Retell/Bland template receptionist** — 75% of voice builders hit reliability walls; saturated.
12. **"AI writes unit tests / commit messages"** — Claude Code/Cursor/Codex do this in-loop; standalone is redundant.
13. **Obsidian-style "second brain" with knowledge graph UI** — 10+ funded entrants; graph UI is demo-only.
14. **Bolt-on computer-use/browser agent without a real payoff** — clicking Chrome for 15s per action, no shipping.
15. **Generic Twitter/news sentiment dashboards** — 2015-era reborn with LLMs.
16. **AI agent marketplaces** — already 8 of them; 36% prompt-injection rate per Snyk.
17. **"Powered by GPT-4" landing-page brag** — 2024 flex, 2026 tell.
18. **Figma-only submissions** — HN backlash against "vibe-coded slop + cool slideshow."
19. **"We've all been there…" openings** — ChatGPT-speak is now cringe (Anthropic Super Bowl ad).
20. **"Our agent has 5 collaborating agents"** — tool/agent sprawl without narrow contracts = theater.

---

## 5. Top 5 "30-second stage wow" archetypes (Berlin/EU)

### Archetype A — "Call an AI. The AI is also an AI." (GibberLink)
Opening: two phones, two AIs, a pizza order. Reveal in 30s that both are AI; switch to audible modem beeps. Introduces a new mechanism in the first moment.
**Provenance:** file 05 (ElevenLabs London; "single most copied stage-wow of 2025"), file 04 #7 (physical-audible).

### Archetype B — "Audible-first, no slides" (Conductr)
Opening: walk on with a physical instrument / MIDI keyboard / mic. Play/sing/speak for 5 seconds. AI responds at perceptual latency as a co-performer. Room cheers before you introduce yourself.
**Provenance:** file 04 (Conductr Opus 4.6 winner), file 04 #1/#7 (hardware + audible-first).

### Archetype C — "Physical object from a judge, live zero-shot" (π0.7 / Genie 3 / HY-World)
Opening: ask a judge for a physical thing (kitchen tool, photo of venue, sketch, language they speak). 30 seconds later the AI does a zero-shot task on it — composes motor skills, generates a walkable world, or speaks in their voice.
**Provenance:** file 05 #10 (Numi placed a petri dish on the jury table — "physical-object-on-table is a powerful EU-jury move"), file 01 (π0.7 + Genie 3), file 04 #2 (domain-expert judge-involvement).

### Archetype D — "Unplug the GPU / cut the Wi-Fi" (Parlor / M3-Pro / BitNet / hamilTUMian)
Opening: do the thing. Then, mid-demo, theatrically disconnect a critical-seeming dependency (GPU, internet, GPS). Same latency. Crowd gasps.
**Provenance:** file 06 (M3-Pro 298pts), file 02 (BitNet HN #1), file 05 (hamilTUMian GPS-denied drone), file 01 (BitNet 1-bit CPU).

### Archetype E — "Watch the agent try to hack itself" (Shannon + Aikido + HSIA + Jailbreak Lab)
Opening: build a tiny app with Claude Code/Cursor live. Push to GitHub. Split screen: left = the dev agent, middle = Aikido Infinite pentest agent attacking it in a real browser, right = AutoFix PR opening automatically. Jury sees the vulnerability and the patch in under 60s.
**Provenance:** file 07/aikido.md (their own Dec 15 + Mar 24 demo format), file 02 (Shannon 96.15% XBOW), file 05 #15 (trust/safety as a track).

---

## Appendix — Scoring notes

- **Composite = creativity × technical × demo** (inherited from each Phase 1 file's own scoring).
- **Ranking applied the Berlin/EU jury filter** (file 05 patterns: builder-jury, vertical wedge, novel mechanism, human impact, live working code, physical-object, safety/eval track) and **antipattern filter** (file 08 do-not-build).
- **Items demoted** from their individual-file ranks when they fell into antipattern territory or lacked a Berlin-jury-visible mechanism (e.g. pure wrappers, generic multi-agent, ChatGPT-for-X).
- **Items promoted** when they matched EU delta themes (human impact, defense-tech, regulated industry, OSS, research-to-practice, evals-as-product, hardware-on-stage).

Source-file reference list:
- 01_frontier_models.md — frontier model capability survey
- 02_github_viral.md — viral GitHub repos last 60 days
- 03_yc_companies.md — YC W25/S25/W26 patterns
- 04_sf_ny_hackathon_winners.md — SF/NY hackathon winners
- 05_berlin_europe_hackathon_winners.md — Berlin/EU hackathon signal (JURY FILTER)
- 06_hn_launches.md — Show HN / Launch HN trends
- 07_infra_partners/*.md — DeepMind, Lovable, Gradium, Entire, Tavily, Pioneer/Fastino, Aikido
- 08_boring_antipatterns.md — do-not-build list (ANTIPATTERN FILTER)
