# Konstantin Journal

---

## 2026-04-25 — Berlin Hack Day 1 Retrospective

### Was heute shipped
- 13 Briefs an 6 Agents — alle 12 Code-Briefs mit Done-Signal returned
- Backend: Tavily-Bug gefixt (finalizeClaim schedulete nie Tavily → payout range war leer)
- Research: System-Prompt v2 — natürliche Gesprächsführung, per-policy Transitions, Silence-Handling
- Frontend: iOS Safari Fixes (safe-area, dvh, mic-permission, no-scroll)
- Polish: Vbakhteev-Integration (neue Status-Labels, Email-Guard)
- Product: AI Studio Test-Scenarios für Gemini Live testing
- Multi-Agent Parallel-Execution hat funktioniert — 5 Agents gleichzeitig, alle pünktlich, kein unerlaubter Push

### Fehler und Lernpunkte

**#1 — Design-Brief ohne Quellen-Verifikation (größter Fehler heute)**
Dennis hat 3 Iterationen für 1 Screen gebraucht. Brief 1 hatte `bg=#0A1628` (navy) — erfunden. Korrektur hatte `bg=#0A0A0A` (dunkelgrün) — immer noch falsch. Echtes Inca-Design ist weiß/light mit grünen Akzenten. Dennis hat korrekt umgesetzt was ich ihm gesagt hab — die Fehlerquelle war ich.
Regel: Vor jedem Design-Brief → Brand-Website fetchen, CSS-Farben extrahieren. Keine geschätzten Hex-Werte.

**#2 — Screenshot-Workflow zu langsam**
Fabian musste mehrfach wiederholen, dass Screenshots automatisch gelesen werden sollen. Memory-Notiz deckte nur "wenn Fabian einen Pfad schickt" ab, nicht "nimm sie selbst". Headless Chrome funktioniert ohne Screen-Recording-Permissions — das ist die Standard-Methode ab jetzt.

**#3 — Kein Preview-Gate vor Design-Implementierung**
Für Code-Briefs können Agents ihre Arbeit selbst verifizieren (TypeScript, Tests, Logs). Für Design gibt es nur eine Verifikation: den Browser. Die passierte erst nach 45 Minuten Implementierungsarbeit. Besser: Phase 1 = nur Design-Proposal (Farben/Tokens in Markdown, 15 min) → Konstantin reviewed → Phase 2 = Implementierung.

**#4 — Vbakhteev-Changes nicht proaktiv getracked**
Vlad pushte 3 Commits während unserer Session (`c495286`, `d2d7d96`, `2053892`) — ich habe das nicht bemerkt bis es relevant wurde. Besser: nach jedem Agenten-Zyklus kurz `git log --oneline -3` um Vlad's Änderungen zeitnah zu erfassen.

### Prozess-Verbesserungen (ab sofort)

1. **Design-Briefs:** fetch → verify CSS → confirmed hex values → proposal-phase → implement
2. **Screenshots:** headless Chrome automatisch, nie Fabian fragen
3. **Design-Gate:** Dennis liefert erst `docs/design-proposal.md`, dann JSX
4. **Vlad-Monitoring:** nach jedem Zyklus `git log` checken

### Offene Punkte für morgen
- Dennis implementiert Landing Page v2 (light/white Inca-Design) — noch aktiv
- 4 weitere Screens zu designen: Onboarding, Dashboard, Call, Review
- Adaptiver Ansatz: Tokens in `globals.css`, kein strukturelles Refactoring → merge-konflikt-sicher
- 8:00 Uhr: Merge mit Vbakhteev → danach schneller Token-Pass auf neue Screens
- 14:00 Uhr: Demo bei Inca
