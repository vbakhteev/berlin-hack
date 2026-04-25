import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const bySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    return ctx.db
      .query("claims")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .unique();
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
      status: "active",
      stage: "greeting",
      visualInspectionRequested: false,
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

    const policy = claim.matchedPolicyId ? await ctx.db.get(claim.matchedPolicyId) : null;
    const retail = claim.retailPriceEur ?? claim.estimatedDamageEur ?? 0;
    const deductible = policy?.deductibleEur ?? 0;

    // Parse depreciation
    let depPct = 0;
    if (policy?.depreciationRule) {
      const match = policy.depreciationRule.match(/(\d+)%\s*per year/i);
      if (match) {
        // Assume 2-year old item for demo
        depPct = Math.min(parseInt(match[1]) * 2 / 100, 0.6);
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
