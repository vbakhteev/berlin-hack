"use client";

import { Doc } from "@/convex/_generated/dataModel";

type ClaimCardProps = {
  claim: Doc<"claims"> | null | undefined;
};

type FieldRowProps = {
  label: string;
  value?: string | number | null;
};

function FieldRow({ label, value }: FieldRowProps) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium">{String(value)}</span>
    </div>
  );
}

export function ClaimCardLive({ claim }: ClaimCardProps) {
  if (!claim) return null;

  const hasAnyField =
    claim.incidentType ||
    claim.productBrandModel ||
    claim.incidentDate ||
    claim.incidentLocation ||
    claim.damageSummary ||
    claim.estimatedDamageEur;

  return (
    <div className="rounded-xl border bg-card p-4 space-y-0">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Claim summary</h3>
        {claim.matchedPolicyId && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            Plan matched
          </span>
        )}
      </div>

      {!hasAnyField ? (
        <p className="text-xs text-muted-foreground py-3">
          Fields will appear here as Lina captures them…
        </p>
      ) : (
        <div className="divide-y divide-border/50">
          <FieldRow label="Damaged item" value={claim.productBrandModel} />
          <FieldRow label="Incident type" value={claim.incidentType} />
          <FieldRow label="Date" value={claim.incidentDate} />
          <FieldRow label="Location" value={claim.incidentLocation} />
          <FieldRow label="Damage" value={claim.damageSummary} />
          <FieldRow
            label="Estimated value"
            value={claim.estimatedDamageEur ? `${claim.estimatedDamageEur} EUR` : undefined}
          />
        </div>
      )}
    </div>
  );
}
