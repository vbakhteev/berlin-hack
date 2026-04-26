import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { POLICY_TEMPLATES, POLICY_TEMPLATES_BY_ID, getPolicyTemplate, getPolicyTemplateByNumber } from "./policyTemplates";

async function getOrCreateUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", identity.subject))
    .unique();
  if (!user) throw new Error("User not found");
  return user;
}

async function logEvent(ctx: any, claim: any, type: string, toolName: string | undefined, payload: any) {
  const events = claim.events ?? [];
  events.push({ type, toolName, payload, timestamp: Date.now() });
  await ctx.db.patch(claim._id, { events });
}

export const matchPolicy = mutation({
  args: {
    sessionId: v.string(),
    lossHypothesis: v.optional(v.string()),
    productCategory: v.optional(v.string()),
    policyType: v.optional(v.string()),
  },
  handler: async (ctx, { sessionId, lossHypothesis, productCategory, policyType }) => {
    const user = await getOrCreateUser(ctx);
    const claim = await ctx.db
      .query("claims")
      .withIndex("by_session", (q: any) => q.eq("sessionId", sessionId))
      .unique();
    if (!claim) throw new Error("Claim not found");

    const activePolicyTypes: string[] = user.activePolicyTypes ?? [];
    const availableTemplates = POLICY_TEMPLATES.filter((t) => activePolicyTypes.includes(t.id));

    if (availableTemplates.length === 0) {
      return { matched: false, reason: "No policies on file" };
    }

    let matched: typeof availableTemplates[0] | undefined;

    if (policyType) {
      matched = availableTemplates.find((t) => t.id === policyType);
      if (!matched) {
        return {
          matched: false,
          reason: `Policy type "${policyType}" is not in the caller's active policies. Active policies: ${activePolicyTypes.join(", ")}`,
        };
      }
    } else {
      const hypothesis = (lossHypothesis ?? "").toLowerCase();
      const category = (productCategory ?? "").toLowerCase();
      const text = hypothesis + " " + category;

      for (const t of availableTemplates) {
        const triggers = t.triggerExamples.toLowerCase().split(",").map((s) => s.trim());
        if (triggers.some((trigger) => text.includes(trigger))) {
          matched = t;
          break;
        }
      }

      if (!matched) matched = availableTemplates[0];
    }

    await ctx.db.patch(claim._id, {
      matchedPolicyType: matched.id,
      stage: "identifying_policy",
    });

    await logEvent(ctx, claim, "tool_call", "match_policy", {
      lossHypothesis,
      productCategory,
      matchedPolicyType: matched.id,
    });

    return {
      matched: true,
      policyType: matched.id,
      title: matched.title,
      insurer: matched.insurer,
      policyNumber: matched.policyNumber,
      deductibleEur: matched.deductibleEur,
      depreciationRule: matched.depreciationRule ?? null,
      requiresVisualInspection: matched.requiresVisualInspection,
      exclusions: matched.exclusions,
      coverageSummary: matched.coverageSummary,
      coverageLimitEur: matched.coverageLimitEur ?? null,
      policyGuidance: matched.voiceAgentContext,
    };
  },
});

export const checkCoverage = mutation({
  args: {
    sessionId: v.string(),
    policyType: v.optional(v.string()),
    policyId: v.optional(v.string()),
  },
  handler: async (ctx, { sessionId, policyType, policyId }) => {
    await getOrCreateUser(ctx);
    const claim = await ctx.db
      .query("claims")
      .withIndex("by_session", (q: any) => q.eq("sessionId", sessionId))
      .unique();
    if (!claim) throw new Error("Claim not found");

    const template =
      (policyType ? getPolicyTemplate(policyType) : undefined) ??
      (policyId ? getPolicyTemplateByNumber(policyId) : undefined) ??
      (claim.matchedPolicyType ? getPolicyTemplate(claim.matchedPolicyType) : undefined);
    if (!template) throw new Error(`Unknown policy: policyType=${policyType}, policyId=${policyId}`);

    await ctx.db.patch(claim._id, { stage: "coverage_caveat" });
    await logEvent(ctx, claim, "tool_call", "check_coverage", { policyType: template.id });

    return {
      deductibleEur: template.deductibleEur,
      depreciationRule: template.depreciationRule ?? null,
      exclusions: template.exclusions,
      coverageLimitEur: template.coverageLimitEur ?? null,
      coverageSummary: template.coverageSummary,
      requiresVisualInspection: template.requiresVisualInspection,
    };
  },
});

export const updateClaimField = mutation({
  args: {
    sessionId: v.string(),
    incidentType: v.optional(v.string()),
    incidentDate: v.optional(v.string()),
    incidentLocation: v.optional(v.string()),
    productCategory: v.optional(v.string()),
    productBrandModel: v.optional(v.string()),
    purchaseDate: v.optional(v.string()),
    damageSummary: v.optional(v.string()),
    estimatedDamageEur: v.optional(v.number()),
    callerEmail: v.optional(v.string()),
  },
  handler: async (ctx, { sessionId, ...fields }) => {
    await getOrCreateUser(ctx);
    const claim = await ctx.db
      .query("claims")
      .withIndex("by_session", (q: any) => q.eq("sessionId", sessionId))
      .unique();
    if (!claim) throw new Error("Claim not found");

    const updates: Record<string, any> = {};
    const updatedFields: string[] = [];
    for (const [k, val] of Object.entries(fields)) {
      if (val !== undefined) {
        updates[k] = val;
        updatedFields.push(k);
      }
    }

    if (claim.stage === "coverage_caveat" || claim.stage === "identifying_policy") {
      updates.stage = "fact_gathering";
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(claim._id, updates);
    }

    const refreshed = await ctx.db.get(claim._id);
    await logEvent(ctx, refreshed, "tool_call", "update_claim_field", { updatedFields, ...fields });

    return { ok: true, updatedFields };
  },
});

export const requestVisualInspection = mutation({
  args: {
    sessionId: v.string(),
    reason: v.union(
      v.literal("policy_required"),
      v.literal("user_offered"),
      v.literal("agent_suggested")
    ),
    hint: v.optional(v.string()),
  },
  handler: async (ctx, { sessionId, reason, hint }) => {
    await getOrCreateUser(ctx);
    const claim = await ctx.db
      .query("claims")
      .withIndex("by_session", (q: any) => q.eq("sessionId", sessionId))
      .unique();
    if (!claim) throw new Error("Claim not found");

    await ctx.db.patch(claim._id, {
      visualInspectionRequested: true,
      visualInspectionRequestedBy: reason,
      stage: "visual_inspection",
    });

    const refreshed = await ctx.db.get(claim._id);
    await logEvent(ctx, refreshed, "tool_call", "request_visual_inspection", { reason, hint });

    return { ok: true };
  },
});

export const finalizeClaim = mutation({
  args: {
    sessionId: v.string(),
    summary: v.string(),
    callerEmail: v.optional(v.string()),
    transcriptText: v.optional(v.string()),
    requiredUploads: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          description: v.string(),
          required: v.boolean(),
        })
      )
    ),
  },
  handler: async (ctx, { sessionId, summary, callerEmail, transcriptText, requiredUploads }) => {
    await getOrCreateUser(ctx);
    const claim = await ctx.db
      .query("claims")
      .withIndex("by_session", (q: any) => q.eq("sessionId", sessionId))
      .unique();
    if (!claim) throw new Error("Claim not found");

    // Server-side completeness gate.
    // Each field must be stored via update_claim_field — Gemini cannot hallucinate past this gate.
    // purchaseDate and estimatedDamageEur are rarely volunteered upfront,
    // forcing Gemini to ask explicitly before finalize can succeed.
    const missing: string[] = [];
    if (!claim.incidentDate) missing.push("incidentDate — ask: 'Wann war das ungefähr?'");
    if (!claim.productBrandModel && !claim.productCategory) missing.push("productBrandModel — ask: 'Was genau für ein Gerät?'");
    if (!claim.purchaseDate) missing.push("purchaseDate — ask: 'Wann haben Sie das ungefähr gekauft?'");
    if (!claim.estimatedDamageEur) missing.push("estimatedDamageEur — ask: 'Was hat das Gerät damals ungefähr gekostet?'");
    if (!claim.callerEmail) missing.push("callerEmail — collect their email address");
    if (missing.length > 0) {
      return { ok: false, error: `Cannot finalize yet — still need: ${missing.join("; ")}. Ask for each missing fact before retrying.` };
    }

    // Minimum conversation depth — at least 5 separate update_claim_field calls.
    // Prevents Gemini from batching all facts into 4 rapid calls and immediately finalizing.
    const fieldUpdateCount = (claim.events ?? []).filter((e: any) => e.toolName === "update_claim_field").length;
    if (fieldUpdateCount < 5) {
      return { ok: false, error: `Too early to finalize — only ${fieldUpdateCount} field updates logged. Continue the conversation.` };
    }

    const uploads =
      requiredUploads && requiredUploads.length > 0
        ? requiredUploads.slice(0, 4).map((u) => ({ ...u, status: "pending" as const }))
        : [
            {
              id: "invoice",
              title: "Invoice or receipt",
              description: "Proof of purchase for the affected item.",
              required: true,
              status: "pending" as const,
            },
          ];

    const updates: any = {
      status: "draft",
      stage: "closed",
      finalizedAt: new Date().toISOString(),
      damageSummary: claim.damageSummary ?? summary,
      requiredUploads: uploads,
    };
    if (callerEmail) updates.callerEmail = callerEmail;
    if (transcriptText) updates.transcriptText = transcriptText;

    await ctx.db.patch(claim._id, updates);

    const refreshed = await ctx.db.get(claim._id);
    await logEvent(ctx, refreshed, "tool_call", "finalize_claim", { summary, callerEmail });

    await ctx.scheduler.runAfter(0, api.tavily.researchReplacementPrice, { claimId: claim._id });

    return { ok: true, claimId: claim._id, formLinkSent: false };
  },
});
