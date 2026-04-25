"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPolicyTemplate } from "@/convex/policyTemplates";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ sessionId: string }> };

export default function SubmittedPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const claim = useQuery(api.claims.bySession, { sessionId });
  const router = useRouter();

  const reviewBy = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const reviewByStr = reviewBy.toLocaleTimeString("en-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const policyTpl = claim?.matchedPolicyType
    ? getPolicyTemplate(claim.matchedPolicyType)
    : null;

  const shortRef = sessionId.slice(-8).toUpperCase();

  return (
    <main className="min-h-screen bg-background flex flex-col items-center p-4 pb-10">
      <div className="w-full max-w-lg pt-12">
        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mb-5">
            <svg
              className="w-10 h-10 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Your claim is submitted</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            We're on it. Expect a decision in your inbox by{" "}
            <span className="font-medium text-foreground">{reviewByStr}</span>{" "}
            today.
          </p>
          <p className="text-xs text-muted-foreground mt-3 font-mono tracking-wider">
            REF {shortRef}
          </p>
        </div>

        {/* Payout estimate */}
        {claim?.expectedPayoutHighEur && (
          <Card className="mb-4">
            <CardContent className="py-4 px-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Estimated payout
                </p>
                <p className="text-2xl font-bold text-primary">
                  {claim.expectedPayoutLowEur?.toLocaleString("de-DE")} €{" – "}
                  {claim.expectedPayoutHighEur.toLocaleString("de-DE")} €
                </p>
              </div>
              {policyTpl && (
                <div className="text-3xl leading-none shrink-0">
                  {policyTpl.emoji}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Matched policy (when no payout yet) */}
        {!claim?.expectedPayoutHighEur && policyTpl && (
          <Card className="mb-4">
            <CardContent className="py-4 px-4 flex items-center gap-4">
              <div className="text-3xl leading-none">{policyTpl.emoji}</div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Matched policy
                </p>
                <p className="font-semibold">{policyTpl.title}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* What happens next */}
        <Card className="mb-8">
          <CardContent className="py-5 px-4">
            <p className="text-sm font-semibold mb-5">What happens next</p>
            <div className="space-y-0">
              <TimelineStep
                status="done"
                label="Claim received"
                detail="Your details and documents are saved"
                isLast={false}
              />
              <TimelineStep
                status="active"
                label="Under review"
                detail={`Our team is looking at your case now · done by ${reviewByStr}`}
                isLast={false}
              />
              <TimelineStep
                status="pending"
                label="Decision emailed"
                detail="Full breakdown sent to your inbox"
                isLast
              />
            </div>
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full h-14"
            onClick={() => router.push("/dashboard")}
          >
            Go to dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}

function TimelineStep({
  status,
  label,
  detail,
  isLast,
}: {
  status: "done" | "active" | "pending";
  label: string;
  detail: string;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-3">
      {/* Icon + connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
            status === "done" &&
              "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
            status === "active" && "bg-primary text-primary-foreground",
            status === "pending" && "bg-muted text-muted-foreground"
          )}
        >
          {status === "done" ? "✓" : status === "active" ? "·" : "·"}
        </div>
        {!isLast && <div className="w-px flex-1 my-1 bg-border min-h-[20px]" />}
      </div>

      {/* Text */}
      <div className={cn("pb-5", isLast && "pb-0")}>
        <p
          className={cn(
            "text-sm font-medium",
            status === "pending" && "text-muted-foreground"
          )}
        >
          {label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
      </div>
    </div>
  );
}
