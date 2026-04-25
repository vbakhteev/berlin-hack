"use client";

import { use, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Id } from "@/convex/_generated/dataModel";

type PageProps = { params: Promise<{ sessionId: string }> };

type RequiredUpload = {
  id: string;
  title: string;
  description: string;
  required: boolean;
  status: "pending" | "uploaded";
  storageId?: Id<"_storage">;
  uploadedAt?: string;
};

export default function ConfirmPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const claim = useQuery(api.claims.bySession, { sessionId });
  const router = useRouter();
  const generateUploadUrl = useMutation(api.uploads.generateUploadUrl);
  const attachUpload = useMutation(api.uploads.attachUpload);
  const submitClaim = useMutation(api.claims.submit);

  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isEstimating =
    claim?.status === "draft" && !claim.expectedPayoutHighEur;
  const isSubmitted = claim?.status === "in_review";

  const requiredUploads = (claim?.requiredUploads ?? []) as RequiredUpload[];

  const allRequiredUploaded = requiredUploads
    .filter((u) => u.required)
    .every((u) => u.status === "uploaded");

  async function handleFileChange(item: RequiredUpload, file: File) {
    if (!claim) return;
    setUploadingId(item.id);
    setFileNames((prev) => ({ ...prev, [item.id]: file.name }));
    try {
      const url = await generateUploadUrl();
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      await attachUpload({
        claimId: claim._id,
        uploadId: item.id,
        storageId: storageId as Id<"_storage">,
      });
    } finally {
      setUploadingId(null);
    }
  }

  async function handleSubmit() {
    if (!claim) return;
    setSubmitting(true);
    try {
      await submitClaim({ claimId: claim._id });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background p-4 pb-8">
      <div className="mx-auto max-w-lg">
        <div className="py-6 text-center">
          <div className="text-4xl mb-2">✓</div>
          <h1 className="text-xl font-bold">Claim opened</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Lina has captured your claim details.
          </p>
        </div>

        {/* Claim summary */}
        <Card className="mb-4">
          <CardContent className="py-4 px-4 space-y-3">
            {claim?.productBrandModel && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Damaged item
                </p>
                <p className="font-medium">{claim.productBrandModel}</p>
              </div>
            )}
            {claim?.damageSummary && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  What happened
                </p>
                <p className="text-sm">{claim.damageSummary}</p>
              </div>
            )}
            {claim?.incidentDate && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  When
                </p>
                <p className="text-sm">{claim.incidentDate}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payout estimate */}
        <Card className="mb-6">
          <CardContent className="py-4 px-4">
            <p className="text-sm font-semibold mb-3">Estimated payout</p>
            {isEstimating ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <p className="text-xs text-muted-foreground animate-pulse">
                  Researching retail prices…
                </p>
              </div>
            ) : claim?.expectedPayoutHighEur ? (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-primary">
                  {claim.expectedPayoutLowEur?.toLocaleString("de-DE")} € –{" "}
                  {claim.expectedPayoutHighEur?.toLocaleString("de-DE")} €
                </p>
                {claim.retailPriceEur && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      Retail price: ~
                      {claim.retailPriceEur.toLocaleString("de-DE")} €
                    </p>
                    {claim.retailPriceSource && (
                      <p className="truncate">
                        Source: {claim.retailPriceSource}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Estimate not available. Upload your invoice to calculate.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Required uploads */}
        {!isSubmitted && requiredUploads.length > 0 && (
          <Card className="mb-6">
            <CardContent className="py-4 px-4">
              <p className="text-sm font-semibold mb-1">Documents we need</p>
              <p className="text-xs text-muted-foreground mb-4">
                Upload these to finish your claim.
              </p>
              <div className="divide-y divide-border/50">
                {requiredUploads.map((item) => {
                  const uploaded = item.status === "uploaded";
                  const busy = uploadingId === item.id;
                  return (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          {item.title}
                          {!item.required && (
                            <span className="ml-1 normal-case tracking-normal text-muted-foreground/70">
                              (Optional)
                            </span>
                          )}
                        </p>
                        {uploaded ? (
                          <span className="text-xs font-medium text-green-600 dark:text-green-500">
                            ✓ Uploaded
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {busy ? "Uploading…" : "Pending"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      {uploaded ? (
                        <p className="text-xs text-muted-foreground truncate">
                          {fileNames[item.id] ?? "File received"}
                        </p>
                      ) : (
                        <input
                          type="file"
                          disabled={busy}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileChange(item, file);
                          }}
                          className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border/50 file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTAs */}
        <div className="space-y-3">
          {isSubmitted ? (
            <Card>
              <CardContent className="py-6 px-4 text-center space-y-2">
                <div className="text-3xl">✓</div>
                <p className="font-semibold">Claim submitted</p>
                <p className="text-sm text-muted-foreground">
                  We'll review your documents and email you within 1-2 business
                  days.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Button
              size="lg"
              className="w-full h-14"
              disabled={!allRequiredUploaded || submitting || !claim}
              onClick={handleSubmit}
            >
              {submitting ? "Submitting…" : "Submit claim"}
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/dashboard")}
          >
            Back to dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}
