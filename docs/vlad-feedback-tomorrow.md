# Vlad — Feedback für morgen früh (2026-04-26)
Stand: laufend aktualisiert von Konstantin/Fabian heute Nacht

---

## 🔊 Audio: Phone-Filter für Linas Stimme

**Was:** Der Output von Lina klingt zu "studio-perfect" — wie jemand der mit einem professionellen Mikrofon in einem schalltoten Raum sitzt. Das fühlt sich nicht wie eine echte Telefonhotline an.

**Gewünschtes Ergebnis:** Linas Stimme soll klingen wie ein echter Büro-Agent mit Headset:
- Leichter Phone-EQ: Highpass ~300Hz, Lowpass ~3400Hz (klassischer Telefonklang)
- Subtiles Office-Hintergrundrauschen (sehr leise, kaum wahrnehmbar)
- Leichte Audio-Kompression

**Wo:** `components/call/use-gemini-live.ts` — Post-Processing auf dem Audio-Output via Web Audio API

**Aufwand:** ~30 Minuten

**Warum:** Macht den "ist das KI oder ein Mensch?"-Moment viel stärker. Jury und Demo-Publikum spüren es sofort.

---

## (weitere Punkte kommen heute Nacht noch dazu)


---

## ⏱️ Response Delay — künstliche Denkzeit vor jeder Antwort

**Was:** AI antwortet in unter 1 Sekunde. Ein Mensch braucht 2-4 Sekunden. Diese Lücke ist der größte AI-Tell im Gespräch.

**Gewünschtes Ergebnis:** Vor dem Ausspielen jeder Lina-Antwort: 1.5-3 Sekunden künstliche Verzögerung. Variabel — nicht immer gleich lang.

**Wo:** `components/call/use-gemini-live.ts` — Audio-Output verzögern bevor es abgespielt wird

**Aufwand:** ~20 Minuten

---

## 🎙️ Imperfekte Aussprache / TTS-Textur

**Was:** Linas Stimme klingt zu perfekt und zu sauber. Kein Mensch spricht so.

**Gewünschtes Ergebnis:** Leichte Audio-Textur auf dem TTS-Output — minimale Variation in Pitch und Speed, die das "zu perfekt" aufbricht. Kein dramatischer Effekt — nur das "uncanny valley" der Perfektion entfernen.

**Wo:** Audio post-processing in der Web Audio API Pipeline, nach dem Gemini Live Output

**Aufwand:** ~45 Minuten. Kann auch einfach mit dem Phone-EQ Filter kombiniert werden.


---

## 🎭 IMPERFECTION LAYER — vollständige Blueprint

Das ist die wichtigste technische Aufgabe für die Demo. Der Inhalt (was Lina sagt) wird über AI Studio gut. Aber wie sie klingt muss manuell imperfekt gemacht werden. Alles davon geht in die Web Audio API Pipeline in `use-gemini-live.ts`.

### 1. Phone EQ Filter (bereits auf der Liste)
Highpass 300Hz + Lowpass 3400Hz. Klassischer Telefonklang. Pflicht.

### 2. Mikrofon-Distanz-Simulation
Gelegentliche leichte Lautstärkeabsenkung (-2 bis -4dB für 1-2 Sekunden), als würde die Person kurz den Kopf wegdrehen. Zufällig, 2-3x pro Gespräch. Nicht dramatisch.

### 3. Hintergrundrauschen — Büro-Atmo
Sehr leises Büro-Ambient: entferntes Tastaturklicken, leises AC-Summen, gelegentlich eine Stimme im Hintergrund. Kaum wahrnehmbar aber spürbar. Loopbare Audiodatei, -30dB unter der Stimme.

### 4. Tastatur-Sounds beim Tippen
Wenn Lina "etwas eingibt" (nach update_claim_field calls): leise Tastaturklicks im Hintergrund für 2-3 Sekunden. Signalisiert: sie tippt gerade. Sehr leise, -25dB.

### 5. Response Delay (bereits auf der Liste)
1.5-3 Sekunden künstliche Verzögerung vor jeder Antwort. Variabel — nicht immer gleich.

### 6. Kompressionsartefakte
Leichte Dynamikkompression wie bei einem echten Telefon-Codec. Stimme klingt etwas "gequetscht" — typisch für VoIP/Headset.

### 7. Stimmtonlage — demotiviert, flach
Wenn möglich über Gemini Voice-Parameter: flachere Intonation, leicht monoton. Nicht robotisch — einfach wie jemand der schon 40 Anrufe heute hatte. Weniger pitch variation als der Default.

### 8. Subtile Raumhall
Minimaler Reverb (Room-Typ, sehr kurz ~50ms), als würde sie in einem Büro-Cubicle sitzen. Kein Hall wie in einem Konzertsaal — nur die Andeutung eines echten Raums.

### 9. Micro-Timing Variation
Winzige zufällige Timing-Variations zwischen TTS-Wörtern (+/- 20-50ms). Macht den Rhythmus weniger maschinell-gleichmäßig.

### Priorität für Demo (wenn nicht alles möglich)
1. Phone EQ Filter ← Pflicht
2. Response Delay ← Pflicht  
3. Tastatur-Sounds ← sehr hoher Impact
4. Hintergrundrauschen ← hoher Impact
5. Mikrofon-Distanz ← mittel
6. Rest ← nice-to-have


---

## 📞 Call Start — Dial Tone + Connect Crackle

**Dial tone:** Short 1-2 beep dial tone before Lina picks up. Not a full ring — just enough to feel like a real call connecting.

**Connect crackle:** Tiny headset crackle/pop (50-80ms) right as the call connects. Like the agent just plugged in their headset or adjusted the cable. Very subtle.

**Mid-call cable rustle:** 1-2x during the call, a brief headset noise (cable being moved). Random timing, very short. Makes it feel like a real person adjusting their equipment.

**Where:** `use-gemini-live.ts` — play audio assets at call start + random intervals

**Assets needed:** 2-3 short audio files (dial beep, connect crackle, cable rustle) — can find royalty-free or generate with Audacity

---

## ⏱️ Call Timer Display

Show elapsed call time on the call screen — exactly like a real phone call UI.
Format: `0:00` counting up from call start.
**Where:** `call-view.tsx` — simple timer component, starts on connect

