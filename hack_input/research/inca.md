# Inca — Research Dossier (Phase 2)

**Domain:** get-inca.com  |  **Legal:** INCA Solutions GmbH, Berlin (Chausseestraße) + Munich
**LinkedIn:** linkedin.com/company/inca-ai (~27 employees, 11-50 range)
**CEO:** Philip Nag (ex-BCG + Bain; Imperial College London, AI Agents/CV/RL; based Munich)
**Stage:** Pre-seed closed — described as "one of the largest and most competitive InsurTech Pre-Seed rounds in Europe"
**Confirmed participant:** "Big Berlin Hack #2" per their LinkedIn post feed

## TL;DR (5 lines)

1. Inca is an AI-native **Third-Party Administrator (TPA)** for P&C insurance claims — not a SaaS. They take over the claims file end-to-end on behalf of insurers/MGAs and run it through their **MARS** platform.
2. MARS = **250+ specialised AI agents** (42 fraud, ~12 coverage/liability, ~63 expert-opinion/invoice, ~29 recourse, 140+ indemnity-optimisation) with human-in-the-loop claims analysts.
3. Scope today: German-market P&C — KFZ Haftpflicht & Kasko, Hausrat, Privat-Haftpflicht, Electronics, Tierkranken/-Haftpflicht, Reise. Pitched value: **2-4pp loss-ratio reduction, 5-10% payout reduction, 24h SLA, zero IT integration** (the TPA wedge).
4. Compliance posture is front-and-center: GDPR, ISO/IEC 27001, **EU AI Act aligned, DORA compliant**, all ops in EU. This is not background noise — it's the moat they sell into BaFin-regulated carriers.
5. Last 90 days obsessed with: (a) fraud agents that catch deepfakes + document manipulation, (b) "why Dunkelverarbeitungsquote is NOT the right KPI" (CEO thought-leadership pivot from dark-processing to indemnity quality), (c) hiring AI engineers and claims experts in parallel — the hybrid is the product.

---

- **what_they_do:** Agentic-AI-powered TPA that handles P&C claims end-to-end for European insurers and MGAs — intake, reserve-setting, coverage review, invoice audit, fraud, recourse, payout authorisation — via the MARS platform (250+ specialised agents) with expert human oversight. Business model is outsourced claims handling (no IT integration required), not a software license; the agents run inside Inca, carriers hand over the file.

- **tech_stack_signals:**
  - **MARS** — internal orchestration platform, 250+ agents segmented by claim sub-task (fraud/coverage/indemnity/recourse); clear multi-agent topology, not one monolithic chain.
  - **Compliance stack:** ISO27001, GDPR, EU AI Act, DORA — implies formal model governance, logging, EU data residency (likely AWS Frankfurt or Hetzner; not confirmed). [UNVERIFIED]
  - **Vision/document AI:** explicitly called out for deepfake detection, document manipulation detection, invoice review, expert-opinion validation. Heavy OCR + vision model workload.
  - **CEO background:** Python/C++/Java, Imperial thesis on conversational AI with RL — signals comfort with custom agent stacks, not just LangChain glue.
  - **No public API/SDK.** No dev docs, no developer portal, no GitHub org visible. Portal exists at portal.getinca.com but appears to be internal claims analyst UI, not hacker-facing. [UNVERIFIED — no public endpoints]
  - Open roles include "AI Associate" + past "Founding AI Engineer" — small tech team, 1-3 AI engineers inferred.

- **current_obsessions (Jan-Apr 2026):**
  - CEO Philip Nag blog 2026-03-30: *"KI im Schaden: Warum die Dunkelverarbeitungsquote nicht die wichtigste Kennzahl ist"* — reframing the industry's favorite metric (straight-through-processing %) as a vanity KPI, pushing indemnity-quality / loss-ratio as the real measure.
  - 2026-03-13: *"Schadenbearbeitung outsourcen: Was ein KI-nativer TPA wirklich anders macht"* — positioning vs. legacy TPAs like Van Ameyde / Innovation Group.
  - Bitkom whitepaper contribution on "Beyond the Pilot" — moving German insurers past AI-pilot-purgatory.
  - Aon Market Prognosis 2026 alignment posts — tracking pricing/reserving macro.
  - Schadenkongress Leipzig presence.
  - Selected into an InsurTech **Global Accelerator Program**.
  - Active hiring: Senior + Junior Claims Analysts, Product Intern, AI Associate, Venture Dev Intern — scaling both AI and ops sides of the hybrid.

- **unmet_needs:**
  - **No multi-modal claims intake demo** public — photo/video/audio FNOL that GibberLinks into an agent dialog is wide open.
  - **No customer-facing agent** — they're back-office; the policyholder never talks to MARS. Opportunity: a claimant-side agent that negotiates with MARS agent-to-agent.
  - **No cross-carrier recourse network** — their 29 recourse agents work per-file; a federated recourse / subrogation protocol between Inca and a counterparty carrier's agent is green-field.
  - **No underwriting, no pricing, no distribution** — pure claims. A hackathon project touching underwriting hand-off or reserve-feedback-to-pricing loop would feel additive, not competitive.
  - **EU AI Act Annex III documentation tooling** — they claim alignment but insurers procuring from them will demand artifacts; automated model-card / risk-register generation is a real gap.
  - **German-language specificity** — Schaden vocab, BaFin-grade audit trails, GDV data standards. Most hacker tools are English-first.

- **what_would_excite_their_team:**
  Build a **"Policyholder Agent that negotiates with MARS"** — a GibberLink-style agent-to-agent FNOL where the claimant uploads a dashcam video + damage photos, their agent does the cognitive load of translating lay description into GDV-compatible claim data, then opens a structured negotiation channel with Inca's coverage/indemnity agents. Demo the full round-trip: claimant agent contests a partial denial, Inca agent cites policy clause, both agents settle on reserve — with a DORA-grade signed audit log. This is *exactly* the next frontier they're positioning for and they don't have a claimant-side story.

- **partner_prize_hook:**
  They are publicly **EU AI Act aligned + DORA compliant** and sell into BaFin-regulated carriers — the single most leverageable capability is **"high-risk AI compliance as code."** Build a drop-in module that, for any agent decision, auto-generates: (1) Annex III risk classification, (2) model card delta, (3) data lineage, (4) human-oversight attestation, (5) DORA ICT-incident hook. Wrap it around a MARS-style fraud agent. Ship it as an open middleware they could adopt. That moves their regulatory moat from compliance-theater to compliance-product.

- **anti_ideas (already built — do NOT pitch):**
  - Generic "AI claims triage chatbot" — they have 250 agents doing this.
  - Fraud detection on claim text — 42 agents live.
  - Deepfake image detection on claim photos — already in production.
  - Invoice/expert-opinion OCR validation — 63 agents.
  - Recourse/subrogation identification — 29 agents.
  - Claims ratio / indemnity optimisation — 140 agents, literally their CEO's thesis.
  - TPA-as-a-service positioning — their whole business.
  - "Human-in-the-loop" framing — their marketing spine.
  - Generic LangChain-style agent orchestration demo — MARS already does this at scale.

- **three_questions_for_pitch (for Inca judges):**
  1. "If MARS is today's 250-agent orchestra, what's the minimum viable protocol for another carrier's agent to *talk* to MARS during a multi-party motor claim — and would you adopt an open spec for that?"
  2. "Your EU AI Act alignment is table stakes today; when your German carrier customers' procurement teams demand Annex III artifacts per-decision, are you generating those manually or is there an automation gap I can fill?"
  3. "The CEO's thesis is that Dunkelverarbeitungsquote is the wrong KPI and indemnity quality is the real one — which specific agent in MARS has the hardest time justifying its decisions to a claims analyst, and what would make that agent's reasoning legible in 5 seconds?"

---

### Sources (cited)
- https://www.get-inca.com (product, MARS, agent counts, insurance lines, CEO email, ISO/GDPR)
- https://www.get-inca.com/insights (CEO blog posts Mar 2026; EU AI Act + DORA claim)
- https://www.linkedin.com/company/inca-ai (About verbatim, team, hiring, recent posts)
- https://de.linkedin.com/in/philipnag (CEO background, Imperial, AI Agents)
- https://join.com/companies/get-incacom (all 5 open roles + archived Founder's Associate + Founding AI Engineer)
- https://www.companyhouse.de/en/Philip-Nag (Managing director INCA Solutions GmbH, Munich residence)
- https://join.com/companies/get-incacom/15721533-senior-claims-analyst-m-f-d (KFZ+PHV confirmed, bicycle/travel/electronics nice-to-have)
- https://www.youtube.com/watch?v=LZxCko5KaK0 (referenced — "Mensch und KI bei Inca" — not fetched, [UNVERIFIED] content)
- https://portal.getinca.com (exists; internal, [UNVERIFIED] scope)

### [UNVERIFIED] flags
- Named investors — confirmed "top-tier VCs" + "insurance industry leaders" but no names surfaced.
- Specific carrier/MGA customers — "Trusted by leading German and European insurers" but none named publicly.
- LLM vendor (OpenAI / Anthropic / Mistral / self-hosted) — never disclosed publicly.
- Cloud provider — not disclosed; EU residency strongly implied by DORA/GDPR stance.
- Exact pre-seed $ amount — not disclosed.
- Co-founder #2+ identities — CEO Philip Nag is the only named founder; team includes Enrico F., Michael England, Dima F. on LinkedIn (roles unconfirmed).
