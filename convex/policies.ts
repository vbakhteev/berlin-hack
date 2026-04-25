import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
    return ctx.db.query("policies").withIndex("by_user", (q) => q.eq("userId", user._id)).collect();
  },
});

export const byId = query({
  args: { policyId: v.id("policies") },
  handler: async (ctx, { policyId }) => {
    return ctx.db.get(policyId);
  },
});

export const seedSample = mutation({
  args: {
    type: v.union(
      v.literal("electronics"),
      v.literal("kfz_kasko"),
      v.literal("hausrat")
    ),
  },
  handler: async (ctx, { type }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Check if already seeded
    const existing = await ctx.db
      .query("policies")
      .withIndex("by_user_type", (q) => q.eq("userId", user._id).eq("type", type))
      .first();
    if (existing) return existing._id;

    const samples = {
      electronics: {
        type: "electronics" as const,
        insurer: "HUK24",
        policyNumber: "ELE-2025-887421",
        coverageSummary: "Covers accidental damage and theft of registered devices.",
        deductibleEur: 150,
        depreciationRule: "Linear, 10% per year from purchase date, max 60% reduction.",
        requiresVisualInspection: true,
        coverageLimitEur: 5000,
        exclusions: ["water damage from natural disasters", "intentional damage"],
      },
      kfz_kasko: {
        type: "kfz_kasko" as const,
        insurer: "Allianz",
        policyNumber: "KFZ-2024-553102",
        coverageSummary: "Vollkasko: collision, theft, vandalism.",
        deductibleEur: 300,
        depreciationRule: undefined,
        requiresVisualInspection: true,
        coverageLimitEur: undefined,
        exclusions: ["driving under influence", "uninsured driver"],
      },
      hausrat: {
        type: "hausrat" as const,
        insurer: "DEVK",
        policyNumber: "HAU-2023-119876",
        coverageSummary: "Home contents incl. accidental damage to electronics inside the residence.",
        deductibleEur: 100,
        depreciationRule: "5% per year, max 40%.",
        requiresVisualInspection: false,
        coverageLimitEur: 25000,
        exclusions: ["business equipment", "vehicles"],
      },
    };

    const data = samples[type];
    return ctx.db.insert("policies", {
      userId: user._id,
      ...data,
      extractedAt: new Date().toISOString(),
      extractedBy: "seeded",
    });
  },
});
