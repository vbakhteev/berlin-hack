"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

export function AxaClaimNotification({ claim }: { claim: Doc<"claims"> }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/axa/claim/${claim.sessionId}`)}
      className="w-full bg-[#F0F0FF] border border-[#00008F]/20 rounded-[6px] px-4 py-3 flex items-center gap-3 text-left hover:bg-[#E5E5FA] active:bg-[#DCDCF5] transition-colors"
    >
      <span className="w-2.5 h-2.5 rounded-full bg-[#00008F] animate-pulse shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#1A1A1A]">
          Neue Schadenmeldung
        </p>
        <p className="text-[12px] text-[#666666] truncate">
          {claim.productBrandModel ?? "Elektronikschaden"} · In Bearbeitung
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-[#00008F] shrink-0" />
    </button>
  );
}
