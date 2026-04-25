# Vlad — Handover: Human Imperfection Layer
**Updated:** 2026-04-26 (tonight by Fabian + Konstantin)
**For:** Tomorrow morning before the 14:00 demo

---

## The Goal

Lina's conversation content is being perfected in AI Studio tonight (what she says, how she flows, natural errors in speech). But the *sound* of the call is still too clean — it screams AI.

The fix is an **imperfection layer** applied to the audio pipeline in `use-gemini-live.ts`. All of these are Web Audio API modifications. The insertion point is already identified: in `AudioPlayer.playNext()`, between `source.connect()` and `source.start()`.

---

## Priority 1 — Must Have (demo-critical)

### 🎛️ Phone EQ Filter
**What:** Add a BiquadFilter that cuts everything below ~300Hz and above ~3400Hz — the exact frequency range of a real phone call. Removes the "studio microphone" quality instantly.
**Where:** `use-gemini-live.ts` → `AudioPlayer.playNext()` — insert before destination
**Code:**
```js
const filter = audioContext.createBiquadFilter();
filter.type = 'bandpass';
filter.frequency.value = 1800;
filter.Q.value = 0.7;
source.connect(filter);
filter.connect(destination);
```
**Effort:** 15 min

---

### ⏱️ Response Delay
**What:** AI responds in <1 second. A real human takes 2-4 seconds to think and type. Add a random 1.5–3s delay before playing each audio response.
**Where:** `use-gemini-live.ts` — before `audioPlayer.enqueue()`
**Code:**
```js
const delay = 1500 + Math.random() * 1500; // 1.5–3s
setTimeout(() => audioPlayer.enqueue(audioData), delay);
```
**Effort:** 10 min

---

### 📞 Dial Tone + Headset Connect Crackle
**What:** When the call starts — 1 short dial beep, then a tiny headset crackle as Lina "picks up". Everyone knows this sound from real calls.
**Where:** `call-view.tsx` — on call connect event
**Assets:** German dial tone = 425Hz sine wave (generate in code or grab from freesound.org). Crackle = short audio file from freesound.org search "headset crackle mic noise"
**Effort:** 20 min

---

### ⏱️ Call Timer on Screen
**What:** Show elapsed call time counting up (0:00, 0:01...) exactly like a real phone call UI. Pure visual but massive perception impact.
**Where:** `call-view.tsx` — simple `useState` + `setInterval` on connect
**Effort:** 10 min

---

## Priority 2 — High Impact

### ⌨️ Keyboard Sounds While Lina Types
**What:** When Lina is "entering data" (triggered by tool calls like `update_claim_field`), play quiet keyboard typing sounds in the background for 2–3 seconds. Signals she's typing without saying it.
**Where:** `use-tool-bridge.ts` — on each tool call, play a typing audio clip in parallel
**Assets:** freesound.org → search "mechanical keyboard office typing" (pick a realistic one, not a gaming keyboard)
**Volume:** -25dB under voice, very subtle
**Effort:** 30 min

---

### 🔊 Office Background Ambient
**What:** Very quiet looping office ambient — AC hum, distant keyboard clicks, occasional muffled voice. Barely noticeable but completely changes the feel.
**Where:** `call-view.tsx` — loop an audio file at -30dB from call start to end
**Assets:** freesound.org → search "office ambience background noise"
**Effort:** 20 min

---

### 🎚️ Dynamic Compression (VoIP Codec Simulation)
**What:** Real phone calls have dynamic compression — the voice sounds slightly "squeezed". Adds authenticity without changing the content.
**Where:** `use-gemini-live.ts` → insert DynamicsCompressorNode in the chain
**Code:**
```js
const compressor = audioContext.createDynamicsCompressor();
compressor.threshold.value = -24;
compressor.knee.value = 30;
compressor.ratio.value = 4;
source.connect(compressor);
compressor.connect(filter); // chain with EQ
```
**Effort:** 10 min

---

## Priority 3 — Nice to Have

### 🎙️ Random Headset Cable Rustle
1–2x during a call, play a very short headset noise (50–100ms) as if Lina moved the cable. Timed randomly between tool calls.
**Assets:** freesound.org → "headset cable noise"
**Effort:** 20 min

### 📉 Mic Distance Simulation
Random volume dips (-3dB for 1–2 seconds) as if Lina turned her head slightly. 2–3x per call, not dramatic.
**Effort:** 20 min

### 🏢 Room Reverb
Very short room reverb (~50ms) using ConvolverNode. Sounds like a cubicle, not a recording booth.
**Effort:** 30 min (need an impulse response file)

---

## What NOT to do

- **Don't add sounds before fixing EQ + Delay.** The base voice quality must be right first. Adding fake sounds on top of clearly-AI audio makes it worse, not better.
- **Don't use synthesized/loop-y sound effects** — only real recordings from freesound.org. Generic sound effects immediately break immersion.
- **Micro-timing variation on individual words** — not technically possible with streaming audio. Skip it.

---

## Total Effort Estimate

| Must Have | ~55 min |
|---|---|
| High Impact | ~60 min |
| Nice to Have | ~70 min |
| **Realistic for demo** | **Phone EQ + Delay + Dial tone + Timer + Keyboard sounds = ~85 min** |

---

## Audio Assets — Where to Get Them

All free, CC-licensed: **freesound.org**

| Sound | Search term |
|---|---|
| Office keyboard typing | `mechanical keyboard office typing` |
| Headset crackle | `headset mic crackle noise` |
| Office ambient | `office ambience background` |
| Cable rustle | `cable rustle headset` |

German dial tone: generate programmatically — 425Hz sine wave, 1 second.

---

## Code Location Summary

| File | What to change |
|---|---|
| `components/call/use-gemini-live.ts` | EQ filter, compressor, response delay, crackle/rustle playback |
| `app/(pages)/claim/[sessionId]/_components/call-view.tsx` | Dial tone on connect, office ambient loop, call timer |
| `components/call/use-tool-bridge.ts` | Trigger keyboard sounds on tool calls |
