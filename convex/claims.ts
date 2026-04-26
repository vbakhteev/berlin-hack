/*
 * Claim status lifecycle:
 *
 *   "call"      – created by claims.create; active voice call in progress
 *       ↓ (whichever fires first — exactly one schedules Tavily)
 *   "draft"     – via tools.finalizeClaim (AI tool call): sets finalizedAt + schedules Tavily
 *                 OR via claims.endCall (frontend on call end): schedules Tavily only when
 *                 finalizedAt is absent (i.e. finalizeClaim did not run during the call)
 *       ↓
 *   "in_review" – via claims.submit (user submits draft form)
 *       ↓
 *   "accepted"  – via claims.approveClaim (admin action, sends approval email)
 *   "rejected"  – via claims.rejectClaim (admin action, sends rejection email)
 */
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { getPolicyTemplate } from "./policyTemplates";

export const bySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const claim = await ctx.db
      .query("claims")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .unique();
    if (!claim) {
      return null;
    }
    const policy = claim.matchedPolicyType
      ? (getPolicyTemplate(claim.matchedPolicyType) ?? null)
      : null;
    return { ...claim, policy };
  },
});

export const byId = query({
  args: { claimId: v.id("claims") },
  handler: async (ctx, { claimId }) => {
    return ctx.db.get(claimId);
  },
});

export const byUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) return [];
    return ctx.db
      .query("claims")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    return ctx.db.insert("claims", {
      userId: user._id,
      sessionId,
      status: "call",
      stage: "greeting",
      visualInspectionRequested: false,
      visualInspectionCompleted: false,
      createdAt: new Date().toISOString(),
      events: [],
      media: [],
    });
  },
});

export const setRetailPrice = mutation({
  args: {
    claimId: v.id("claims"),
    retailPriceEur: v.number(),
    retailPriceSource: v.string(),
  },
  handler: async (ctx, { claimId, retailPriceEur, retailPriceSource }) => {
    await ctx.db.patch(claimId, { retailPriceEur, retailPriceSource });
  },
});

export const computePayoutRange = mutation({
  args: { claimId: v.id("claims") },
  handler: async (ctx, { claimId }) => {
    const claim = await ctx.db.get(claimId);
    if (!claim) return;

    const template = claim.matchedPolicyType
      ? getPolicyTemplate(claim.matchedPolicyType)
      : null;
    const retail = claim.retailPriceEur ?? claim.estimatedDamageEur ?? 0;
    const deductible = template?.deductibleEur ?? 0;

    let depPct = 0;
    if (template?.depreciationRule) {
      const match = template.depreciationRule.match(/(\d+)%\s*per year/i);
      if (match) {
        // Assume 2-year-old item for demo
        depPct = Math.min((parseInt(match[1]) * 2) / 100, 0.6);
      }
    }

    const lo = Math.max(0, retail * (1 - depPct - 0.1) - deductible);
    const hi = Math.max(0, retail * (1 - depPct) - deductible);

    await ctx.db.patch(claimId, {
      expectedPayoutLowEur: Math.round(lo),
      expectedPayoutHighEur: Math.round(hi),
    });
  },
});

export const events = query({
  args: { claimId: v.id("claims") },
  handler: async (ctx, { claimId }) => {
    const claim = await ctx.db.get(claimId);
    return claim?.events ?? [];
  },
});

export const submit = mutation({
  args: { claimId: v.id("claims") },
  handler: async (ctx, { claimId }) => {
    await ctx.db.patch(claimId, { status: "in_review" });
    return { ok: true };
  },
});

export const markVisualInspectionDone = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const claim = await ctx.db
      .query("claims")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .unique();
    if (!claim) return;
    await ctx.db.patch(claim._id, { visualInspectionCompleted: true });
  },
});

export const saveGpsLocation = mutation({
  args: {
    claimId: v.id("claims"),
    latitude: v.number(),
    longitude: v.number(),
    accuracyMeters: v.number(),
  },
  handler: async (ctx, { claimId, latitude, longitude, accuracyMeters }) => {
    await ctx.db.patch(claimId, {
      gpsLatitude: latitude,
      gpsLongitude: longitude,
      gpsAccuracyMeters: accuracyMeters,
    });
  },
});

export const endCall = mutation({
  args: { claimId: v.id("claims") },
  handler: async (ctx, { claimId }) => {
    const claim = await ctx.db.get(claimId);
    if (!claim) throw new Error("Claim not found");
    await ctx.db.patch(claimId, { status: "draft", stage: "closed" });
    // Schedule Tavily only when finalizeClaim (tools.ts) hasn't already done so
    if (!claim.finalizedAt) {
      await ctx.scheduler.runAfter(0, api.tavily.researchReplacementPrice, {
        claimId,
      });
    }
  },
});

export const attachMedia = mutation({
  args: {
    claimId: v.id("claims"),
    storageId: v.id("_storage"),
    kind: v.union(
      v.literal("damage_video"),
      v.literal("damage_frame"),
      v.literal("invoice")
    ),
    durationSec: v.optional(v.number()),
  },
  handler: async (ctx, { claimId, storageId, kind, durationSec }) => {
    const claim = await ctx.db.get(claimId);
    if (!claim) throw new Error("Claim not found");
    const entry = {
      kind,
      storageId,
      capturedAt: new Date().toISOString(),
      ...(durationSec != null ? { durationSec } : {}),
    };
    await ctx.db.patch(claimId, { media: [...(claim.media ?? []), entry] });
  },
});

export const allClaims = query({
  args: {},
  handler: async (ctx) => {
    const claims = await ctx.db.query("claims").order("desc").collect();
    return Promise.all(
      claims.map(async (claim) => {
        const user = await ctx.db.get(claim.userId);
        return { ...claim, user };
      })
    );
  },
});

export const byIdInternal = query({
  args: { claimId: v.id("claims") },
  handler: async (ctx, { claimId }) => {
    const claim = await ctx.db.get(claimId);
    if (!claim) return null;

    const user = await ctx.db.get(claim.userId);
    const policy = claim.matchedPolicyType
      ? (getPolicyTemplate(claim.matchedPolicyType) ?? null)
      : null;

    const mediaWithUrls = await Promise.all(
      (claim.media ?? []).map(async (m) => ({
        ...m,
        url: await ctx.storage.getUrl(m.storageId),
      }))
    );

    const uploadsWithUrls = await Promise.all(
      (claim.requiredUploads ?? []).map(async (u) => ({
        ...u,
        url: u.storageId ? await ctx.storage.getUrl(u.storageId) : null,
      }))
    );

    return { ...claim, user, policy, mediaWithUrls, uploadsWithUrls };
  },
});

export const updateDraftFields = mutation({
  args: {
    claimId: v.id("claims"),
    incidentType: v.optional(v.string()),
    incidentDate: v.optional(v.string()),
    incidentLocation: v.optional(v.string()),
    productCategory: v.optional(v.string()),
    productBrandModel: v.optional(v.string()),
    damageSummary: v.optional(v.string()),
    estimatedDamageEur: v.optional(v.number()),
  },
  handler: async (ctx, { claimId, ...fields }) => {
    const patch: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) patch[key] = value;
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(claimId, patch);
    }
    return { ok: true };
  },
});

export const setStatus = mutation({
  args: {
    claimId: v.id("claims"),
    status: v.union(
      v.literal("draft"),
      v.literal("in_review"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, { claimId, status }) => {
    await ctx.db.patch(claimId, { status });
  },
});

export const approveClaim = action({
  args: { claimId: v.id("claims") },
  handler: async (ctx, { claimId }) => {
    const claim = await ctx.runQuery(api.claims.byId, { claimId });
    if (!claim) throw new Error("Claim not found");

    await ctx.runMutation(api.claims.setStatus, {
      claimId,
      status: "accepted",
    });

    const email = claim.callerEmail;
    if (email) {
      const shortRef = claim.sessionId.slice(-8).toUpperCase();
      await ctx.runAction(api.emails.sendApprovalEmail, {
        to: email,
        claimRef: `REF ${shortRef}`,
        payoutLow: claim.expectedPayoutLowEur ?? undefined,
        payoutHigh: claim.expectedPayoutHighEur ?? undefined,
      });
    }
  },
});

export const rejectClaim = action({
  args: { claimId: v.id("claims"), reason: v.optional(v.string()) },
  handler: async (ctx, { claimId, reason }) => {
    const claim = await ctx.runQuery(api.claims.byId, { claimId });
    if (!claim) throw new Error("Claim not found");

    await ctx.runMutation(api.claims.setStatus, {
      claimId,
      status: "rejected",
    });

    const email = claim.callerEmail;
    if (email) {
      const shortRef = claim.sessionId.slice(-8).toUpperCase();
      await ctx.runAction(api.emails.sendRejectionEmail, {
        to: email,
        claimRef: `REF ${shortRef}`,
        reason,
      });
    }
  },
});
