# SF / NY AI Hackathon Winners — Last 6 Months

**Research window:** ~2025-10-21 to 2026-04-21
**Author:** Agent 1.4
**Status:** Verified where cited; items marked [UNVERIFIED] where only tangential references found.

---

## TL;DR (5 lines)

1. Domain-expert non-coders beat professional devs repeatedly when Claude Code / Codex do the heavy lifting — 4 of 5 Opus 4.6 winners were not engineers.
2. "Agent-on-a-decision-graph" beats "agent-as-chatbot" — Rippletide won OpenAI Codex Hackathon precisely because they replaced free-text output with a structured state machine.
3. Real-world domain evidence wins (dashcam of an actual road, blueprints of a real ADU, NYC zoning PDFs) — judges reward proof that the agent works on messy production data, not demo data.
4. Voice + vision + physical body (Unitree G1, Brilliant AR glasses, MIDI controller driving Claude) is the fastest path to "stage wow"; pure-software agents have to be 10x better to match the applause.
5. Single-person + 6-day builds are increasingly winning over 30-person-weeks team builds — the meta shifted hard toward "one human + one agent harness + one painful real problem."

---

## 1. Winning Patterns (what SF/NY AI hackathons reward right now)

1. **Real hardware on stage beats pure-software 9/10 times.** Unitree humanoids, Brilliant AR glasses, MIDI controllers, and dashcam hardware keep showing up in winner lists (Physical AI Hack, Horizon SF, Opus 4.6 Conductr).
2. **Domain expert > elite coder.** Opus 4.6 hackathon: 4 of 5 winners were a lawyer, a cardiologist, a road engineer, and a musician. Judges reward taste and domain depth; Claude Code supplies the code.
3. **Vertical wedge into a broken bureaucratic process.** CrossBeam (CA ADU permits), Due Intelligence (NYC zoning due diligence), TARA (road-condition appraisals), NexusGuardAI (SOC incident response). Boring regulated industries keep winning.
4. **Agent-as-structured-state-machine, not agent-as-chatbot.** Rippletide won OpenAI Codex Hackathon by making the decision layer (hypergraph) the product, not the LLM output. Judges were tired of free-text agents.
5. **"I didn't write a line of code" as a narrative weapon.** Mike Brown's CrossBeam pitch ("I didn't write a single line… I didn't even read a line") is now a recognized winning frame — judges love proof the model is the builder.
6. **Early access to a brand new model capability.** Opus 4.6 vision on dashcams (TARA), Gemini 3's long-context grounding (Due Intelligence), Codex's persistent agents (Rippletide). Win the first hackathon of a new model by exploiting its specific novelty.
7. **Physical-audible demo in the first 15 seconds.** Conductr (musician plays chords → Claude jams live @ 15ms latency) — you *hear* the AI before you see a slide. Kaizen — camera sees user dodging, AI trainer yells back. Stage wow scales with sensory modality count.
8. **Evaluation as the product.** In 2026, "an eval harness / test-generator / benchmark" is no longer infrastructure — it's a winner (see Rippletide's decision graph, affaan-m's "Everything Claude Code" agent harness).
9. **Agent swarms with legible division of labor.** Moveworks Molina Ambient PM agent, Rippletide multi-agent scientific discovery — but only when each agent has a named role judges can follow on screen.
10. **Synthetic personas / simulation loops.** zenith.chat (talk to fake customers), Elisa (block-IDE teaching loop). Loop-back demos where the AI gets better on stage are undefeated.
11. **"Ship it for a real user waiting tonight."** Mike Brown had permit applicants waiting; Kazibwe tested TARA on an actual road under construction. Judges visibly perk up when the demo ends with "and this ships to a paying user Monday."
12. **Open-sourcing the harness / config post-win.** affaan-m published his agent-harness config → grew to 82K GitHub stars and amplified the win into a career. The post-hackathon distribution play is now part of the judging taste.

---

## 2. Winning Projects (sorted by creativity × technical × demo, desc)

```
- item: Rippletide Decision Layer (Scientific Discovery Multi-Agent)
  one_liner: Continuously-running multi-agent system that replaces LLM free-text with a hypergraph decision state for scientific discovery.
  why_novel: Judged by Greg Brockman/Sonya Huang — judges specifically praised replacing "outputs" with "outcomes" via explicit state graph; first hackathon winner to pitch eval-as-product.
  creativity_score: 9
  technical_depth_score: 10
  demo_factor: 9
  stage_wow_idea: Open by putting a live, zooming hypergraph on the screen — nodes lighting up as agents propose/reject hypotheses — then show the decision trace back to the ground-truth paper that justified the action.
  link: https://www.rippletide.com/resources/blog/winning-the-openai-codex-hackathon-moving-from-outputs-to-outcomes-the-decision-layer
  event: OpenAI Codex Hackathon @ OpenAI HQ, SF, Feb 5 2026
```

```
- item: CrossBeam
  one_liner: AI permit assistant that reads ADU blueprints + CA correction letters and auto-generates municipal-grade action plans.
  why_novel: Non-coder attorney beat 500 engineers; attacked a politically potent pain (CA housing crisis) with zero code written, all Claude Code.
  creativity_score: 8
  technical_depth_score: 9
  demo_factor: 10
  stage_wow_idea: Drop a real 40-page correction letter PDF on stage, hit one button, pan to a live split-screen of the agent annotating the blueprint with code citations while the timer counts from 0 to "plan complete" in 90 seconds.
  link: https://claude.com/blog/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon
  event: Built with Opus 4.6 / Cerebral Valley x Anthropic, Feb 2026
```

```
- item: Conductr
  one_liner: Browser MIDI instrument where Claude plays the bass/drums/melody bandmate live at ~15ms latency.
  why_novel: Audible-first demo; first winning hackathon project to prove LLMs can participate in real-time musical performance under perceptual latency floor.
  creativity_score: 10
  technical_depth_score: 9
  demo_factor: 10
  stage_wow_idea: Walk on stage with a MIDI keyboard, no slides. Play two chords. Claude drops in drums, bass, and a counter-melody. Stop. Restart in a different key. The room cheers before you introduce yourself.
  link: https://claude.com/blog/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon
  event: Built with Opus 4.6, Feb 2026
```

```
- item: TARA (Dashcam-to-Road-Appraisal)
  one_liner: Uploads dashcam footage, uses Opus 4.6 vision to segment distress patterns + roadside activity, emits NPV/cash-flow economic appraisal in ~5 hours vs weeks.
  why_novel: Built by a Ugandan road technician; weaponized Opus 4.6 vision on a problem Silicon Valley never touches; tested on a real road under construction.
  creativity_score: 9
  technical_depth_score: 8
  demo_factor: 9
  stage_wow_idea: Play 8 seconds of shaky dashcam from Kampala, freeze, overlay the AI's segmentation masks in red/yellow/green, then cut to a generated PDF appraisal landing in a real government inbox.
  link: https://claude.com/blog/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon
  event: Built with Opus 4.6, Feb 2026
```

```
- item: Due Intelligence
  one_liner: Agentic platform that ingests NYC's fragmented public data (zoning, DOB, landmarks, FAR) and produces a site-feasibility due-diligence report in minutes.
  why_novel: First Gemini-3-long-context winner at a major SF/NY hackathon; replaces 10+ consultant data sources with one agent loop; grounded by authoritative municipal data.
  creativity_score: 8
  technical_depth_score: 9
  demo_factor: 8
  stage_wow_idea: Drop a Manhattan lot number into the prompt. Screen fills with a live map + pulling zoning PDFs, tax lots, landmark overlays. End with a printable 12-page PDF in 90 seconds.
  link: https://cerebralvalley.ai/e/zero-to-agent-nyc
  event: Zero to Agent (Vercel x DeepMind x Cerebral Valley), NYC, Mar 21 2026
```

```
- item: Elisa
  one_liner: Block-based visual IDE where kids snap primitives and Claude writes backend code; 39K LOC + 1.5K tests in 30 hours.
  why_novel: The only pro-engineer winner in the 4.6 cohort — still won by outbuilding every other engineer on test coverage and scope in one week, using Claude Code as a force multiplier.
  creativity_score: 7
  technical_depth_score: 10
  demo_factor: 8
  stage_wow_idea: Invite a judge's kid on stage. They drag "when cat clicked → move forward" blocks; the IDE side panel shows Claude writing real TypeScript; then you open the test runner showing 1,500 tests green in real time.
  link: https://claude.com/blog/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon
  event: Built with Opus 4.6, Feb 2026
```

```
- item: Kaizen
  one_liner: Fitness app that uses computer vision to track your body, with AI character trainers who yell, cheer, and adapt workouts in real time.
  why_novel: Voice + vision + game loop all on stage; judges saw the pitcher physically work out during the demo.
  creativity_score: 8
  technical_depth_score: 8
  demo_factor: 10
  stage_wow_idea: Pitcher drops to the floor mid-demo, does burpees. The AI trainer's voice (ElevenLabs) counts reps, catches a form break, roasts them on stage. Audience howls.
  link: https://elevenlabs.io/blog/hackathons-nyc-london
  event: ElevenLabs x a16z x Cerebral Valley, NYC
```

```
- item: PostVisit.ai
  one_liner: Takes a doctor-visit transcript (or AI-scribe notes) and returns patient-friendly diagnosis explanations + evidence-backed next steps; also gives MDs between-visit visibility.
  why_novel: Built by a practicing Brussels cardiologist; wins judges because the agent's outputs are citation-grounded on real clinical guidelines, not hallucinated.
  creativity_score: 7
  technical_depth_score: 8
  demo_factor: 8
  stage_wow_idea: Play a 20-second audio snippet of an actual cardiologist saying "EF is 35, we're starting sacubitril-valsartan." Cut to a phone mockup: a worried patient gets a plain-language explanation and a calendar reminder — citations linked to ESC guidelines.
  link: https://claude.com/blog/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon
  event: Built with Opus 4.6, Feb 2026
```

```
- item: zenith.chat
  one_liner: Customer-discovery platform where you pitch a product to synthetic personas that react, push back, and refuse to buy — built in 8 hours with Claude Code.
  why_novel: Win came from the meta-story: an 8-hour build with a leaked Claude Code config that went viral post-hackathon; config later open-sourced as "Everything Claude Code" (82K stars).
  creativity_score: 8
  technical_depth_score: 7
  demo_factor: 8
  stage_wow_idea: Live on stage, pitch your terrible startup idea to three synthetic personas. They dunk on you in three different accents. Ask what would make them buy. One gives you the winning wedge.
  link: https://zenith.chat/
  event: Anthropic x Forum Ventures Hackathon, NYC
```

```
- item: Brilliant Labs AR Glasses Restaurant Agent
  one_liner: Smart AR glasses turn a generic "chat to an AI agent" into a walk-up restaurant concierge — voice in ear, menu/specials overlaid, order sent to POS.
  why_novel: Won Horizon SF by taking the boring chatbot format and physically embedding it in AR hardware you could pass around to judges.
  creativity_score: 8
  technical_depth_score: 8
  demo_factor: 10
  stage_wow_idea: Hand the AR glasses to a judge. Say "order me something the chef is proud of tonight." They see a floating specials menu, hear the agent narrate, and watch the ticket print on a real receipt printer on the table.
  link: https://brilliant.xyz/blogs/announcements/we-won-fdotinc-s-sf-horizon-3-day-hackathon-as-part-of-sf-tech-week
  event: Horizon SF Hackathon @ Founders, Inc. (SF Tech Week, Oct 2025)
```

```
- item: Molina Ambient Project Management Agent
  one_liner: Always-on agent that sits in meetings + Slack + Jira and autonomously files tickets, reassigns work, and prevents dropped handoffs across a healthcare project.
  why_novel: Won Moveworks' Chase Center Grand Prize by being "invisible" — the demo was the lack of manual PM work, with a running counter of tickets auto-created.
  creativity_score: 7
  technical_depth_score: 8
  demo_factor: 7
  stage_wow_idea: Run a 60-second staged Zoom meeting on stage. As people argue, tickets and handoffs silently populate a Jira board behind them. At minute-end, the agent posts a 3-bullet recap in chat — the room reads it faster than the humans finished speaking.
  link: https://www.moveworks.com/us/en/resources/blog/moveworks-ai-agent-hackathon-san-francisco-25
  event: Moveworks AI Agent Hackathon @ Chase Center, SF (late 2025)
```

```
- item: Canard Security (anti-vishing)
  one_liner: Voice-phishing defense layer — live call goes through an AI inspector that detects social-engineering patterns and drops the line before the human falls for it.
  why_novel: Third place at Mistral Worldwide Hackathon SF (70 teams, 36 hours); voice attack surface is a live 2026 pain and the demo replays a real vishing call.
  creativity_score: 7
  technical_depth_score: 7
  demo_factor: 8
  stage_wow_idea: Play a recorded vishing call that tried to steal credentials. Re-run it through the agent — the audio cuts, a red banner flashes "social-engineering attempt detected: urgency + fake-authority + PII-probe," and the agent SMS-warns the target.
  link: https://news.ucsc.edu/2026/03/ucsc-trio-takes-third-at-2026-mistral-ai-hackathon-with-cybersecurity-platform/
  event: Mistral AI Worldwide Hackathon, SF, Mar 2026
```

```
- item: Waddle Labs "Oracle of Delphi" / Gentoo
  one_liner: Autonomous growth agent that crawls your e-commerce site, predicts revenue blockers, and ships fixes — later launched as Gentoo, driving 60% revenue growth claims.
  why_novel: Won OpenAI hackathon and immediately turned into a funded US-market product; rare hackathon-to-revenue-producing-product arc in 6 months.
  creativity_score: 7
  technical_depth_score: 7
  demo_factor: 7
  stage_wow_idea: Drop any Shopify URL into the prompt on stage. 30 seconds later, the agent reads out "your checkout loses 14% of buyers at shipping selection — here's the code diff, ready to ship." Before-and-after conversion delta on screen.
  link: https://finance.yahoo.com/news/openai-hackathon-winner-waddle-labs-160000616.html
  event: OpenAI Hackathon, SF
```

```
- item: Chattermint
  one_liner: AI accent coach powered by Gemini Flash giving phoneme-level feedback in real time.
  why_novel: Phoneme-level visualization (spectrogram-ish) is rare and visually arresting; judges at Zero to Agent NYC called out the latency.
  creativity_score: 6
  technical_depth_score: 8
  demo_factor: 8
  stage_wow_idea: Ask a judge to read "rural juror" 3x fast. Their voice spectrogram overlays in real time; Gemini highlights the retroflex-R failure; the agent models the corrected pronunciation in the judge's own voice clone.
  link: https://cerebralvalley.ai/e/zero-to-agent-nyc/hackathon/gallery
  event: Zero to Agent NYC (Vercel x DeepMind x Cerebral Valley), Mar 21 2026
```

```
- item: Ansr
  one_liner: AI voice host for restaurants — picks up the phone, takes reservations, handles allergies, upsells specials.
  why_novel: Finalist at Zero to Agent NYC; voice UX + real POS integration shown live with a phone ringing on stage.
  creativity_score: 6
  technical_depth_score: 7
  demo_factor: 8
  stage_wow_idea: A judge's phone rings during the pitch. They answer. It's the agent, calling from a "restaurant" to confirm the reservation the judge supposedly made 30 seconds ago. The room erupts.
  link: https://cerebralvalley.ai/e/zero-to-agent-nyc/hackathon/gallery
  event: Zero to Agent NYC, Mar 21 2026
```

```
- item: Self-Evolving AI Comedian [UNVERIFIED project name]
  one_liner: Stand-up comedy bot that rewrites its own prompts based on live laughter signal from the audience microphone.
  why_novel: AGI House created a last-minute bonus prize for it in Nov 2025 — meaning the demo was so wild the organizers improvised prize money on the spot.
  creativity_score: 9
  technical_depth_score: 6
  demo_factor: 10
  stage_wow_idea: Point a mic at the crowd. Bot tells a joke. Laughter-detector prints a "crowd score" on screen. Bot silently edits its own system prompt. Next joke is measurably funnier. By joke 4 the audience is roaring — the evolution is the demo.
  link: https://agihousecommunity.beehiiv.com/
  event: AGI House NYC Flash SLM Hackathon, Nov 2025
```

```
- item: Global Chess Challenge 2025 winner [UNVERIFIED specific team]
  one_liner: Fine-tuned small language model that plays chess via RLVR, evaluated live against Stockfish on AWS Trainium.
  why_novel: $17K cash + $8K compute, two tracks (data-centric fine-tuning vs RLVR); live leaderboard vs Stockfish made it measurable for judges.
  creativity_score: 6
  technical_depth_score: 9
  demo_factor: 7
  stage_wow_idea: Live board on stage. Their SLM vs Stockfish-1500. Move-by-move commentary explaining the model's reasoning traces appears under each move.
  link: https://www.aicrowd.com/challenges/global-chess-challenge-2025
  event: AGI House x AWS x NeurIPS 2025 Expo Workshop, San Diego, Dec 2 2025
```

```
- item: "Everything Claude Code" Agent Harness
  one_liner: Open-source Claude Code configuration system (skills, instincts, memory, security, research-first dev) that amplifies one engineer into a team.
  why_novel: Not a "product" in the classic sense — it's the harness that won Anthropic hackathons, then open-sourced for distribution; 82K GitHub stars; redefined what "winning" looks like.
  creativity_score: 8
  technical_depth_score: 9
  demo_factor: 6
  stage_wow_idea: Two laptops side by side. Vanilla Claude Code on the left, harnessed Claude on the right. Same prompt: "ship a working feature with tests and docs." Right finishes in 4 minutes; left still asking clarifying questions at 12 minutes.
  link: https://github.com/affaan-m/everything-claude-code
  event: Anthropic x Forum Ventures Hackathon, NYC (post-winner artifact)
```

```
- item: API Self-Healing Agent (Postman SF winner) [UNVERIFIED team name]
  one_liner: Agent that monitors API contracts, detects breaking changes upstream, and auto-patches the client with a reviewed PR.
  why_novel: Won Postman's SF 2025 sponsor prize; attacks a universally felt pain (upstream API drift) that every dev in the audience has cursed at.
  creativity_score: 6
  technical_depth_score: 8
  demo_factor: 7
  stage_wow_idea: Judge picks any public API. Presenter force-breaks the contract (mock). 10 seconds later, the agent files a real PR in GitHub Actions with a full diff + regenerated types + passing tests.
  link: https://www.youtube.com/shorts/Y0TCAfWs2S0
  event: Postman-sponsored SF Hackathon, 2025
```

---

## 3. Sources

- https://claude.com/blog/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon (Opus 4.6 winners, primary)
- https://www.rippletide.com/resources/blog/winning-the-openai-codex-hackathon-moving-from-outputs-to-outcomes-the-decision-layer (Rippletide / OpenAI Codex)
- https://cerebralvalley.ai/e/zero-to-agent-nyc (Zero to Agent NYC, Due Intelligence, Chattermint, Ansr)
- https://brilliant.xyz/blogs/announcements/we-won-fdotinc-s-sf-horizon-3-day-hackathon-as-part-of-sf-tech-week (Horizon SF / Brilliant AR)
- https://elevenlabs.io/blog/hackathons-nyc-london (Kaizen @ ElevenLabs NYC)
- https://news.ucsc.edu/2026/03/ucsc-trio-takes-third-at-2026-mistral-ai-hackathon-with-cybersecurity-platform/ (Canard Security / Mistral SF)
- https://finance.yahoo.com/news/openai-hackathon-winner-waddle-labs-160000616.html (Waddle Labs / Gentoo)
- https://www.moveworks.com/us/en/resources/blog/moveworks-ai-agent-hackathon-san-francisco-25 (Molina / Moveworks)
- https://www.aicrowd.com/challenges/global-chess-challenge-2025 (Global Chess Challenge)
- https://github.com/affaan-m/everything-claude-code (Everything Claude Code harness)
- https://zenith.chat/ (zenith.chat / Anthropic x Forum Ventures)
- https://cerebralvalley.ai/hackathons (Cerebral Valley hackathon hub)
- https://x.com/cerebral_valley/status/2026066211482857844 (4.6 hackathon stats: 13K apps / 500 selected / 227 projects / 6 finalists / 3 winners)
- https://luma.com/8ca2z1rr (Physical AI Hack 2026)
- https://sensaihack.com/sanfrancisco/ (Worlds in Action Hack SF, Mar 14-15 2026)
- https://agihousecommunity.beehiiv.com/ (AGI House newsletter, self-evolving comedian reference)
- https://blog.agihouse.org/posts/autonomous-robot-build-day-pre-event-guide (AGI House Autonomous Robot Build Day, Feb 7 2026)

## 4. Gaps / [UNVERIFIED] notes

- AGI House has hosted ~weekly build days since Oct 2025 (Gemini 3 Build Day Dec 13 2025, Autonomous Robot Build Day Feb 7 2026, NYC Flash SLM Hackathon Nov 2025, Global Chess Challenge NeurIPS Dec 2 2025) but most winner project names are not publicly searchable — follow-up: pull AGI House beehiiv newsletter archive and @agihouse_org X posts by date range.
- a16z speedrun does not appear to run a distinct "hackathon with winners" — it's an accelerator. Safely ignore.
- Scale AI hackathons: no new SF/NY winners announced in the Oct 2025–Apr 2026 window per search.
- Worlds in Action Hack SF (Mar 14-15 2026) winners not yet indexed — check Devpost directly: https://world-model-hackathon.devpost.com/
- Opus 4.7 Claude Code Hackathon starts today (Apr 21 2026) — no winners yet.
