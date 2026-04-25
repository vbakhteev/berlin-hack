"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPolicyTemplate } from "@/convex/policyTemplates";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "draft" | "in_review" | "accepted";

export default function InternalPage() {
  const claims = useQuery(api.claims.allClaims);
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered = (claims ?? []).filter(
    (c) => filter === "all" || c.status === filter
  );

  const counts = {
    all: claims?.length ?? 0,
    draft: claims?.filter((c) => c.status === "draft").length ?? 0,
    in_review: claims?.filter((c) => c.status === "in_review").length ?? 0,
    accepted: claims?.filter((c) => c.status === "accepted").length ?? 0,
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                Internal
              </p>
              <h1 className="text-2xl font-bold">Claims Dashboard</h1>
            </div>
            <div className="flex gap-5 text-center">
              <StatBox label="Total" value={counts.all} />
              <StatBox label="In Review" value={counts.in_review} highlight />
              <StatBox label="Accepted" value={counts.accepted} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "draft", "in_review", "accepted"] as const).map((s) => (
            <Button
              key={s}
              variant={filter === s ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter(s)}
              className="h-8 text-xs"
            >
              {FILTER_LABELS[s]}
              <span className="ml-1.5 text-muted-foreground">
                {counts[s]}
              </span>
            </Button>
          ))}
        </div>

        {/* Claims list */}
        {claims === undefined ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-sm">No claims found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((claim) => {
              const policy = claim.matchedPolicyType
                ? getPolicyTemplate(claim.matchedPolicyType)
                : null;
              const shortRef = claim.sessionId.slice(-8).toUpperCase();
              const date = new Date(claim.createdAt).toLocaleDateString(
                "en-DE",
                { day: "numeric", month: "short", year: "numeric" }
              );
              return (
                <Link
                  key={claim._id}
                  href={`/internal/claims/${claim._id}`}
                  className="block"
                >
                  <div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-border/50 bg-card hover:bg-muted/40 hover:border-border transition-colors cursor-pointer">
                    {/* Policy emoji */}
                    <div className="text-2xl w-9 text-center shrink-0">
                      {policy?.emoji ?? "📋"}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm truncate">
                          {claim.user?.name ?? claim.user?.email ?? "Unknown"}
                        </span>
                        <span className="text-muted-foreground text-xs font-mono shrink-0">
                          #{shortRef}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {[claim.incidentType, claim.productBrandModel, claim.incidentLocation]
                          .filter(Boolean)
                          .join(" · ") || "No details captured"}
                      </p>
                    </div>

                    {/* Policy */}
                    {policy && (
                      <div className="hidden sm:block text-xs text-muted-foreground shrink-0 w-32 truncate text-right">
                        {policy.title}
                      </div>
                    )}

                    {/* Payout */}
                    <div className="hidden md:block text-right shrink-0 w-28">
                      {claim.expectedPayoutHighEur ? (
                        <p className="text-sm font-semibold text-primary">
                          {claim.expectedPayoutLowEur?.toLocaleString("de-DE")} –{" "}
                          {claim.expectedPayoutHighEur.toLocaleString("de-DE")} €
                        </p>
                      ) : claim.estimatedDamageEur ? (
                        <p className="text-sm text-muted-foreground">
                          ~{claim.estimatedDamageEur.toLocaleString("de-DE")} €
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground/50">—</p>
                      )}
                    </div>

                    {/* Status + date */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StatusBadge status={claim.status} />
                      <span className="text-xs text-muted-foreground">
                        {date}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function StatBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div>
      <p
        className={cn(
          "text-2xl font-bold",
          highlight && "text-primary"
        )}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    draft:
      "bg-muted text-muted-foreground border-transparent",
    in_review:
      "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-transparent",
    accepted:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
        variants[status] ?? variants.draft
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All",
  draft: "Draft",
  in_review: "In Review",
  accepted: "Accepted",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  in_review: "In Review",
  accepted: "Accepted",
};
