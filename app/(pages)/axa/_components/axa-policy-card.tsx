"use client";

import { Laptop, Shield, Home as HomeIcon } from "lucide-react";
import type { MockPolicy } from "@/lib/axa/mock-customer";

const ICONS = { laptop: Laptop, shield: Shield, home: HomeIcon };

const TYPE_COLORS: Record<MockPolicy["type"], string> = {
  elektronik: "bg-[#E8E8FF]",
  haftpflicht: "bg-[#E8F0FF]",
  hausrat: "bg-[#E8F5FF]",
};

export function AxaPolicyCard({ policy }: { policy: MockPolicy }) {
  const Icon = ICONS[policy.iconKey];
  return (
    <div className="bg-white border border-[#E0E0E0] rounded-[6px] px-4 py-4 flex items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${TYPE_COLORS[policy.type]}`}
      >
        <Icon className="w-6 h-6 text-[#00008F]" strokeWidth={1.6} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-[#1A1A1A] truncate">
          {policy.title}
        </p>
        <p className="text-[12px] text-[#666666] mt-0.5 truncate">
          {policy.subtitle} · {policy.policyNumber}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[14px] font-bold text-[#1A1A1A]">
          {policy.monthlyEur.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
          })}{" "}
          €
        </p>
        <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-0.5">
          / Monat
        </p>
      </div>
    </div>
  );
}
