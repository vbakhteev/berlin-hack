"use client";

import { ReactNode, useEffect } from "react";

export function AxaClaimSheet({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[8px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="absolute bottom-0 inset-x-0 bg-white rounded-t-[20px] shadow-[0_-8px_40px_rgba(0,0,0,0.22)] flex flex-col axa-sheet-enter"
        style={{
          maxHeight: "92dvh",
          paddingBottom: "env(safe-area-inset-bottom, 16px)",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#D1D1D1]" />
        </div>

        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
