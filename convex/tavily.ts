import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const FALLBACK_PRICES: Record<string, { priceEur: number; source: string }> = {
  "macbook pro 14": { priceEur: 2399, source: "apple.de (fallback)" },
  "macbook pro 13": { priceEur: 1599, source: "apple.de (fallback)" },
  "macbook air": { priceEur: 1299, source: "apple.de (fallback)" },
  "iphone 15": { priceEur: 949, source: "apple.de (fallback)" },
  "iphone 14": { priceEur: 799, source: "apple.de (fallback)" },
  "ipad": { priceEur: 449, source: "apple.de (fallback)" },
  "thinkpad x1": { priceEur: 1899, source: "lenovo.de (fallback)" },
  "samsung galaxy": { priceEur: 849, source: "samsung.de (fallback)" },
  "dell xps": { priceEur: 1699, source: "dell.de (fallback)" },
};

function getFallbackPrice(model: string) {
  const lower = model.toLowerCase();
  for (const [key, val] of Object.entries(FALLBACK_PRICES)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

export const researchReplacementPrice = action({
  args: { claimId: v.id("claims") },
  handler: async (ctx, { claimId }) => {
    const claim = await ctx.runQuery(api.claims.byId, { claimId });
    if (!claim?.productBrandModel) {
      await ctx.runMutation(api.claims.setRetailPrice, {
        claimId,
        retailPriceEur: claim?.estimatedDamageEur ?? 500,
        retailPriceSource: "estimate",
      });
      await ctx.runMutation(api.claims.computePayoutRange, { claimId });
      return;
    }

    const fallback = getFallbackPrice(claim.productBrandModel);

    const tavilyKey = process.env.TAVILY_API_KEY;
    if (tavilyKey) {
      try {
        const query = `${claim.productBrandModel} new price EUR Germany retail 2026`;
        const res = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tavilyKey}`,
          },
          body: JSON.stringify({
            query,
            search_depth: "basic",
            max_results: 5,
            include_answer: true,
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
          const data = await res.json();
          const answer = data.answer ?? "";
          const priceMatch = answer.match(/(\d{1,4}[.,]\d{3}|\d{3,5})\s*(?:EUR|€|euro)/i);
          if (priceMatch) {
            const priceStr = priceMatch[1].replace(",", "");
            const price = parseFloat(priceStr);
            if (price >= 50 && price <= 10000) {
              await ctx.runMutation(api.claims.setRetailPrice, {
                claimId,
                retailPriceEur: price,
                retailPriceSource: data.results?.[0]?.url ?? "tavily",
              });
              await ctx.runMutation(api.claims.computePayoutRange, { claimId });
              return;
            }
          }
        }
      } catch (e) {
        // fall through to fallback
      }
    }

    const price = fallback ?? { priceEur: claim.estimatedDamageEur ?? 500, source: "estimate" };
    await ctx.runMutation(api.claims.setRetailPrice, {
      claimId,
      retailPriceEur: price.priceEur,
      retailPriceSource: price.source,
    });
    await ctx.runMutation(api.claims.computePayoutRange, { claimId });
  },
});
