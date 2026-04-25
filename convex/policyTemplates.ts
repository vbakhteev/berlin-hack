// Pure TypeScript — no Convex imports. Safe to import from both Convex functions and Next.js.

export type PolicyTypeId = "auto" | "pet" | "electronics" | "bike";

export interface PolicyTemplate {
  id: PolicyTypeId;
  emoji: string;
  title: string;
  description: string;
  voiceAgentContext: string;
  insurer: string;
  policyNumber: string;
  coverageSummary: string;
  deductibleEur: number;
  depreciationRule?: string;
  requiresVisualInspection: boolean;
  coverageLimitEur?: number;
  exclusions: string[];
}

export const POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    id: "auto",
    emoji: "🚗",
    title: "Car insurance",
    description: "Collision, theft, and accidental damage",
    voiceAgentContext:
      "This is a comprehensive car (Vollkasko) policy. The caller may be on a roadside or in a stressful post-accident situation — be calm, brief, and reassuring. Move quickly through the facts. " +
      "It covers collision damage, theft, vandalism, and weather events. " +
      "Visual inspection is always required for damage claims — ask the caller to show the vehicle damage. " +
      "For accidents, a police report is required. For theft, a police report is mandatory. " +
      "The deductible applies per incident. Depreciation is not applied to vehicles — repairs are covered at actual cost. " +
      "Key exclusion: driving under the influence and uninsured drivers are not covered. " +
      "If the caller mentions an accident, ask about third-party involvement and whether a police report was filed. " +
      "GUIDANCE SCAFFOLDS: If caller doesn't know exact accident location, 'a rough address or landmark is fine.' " +
      "If caller doesn't have the other driver's insurance details, 'a photo of their number plate is enough for now.' " +
      "If caller is unsure whether to move the car, tell them: if safe and not blocking traffic, fine to move — otherwise leave it and call roadside assistance. " +
      "If caller hints at drink-driving, do not probe — if they explicitly state it, calmly disclose the exclusion: 'accidents under the influence aren't covered under this policy — I want you to have the full picture now.' " +
      "If caller is unsure whose fault it was, reassure them: 'fault determination is handled by the claims team — just tell me what happened.' " +
      "If caller asks about a rental during repair, flag it for the assessor — don't promise coverage. " +
      "Weather-related damage (hail, flooding, fallen tree) is covered — confirm with check_coverage and proceed. " +
      "Do not speculate on total loss — flag it for the assessor.",
    insurer: "Allianz",
    policyNumber: "KFZ-2024-553102",
    coverageSummary: "Vollkasko: covers collision, theft, vandalism, and accidental damage to your vehicle.",
    deductibleEur: 300,
    depreciationRule: undefined,
    requiresVisualInspection: true,
    coverageLimitEur: undefined,
    exclusions: ["driving under influence", "uninsured driver", "racing or competition use"],
  },
  {
    id: "pet",
    emoji: "🐾",
    title: "Pet insurance",
    description: "Vet bills, surgery, and accidents",
    voiceAgentContext:
      "This is a pet health and accident insurance policy. It covers emergency vet visits, surgeries, diagnostic tests, and accident treatment. " +
      "There is no visual inspection for this policy — the vet will document the condition. " +
      "Ask the caller: what happened to the pet, which vet they visited or plan to visit, and the estimated or actual treatment cost. " +
      "Depreciation does not apply to medical treatment costs. " +
      "Pre-existing conditions diagnosed before the policy start date are excluded. Routine check-ups and vaccinations are not covered. " +
      "If the pet was in an accident, ask the caller to describe what happened and confirm the pet has been seen by a vet. " +
      "GUIDANCE SCAFFOLDS: Always ask about the pet's current status first — if it's an emergency, tell the caller to go to the vet immediately and file later. " +
      "If caller doesn't have the vet name yet, a neighbourhood or city is enough for now — exact details come with the invoice upload. " +
      "If caller doesn't know the treatment cost yet, reassure them: 'the actual invoice is what we'll use — no need to have it now.' " +
      "If caller is unsure whether a condition is pre-existing, don't ask them to figure it out — the vet records will show it; focus on getting the pet care now. " +
      "If the condition sounds chronic or recurring, flag it gently but clearly: pre-existing conditions diagnosed before policy start aren't covered, and the claims team will review vet notes. " +
      "Specialist referrals and diagnostic tests are covered — tell caller to keep all paperwork. " +
      "Accidental ingestion is covered — make sure vet notes describe what happened. " +
      "Cosmetic procedures (ear/tail) are excluded — disclose this if the caller mentions it rather than having them discover it at review.",
    insurer: "Petolo",
    policyNumber: "PET-2025-334812",
    coverageSummary: "Covers emergency vet treatment, surgeries, and accident-related care for your pet.",
    deductibleEur: 100,
    depreciationRule: undefined,
    requiresVisualInspection: false,
    coverageLimitEur: 3000,
    exclusions: ["pre-existing conditions", "routine check-ups", "cosmetic procedures", "breeding costs"],
  },
  {
    id: "electronics",
    emoji: "💻",
    title: "Electronics insurance",
    description: "Phones, laptops, tablets, and gadgets",
    voiceAgentContext:
      "This is the most common claim type — electronics accidental damage and theft. Callers typically have a cracked screen or water damage. " +
      "Visual inspection is required for damage claims — ask the caller to show the damaged device on camera. " +
      "Depreciation applies linearly at 10% per year from the purchase date, with a maximum 60% reduction. " +
      "Ask for: the device brand and model, approximate purchase date, serial number if available, and a description of what happened. " +
      "Before finalizing, always confirm whether the caller has their purchase receipt — it is required for reimbursement. " +
      "Water damage from natural disasters (flooding) is excluded, but accidental spills are covered. " +
      "For theft: ask if a police report was filed — it is required for theft claims. " +
      "The device must have been registered on the policy for coverage to apply. " +
      "GUIDANCE SCAFFOLDS: If caller doesn't know the device model, tell them: 'flip it over — there's usually a sticker on the back, or check Settings → About.' " +
      "If caller doesn't know the purchase date, 'even roughly two years ago is enough — we'll pin the exact date from your receipt.' " +
      "If caller can't find their receipt, suggest checking email order confirmations; a bank statement showing the charge also works. " +
      "For serial number: phones can dial *#06# to display it; laptops usually have it on the bottom or in the battery compartment. " +
      "Accidental water spills and drops in water are covered — flooding from natural disasters is not. A phone dropped in a sink or bath is covered. " +
      "For theft without a police report, don't stop the call — continue gathering facts and walk the caller through how to file (online at local Polizei portal or in person). " +
      "If caller wants replacement vs repair: flag for assessor — if repair cost exceeds depreciated value, replacement payment is typical. " +
      "Two devices in the same incident: cover both in one claim, note them separately.",
    insurer: "HUK24",
    policyNumber: "ELE-2025-887421",
    coverageSummary: "Covers accidental damage and theft of registered personal electronics.",
    deductibleEur: 150,
    depreciationRule: "Linear, 10% per year from purchase date, max 60% reduction.",
    requiresVisualInspection: true,
    coverageLimitEur: 5000,
    exclusions: ["water damage from natural disasters", "intentional damage", "unregistered devices"],
  },
  {
    id: "bike",
    emoji: "🚲",
    title: "Bike insurance",
    description: "Theft and accidental damage for bicycles",
    voiceAgentContext:
      "This is a bicycle theft and accidental damage policy. It covers road bikes, mountain bikes, and e-bikes. " +
      "For theft claims: a police report is mandatory and the bike must have been locked with a certified lock at the time of theft. " +
      "For damage claims: visual inspection is required — ask the caller to show the damaged bike on camera. " +
      "Ask for: the bike brand and model, purchase price, purchase date, frame serial number, and description of what happened. " +
      "Depreciation applies at 8% per year from the purchase date, max 50% reduction. " +
      "Coverage does not apply to bikes used in competitions or races. " +
      "If the bike was stolen without being locked: this is excluded — handle with empathy and explain the lock requirement. " +
      "GUIDANCE SCAFFOLDS: Frame serial number is usually stamped on the underside of the bottom bracket — tell caller to check there or on their purchase receipt. " +
      "If caller doesn't know the purchase price, 'roughly is fine — the receipt or a bank statement is the best upload.' " +
      "If caller isn't sure of lock type: ask whether it was a D-lock, heavy chain, or cable — cable locks don't meet the certified lock requirement. " +
      "If bike was locked with a cable lock or unlocked: don't reject on the call — acknowledge with empathy, explain the requirement, and flag for claims team review. " +
      "Second-hand bikes are covered — use the price paid as the starting value. " +
      "E-bikes: motor and battery are covered; encourage caller to note serial numbers for both. " +
      "If bike was stolen from a locked storage room but not individually locked, the individual lock requirement still applies — flag for claims team. " +
      "Cosmetic scratches without structural damage are excluded — if caller describes only surface marks, clarify whether there's any frame or component damage before proceeding. " +
      "Multiple bikes stolen together: one claim, note each bike separately.",
    insurer: "DEVK",
    policyNumber: "BKE-2025-221047",
    coverageSummary: "Covers theft and accidental damage for bicycles, including e-bikes.",
    deductibleEur: 75,
    depreciationRule: "8% per year from purchase date, max 50% reduction.",
    requiresVisualInspection: true,
    coverageLimitEur: 4000,
    exclusions: ["theft without certified lock", "competition or race use", "cosmetic scratches"],
  },
];

export const POLICY_TEMPLATES_BY_ID: Record<PolicyTypeId, PolicyTemplate> =
  Object.fromEntries(POLICY_TEMPLATES.map((t) => [t.id, t])) as Record<PolicyTypeId, PolicyTemplate>;

export function getPolicyTemplate(id: string): PolicyTemplate | undefined {
  return POLICY_TEMPLATES_BY_ID[id as PolicyTypeId];
}

export function getPolicyTemplateByNumber(policyNumber: string): PolicyTemplate | undefined {
  return POLICY_TEMPLATES.find((t) => t.policyNumber === policyNumber);
}

export function isPolicyTypeId(id: string): id is PolicyTypeId {
  return id in POLICY_TEMPLATES_BY_ID;
}
