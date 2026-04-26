"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";

function IosStatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[59px] bg-white flex items-start px-6 pt-[22px] select-none">
      {/* Time */}
      <span
        className="text-[15px] font-semibold text-[#1A1A1A] w-16 leading-none"
        style={{ fontFamily: "-apple-system, 'SF Pro Display', sans-serif" }}
      >
        {time}
      </span>

      {/* Dynamic Island */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[10px] w-[126px] h-[37px] bg-black rounded-full" />

      {/* Icons: multiply removes white bg on white surface */}
      <div className="ml-auto flex items-center gap-[6px]" style={{ mixBlendMode: "multiply" }}>
        <Image src="/ios-signal.png" alt="" width={17} height={13} className="h-[13px] w-auto" unoptimized />
        <Image src="/ios-wifi.png" alt="" width={16} height={13} className="h-[13px] w-auto" unoptimized />
        <Image src="/ios-battery.png" alt="" width={27} height={13} className="h-[13px] w-auto" unoptimized />
      </div>
    </div>
  );
}

export default function AxaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="axa-scope min-h-[100dvh] bg-white text-[#1A1A1A] antialiased">
      <IosStatusBar />
      <div className="pt-[59px]">{children}</div>
    </div>
  );
}
