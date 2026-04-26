"use client";

import { useEffect, useState } from "react";
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
import { getPolicyTemplate } from "@/convex/policyTemplates";

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

export function ReviewView({ sessionId }: { sessionId: string }) {
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
  const [estimatingTimedOut, setEstimatingTimedOut] = useState(false);

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
        claim.estimatedDamageEur != null
          ? String(claim.estimatedDamageEur)
          : "",
    });
  }, [claim, isEditing]);

  const isEstimating =
    claim?.status === "draft" && !claim.expectedPayoutHighEur;
  const isSubmitted = claim?.status === "in_review";

  useEffect(() => {
    if (!isEstimating) {
      setEstimatingTimedOut(false);
      return;
    }
    const t = setTimeout(() => setEstimatingTimedOut(true), 5000);
    return () => clearTimeout(t);
  }, [isEstimating]);

  const payoutTemplate = claim?.matchedPolicyType
    ? getPolicyTemplate(claim.matchedPolicyType)
    : null;
  const deductibleEur = payoutTemplate?.deductibleEur ?? 0;
  const depreciationPct = (() => {
    if (!payoutTemplate?.depreciationRule) return 0;
    const m = payoutTemplate.depreciationRule.match(/(\d+)%\s*per year/i);
    if (!m) return 0;
    return Math.min(parseInt(m[1]) * 2, 60);
  })();

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
      router.push(`/claim/${sessionId}/submitted`);
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

  // Header logic
  let h1: string;
  let subtext: string;
  if (isEditing) {
    h1 = "Edit claim details";
    subtext = "Update anything Lina got wrong, then save.";
  } else if (claim?.status === "in_review") {
    h1 = "Claim in review";
    subtext =
      "Your claim is being reviewed. You can still add documents below.";
  } else {
    h1 = "Review your claim";
    subtext = "Review the details below and attach any documents needed.";
  }

  return (
    <main className="min-h-[100dvh] bg-background p-4 pb-8">
      <div className="mx-auto max-w-lg">
        <div className="py-6 text-center">
          <h1 className="text-xl font-bold">{h1}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtext}</p>
        </div>

        {isEditing ? (
          <Card className="mb-4">
            <CardContent className="py-5 px-4 space-y-4">
              <EditField
                id="incidentType"
                label="Incident type"
                placeholder="e.g. theft, accidental damage, water damage"
                value={form.incidentType}
                onChange={(v) => setForm((f) => ({ ...f, incidentType: v }))}
              />
              <EditField
                id="incidentDate"
                label="When"
                placeholder="e.g. 2026-04-23 or yesterday afternoon"
                value={form.incidentDate}
                onChange={(v) => setForm((f) => ({ ...f, incidentDate: v }))}
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
                onChange={(v) => setForm((f) => ({ ...f, productCategory: v }))}
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
                <Label
                  htmlFor="damageSummary"
                  className="text-xs uppercase tracking-wide text-muted-foreground"
                >
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
                  <DetailRow label="Where" value={claim?.incidentLocation} />
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
            {claim?.matchedPolicyType &&
              (() => {
                const tpl = getPolicyTemplate(claim.matchedPolicyType);
                if (!tpl) return null;
                return (
                  <Card className="mb-4">
                    <CardContent className="py-4 px-4 flex items-center gap-4">
                      <div className="text-4xl leading-none">{tpl.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Matched policy
                        </p>
                        <p className="font-semibold truncate">{tpl.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

            {/* Payout estimate */}
            <Card className="mb-6">
              <CardContent className="py-4 px-4">
                <p className="text-sm font-semibold mb-3">Estimated payout</p>
                {isEstimating && !estimatingTimedOut ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <p className="text-xs text-muted-foreground animate-pulse">
                      Researching retail prices…
                    </p>
                  </div>
                ) : isEstimating && estimatingTimedOut ? (
                  <p className="text-sm text-muted-foreground">
                    Calculating estimate…
                  </p>
                ) : claim?.expectedPayoutHighEur ? (
                  <div className="space-y-3">
                    <p className="text-2xl font-bold text-primary">
                      {claim.expectedPayoutLowEur?.toLocaleString("de-DE")} € –{" "}
                      {claim.expectedPayoutHighEur?.toLocaleString("de-DE")} €
                    </p>
                    <div className="divide-y divide-border/40 text-sm">
                      {claim.retailPriceEur != null && (
                        <div className="flex justify-between py-1.5 text-muted-foreground">
                          <span>Retail (Tavily)</span>
                          <span>
                            ~{claim.retailPriceEur.toLocaleString("de-DE")} €
                          </span>
                        </div>
                      )}
                      {depreciationPct > 0 && (
                        <div className="flex justify-between py-1.5 text-muted-foreground">
                          <span>Depreciation</span>
                          <span>−{depreciationPct}%</span>
                        </div>
                      )}
                      {deductibleEur > 0 && (
                        <div className="flex justify-between py-1.5 text-muted-foreground">
                          <span>Deductible</span>
                          <span>
                            −{deductibleEur.toLocaleString("de-DE")} €
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Estimate not available. Upload your invoice to calculate.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            {(() => {
              const visibleUploads = isSubmitted
                ? requiredUploads.filter((u) => u.status === "uploaded")
                : requiredUploads;
              if (visibleUploads.length === 0) return null;
              return (
                <Card className="mb-6">
                  <CardContent className="py-4 px-4">
                    <p className="text-sm font-semibold mb-1">
                      {isSubmitted ? "Attached documents" : "Documents we need"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {isSubmitted
                        ? "Files attached to your claim."
                        : storedUploads.length > 0
                          ? "Lina asked for these to finish your claim."
                          : "Lina didn't request specific documents. Attach anything that supports your claim."}
                    </p>
                    <div className="divide-y divide-border/50">
                      {visibleUploads.map((item) => {
                        const uploaded = item.status === "uploaded";
                        const busy = uploadingId === item.id;
                        const label = item.description?.trim() || item.title;
                        return (
                          <div
                            key={item.id}
                            className="py-3 first:pt-0 last:pb-0"
                          >
                            <p className="text-sm font-medium mb-2">{label}</p>
                            {uploaded ? (
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                                <svg
                                  className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <span className="text-xs text-green-800 dark:text-green-300 truncate flex-1">
                                  {fileNames[item.id] ?? "File received"}
                                </span>
                                <svg
                                  className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <label className="block cursor-pointer">
                                <input
                                  type="file"
                                  disabled={busy}
                                  className="sr-only"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileChange(item, file);
                                  }}
                                />
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/40 transition-colors">
                                  <svg
                                    className="w-4 h-4 text-muted-foreground shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                    />
                                  </svg>
                                  <span className="text-xs text-muted-foreground">
                                    {busy
                                      ? "Uploading…"
                                      : "Choose file to upload"}
                                  </span>
                                </div>
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* CTAs */}
            <div className="space-y-3">
              {!isSubmitted && (
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
                onClick={() => router.push("/axa")}
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

function DetailRow({ label, value }: { label: string; value?: string | null }) {
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
