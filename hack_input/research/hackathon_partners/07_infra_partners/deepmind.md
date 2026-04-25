# Google DeepMind — Hackathon Infrastructure Partner Dossier

**TL;DR (5 lines)**
1. Gemini 3.1 Pro (released Feb 19 2026) is the flagship: 1M-token context, 64k output, native multimodal (text/image/video/audio/code), agentic tool use, and a tunable `thinking_level` (minimal→high) with Deep Think mode for heavy reasoning. [1][2][7]
2. Full generative-media stack is callable from one Gemini API key: Veo 3.1 + Veo 3.1 Lite (video with native audio), Imagen 4 (up to 2K images), Lyria 3 / Lyria 3 Pro (up to ~3 min music, text+image input, SynthID), Gemini 3 Flash Image. [3][4][5][11]
3. Live API (`gemini-3.1-flash-live-preview`, released Mar 26 2026) is a WebSocket-based audio-to-audio agent with 70-language support, barge-in, affective dialog, proactive audio, video input, and combined built-in + custom tools. [6][9]
4. Genuinely new last-90-days: Gemini 3.1 Pro (+2× reasoning), Gemini 3 Flash, Gemini 3.1 Flash-Lite, Veo 3.1 Lite, Lyria 3 Pro (3-min tracks), Gemini Robotics-ER 1.6 (Apr 14 — spatial/embodied reasoning), combined-tools single-call, 100 MB file inputs, Computer Use tool on Gemini 3 Pro/Flash, multimodal embeddings (`gemini-embedding-2-preview`). [7][8][11]
5. Hackers get free-tier keys via AI Studio, but Pro models moved behind paid billing Apr 1 2026 — Flash-Lite remains the free workhorse (15 RPM / 1000 RPD / 250k TPM / 1M context). [10]

---

- **what_it_does:** Google DeepMind ships the Gemini family of frontier multimodal foundation models plus a full generative-media suite (Veo, Imagen, Lyria, Genie) and embodied-reasoning models (Gemini Robotics-ER). For hackathon developers, everything is exposed through a single unified Gemini API accessible via Google AI Studio (prototyping) or Vertex AI (enterprise). One API key gives you text, vision, video understanding, video generation, image generation, music generation, speech, real-time multimodal streaming, and robotics reasoning — plus a tunable `thinking_level` and Google Search / Maps / Code Execution / URL Context / File Search as built-in tools callable in the same request as your custom functions. [1][2][7]

- **primary_sdk_capabilities:**
  - **Text/multimodal generation:** `gemini-3.1-pro-preview` (1M in / 64k out, thinking_level: minimal|low|medium|high, default high) — best reasoning; `gemini-3-flash-preview` — Pro-level intel at Flash speed; `gemini-3.1-flash-lite-preview` — cost-efficient workhorse, free-tier eligible. [2][7][10]
  - **Image generation:** `gemini-3-pro-image-preview`, `gemini-3.1-flash-image-preview` (32k out), plus Imagen 4 (up to 2K) on Vertex AI / Gemini API. [2][11]
  - **Video generation:** `veo-3.1-generate-preview`, `veo-3.1-lite-generate-preview` (released Mar 31 2026 — <50% cost of Veo 3.1 Fast at same speed). Native audio (SFX, ambience, dialogue), 4K output (added Jan 13). [3][7][11]
  - **Music generation:** `lyria-3-clip-preview` (30 s), `lyria-3-pro-preview` (~3 min, verses/choruses, text+image input, SynthID watermark). [5][7]
  - **Real-time multimodal:** Live API via WebSocket — `gemini-3.1-flash-live-preview` A2A model; input: 16 kHz PCM audio, ≤1 FPS JPEG, text; output: 24 kHz PCM audio; 70 languages; barge-in; affective dialog; proactive audio. Ephemeral tokens for client-direct connections. Integrations: LiveKit, Pipecat, Fishjam, ADK. [6][9]
  - **Embeddings:** `gemini-embedding-2-preview` — multimodal (text, image, video, audio, PDF). [7]
  - **Speech:** `gemini-3.1-flash-tts-preview` (Apr 15 2026 — expressive, steerable, multilingual). [7]
  - **Robotics / embodied reasoning:** `gemini-robotics-er-1.6-preview` (Apr 14 2026 — spatial reasoning, multi-view perception, instrument/gauge reading, safety-constraint adherence; Colab provided). [8]
  - **Tools-in-model (all combinable in one call since Mar 18 2026):** Google Search grounding, Maps grounding, Code Execution, URL Context, File Search, Function Calling, Computer Use (Jan 29). [7]
  - **Open-weight siblings:** `gemma-4-26b-a4b-it`, `gemma-4-31b-it` (Apr 2 2026). [7]
  - **World models:** Genie 3 — 720p @ 24 FPS interactive worlds, ~1 min visual memory, "promptable world events" (weather, objects). Currently research-preview only; no public API. [12]

- **whats_newly_possible (last 90 days):**
  - **Gemini 3.1 Pro** (Feb 19 2026) — 2×+ reasoning boost over Gemini 3 Pro; `thinking_level` parameter; thought-signature continuity across tool-calling turns (400 error if dropped); `media_resolution_low/medium/high/ultra_high` per input. [1][2]
  - **Combined built-in + custom tools in a single API call** (Mar 18 2026) — one request can ground on Search, execute code, fetch URL context, call your function, and search a file store. [7]
  - **Live API A2A** (`gemini-3.1-flash-live-preview`, Mar 26 2026) — production-grade real-time voice agent; proactive audio + affective dialog in preview. [6][7]
  - **Veo 3.1 Lite** (Mar 31 2026) — high-volume video gen at <50% cost of Fast. 4K portrait support added Jan 13. [3][7]
  - **Lyria 3 Pro** (Mar 25 2026) — ~3-min tracks with verse/chorus structure and image-to-music conditioning. [5][7]
  - **Gemini Robotics-ER 1.6** (Apr 14 2026) — gauge/instrument reading, +6%/+10% safety adherence in text/video. [8]
  - **Multimodal embedding** (`gemini-embedding-2-preview`, Mar 10 2026) — one vector space across text/image/video/audio/PDF. [7]
  - **Computer Use tool** on Gemini 3 Pro/Flash (Jan 29 2026) — agent can drive a browser/UI. [7]
  - **File inputs up to 100 MB + Cloud Storage / signed URL support** (Jan 8 2026). [7]
  - **Flex and Priority inference tiers** (Apr 1 2026) — latency/cost knobs. [7]
  - **`gemini-3.1-flash-tts-preview`** (Apr 15 2026) — steerable multilingual TTS. [7]

- **integration_footprint:**
  - **Auth:** API key from Google AI Studio (fastest path, good for hackathon) OR service account / OAuth on Vertex AI for enterprise. [2][7]
  - **SDKs:** Official Google GenAI SDK (Python, JS/TS, Go), REST, plus ADK (Agent Development Kit) and Gemini CLI. [7]
  - **Free tier (Apr 2026 state):** Gemini 2.5 Flash, 2.5 Flash-Lite, Gemini 3.1 Flash-Lite, Embeddings are free. Pro models are PAID-ONLY since Apr 1 2026. Rate limits (free): Flash-Lite 15 RPM / 1000 RPD, 2.5 Flash 10 RPM / 250 RPD, 2.5 Pro 5 RPM / 100 RPD; all share 250k TPM and the 1M-token context. Quotas are per-project, not per-key. [10]
  - **Paid pricing (highlights):** Gemini 3.1 Pro $2/$12 per 1M in/out (≤200k), $4/$18 (>200k); Flash-Lite $0.25/$1.50; Veo 3.1 $0.05–$0.60/sec; Imagen 4 $0.02–$0.06/image; Lyria 3 $0.04–$0.08/song; batch = 50% off. [11]
  - **Mandatory spending caps + prepaid billing** for new accounts since Apr 1 2026. [10]

- **killer_demo_angle:** DeepMind engineers lean forward for demos that **exercise multiple new-in-2026 capabilities in a single loop**, showing the model is the system, not the glue. Strongest angles for this weekend:
  1. **"Thinking-aware agent"** — visibly surface `thoughtSignature` continuity across a multi-turn tool-calling loop where the agent uses Search + Code Execution + a custom tool in ONE API call (the Mar 18 combined-tools release). Shows you actually read the changelog. [7]
  2. **Real-time multimodal world-builder** — Live API voice input → Gemini 3 Pro plan → Veo 3.1 Lite shot generation → Lyria 3 score → streaming back via Live API TTS, all on one API key. Hits every 2026 release.
  3. **Embodied-reasoning-in-the-browser** — use `gemini-robotics-er-1.6-preview` on a webcam feed (phones count) to do spatial grounding / pick-and-place plans in a simulated robot, or ship a real-world "read this analog gauge" demo (the specific capability Boston Dynamics called out Apr 14). [8]
  4. **Computer Use agent** solving a real SaaS workflow end-to-end with Search grounding + File Search over an uploaded PDF corpus (100 MB input limit now possible). [7]
  5. **Long-horizon video understanding** — ingest hours of video via 1M-context + multimodal embeddings, then answer needle-in-haystack queries. Showcases the context window, not just "another chatbot".

- **combinability:**
  - **Lovable (AI app builder):** Natural pair. Scaffold a Next.js/React app with Lovable in 10 min, drop in a Gemini Live API WebSocket component and a Veo 3.1 generation endpoint — you get a full-stack media app without writing plumbing. Lovable's vibe-coding + Gemini 3's agentic-coding strengths reinforce each other.
  - **Tavily (search/grounding):** Gemini 3 already has Google Search grounding built-in, but Tavily is better for **agentic deep-research loops** (longer crawls, neutral provenance). Use Gemini 3 Pro as the reasoner, Tavily as the external web tool via function calling; complements Google Search rather than duplicating it.
  - **Pioneer by Fastino (small task-specific models):** Good latency/cost combo — Fastino for tight, structured extraction (PII, classification, intent) on the hot path; Gemini 3 Pro only when you need heavy reasoning or multimodal. Classic "route to the smallest model that works" pattern.
  - **Aikido (security/SAST):** Useful safety layer for Computer Use or agentic coding demos — Aikido scans generated/agent-written code before it ships. DeepMind loves responsible-AI stories.
  - **Gradium / Entire [UNVERIFIED — specifics of these partners weren't verified in this pass]:** If Gradium is a data/analytics partner, pair Gemini's multimodal embeddings with their index. If Entire is an infra/runtime partner, deploy the agent there.

- **anti_patterns (what the DeepMind team is tired of):**
  - "ChatGPT clone but with Gemini" — vanilla text chatbot using none of the 2026-specific features (no Live API, no tools, no multimodal, no thinking_level).
  - Ignoring the multimodal story — feeding only text into a model whose whole edge is 1M-token video+audio+image context.
  - Using Gemini Pro where Flash-Lite would do; or vice-versa, using Flash-Lite for heavy reasoning and complaining it's dumb.
  - Hard-coding `temperature=0.1` on Gemini 3 — docs explicitly warn this breaks reasoning; leave it at the default 1.0. [2]
  - Dropping `thoughtSignature` between turns in manual REST implementations (returns HTTP 400; SDKs handle it). [2]
  - "We built a RAG pipeline" — with 1M-token context and File Search as a built-in tool, naive RAG is often the wrong shape.
  - Using Veo 3 purely for "cool b-roll" with no interaction loop — show agency, not just a render.
  - Wrapping Gemini in LangChain for no reason — the native SDK's combined-tools + thinking is more capable and cheaper.
  - Treating Genie 3 as a public API (it isn't — research preview only). [12]

- **quick_start_path:**
  1. Go to [aistudio.google.com](https://aistudio.google.com) → sign in with Google → "Get API key" (instant, free). [2]
  2. `pip install google-genai` (or `npm i @google/genai`).
  3. Prototype in AI Studio's chat UI to pick a model. For free use `gemini-3.1-flash-lite-preview`; for anything with heavy reasoning, upgrade to paid and use `gemini-3.1-pro-preview`. [7][10]
  4. Copy the code snippet directly from AI Studio (it includes the right model name + auth). Add tools: `google_search`, `code_execution`, `url_context`, `file_search`, or function calling — combine freely in one call. [7]
  5. For voice/video agents, start from [github.com/google-gemini/gemini-live-api-examples](https://github.com/google-gemini/gemini-live-api-examples) with `gemini-3.1-flash-live-preview`. [6]
  6. For video gen: `veo-3.1-lite-generate-preview` from AI Studio — cheapest, fastest path to a demoable clip with native audio. [3][7]
  7. Keep a paid billing project ready — Pro models are gated behind billing since Apr 1 2026. Set a spending cap to avoid surprise charges. [10]

---

### Sources
1. [Gemini 3 announcement — blog.google](https://blog.google/products/gemini/gemini-3/)
2. [Gemini 3 Developer Guide — ai.google.dev](https://ai.google.dev/gemini-api/docs/gemini-3)
3. [Veo — deepmind.google/models/veo](https://deepmind.google/models/veo/)
4. [Imagen / Veo / Lyria on Vertex AI — cloud.google.com](https://cloud.google.com/blog/products/ai-machine-learning/announcing-veo-3-imagen-4-and-lyria-2-on-vertex-ai)
5. [Lyria 3 developers — blog.google](https://blog.google/innovation-and-ai/technology/developers-tools/lyria-3-developers/)
6. [Gemini Live API docs — ai.google.dev](https://ai.google.dev/gemini-api/docs/live-api)
7. [Gemini API Release Notes / Changelog — ai.google.dev](https://ai.google.dev/gemini-api/docs/changelog)
8. [Gemini Robotics-ER 1.6 — deepmind.google/blog](https://deepmind.google/blog/gemini-robotics-er-1-6/)
9. [Gemini Live API examples — github.com/google-gemini](https://github.com/google-gemini/gemini-live-api-examples)
10. [Gemini API rate limits — ai.google.dev](https://ai.google.dev/gemini-api/docs/rate-limits)
11. [Gemini API pricing — ai.google.dev](https://ai.google.dev/gemini-api/docs/pricing)
12. [Genie 3 — deepmind.google/blog](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/)
