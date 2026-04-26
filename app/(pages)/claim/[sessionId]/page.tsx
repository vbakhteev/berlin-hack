"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CallView } from "./_components/call-view";
import { ReviewView } from "./_components/review-view";

type PageProps = { params: Promise<{ sessionId: string }> };

export default function ClaimPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const claim = useQuery(api.claims.bySession, { sessionId });
  // Decoupled from Convex realtime: only switch to ReviewView when CallView
  // explicitly signals the call is fully concluded (Lina finished closing summary).
  // This prevents the Convex finalizedAt push (~200ms) from cutting Lina off mid-sentence.
  const [callConcluded, setCallConcluded] = useState(false);

  if (claim === undefined) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  if (claim === null) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Claim not found.</p>
      </main>
    );
  }

  if (claim.finalizedAt && callConcluded) {
    return <ReviewView sessionId={sessionId} />;
  }

  return <CallView sessionId={sessionId} onCallConcluded={() => setCallConcluded(true)} />;
}
