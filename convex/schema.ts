import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    createdAt: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    tokenIdentifier: v.string(),
    onboardingComplete: v.optional(v.boolean()),
    activePolicyTypes: v.optional(v.array(v.string())),
  }).index("by_token", ["tokenIdentifier"]),

  claims: defineTable({
    userId: v.id("users"),
    sessionId: v.string(),
    matchedPolicyType: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("in_review"),
      v.literal("accepted")
    ),
    stage: v.union(
      v.literal("greeting"),
      v.literal("identifying_policy"),
      v.literal("coverage_caveat"),
      v.literal("fact_gathering"),
      v.literal("visual_inspection"),
      v.literal("voice_confirmation"),
      v.literal("closed")
    ),
    visualInspectionRequested: v.boolean(),
    visualInspectionRequestedBy: v.optional(
      v.union(
        v.literal("policy_required"),
        v.literal("user_offered"),
        v.literal("agent_suggested")
      )
    ),
    incidentType: v.optional(v.string()),
    incidentDate: v.optional(v.string()),
    incidentLocation: v.optional(v.string()),
    gpsLatitude: v.optional(v.number()),
    gpsLongitude: v.optional(v.number()),
    gpsAccuracyMeters: v.optional(v.number()),
    productCategory: v.optional(v.string()),
    productBrandModel: v.optional(v.string()),
    damageSummary: v.optional(v.string()),
    estimatedDamageEur: v.optional(v.number()),
    callerEmail: v.optional(v.string()),
    callerPhone: v.optional(v.string()),
    retailPriceEur: v.optional(v.number()),
    retailPriceSource: v.optional(v.string()),
    expectedPayoutLowEur: v.optional(v.number()),
    expectedPayoutHighEur: v.optional(v.number()),
    transcriptText: v.optional(v.string()),
    confirmationImageStorageId: v.optional(v.id("_storage")),
    createdAt: v.string(),
    finalizedAt: v.optional(v.string()),

    events: v.optional(
      v.array(
        v.object({
          type: v.union(
            v.literal("transcript_user"),
            v.literal("transcript_agent"),
            v.literal("tool_call"),
            v.literal("tool_result"),
            v.literal("stage_transition"),
            v.literal("system")
          ),
          payload: v.any(),
          toolName: v.optional(v.string()),
          reasoningTrace: v.optional(v.string()),
          timestamp: v.number(),
        })
      )
    ),

    media: v.optional(
      v.array(
        v.object({
          kind: v.union(
            v.literal("damage_video"),
            v.literal("damage_frame"),
            v.literal("invoice")
          ),
          storageId: v.id("_storage"),
          durationSec: v.optional(v.number()),
          capturedAt: v.string(),
        })
      )
    ),

    requiredUploads: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          description: v.string(),
          required: v.boolean(),
          status: v.union(v.literal("pending"), v.literal("uploaded")),
          storageId: v.optional(v.id("_storage")),
          uploadedAt: v.optional(v.string()),
        })
      )
    ),

    formSession: v.optional(
      v.object({
        token: v.string(),
        status: v.union(
          v.literal("pending"),
          v.literal("opened"),
          v.literal("submitted")
        ),
        invoiceStorageId: v.optional(v.id("_storage")),
        invoiceTotalEur: v.optional(v.number()),
        submittedAt: v.optional(v.string()),
        expiresAt: v.string(),
      })
    ),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_user_status", ["userId", "status"]),
});
