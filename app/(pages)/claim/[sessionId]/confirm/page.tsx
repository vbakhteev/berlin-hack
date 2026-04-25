"use client";

import { use, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const DEFAULT_UPLOAD: RequiredUpload = {
  id: "additional-files",
  title: "Additional files",
  description:
    "Attach any supporting documents (invoice, police report, photos, etc.).",
  required: false,
  status: "pending",
};

type DraftForm = {
  incidentType: string;
  incidentDate: string;
  incidentLocation: string;
  productCategory: string;
  productBrandModel: string;
  damageSummary: string;
  estimatedDamageEur: string;
};

const EMPTY_FORM: DraftForm = {
  incidentType: "",
  incidentDate: "",
  incidentLocation: "",
  productCategory: "",
  productBrandModel: "",
  damageSummary: "",
  estimatedDamageEur: "",
};

export default function ConfirmPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const claim = useQuery(api.claims.bySession, { sessionId });
  const router = useRouter();
  const generateUploadUrl = useMutation(api.uploads.generateUploadUrl);
  const attachUpload = useMutation(api.uploads.attachUpload);
  const submitClaim = useMutation(api.claims.submit);
  const updateDraftFields = useMutation(api.claims.updateDraftFields);

  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [form, setForm] = useState<DraftForm>(EMPTY_FORM);

  useEffect(() => {
    if (!claim || isEditing) return;
    setForm({
      incidentType: claim.incidentType ?? "",
      incidentDate: claim.incidentDate ?? "",
      incidentLocation: claim.incidentLocation ?? "",
      productCategory: claim.productCategory ?? "",
      productBrandModel: claim.productBrandModel ?? "",
      damageSummary: claim.damageSummary ?? "",
      estimatedDamageEur:
        claim.estimatedDamageEur != null ? String(claim.estimatedDamageEur) : "",
    });
  }, [claim, isEditing]);

  const isEstimating =
    claim?.status === "draft" && !claim.expectedPayoutHighEur;
  const isSubmitted = claim?.status === "in_review";

  const storedUploads = (claim?.requiredUploads ?? []) as RequiredUpload[];
  const requiredUploads: RequiredUpload[] =
    storedUploads.length > 0 ? storedUploads : [DEFAULT_UPLOAD];

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
        title: item.title,
        description: item.description,
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

  async function handleSaveEdit() {
    if (!claim) return;
    setSavingEdit(true);
    try {
      const parsedAmount = form.estimatedDamageEur.trim()
        ? Number(form.estimatedDamageEur)
        : undefined;
      await updateDraftFields({
        claimId: claim._id,
        incidentType: form.incidentType.trim() || undefined,
        incidentDate: form.incidentDate.trim() || undefined,
        incidentLocation: form.incidentLocation.trim() || undefined,
        productCategory: form.productCategory.trim() || undefined,
        productBrandModel: form.productBrandModel.trim() || undefined,
        damageSummary: form.damageSummary.trim() || undefined,
        estimatedDamageEur:
          parsedAmount != null && Number.isFinite(parsedAmount)
            ? parsedAmount
            : undefined,
      });
      setIsEditing(false);
    } finally {
      setSavingEdit(false);
    }
  }

  function handleCancelEdit() {
    if (!claim) return;
    setForm({
      incidentType: claim.incidentType ?? "",
      incidentDate: claim.incidentDate ?? "",
      incidentLocation: claim.incidentLocation ?? "",
      productCategory: claim.productCategory ?? "",
      productBrandModel: claim.productBrandModel ?? "",
      damageSummary: claim.damageSummary ?? "",
      estimatedDamageEur:
        claim.estimatedDamageEur != null
          ? String(claim.estimatedDamageEur)
          : "",
    });
    setIsEditing(false);
  }

  return (
    <main className="min-h-screen bg-background p-4 pb-8">
      <div className="mx-auto max-w-lg">
        <div className="py-6 text-center">
          <div className="text-4xl mb-2">📝</div>
          <h1 className="text-xl font-bold">Draft created</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditing
              ? "Update anything Lina got wrong, then save."
              : "Review the details below and attach any documents needed."}
          </p>
        </div>

        {isEditing ? (
          <Card className="mb-4">
            <CardContent className="py-5 px-4 space-y-4">
              <EditField
                id="incidentType"
                label="Incident type"
                placeholder="e.g. theft, accidental damage, water damage"
                value={form.incidentType}
                onChange={(v) =>
                  setForm((f) => ({ ...f, incidentType: v }))
                }
              />
              <EditField
                id="incidentDate"
                label="When"
                placeholder="e.g. 2026-04-23 or yesterday afternoon"
                value={form.incidentDate}
                onChange={(v) =>
                  setForm((f) => ({ ...f, incidentDate: v }))
                }
              />
              <EditField
                id="incidentLocation"
                label="Where"
                placeholder="e.g. Berlin, S-Bahn, my apartment"
                value={form.incidentLocation}
                onChange={(v) =>
                  setForm((f) => ({ ...f, incidentLocation: v }))
                }
              />
              <EditField
                id="productCategory"
                label="Item category"
                placeholder="e.g. laptop, bicycle, phone"
                value={form.productCategory}
                onChange={(v) =>
                  setForm((f) => ({ ...f, productCategory: v }))
                }
              />
              <EditField
                id="productBrandModel"
                label="Brand & model"
                placeholder="e.g. MacBook Pro 14 M3"
                value={form.productBrandModel}
                onChange={(v) =>
                  setForm((f) => ({ ...f, productBrandModel: v }))
                }
              />
              <div className="space-y-1.5">
                <Label htmlFor="damageSummary" className="text-xs uppercase tracking-wide text-muted-foreground">
                  What happened
                </Label>
                <Textarea
                  id="damageSummary"
                  rows={3}
                  placeholder="Describe what happened in your own words"
                  value={form.damageSummary}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, damageSummary: e.target.value }))
                  }
                />
              </div>
              <EditField
                id="estimatedDamageEur"
                label="Estimated damage (€)"
                placeholder="e.g. 1800"
                inputMode="decimal"
                value={form.estimatedDamageEur}
                onChange={(v) =>
                  setForm((f) => ({ ...f, estimatedDamageEur: v }))
                }
              />
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelEdit}
                  disabled={savingEdit}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                >
                  {savingEdit ? "Saving…" : "Save draft"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Claim details */}
            <Card className="mb-4">
              <CardContent className="py-4 px-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Claim details</p>
                  {!isSubmitted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit draft
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  <DetailRow
                    label="Incident type"
                    value={claim?.incidentType}
                  />
                  <DetailRow label="When" value={claim?.incidentDate} />
                  <DetailRow
                    label="Where"
                    value={claim?.incidentLocation}
                  />
                  <DetailRow
                    label="Item"
                    value={joinNonEmpty(
                      [claim?.productCategory, claim?.productBrandModel],
                      " · "
                    )}
                  />
                  <DetailRow
                    label="What happened"
                    value={claim?.damageSummary}
                  />
                  <DetailRow
                    label="Estimated damage"
                    value={
                      claim?.estimatedDamageEur != null
                        ? `${claim.estimatedDamageEur.toLocaleString("de-DE")} €`
                        : undefined
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Matched policy */}
            {claim?.policy && (
              <Card className="mb-4">
                <CardContent className="py-4 px-4 flex items-center gap-4">
                  <div className="text-4xl leading-none">
                    {policyEmoji(claim.policy.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Matched policy
                    </p>
                    <p className="font-semibold truncate">
                      {policyLabel(claim.policy.type)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

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

            {/* Documents */}
            {!isSubmitted && (
              <Card className="mb-6">
                <CardContent className="py-4 px-4">
                  <p className="text-sm font-semibold mb-1">
                    Documents we need
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {storedUploads.length > 0
                      ? "Lina asked for these to finish your claim."
                      : "Lina didn't request specific documents. Attach anything that supports your claim."}
                  </p>
                  <div className="divide-y divide-border/50">
                    {requiredUploads.map((item) => {
                      const uploaded = item.status === "uploaded";
                      const busy = uploadingId === item.id;
                      const label =
                        item.description?.trim() || item.title;
                      return (
                        <div
                          key={item.id}
                          className="py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-baseline justify-between gap-2 mb-2">
                            <p className="text-sm font-medium">{label}</p>
                            {uploaded ? (
                              <span className="text-xs font-medium text-green-600 dark:text-green-500 shrink-0">
                                ✓ Uploaded
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground shrink-0">
                                {busy ? "Uploading…" : "Pending"}
                              </span>
                            )}
                          </div>
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
                      We'll review your documents and email you within 1-2
                      business days.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  size="lg"
                  className="w-full h-14"
                  disabled={submitting || !claim}
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
          </>
        )}
      </div>
    </main>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      {value ? (
        <p className="text-sm">{value}</p>
      ) : (
        <p className="text-sm text-muted-foreground/60 italic">Not captured</p>
      )}
    </div>
  );
}

function EditField({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "decimal" | "numeric" | "text";
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function joinNonEmpty(
  parts: Array<string | null | undefined>,
  sep: string
): string | undefined {
  const filtered = parts.filter((p): p is string => Boolean(p && p.trim()));
  return filtered.length > 0 ? filtered.join(sep) : undefined;
}

function policyEmoji(type: string): string {
  switch (type) {
    case "electronics":
      return "💻";
    case "kfz_haftpflicht":
      return "🚗";
    case "kfz_kasko":
      return "🚙";
    case "hausrat":
      return "🏠";
    case "privat_haftpflicht":
      return "🛡️";
    case "travel":
      return "✈️";
    case "pet":
      return "🐾";
    default:
      return "📄";
  }
}

function policyLabel(type: string): string {
  switch (type) {
    case "electronics":
      return "Electronics insurance";
    case "kfz_haftpflicht":
      return "Car liability";
    case "kfz_kasko":
      return "Comprehensive car";
    case "hausrat":
      return "Home contents";
    case "privat_haftpflicht":
      return "Personal liability";
    case "travel":
      return "Travel insurance";
    case "pet":
      return "Pet insurance";
    default:
      return type;
  }
}
