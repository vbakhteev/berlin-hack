"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, Info } from "lucide-react";
import Image from "next/image";
import { AxaClaimSheet } from "@/app/(pages)/axa/_components/axa-claim-sheet";
import { AxaClaimHero } from "@/app/(pages)/axa/_components/axa-claim-hero";
import { AxaClaimDetails } from "@/app/(pages)/axa/_components/axa-claim-details";
import { AxaRequiredUploads } from "@/app/(pages)/axa/_components/axa-required-uploads";
import { AxaTimeline } from "@/app/(pages)/axa/_components/axa-timeline";

export default function AxaClaimSheetPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();
  const claim = useQuery(api.claims.bySession, { sessionId });

  return (
    <div className="axa-scope">
      {/* Home visible behind the sheet (blurred by backdrop) */}
      <div className="min-h-[100dvh] bg-[#F5F5F5]" />

      <AxaClaimSheet onClose={() => router.push("/axa")}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#F0F0F0] shrink-0">
          <button
            aria-label="Zurück"
            onClick={() => router.push("/axa")}
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2">
            <Image
              src="/axa-logo.png"
              alt="AXA"
              width={48}
              height={18}
              className="h-4 w-auto object-contain"
            />
            <h1 className="text-[15px] font-semibold text-[#1A1A1A]">
              Schadenmeldung
            </h1>
          </div>

          <button
            aria-label="Info"
            className="w-10 h-10 -mr-2 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition-colors"
          >
            <Info className="w-5 h-5 text-[#00008F]" strokeWidth={1.8} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5 space-y-6 overflow-y-auto">
          <AxaClaimHero claim={claim} />
          <AxaClaimDetails claim={claim} />
          <AxaRequiredUploads claim={claim} />
          <AxaTimeline claim={claim} />

          {/* 48h notice */}
          <div className="bg-[#F0F4FF] border border-[#00008F]/15 rounded-[8px] px-4 py-4">
            <p className="text-[13px] font-semibold text-[#00008F] mb-1">
              Wie geht es weiter?
            </p>
            <p className="text-[12px] text-[#444444] leading-relaxed">
              Unser Team meldet sich innerhalb von{" "}
              <strong>48 Stunden</strong>. Entweder kommt die Zahlung ein
              oder Sie erhalten schriftlich den Grund, warum nicht.
            </p>
          </div>

          {/* Footer space */}
          <div className="h-4" />
        </div>
      </AxaClaimSheet>
    </div>
  );
}
