import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const attachUpload = mutation({
  args: {
    claimId: v.id("claims"),
    uploadId: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { claimId, uploadId, storageId }) => {
    const claim = await ctx.db.get(claimId);
    if (!claim) throw new Error("Claim not found");

    const uploads = claim.requiredUploads ?? [];
    const next = uploads.map((u) =>
      u.id === uploadId
        ? {
            ...u,
            status: "uploaded" as const,
            storageId,
            uploadedAt: new Date().toISOString(),
          }
        : u
    );

    await ctx.db.patch(claimId, { requiredUploads: next });
    return { ok: true };
  },
});
