"use client";

import { Laptop } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

function shortRef(sessionId: string) {
  return "AXA-2024-" + sessionId.slice(-6).toUpperCase();
}

export function AxaClaimHero({
  claim,
}: {
  claim: Doc<"claims"> | null | undefined;
}) {
  if (!claim) {
    return (
      <div className="h-28 rounded-[8px] bg-[#F5F5F5] animate-pulse" />
    );
  }

  const date = new Date(claim.createdAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const status =
    claim.status === "call"
      ? "Aufnahme läuft"
      : claim.status === "draft"
      ? "In Bearbeitung"
      : claim.status === "in_review"
      ? "In Prüfung"
      : claim.status === "accepted"
      ? "Genehmigt"
      : claim.status === "rejected"
      ? "Abgelehnt"
      : "In Bearbeitung";

  const statusColor =
    claim.status === "accepted"
      ? "bg-[#E8F5E9] text-[#2E7D32]"
      : claim.status === "rejected"
      ? "bg-[#FFEBEE] text-[#C62828]"
      : "bg-[#E8E8FF] text-[#00008F]";

  return (
    <div className="bg-[#F5F5F5] rounded-[8px] p-5 flex items-start gap-4">
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#E0E0E0] shadow-sm">
        <Laptop className="w-7 h-7 text-[#00008F]" strokeWidth={1.6} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-[0.1em] text-[#666666] font-semibold">
          Elektronikschaden
        </p>
        <p className="text-[19px] font-bold text-[#1A1A1A] mt-0.5 leading-tight">
          {claim.productBrandModel ?? "Schadenfall"}
        </p>
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusColor}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                claim.status === "accepted"
                  ? "bg-[#2E7D32]"
                  : claim.status === "rejected"
                  ? "bg-[#C62828]"
                  : "bg-[#00008F] animate-pulse"
              }`}
            />
            {status}
          </span>
          <span className="text-[11px] text-[#999999] font-mono">
            {shortRef(claim.sessionId)}
          </span>
        </div>
        <p className="text-[12px] text-[#999999] mt-1.5">{date}</p>
      </div>
    </div>
  );
}
