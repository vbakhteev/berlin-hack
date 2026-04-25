# Lina Customer Guidance Scripts

Per-policy scripts for when callers are vague, lost, or don't know what to say.
These are Lina's fallback lines — not rigid flows, but conversational scaffolds to keep things moving.

---

## Electronics

### Primary questions (in order)

1. **What happened to the device?**
   - Customer knows → briefly confirm the incident type and move on: "Got it. And just to confirm — this happened accidentally, right? Not intentional damage?"
   - Customer is unsure → "Take your time. Were you using it when it happened, or did you notice the damage after the fact? Just walk me through it from the start."

2. **What kind of device is it — brand and model?**
   - Customer knows → "Perfect, [model] — noted."
   - Customer is unsure → "No worries at all — just flip it over. There's usually a label on the back with the model name, or you can find it in Settings → About. If you can't get it right now, 'black iPhone, maybe a 14' is enough to start."

3. **Roughly when did you buy it?**
   - Customer knows → "Great. And do you still have the purchase receipt?"
   - Customer is unsure → "No exact date needed — even 'about two years ago' or 'sometime in 2023' is fine. We can pin the exact date when you send in your receipt."

4. **Do you have a purchase receipt?**
   - Customer has it → "Brilliant. You can upload that whenever — no need right now."
   - Customer is unsure → "Check your email for the order confirmation — it's usually from the retailer: Amazon, MediaMarkt, wherever you bought it. If you genuinely can't find it, let me know and we'll work with what's available."

5. **What's the approximate value of the device?**
   - Customer knows → "Noted. Just so you know — the policy applies a 10% annual depreciation from the purchase date, so the final payout may be a bit less than what you paid. I'll walk you through the exact calculation once we have the device age."
   - Customer doesn't know → "Ballpark is fine — even 'I think I paid around €800' helps. We can cross-check it with the receipt."

6. *(For theft)* **Did you file a police report?**
   - Yes → "Good. You'll need to upload that — it's required for theft claims."
   - Not yet → "That's okay — you can still file it today. In Germany you can do it online at your local Polizei portal, or just go in person. It usually takes under 20 minutes. We do need it to process the theft claim, but you don't have to have it right now to continue."

### Customer scaffolds

- **Customer doesn't know the device model:** "No worries — just flip it over and there should be a sticker on the back with the model name. Or if it's a phone, go to Settings → About — it'll be right at the top."
- **Customer doesn't know the purchase date:** "Even a rough idea works — 'about two years ago' or 'I bought it in 2023' is enough. We can pin down the exact date when you send in your receipt."
- **Customer can't find their receipt:** "Check your email for the order confirmation — usually from the retailer. If you paid by card, a bank statement showing the charge works too. We'll do our best with what you have."
- **Customer doesn't have the serial number:** "Serial numbers help, but aren't always needed right now. For phones, dial *#06# — it appears on screen. For laptops, check the bottom of the device or the battery compartment."
- **Customer isn't sure if the device is registered on the policy:** "Let me check that for you — it should be on file if you added it when you set up the policy. If it wasn't registered, let's confirm first before I tell you anything definitive."
- **Customer asks about the payout amount now:** "I can give you a rough picture. The policy covers up to €5,000, minus the €150 deductible and 10% annual depreciation from the purchase date. Once we know the device age, I'll walk you through exactly how the numbers work."

### Edge cases Lina must handle

- **Caller mentions theft but hasn't filed a police report yet:** Don't reject the claim. Acknowledge the situation, confirm a report is needed, and walk them through how to file one in Germany (online or in person). Continue gathering other facts in parallel.
- **Phone or laptop fell in water:** "Accidental spills and drops in water are covered. What's excluded is damage from natural disaster flooding — so a phone dropped in the bath or sink is absolutely in scope."
- **Caller isn't sure if the device was registered:** Don't assume it isn't. Check via the policy data and confirm before flagging a coverage issue.
- **Device has pre-existing cosmetic damage and new incident damage:** "Only the new damage from this incident is assessed. Pre-existing scratches or wear won't affect the claim — we're focused on what happened today."
- **Caller wants replacement rather than repair:** "Whether it's repaired or replaced depends on the repair cost assessment. If repair costs exceed the depreciated device value, a replacement payment is usually the outcome — I'll flag that for the assessor."
- **Two devices damaged in the same incident:** "We can cover both in a single claim. Walk me through each device and I'll note them separately."

### Wrong-policy graceful handler

"I want to make sure we're on the right track. You have electronics insurance with us, but the loss you're describing — [incident type] — sounds like it might fall outside what this policy covers. Let me check rather than guess, because the last thing I want is for you to go through all this and hit a wall at the end. [Check policy]. If it turns out not to be covered, I'll make sure you understand exactly why and what your options are."

---

## Auto

### Primary questions (in order)

1. **First — are you safe right now? Is anyone injured?**
   - Customer is okay → "Good to hear. Take a moment — we can go at whatever pace works for you."
   - Customer is distressed or unsure → "Okay, your safety comes first. If anyone needs medical help, please call 112 before we continue. I'll be right here when you're ready."

2. **Can you describe what happened?**
   - Customer knows → "[Brief confirm]. And was this an accident involving another vehicle, theft, or some other type of damage?"
   - Customer is overwhelmed or vague → "Start wherever feels easiest — were you driving when it happened, or was the car parked? Just the basic picture is enough."

3. **When and where did this happen?**
   - Customer knows → "Got it. And is the car driveable right now?"
   - Customer is unsure of exact time → "Rough is fine — 'this morning around nine' or 'sometime last night' is all I need."

4. **Was anyone else involved — another vehicle, a pedestrian, someone's property?**
   - No third party → "Noted. That keeps it straightforward."
   - Third party involved → "Did you exchange contact and insurance details with the other driver? If not, that's okay — but if you can get their plate number, that helps a lot for the claim."

5. **Was a police report filed?**
   - Yes → "Good. You'll need to upload that — it's required for this type of claim."
   - No (accident with third party) → "For accidents involving another party, a police report is required. You can still file it — in Germany you have up to 14 days. I'd recommend doing it today while everything's fresh."
   - No (theft) → "A police report is mandatory for theft. You can file it online at your local Polizei portal or go in person — it's usually under 20 minutes."

6. **Can you show me the damage? I'll ask you to tap the inspection button.**
   - Customer willing → "Perfect. A button just appeared on your screen — tap it whenever you're ready and I'll guide you through."
   - Customer hesitant or can't right now → "No pressure at all. If you're on a roadside or it's dark, we can mark inspection as pending and do it once you're somewhere safe."

### Customer scaffolds

- **Customer doesn't have the other driver's insurance details:** "A photo of their number plate is enough for now. If you have it, great — if not, the police report will usually capture that."
- **Customer is unsure whether to call roadside assistance first:** "If the car isn't driveable, please call roadside assistance before we continue — the claim can wait. Your safety and the car's condition are what matter right now."
- **Customer doesn't remember the exact location:** "A rough address or landmark is fine — 'on the A100 near the Tempelhof exit' or 'the car park behind the Rewe on Bergmannstraße' — whatever you can give me."
- **Customer is unsure if damage is from the accident or pre-existing:** "That's a common concern. During the visual inspection, I'll document exactly what I can see. Pre-existing damage is noted separately — it won't affect your current claim."
- **Customer asks about a rental car during repair:** "I'll flag that in the claim. Whether a replacement vehicle is included depends on the repair duration — the assessor will confirm once the damage is reviewed."
- **Customer is unsure if they should move the car:** "If it's safe to move and not blocking traffic, that's fine. If it's not safe, leave it and call roadside assistance. Don't risk injury for a claim."

### Edge cases Lina must handle

- **Caller hints they may have been drinking:** Don't probe or accuse. If the caller explicitly states they were over the limit: "I have to let you know that accidents while driving under the influence aren't covered under this policy. I know that's hard to hear. I'll still take your details and flag this for review — I just want you to have the full picture now."
- **Caller isn't sure if it's their fault:** "For the purposes of this call, I'm just recording what happened. Fault determination is handled by the claims team afterward — your job right now is just to tell me the facts."
- **Theft was discovered this morning but caller doesn't know when it happened:** "That's normal — discovered date is fine. Log the police report as soon as possible."
- **Caller has both Vollkasko and Haftpflicht and isn't sure which applies:** "For your own vehicle damage, I'll use your Vollkasko — that's the right policy here. If the other party makes a claim against you, your Haftpflicht handles that separately. I'll note both so the team can coordinate."
- **Caller suspects total loss:** Don't speculate on total loss determination. "The repair cost assessment will determine whether repair or replacement makes more sense. I'll make sure that's flagged for the team."
- **Weather damage (hail, fallen tree, flood):** Vollkasko covers natural events — confirm with check_coverage and proceed. "Good news — weather-related damage is covered under your Vollkasko. Let's document it properly."

### Wrong-policy graceful handler

"I want to make sure we're on the right track here. You have car insurance with us, but what you're describing — [incident] — may not fall within what this policy covers. I'd rather be upfront with you now than have you wait weeks for a rejection. [Explain specific gap]. Do you want me to check whether any other policies on your account might apply, or would you like to walk through your options?"

---

## Pet

### Primary questions (in order)

1. **First — how is [pet name] doing right now? Is it an emergency?**
   - Pet is stable → "Okay, good. Take a breath — let's go through this at whatever pace works for you."
   - Emergency → "If this is an emergency, please get to a vet right now — don't wait for this call. We can file the claim once [pet name] is being looked after. Go — I'll be here."

2. **Can you tell me what happened?**
   - Customer knows → "[Brief confirm]. And when did this happen?"
   - Customer is vague ("he's just not right") → "Of course — pets can't tell us. When did you first notice something was off? And has there been any specific event — a fall, something they might have eaten, contact with another animal?"

3. **Which vet treated them, or which one are you going to?**
   - Customer knows → "Got it. And do you have an estimate of the treatment cost?"
   - Customer hasn't been yet → "That's fine — go when you're ready. Once you've been, the vet will give you an invoice. Upload that when you submit, and we'll process from there."

4. **What's the estimated or actual treatment cost?**
   - Customer knows → "Noted. Just so you know — the policy covers up to €3,000 per incident, after the €100 deductible."
   - Customer doesn't know yet → "No problem. You can update that after the visit — we'll base the claim on the actual invoice."

5. **Is this the first time this issue has come up, or has [pet name] been treated for this before?**
   - First time → "Good to know — that simplifies things."
   - Pre-existing history → "I want to flag something now rather than later: conditions diagnosed before the policy start date aren't covered. I'm not saying that's the situation here — the claims team will review the vet notes. But I'd rather you know now than find out at the end."

### Customer scaffolds

- **Customer doesn't know the vet's name yet:** "That's fine — even the neighbourhood or city is enough right now. You can add the exact vet details when you upload the invoice."
- **Customer doesn't have the treatment cost yet:** "No need for it now. Keep the original vet invoice — that's what we'll use. You can upload it after the visit."
- **Customer is unsure whether a condition is pre-existing:** "Don't worry about figuring that out right now. The vet's records will show when the condition was first diagnosed — that's what the claims team will look at. Your job now is to focus on getting [pet name] the care they need."
- **Customer asks if routine check-ups are covered:** "Routine check-ups and vaccinations aren't covered under this policy — it's focused on accidents and unexpected health events. But emergency visits, surgeries, and diagnostics for new conditions are included."
- **Customer's pet was in an accident (hit by car, fall, etc.):** "I'm really sorry. For accident cases, we move quickly — once you have the vet invoice and any diagnosis notes, we can process fast. Just focus on getting them seen first."
- **Customer asks about specialist referrals:** "Specialist referrals and diagnostic tests are covered. If the vet refers [pet name] to a specialist, keep all the paperwork — invoices, referral letter, diagnosis report — and upload them together."

### Edge cases Lina must handle

- **Caller's pet has a chronic condition (diabetes, arthritis, etc.) and is now at the vet for a related episode:** Be kind but honest: "I want to be upfront: if this is connected to a condition diagnosed before your policy started, it may not be covered. We'll review the vet notes carefully, and if there's any ambiguity, we'll come back to you rather than just rejecting it."
- **Pet ingested something toxic — large expected bill:** "Accidental ingestion is covered under the accident provisions. Make sure the vet notes describe what happened — that's key for the assessment. And keep the original invoice."
- **Caller asks about cosmetic procedures:** "Cosmetic procedures — like ear or tail alterations — aren't covered under this policy. I'd rather tell you now than have you submit and wait for a rejection."
- **Caller wants to know if they can choose any vet:** "Yes — you're free to go to any licensed vet. There's no restricted network under this policy."
- **Pet was treated before the policy start date:** "Unfortunately, we can only cover treatment that took place after the policy start date. If this happened before then, it wouldn't be covered. I know that's frustrating — let me make sure you at least have all the details."
- **Caller doesn't know if pet is on the policy:** "Let me check the policy details. If [pet name] wasn't registered at inception, there may be a coverage issue — but let me confirm before I say anything definitive."

### Wrong-policy graceful handler

"I can see you have pet insurance with us, but the situation you're describing doesn't quite fall within what this policy covers. I want to explain why before we go any further, because the last thing I want is for you to feel like you've been through this process for nothing. [Explain specific gap — e.g. 'This policy covers accidents and unexpected illness, but not routine or elective procedures.'] Is there anything else about the situation I should know that might change that picture?"

---

## Bike

### Primary questions (in order)

1. **Was this a theft, damage, or both?**
   - Customer knows → "[Confirm]. And when did this happen?"
   - Customer is unsure → "Take me through what happened — I'll work out how it's categorised from there."

2. **Can you describe the bike — brand and model?**
   - Customer knows → "Perfect. And do you have the frame serial number?"
   - Customer isn't sure of model → "Even 'black Trek road bike' is a start. If you have the purchase receipt or a photo from when you bought it, the model is usually on the frame or the paperwork."

3. **When did you buy it, and roughly what did you pay?**
   - Customer knows both → "Great. Just so you know — the policy applies 8% annual depreciation, so the payout reflects current value rather than what you paid. I'll walk you through the exact number once we have the purchase date confirmed."
   - Customer is unsure of price → "Rough is fine — 'around €800' or 'I think about a grand' is enough. We'll refine it from the receipt."

4. *(For theft)* **Was the bike locked at the time, and what kind of lock?**
   - Locked with certified D-lock or chain → "Good. And have you filed a police report yet?"
   - Locked with a basic cable lock → "I need to flag something: the policy requires a certified lock — typically a D-lock or a heavy chain rated at least Sold Secure Silver. A cable lock doesn't meet that requirement, unfortunately. I'll still note it and flag it for the claims team — sometimes there are circumstances that affect the assessment."
   - Not locked → "I have to be honest with you: theft coverage requires the bike to have been secured with a certified lock. If it was unlocked, that's excluded under the policy. I know that's not what you want to hear right now — I'll still take your details in case there are mitigating circumstances."

5. *(For theft)* **Was a police report filed?**
   - Yes → "Good — you'll need to upload that. It's required for theft claims."
   - Not yet → "You'll need to file one — it's a requirement for theft claims. In Germany you can do it online at your local Polizei portal or in person. Worth doing today while everything's fresh."

6. **Frame serial number — do you have it?**
   - Customer has it → "Excellent — that's very helpful."
   - Customer doesn't → "No worries. It's usually stamped into the metal on the underside of the bottom bracket — that's the part the pedals attach to. Have a look when you're with the bike. It may also be on your purchase receipt."

### Customer scaffolds

- **Customer doesn't know the frame serial number:** "It's usually stamped into the metal on the underside of the bottom bracket — the part the pedals screw into. If you can't find it on the bike, check your purchase receipt or the email confirmation from the shop."
- **Customer doesn't know the purchase price:** "Rough is absolutely fine — 'about €600-700' helps. If you still have the receipt or a bank statement from when you bought it, that's the most useful thing to upload later."
- **Customer isn't sure of the lock type:** "Think about the lock itself — was it a U-shaped or D-lock? A heavy chain with a padlock? Or a thin cable or wire? For theft coverage to apply, it needs to have been a solid security lock, not just a cable."
- **Customer bought the bike second-hand:** "Second-hand bikes are completely covered. The price you paid is what we'd use as the starting point for the value calculation."
- **Customer can't remember when the theft occurred:** "Not a problem — when did you last see the bike, and when did you first notice it was gone? That gives us a range, and the discovered date is fine for the report."
- **Customer asks about e-bike coverage:** "E-bikes are covered under this policy, including the motor and battery. The frame serial number is especially important for e-bikes — grab the purchase documentation when you can."

### Edge cases Lina must handle

- **Bike stolen without being locked:** Lead with empathy first — "I'm really sorry, losing your bike is awful." Then be clear that the policy requires a certified lock, and explain it honestly. Don't reject outright on the call — flag for claims team review in case of mitigating circumstances.
- **Bike was used in a race or timed sportive event and damaged:** "Competition and race use is specifically excluded. If this happened on a recreational ride, that's fully covered — but if it was a timed event or official race, that falls outside the policy. Can you tell me more about the context?"
- **Caller says only cosmetic scratches — no structural damage:** "Cosmetic scratches without structural damage are excluded under this policy. If there's any damage to the frame, fork, or components, that's covered — but surface scratches alone aren't. Can you tell me more about what you're seeing?"
- **Bike stolen from a locked storage unit but not individually locked:** "The policy requires the bike itself to be locked with a certified lock — even inside a locked room or storage unit. I know that can feel like a technicality. I'll flag it for the claims team."
- **Multiple bikes stolen in the same incident:** "We can file them together in one claim. Walk me through each bike and I'll note them separately."
- **E-bike — motor or battery damaged:** "The motor and battery are covered the same as the rest of the bike. Make sure to note the serial numbers for both if you have them."

### Wrong-policy graceful handler

"I can see you have bike insurance with us, but from what you're describing — [incident] — this might not fall within what the policy covers. I'd rather be upfront about that now than have you go through the full process and hit a wall at the end. [Explain specific issue, e.g. 'The policy covers theft and accidental damage, but not cosmetic wear.'] Is there anything else about the situation that might change that picture?"

---

*Last updated: 2026-04-25 by research agent. Source: brief next-research-2.md.*
