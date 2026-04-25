"use client";

type AudioOrbProps = {
  state: "idle" | "connecting" | "connected" | "error" | "ended";
  isSpeaking?: boolean;
};

export function AudioOrb({ state, isSpeaking }: AudioOrbProps) {
  const isActive = state === "connected";
  const isConnecting = state === "connecting";

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer ring pulse when speaking */}
      {isActive && isSpeaking && (
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
      )}
      {/* Middle ring */}
      {isActive && (
        <div className="absolute w-32 h-32 rounded-full bg-primary/10 animate-pulse" />
      )}
      {/* Core orb */}
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
          state === "error"
            ? "bg-destructive/20 border-2 border-destructive"
            : state === "connecting"
            ? "bg-muted border-2 border-border animate-pulse"
            : state === "connected"
            ? "bg-primary/20 border-2 border-primary"
            : state === "ended"
            ? "bg-muted border-2 border-muted-foreground"
            : "bg-muted border-2 border-border"
        }`}
      >
        {state === "connecting" ? (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : state === "connected" ? (
          <div className="flex gap-0.5 items-end h-6">
            {[0.4, 0.7, 1, 0.7, 0.4].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 bg-primary rounded-full transition-all duration-150 ${
                  isSpeaking ? "animate-bounce" : ""
                }`}
                style={{
                  height: `${h * 24}px`,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
        ) : state === "error" ? (
          <span className="text-2xl">⚠️</span>
        ) : state === "ended" ? (
          <span className="text-2xl">✓</span>
        ) : (
          <span className="text-2xl">🎙</span>
        )}
      </div>
    </div>
  );
}
