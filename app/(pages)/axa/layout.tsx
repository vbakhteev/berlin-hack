import { ReactNode } from "react";

export default function AxaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="axa-scope min-h-[100dvh] bg-white text-[#1A1A1A] antialiased">
      {children}
    </div>
  );
}
