# Gradium — Voice AI (TTS / STT / Voice Cloning)

## TL;DR
- Gradium is a Paris-based Kyutai spin-out (Dec 2, 2025, $70M seed led by FirstMark + Eurazeo; Eric Schmidt, Xavier Niel, Yann LeCun, Guillermo Rauch in); founders Neil Zeghidour (CEO, ex-Meta/DeepMind/Kyutai), Olivier Teboul, Laurent Mazaré, Alexandre Défossez.
- Their pitch: **audio-native foundation models** — one unified neural architecture for TTS, STT, voice cloning, and dialogue — delivering **sub-500ms cascaded latency** with **TTFA ~220–230ms p90** (CUDA Graph on, 32 codebooks).
- Ships production TTS + STT WebSocket streaming APIs in **EN / FR / ES / PT / DE**, 237 prebuilt voices, and **10-second instant voice cloning** plus Pro Clones that preserve vocal fry, rasp, breathiness, accent.
- First-class **LiveKit** and **Pipecat** plugins (`livekit-agents[gradium]~=1.3`); official **Python** (`gradium-py`) and **Rust** (`gradium-rs`) SDKs + OpenAPI spec + AWS Marketplace listing for on-prem TTS.
- **Free tier = 45k credits (~1h TTS / 3h STT)** with Studio + API access; **startup grant = $2,000+ credits + 6 months full API access** — best path for hackathon teams. No Berlin-Hack-specific credits confirmed [UNVERIFIED].

---

- **what_it_does**: Gradium builds ultra-low-latency, emotionally expressive **audio language models** that unify TTS, STT, voice cloning, and dialogue under a single neural architecture. Unlike ElevenLabs (diffusion-style TTS) and Deepgram (pure STT), Gradium treats speech as tokens via a Soundstream-style codec and predicts audio with transformer-based Audio Language Models (ALMs) — the same lineage as Kyutai's Moshi full-duplex model. Commercially they ship **cascaded** STT→LLM→TTS building blocks (sub-500ms end-to-end) with streaming WebSocket APIs, but keep one foot in research for eventual end-to-end speech-to-speech.

- **primary_sdk_capabilities**:
  - **Streaming TTS WebSocket** (`docs.gradium.ai/api-reference/endpoint/tts-websocket`) + plain HTTP `POST /tts` for non-streaming.
  - **Streaming STT WebSocket** (`/stt-websocket`) with semantic VAD (`vad_threshold`, `vad_bucket`), word-level timestamps.
  - **Voice cloning**: Instant clones from **10s** of audio; Pro Clones preserve vocal fry/rasp/breathiness/accent; `POST /create-voice`. Free = 5 clones, paid tiers = 1000 instant + 5–20 Pro.
  - **237 prebuilt voices** across EN/FR/ES/PT/DE (`guides/voices/all-voices`), plus curated "Flagship" voices.
  - **Pronunciation dictionaries** (CRUD endpoints) — custom pronunciation of brand names, proper nouns.
  - **Advanced controls**: `temperature` (0–1.4 diversity), `cfg_coef` (1.0–4.0 speaker similarity), `padding_bonus` (speed: negative=faster, positive=slower).
  - **Multiplexing**: multiple concurrent requests over one WebSocket (`guides/multiplexing`).
  - **SDKs**: `pip install gradium` (Python), `cargo add gradium` (Rust), OpenAPI JSON for any other language. Community Go client (`cydanix/go-gradium`) exists.
  - **Agent frameworks**: `livekit-agents[gradium]~=1.3` — drop-in `gradium.STT()` / `gradium.TTS()`; Pipecat plugin; **Gradbot** — Gradium's own Rust-based agent orchestrator for "voice agents in ~50–60 lines of Python" with built-in turn-taking, interruption, silence signaling.
  - **AWS Marketplace**: `Gradium real-time TTS` for on-prem / VPC deployments.

- **whats_newly_possible (last 90 days)**:
  - **Dec 2, 2025**: Public stealth launch, $70M seed, first public release of production TTS/STT in 5 EU languages with Studio (studio.gradium.ai). Before this Gradium was invite-only.
  - **Late-Dec 2025 – Q1 2026**: LiveKit plugin shipped (`livekit-plugins-gradium` on piwheels), Pipecat support, Gradbot framework released, pronunciation-dictionary endpoints + pronunciation IDs added to LiveKit agents. Published latency optimization blog (TTFA 220ms p50 with CUDA Graph + batch 8).
  - **Early 2026**: AWS Marketplace listing for self-hosted TTS; TEN Framework integration blog.
  - **Not yet shipped but teased**: End-to-end speech-to-speech (Moshi-lineage) — research track, not production.

- **integration_footprint**:
  - **Auth**: Bearer API key (`GRADIUM_API_KEY` env var, created in Studio).
  - **Latency**: TTFA **~220–230ms p90** (CUDA Graph on, 32 codebooks, batch 8) on Gradium infra; claimed **<300ms TTFB streaming**; **sub-500ms cascaded** STT→LLM→TTS end-to-end; RTF ~4.4 p90 (well above 1.0 no-skip threshold). EU + US regions.
  - **Languages**: English, French, Spanish, Portuguese, German (more in development). This is a real differentiator vs. Cartesia (EN-strong) and a match for ElevenLabs.
  - **Pricing**: 1 TTS char = 1 credit; 1s STT = 3 credits. Free $0 / 45k credits. XS $13/mo, S $43/mo (popular), M $340, L $1,615, Tailored. Pay-as-you-go $3.80–$6.90 / 100k credits.
  - **Hackathon / startup credits**: Startup grant advertises **"$2,000+ in free credits, 6 months of full API access"** — apply via site. No Berlin-Hack-specific promo code was surfaced in search [UNVERIFIED]; ask sponsor on-site.

- **killer_demo_angle**:
  The Gradium team leans forward when a demo shows **real-time voice magic that would feel broken with any other vendor's latency budget**. Winning angles:
  1. **Live on-stage voice clone**: record a judge's voice for 10 seconds during their intro, then have your agent roast/quote them back in EN + FR + DE mid-demo. This is Gradium's signature flex (accent/rasp/breathiness preservation).
  2. **Sub-500ms interruptible agent** where the presenter talks over the AI mid-sentence and it gracefully yields (LiveKit `allow_interruptions=True`, `min_interruption_words=0`, `preemptive_generation=True`) — Gradium's semantic VAD + TTFA ~220ms makes this actually feel human.
  3. **Multilingual live translation** with the *same cloned voice* speaking 5 languages back — cross-lingual voice identity is a Kyutai research pillar and visually obvious on stage.
  4. **Expressive control live**: twist a knob on screen that changes `cfg_coef` / `temperature` / `padding_bonus` and hear speaker similarity / emotion / speed shift in real time — shows off the "audio-native" story.

- **combinability**:
  - **+ DeepMind (Gemini / Gemini Live)**: Use Gemini as the LLM brain, Gradium STT+TTS on the edges for sub-500ms EU-region latency and better multilingual voice cloning than Gemini Live's built-in voices. Swap `inference.LLM(model="...")` → Gemini in the LiveKit `AgentSession`.
  - **+ Lovable**: Lovable generates the front-end shell; Gradium Studio or LiveKit embed gives the voice layer. Demo a Lovable-built app that *talks back*.
  - **+ Entire (entire.so / agentic ops)**: Wire Entire workflows as `@function_tool`s inside the Gradium/LiveKit agent — voice-first trigger for back-office automations. Async tool calling in Gradbot keeps the convo alive while Entire runs.
  - **+ Tavily (search)**: Voice agent that researches live — Tavily search as a tool, Gradium reads results in a cloned voice with emotion appropriate to the finding. Classic "voice research copilot."
  - **+ Pioneer by Fastino (task-specific small LMs)**: Use Fastino's tiny classifier LMs as fast intent routers between Gradium STT and the heavy LLM — keeps the cascade under 500ms even with a tool-heavy agent.
  - **+ Aikido (security)**: Aikido scans the voice agent's tool surface and prompt-injection vectors; demo a "red-teamed voice agent" where Aikido catches a voice-injected exploit mid-conversation.

- **anti_patterns (avoid)**:
  - "Voice assistant for [vertical]" with no latency-sensitive interaction — Gradium's edge is wasted if your demo is a one-shot Q&A.
  - Generic phone/IVR bot. Twilio-style use cases don't showcase the ALM architecture, sub-300ms TTFA, or cross-lingual voice identity.
  - Read-an-article TTS (audiobook). Technically possible with Pipecat non-conversational guide, but doesn't wow a live crowd.
  - "ChatGPT with a voice" — OpenAI Realtime already does this; you need to differentiate on *cloning*, *EU languages*, or *expressive control*.
  - Demos that require an **end-to-end S2S model** — Gradium's public API is cascaded. Moshi-style S2S is research-track.

- **quick_start_path**:
  1. Sign up at **studio.gradium.ai** → grab `GRADIUM_API_KEY` (Free = 45k credits, enough for a full hack).
  2. `pip install "livekit-agents[gradium]~=1.3"` (and `livekit` + `livekit-api`).
  3. `.env` with `GRADIUM_API_KEY`, `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.
  4. Core session (verbatim from their LiveKit quickstart):
     ```python
     session = AgentSession(
         stt=gradium.STT(vad_threshold=0.6, vad_bucket=1),
         llm=inference.LLM(model="openai/gpt-4.1-mini"),
         tts=gradium.TTS(),
         allow_interruptions=True,
         min_interruption_words=0,
         preemptive_generation=True,
     )
     ```
  5. `uv run python src/agent.py console` (local voice loop) → `uv run python src/agent.py dev` (LiveKit room) → `lk cloud deploy` (prod). ~100 lines total for a full conversational agent. For vibe-coding / minimal footprint, use `pip install gradbot` and their ~50-line template.
  6. For voice cloning: record 10s of target voice, `POST /create-voice` with audio file, get `voice_id`, pass as `gradium.TTS(voice_id=...)`. Free tier = 5 instant clones.

---

## Sources
- Homepage: https://gradium.ai
- API Docs: https://docs.gradium.ai (sitemap at `/llms.txt`)
- Pricing: https://gradium.ai/pricing
- LiveKit quickstart: https://gradium.ai/content/how-to-build-voice-ai-agent-gradium-livekit
- Launch thesis: https://gradium.ai/blog/gradium
- Gradbot: https://gradium.ai/blog/gradbot
- Latency benchmarks: https://gradium.ai/blog/optimizing-quality-vs-latency
- Voice cloning whitepaper: https://gradium.ai/blog/voice-cloning-sounds-fake
- Full-duplex / Moshi context (Coval): https://www.coval.ai/blog/the-future-of-speech-to-speech-ai-inside-gradium-and-kyutai-s-approach-to-full-duplex-conversation
- TechCrunch stealth launch: https://techcrunch.com/2025/12/02/paris-based-ai-voice-startup-gradium-nabs-70m-seed/
- Sifted ($70M, Eric Schmidt): https://sifted.eu/articles/gradium-70m-seed-voice-ai
- Slator launch coverage: https://slator.com/voice-ai-startup-gradium-70m-seed-round/
- PYMNTS: https://www.pymnts.com/artificial-intelligence-2/2025/gradium-gets-70-million-to-turn-voice-into-ais-universal-interface/
- GitHub: https://github.com/gradium-ai (`gradium-py`, `gradium-rs`)
- Community Go SDK: https://github.com/cydanix/go-gradium
- crates.io: https://crates.io/crates/gradium
- AWS Marketplace: https://aws.amazon.com/marketplace/pp/prodview-vso5hhkq2eiww
- TEN Framework integration: https://theten.ai/blog/gradium-tts-stt-ten
- FirstMark portfolio: https://firstmark.com/portfolio/gradium/
- X/Twitter: @GradiumAI
- LinkedIn: linkedin.com/company/110085693
- Discord: discord.gg/bcysuPRzXE

## Notes / [UNVERIFIED]
- `gradium.com` is a placeholder page (TV-snow GIF, unrelated). `gradium.io` redirects to `/lander`. Canonical domain is **gradium.ai**.
- No Berlin Hack 2026-specific sponsorship promo code surfaced via web search [UNVERIFIED] — confirm with on-site sponsor rep; startup grant ($2k + 6mo) is the documented fallback.
- Emotion control is implicit (voice similarity `cfg_coef` + temperature diversity + voice selection); there is no explicit "happy/sad/angry" style-prompt API like ElevenLabs v3 [UNVERIFIED at time of research].
- End-to-end speech-to-speech (Moshi) is research-track at Kyutai, not in Gradium's production API as of April 2026.
