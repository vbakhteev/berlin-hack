export const toolSchemas = [
  {
    name: "match_policy",
    description:
      "Match the current claim context to one of the caller's loaded policies. " +
      "Call this as soon as you have a rough sense of what was damaged or what happened. Do not wait.",
    parameters: {
      type: "object",
      properties: {
        lossHypothesis: {
          type: "string",
          description: "1-sentence hypothesis of the loss",
        },
        productCategory: {
          type: "string",
          description: "e.g. laptop, phone, vehicle, furniture",
        },
      },
      required: ["lossHypothesis"],
    },
  },
  {
    name: "check_coverage",
    description:
      "Look up the deductible, depreciation, and exclusions for the matched " +
      "policy so you can read them aloud accurately. Call this right after match_policy.",
    parameters: {
      type: "object",
      properties: {
        policyId: {
          type: "string",
          description: "The policy ID returned by match_policy",
        },
      },
      required: ["policyId"],
    },
  },
  {
    name: "update_claim_field",
    description:
      "Update one or more fields on the live claim card visible to the caller. " +
      "Call this every time a fact is established during conversation. Multiple fields per call are fine.",
    parameters: {
      type: "object",
      properties: {
        incidentType: { type: "string", description: "e.g. accidental drop, theft, collision" },
        incidentDate: { type: "string", description: "ISO date string or natural date" },
        incidentLocation: { type: "string" },
        productCategory: { type: "string", description: "e.g. laptop, phone" },
        productBrandModel: { type: "string", description: "e.g. MacBook Pro 14 M3 2023" },
        damageSummary: { type: "string", description: "Brief description of the damage" },
        estimatedDamageEur: { type: "number", description: "Caller's stated damage estimate in EUR" },
        callerEmail: { type: "string" },
      },
    },
  },
  {
    name: "request_visual_inspection",
    description:
      "Surface the 'Start visual inspection' button on the caller's screen. " +
      "Call this when the matched policy requires visual inspection OR when the caller offers to show the damage.",
    parameters: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          enum: ["policy_required", "user_offered", "agent_suggested"],
          description: "Why visual inspection is being requested",
        },
        hint: {
          type: "string",
          description: "Brief instruction shown on the button, e.g. 'Show the screen damage'",
        },
      },
      required: ["reason"],
    },
  },
  {
    name: "finalize_claim",
    description:
      "Voice-confirmation close. Call this after the caller confirms the summary you read back. " +
      "This triggers the post-call flow: Tavily price research, confirmation screen, email handoff.",
    parameters: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "The 2-sentence summary you read to the caller",
        },
        callerEmail: {
          type: "string",
          description: "Email address to send the form link to",
        },
      },
      required: ["summary", "callerEmail"],
    },
  },
];
