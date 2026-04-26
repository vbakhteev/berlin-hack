"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { IosCallScreen } from "@/app/(pages)/axa/_components/ios-call-screen";

function CallPageInner() {
  const params = useSearchParams();
  const sessionId = params.get("sessionId");

  if (!sessionId) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: "#1C1C1E" }}
      >
        <p className="text-[#8E8E93] text-sm">Kein aktiver Anruf.</p>
      </div>
    );
  }

  return <IosCallScreen sessionId={sessionId} />;
}

export default function AxaCallPage() {
  return (
    <Suspense
      fallback={
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: "#1C1C1E" }}
        >
          <p className="text-[#8E8E93] text-sm">Verbinde …</p>
        </div>
      }
    >
      <CallPageInner />
    </Suspense>
  );
}
