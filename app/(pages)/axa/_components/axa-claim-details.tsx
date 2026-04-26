"use client";

import type { Doc } from "@/convex/_generated/dataModel";

function Row({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex justify-between gap-4 py-3 border-b border-[#F0F0F0] last:border-0">
      <span className="text-[11px] uppercase tracking-[0.08em] text-[#666666] font-semibold shrink-0">
        {label}
      </span>
      <span className="text-[14px] text-[#1A1A1A] text-right leading-snug">
        {value || (
          <em className="text-[#BBBBBB] font-normal not-italic">—</em>
        )}
      </span>
    </div>
  );
}

export function AxaClaimDetails({
  claim,
}: {
  claim: Doc<"claims"> | null | undefined;
}) {
  if (!claim) return null;

  const value =
    claim.estimatedDamageEur != null
      ? `${claim.estimatedDamageEur.toLocaleString("de-DE")} €`
      : null;

  const payout =
    claim.expectedPayoutLowEur != null && claim.expectedPayoutHighEur != null
      ? `${claim.expectedPayoutLowEur.toLocaleString("de-DE")} – ${claim.expectedPayoutHighEur.toLocaleString("de-DE")} €`
      : null;

  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.12em] text-[#666666] font-bold mb-2">
        Schadendetails
      </h2>
      <div className="bg-white border border-[#E0E0E0] rounded-[8px] px-4">
        <Row label="Gerät" value={claim.productBrandModel} />
        <Row label="Schaden" value={claim.damageSummary} />
        <Row label="Datum" value={claim.incidentDate} />
        <Row label="Ort" value={claim.incidentLocation} />
        <Row label="Kaufpreis" value={value} />
        {payout && <Row label="Erwartete Zahlung" value={payout} />}
      </div>
    </section>
  );
}
