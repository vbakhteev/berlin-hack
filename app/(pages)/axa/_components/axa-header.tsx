"use client";

import Image from "next/image";
import { Bell, Phone } from "lucide-react";

export function AxaHeader({ onPhoneTap }: { onPhoneTap: () => void }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E0E0E0]">
      <div className="flex items-center justify-between px-5 h-12">
        <Image
          src="/axa-logo.png"
          alt="AXA"
          width={72}
          height={26}
          priority
          className="h-7 w-auto object-contain"
        />
        <div className="flex items-center gap-1">
          <button
            aria-label="Benachrichtigungen"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition-colors"
          >
            <Bell className="w-5 h-5 text-[#333333]" strokeWidth={1.8} />
          </button>
          <button
            onClick={onPhoneTap}
            aria-label="AXA Kundenservice anrufen"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#00008F] hover:bg-[#000074] active:bg-[#00005C] transition-colors shadow-md"
          >
            <Phone className="w-4 h-4 text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}
