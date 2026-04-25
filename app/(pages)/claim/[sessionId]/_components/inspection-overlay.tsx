"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

type InspectionOverlayProps = {
  onStartCamera: (videoEl: HTMLVideoElement) => Promise<void>;
  onStop: () => void;
  onEndCall: () => void;
  hint?: string;
  isActive: boolean;
};

export function InspectionOverlay({
  onStartCamera,
  onStop,
  onEndCall,
  hint,
  isActive,
}: InspectionOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      onStartCamera(videoRef.current);
    }
    // No cleanup here — parent calls onStop explicitly via button handlers.
    // Calling onStop in cleanup triggers the upload path prematurely (React
    // strict mode fires cleanup+remount, closing the overlay before any frames
    // are recorded).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, onStartCamera]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <video
        ref={videoRef}
        className="flex-1 min-h-0 w-full object-cover"
        muted
        playsInline
        autoPlay
      />
      <div
        className="p-6 bg-black/80 flex flex-col items-center gap-4"
        style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}
      >
        {hint && (
          <p className="text-white text-sm text-center font-medium">{hint}</p>
        )}
        <p className="text-white/60 text-xs text-center">
          Lina can see your camera. Show the damage clearly.
        </p>
        <div className="flex gap-3 w-full max-w-sm">
          <Button
            variant="outline"
            className="flex-1 border-white/30 text-white bg-white/10 hover:bg-white/20"
            onClick={onStop}
          >
            Stop inspection
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onEndCall}
          >
            End call
          </Button>
        </div>
      </div>
    </div>
  );
}
