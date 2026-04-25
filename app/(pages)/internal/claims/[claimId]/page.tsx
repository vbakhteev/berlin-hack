"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";

type PageProps = { params: Promise<{ claimId: string }> };

export default function InternalClaimPage({ params }: PageProps) {
  const { claimId } = use(params);
  const claim = useQuery(api.claims.byIdInternal, {
    claimId: claimId as Id<"claims">,
  });

  if (claim === undefined) return <LoadingSkeleton />;
  if (claim === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Claim not found</p>
      </div>
    );
  }

  const shortRef = claim.sessionId.slice(-8).toUpperCase();
  const createdAt = new Date(claim.createdAt).toLocaleString("en-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const finalizedAt = claim.finalizedAt
    ? new Date(claim.finalizedAt).toLocaleString("en-DE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const transcriptEvents = (claim.events ?? [])
    .filter(
      (e) => e.type === "transcript_user" || e.type === "transcript_agent"
    )
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center gap-4">
          <Link href="/internal">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              All claims
            </Button>
          </Link>
          <div className="flex-1" />
          <StatusBadge status={claim.status} size="md" />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {claim.incidentType
                  ? capitalize(claim.incidentType)
                  : "Insurance Claim"}
                {claim.productBrandModel ? ` — ${claim.productBrandModel}` : ""}
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                REF {shortRef}
              </p>
            </div>
          </div>
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <span>Created {createdAt}</span>
            {finalizedAt && <span>· Call ended {finalizedAt}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Incident details */}
            <Section title="Incident">
              <Grid2>
                <Field label="Type" value={claim.incidentType} />
                <Field label="Date" value={claim.incidentDate} />
                <Field label="Location" value={claim.incidentLocation} />
                <Field
                  label="GPS"
                  value={
                    claim.gpsLatitude != null && claim.gpsLongitude != null
                      ? `${claim.gpsLatitude.toFixed(5)}, ${claim.gpsLongitude.toFixed(5)}`
                      : undefined
                  }
                  extra={
                    claim.gpsLatitude != null && claim.gpsLongitude != null ? (
                      <a
                        href={`https://maps.google.com/?q=${claim.gpsLatitude},${claim.gpsLongitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Open in Maps
                      </a>
                    ) : null
                  }
                />
              </Grid2>
            </Section>

            {/* Item & damage */}
            <Section title="Item & Damage">
              <Grid2>
                <Field label="Category" value={claim.productCategory} />
                <Field label="Brand / Model" value={claim.productBrandModel} />
                <Field
                  label="Estimated damage"
                  value={
                    claim.estimatedDamageEur != null
                      ? `${claim.estimatedDamageEur.toLocaleString("de-DE")} €`
                      : undefined
                  }
                />
              </Grid2>
              {claim.damageSummary && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">
                    Summary
                  </p>
                  <p className="text-sm leading-relaxed">
                    {claim.damageSummary}
                  </p>
                </div>
              )}
            </Section>

            {/* Transcript */}
            <Section title="Call Transcript">
              {transcriptEvents.length > 0 ? (
                <TranscriptView events={transcriptEvents} />
              ) : claim.transcriptText ? (
                <div className="bg-muted/40 rounded-lg p-4">
                  <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed text-foreground/80">
                    {claim.transcriptText}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No transcript recorded
                </p>
              )}
            </Section>

            {/* Media */}
            {claim.mediaWithUrls.length > 0 && (
              <Section title="Recorded Media">
                <div className="space-y-4">
                  {claim.mediaWithUrls.map((m, i) => (
                    <MediaItem key={i} item={m} />
                  ))}
                </div>
              </Section>
            )}

            {/* Event log */}
            <EventLog events={claim.events ?? []} />
          </div>

          {/* Right column — sidebar */}
          <div className="space-y-5">
            {/* Claimant */}
            <Section title="Claimant">
              <div className="space-y-3">
                <Field label="Name" value={claim.user?.name} />
                <Field
                  label="Email"
                  value={claim.callerEmail ?? claim.user?.email}
                  extra={
                    (claim.callerEmail ?? claim.user?.email) ? (
                      <a
                        href={`mailto:${claim.callerEmail ?? claim.user?.email}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Send email
                      </a>
                    ) : null
                  }
                />
                <Field label="Phone" value={claim.callerPhone} />
              </div>
            </Section>

            {/* Policy */}
            {claim.policy && (
              <Section title="Policy">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{claim.policy.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">
                      {claim.policy.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {claim.policy.insurer}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Field label="Policy No." value={claim.policy.policyNumber} />
                  <Field
                    label="Deductible"
                    value={`${claim.policy.deductibleEur.toLocaleString("de-DE")} €`}
                  />
                  {claim.policy.coverageLimitEur && (
                    <Field
                      label="Coverage limit"
                      value={`${claim.policy.coverageLimitEur.toLocaleString("de-DE")} €`}
                    />
                  )}
                  {claim.policy.depreciationRule && (
                    <Field
                      label="Depreciation"
                      value={claim.policy.depreciationRule}
                    />
                  )}
                </div>
              </Section>
            )}

            {/* Payout estimate */}
            <Section title="Payout Estimate">
              {claim.expectedPayoutHighEur ? (
                <div className="space-y-3">
                  <p className="text-2xl font-bold text-primary">
                    {claim.expectedPayoutLowEur?.toLocaleString("de-DE")} €
                    {" – "}
                    {claim.expectedPayoutHighEur.toLocaleString("de-DE")} €
                  </p>
                  {claim.retailPriceEur && (
                    <div className="space-y-1.5">
                      <Field
                        label="Retail price"
                        value={`${claim.retailPriceEur.toLocaleString("de-DE")} €`}
                      />
                      {claim.retailPriceSource && (
                        <Field label="Source" value={claim.retailPriceSource} />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Estimate pending
                </p>
              )}
            </Section>

            {/* Documents */}
            {claim.uploadsWithUrls.length > 0 && (
              <Section title="Documents">
                <div className="space-y-2">
                  {claim.uploadsWithUrls.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {doc.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.status === "uploaded" ? "Uploaded" : "Pending"}
                          {doc.uploadedAt
                            ? ` · ${new Date(doc.uploadedAt).toLocaleDateString("en-DE")}`
                            : ""}
                        </p>
                      </div>
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                          >
                            View
                          </Button>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Sub-components ---

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="py-4 px-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          {title}
        </p>
        {children}
      </CardContent>
    </Card>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>;
}

function Field({
  label,
  value,
  extra,
}: {
  label: string;
  value?: string | null;
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
        {label}
      </p>
      {value ? (
        <p className="text-sm">{value}</p>
      ) : (
        <p className="text-sm text-muted-foreground/50 italic">—</p>
      )}
      {extra && <div className="mt-0.5">{extra}</div>}
    </div>
  );
}

function TranscriptView({
  events,
}: {
  events: Array<{
    type: string;
    payload: unknown;
    timestamp: number;
  }>;
}) {
  return (
    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
      {events.map((e, i) => {
        const isUser = e.type === "transcript_user";
        const text =
          typeof e.payload === "string"
            ? e.payload
            : typeof (e.payload as { text?: string })?.text === "string"
              ? (e.payload as { text: string }).text
              : JSON.stringify(e.payload);

        return (
          <div
            key={i}
            className={cn(
              "flex gap-2",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            {!isUser && (
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px]">A</span>
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                isUser
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted rounded-bl-sm"
              )}
            >
              {text}
            </div>
            {isUser && (
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px]">U</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MediaItem({
  item,
}: {
  item: {
    kind: string;
    url: string | null;
    capturedAt: string;
    durationSec?: number;
  };
}) {
  const label =
    item.kind === "damage_video"
      ? "Damage Video"
      : item.kind === "damage_frame"
        ? "Damage Photo"
        : "Invoice";

  if (!item.url)
    return (
      <div className="p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground">
        {label} — file unavailable
      </div>
    );

  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
        {label}
        {item.durationSec != null && ` · ${item.durationSec}s`}
      </p>
      {item.kind === "damage_video" ? (
        <video
          src={item.url}
          controls
          className="w-full rounded-xl border border-border max-h-72 bg-black"
        />
      ) : (
        <img
          src={item.url}
          alt={label}
          className="w-full rounded-xl border border-border max-h-72 object-contain bg-muted"
        />
      )}
      <p className="text-xs text-muted-foreground mt-1">
        {new Date(item.capturedAt).toLocaleString("en-DE")}
      </p>
    </div>
  );
}

const STAGES = [
  "greeting",
  "identifying_policy",
  "fact_gathering",
  "visual_inspection",
  "voice_confirmation",
  "closed",
] as const;

const STAGE_LABELS: Record<string, string> = {
  greeting: "Greeting",
  identifying_policy: "Policy ID",
  coverage_caveat: "Coverage",
  fact_gathering: "Fact gathering",
  visual_inspection: "Inspection",
  voice_confirmation: "Confirmation",
  closed: "Closed",
};

function StageTimeline({ stage }: { stage: string }) {
  const currentIdx = STAGES.indexOf(stage as (typeof STAGES)[number]);
  return (
    <div className="space-y-1.5">
      {STAGES.map((s, i) => {
        const done = i < currentIdx;
        const active = s === stage;
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                done && "bg-green-500",
                active && "bg-primary",
                !done && !active && "bg-muted-foreground/30"
              )}
            />
            <span
              className={cn(
                "text-xs",
                active && "font-semibold",
                !done && !active && "text-muted-foreground"
              )}
            >
              {STAGE_LABELS[s] ?? s}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function EventLog({
  events,
}: {
  events: Array<{
    type: string;
    payload: unknown;
    toolName?: string;
    timestamp: number;
  }>;
}) {
  const [open, setOpen] = useState(false);
  if (events.length === 0) return null;

  return (
    <Card>
      <CardContent className="py-4 px-5">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Event Log
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{events.length} events</span>
            <svg
              className={cn(
                "w-4 h-4 transition-transform",
                open && "rotate-180"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {open && (
          <div className="mt-4 max-h-96 overflow-y-auto space-y-1.5 pr-1">
            {[...events]
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((e, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs py-1.5 border-b border-border/30 last:border-0"
                >
                  <span
                    className={cn(
                      "shrink-0 font-mono px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide",
                      EVENT_COLORS[e.type] ?? "bg-muted text-muted-foreground"
                    )}
                  >
                    {e.type.replace("_", " ")}
                  </span>
                  {e.toolName && (
                    <span className="text-muted-foreground font-mono shrink-0">
                      {e.toolName}
                    </span>
                  )}
                  <span className="text-muted-foreground/70 flex-1 truncate">
                    {typeof e.payload === "string"
                      ? e.payload.slice(0, 120)
                      : JSON.stringify(e.payload).slice(0, 120)}
                  </span>
                  <span className="text-muted-foreground/40 shrink-0 font-mono">
                    {new Date(e.timestamp).toLocaleTimeString("en-DE", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({
  status,
  size = "sm",
}: {
  status: string;
  size?: "sm" | "md";
}) {
  const variants: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    in_review: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    accepted:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border border-transparent",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variants[status] ?? variants.draft
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  in_review: "In Review",
  accepted: "Accepted",
};

const EVENT_COLORS: Record<string, string> = {
  transcript_user:
    "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300",
  transcript_agent:
    "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300",
  tool_call:
    "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300",
  tool_result:
    "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300",
  stage_transition:
    "bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-300",
  system: "bg-muted text-muted-foreground",
};

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-muted/30 h-16" />
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        <Skeleton className="h-16 w-72" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
