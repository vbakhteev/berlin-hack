import { mutation } from "./_generated/server";
import { v } from "convex/values";

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
  events.push({
    type,
    toolName,
    payload,
    timestamp: Date.now(),
  });
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

    const policies = await ctx.db
      .query("policies")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();

    if (policies.length === 0) {
      return { matched: false, reason: "No policies on file" };
    }

    // Simple keyword matching for demo
    const hypothesis = lossHypothesis.toLowerCase();
    const category = (productCategory ?? "").toLowerCase();

    let matched = policies[0];
    for (const p of policies) {
      if (p.type === "electronics" && (category.includes("laptop") || category.includes("phone") || category.includes("tablet") || category.includes("macbook") || hypothesis.includes("electronic") || hypothesis.includes("laptop") || hypothesis.includes("phone"))) {
        matched = p;
        break;
      }
      if ((p.type === "kfz_kasko" || p.type === "kfz_haftpflicht") && (hypothesis.includes("car") || hypothesis.includes("vehicle") || hypothesis.includes("auto") || hypothesis.includes("crash"))) {
        matched = p;
        break;
      }
      if (p.type === "hausrat" && (hypothesis.includes("home") || hypothesis.includes("house") || hypothesis.includes("apartment") || hypothesis.includes("furniture"))) {
        matched = p;
        break;
      }
    }

    await ctx.db.patch(claim._id, {
      matchedPolicyId: matched._id,
      stage: "identifying_policy",
    });

    await logEvent(ctx, claim, "tool_call", "match_policy", {
      lossHypothesis,
      productCategory,
      matchedPolicyId: matched._id,
    });

    return {
      matched: true,
      policyId: matched._id,
      type: matched.type,
      insurer: matched.insurer,
      policyNumber: matched.policyNumber,
      deductibleEur: matched.deductibleEur,
      depreciationRule: matched.depreciationRule,
      requiresVisualInspection: matched.requiresVisualInspection,
      exclusions: matched.exclusions,
    };
  },
});

export const checkCoverage = mutation({
  args: {
    sessionId: v.string(),
    policyId: v.id("policies"),
  },
  handler: async (ctx, { sessionId, policyId }) => {
    await getOrCreateUser(ctx);
    const claim = await ctx.db
      .query("claims")
      .withIndex("by_session", (q: any) => q.eq("sessionId", sessionId))
      .unique();
    if (!claim) throw new Error("Claim not found");

    const policy = await ctx.db.get(policyId);
    if (!policy) throw new Error("Policy not found");

    await ctx.db.patch(claim._id, { stage: "coverage_caveat" });

    await logEvent(ctx, claim, "tool_call", "check_coverage", { policyId });

    return {
      deductibleEur: policy.deductibleEur,
      depreciationRule: policy.depreciationRule ?? null,
      exclusions: policy.exclusions,
      coverageLimitEur: policy.coverageLimitEur ?? null,
      coverageSummary: policy.coverageSummary,
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
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) {
        updates[k] = v;
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
  },
  handler: async (ctx, { sessionId, summary, callerEmail, transcriptText }) => {
    await getOrCreateUser(ctx);
    const claim = await ctx.db
      .query("claims")
      .withIndex("by_session", (q: any) => q.eq("sessionId", sessionId))
      .unique();
    if (!claim) throw new Error("Claim not found");

    const updates: any = {
      status: "estimating",
      stage: "closed",
      finalizedAt: new Date().toISOString(),
      damageSummary: claim.damageSummary ?? summary,
    };
    if (callerEmail) updates.callerEmail = callerEmail;
    if (transcriptText) updates.transcriptText = transcriptText;

    await ctx.db.patch(claim._id, updates);

    const refreshed = await ctx.db.get(claim._id);
    await logEvent(ctx, refreshed, "tool_call", "finalize_claim", { summary, callerEmail });

    return { ok: true, claimId: claim._id, formLinkSent: false };
  },
});
