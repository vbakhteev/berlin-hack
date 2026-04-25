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

