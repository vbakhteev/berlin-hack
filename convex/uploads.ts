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
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { claimId, uploadId, storageId, title, description }) => {
    const claim = await ctx.db.get(claimId);
    if (!claim) throw new Error("Claim not found");

    const uploads = claim.requiredUploads ?? [];
    const exists = uploads.some((u) => u.id === uploadId);
    const uploadedAt = new Date().toISOString();

    const next = exists
      ? uploads.map((u) =>
          u.id === uploadId
            ? { ...u, status: "uploaded" as const, storageId, uploadedAt }
            : u
        )
      : [
          ...uploads,
          {
            id: uploadId,
            title: title ?? "Additional files",
            description: description ?? "Supporting document",
            required: false,
            status: "uploaded" as const,
            storageId,
            uploadedAt,
          },
        ];

    await ctx.db.patch(claimId, { requiredUploads: next });
    return { ok: true };
  },
});
