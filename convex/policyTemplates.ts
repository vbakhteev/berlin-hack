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
      "This is a comprehensive car (Vollkasko) policy. It covers collision damage, theft, vandalism, and weather events. " +
      "Visual inspection is always required for damage claims — ask the caller to show the vehicle damage. " +
      "For accidents, a police report is required. For theft, a police report is mandatory. " +
      "The deductible applies per incident. Depreciation is not applied to vehicles — repairs are covered at actual cost. " +
      "Key exclusion: driving under the influence and uninsured drivers are not covered. " +
      "If the caller mentions an accident, ask about third-party involvement and whether a police report was filed.",
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
      "If the pet was in an accident, ask the caller to describe what happened and confirm the pet has been seen by a vet.",
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
      "This is an electronics accidental damage and theft policy. It covers laptops, smartphones, tablets, and other registered devices. " +
      "Visual inspection is required for damage claims — ask the caller to show the damaged device on camera. " +
      "Depreciation applies linearly at 10% per year from the purchase date, with a maximum 60% reduction. " +
      "Ask for: the device brand and model, approximate purchase date, serial number if available, and a description of what happened. " +
      "Water damage from natural disasters (flooding) is excluded, but accidental spills are covered. " +
      "For theft: ask if a police report was filed — it is required for theft claims. " +
      "The device must have been registered on the policy for coverage to apply.",
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
      "Depreciation applies at 8% per year from the purchase date. " +
      "Coverage does not apply to bikes used in competitions or races. " +
      "If the bike was stolen without being locked: this is excluded — handle with empathy and explain the lock requirement.",
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
