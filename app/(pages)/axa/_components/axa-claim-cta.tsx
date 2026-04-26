"use client";

import { ChevronRight, Phone } from "lucide-react";

export function AxaClaimCta({ onTap }: { onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      className="group w-full bg-[#00008F] text-white rounded-[10px] px-5 py-5 flex items-center gap-4 hover:bg-[#000074] active:bg-[#00005C] transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
    >
      <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
        <Phone className="w-6 h-6 text-white" strokeWidth={1.8} />
      </div>
      <div className="flex-1 text-left">
        <p className="text-[15px] font-bold tracking-[0.08em] uppercase">
          Schaden melden
        </p>
        <p className="text-[13px] text-white/75 mt-0.5">
          Jetzt mit AXA Kundenservice sprechen
        </p>
      </div>
      <ChevronRight
        className="w-5 h-5 text-white/60 shrink-0 group-hover:translate-x-0.5 transition-transform"
      />
    </button>
  );
}
