import { mutation } from "./_generated/server";
import { v } from "convex/values";
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
    lossHypothesis: v.string(),
    productCategory: v.optional(v.string()),
  },
  handler: async (ctx, { sessionId, lossHypothesis, productCategory }) => {
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

    const hypothesis = lossHypothesis.toLowerCase();
    const category = (productCategory ?? "").toLowerCase();

    let matched = availableTemplates[0];
    for (const t of availableTemplates) {
      if (
        t.id === "electronics" &&
        (category.includes("laptop") || category.includes("phone") || category.includes("tablet") ||
          category.includes("macbook") || hypothesis.includes("electronic") ||
          hypothesis.includes("laptop") || hypothesis.includes("phone") || hypothesis.includes("screen"))
      ) {
        matched = t;
        break;
      }
      if (
        t.id === "auto" &&
        (hypothesis.includes("car") || hypothesis.includes("vehicle") || hypothesis.includes("auto") ||
          hypothesis.includes("crash") || hypothesis.includes("accident") || hypothesis.includes("truck"))
      ) {
        matched = t;
        break;
      }
      if (
        t.id === "bike" &&
        (hypothesis.includes("bike") || hypothesis.includes("bicycle") || hypothesis.includes("cycling") ||
          hypothesis.includes("cycle"))
      ) {
        matched = t;
        break;
      }
      if (
        t.id === "pet" &&
        (hypothesis.includes("pet") || hypothesis.includes("dog") || hypothesis.includes("cat") ||
          hypothesis.includes("vet") || hypothesis.includes("animal"))
      ) {
        matched = t;
        break;
      }
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

    return { ok: true, claimId: claim._id, formLinkSent: false };
  },
});
