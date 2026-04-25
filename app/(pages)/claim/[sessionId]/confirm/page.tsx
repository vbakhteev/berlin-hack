"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type PageProps = { params: Promise<{ sessionId: string }> };

export default function ConfirmPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const claim = useQuery(api.claims.bySession, { sessionId });
  const router = useRouter();

  const isEstimating =
    claim?.status === "estimating" && !claim.expectedPayoutHighEur;

  return (
    <main className="min-h-screen bg-background p-4 pb-8">
      <div className="mx-auto max-w-lg">
        <div className="py-6 text-center">
          <div className="text-4xl mb-2">✓</div>
          <h1 className="text-xl font-bold">Claim opened</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Lina has captured your claim details.
          </p>
        </div>

        {/* Claim summary */}
        <Card className="mb-4">
          <CardContent className="py-4 px-4 space-y-3">
            {claim?.productBrandModel && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Damaged item</p>
                <p className="font-medium">{claim.productBrandModel}</p>
              </div>
            )}
            {claim?.damageSummary && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">What happened</p>
                <p className="text-sm">{claim.damageSummary}</p>
              </div>
            )}
            {claim?.incidentDate && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">When</p>
                <p className="text-sm">{claim.incidentDate}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payout estimate */}
        <Card className="mb-6">
          <CardContent className="py-4 px-4">
            <p className="text-sm font-semibold mb-3">Estimated payout</p>
            {isEstimating ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <p className="text-xs text-muted-foreground animate-pulse">
                  Researching retail prices…
                </p>
              </div>
            ) : claim?.expectedPayoutHighEur ? (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-primary">
                  {claim.expectedPayoutLowEur?.toLocaleString("de-DE")} € –{" "}
                  {claim.expectedPayoutHighEur?.toLocaleString("de-DE")} €
                </p>
                {claim.retailPriceEur && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Retail price: ~{claim.retailPriceEur.toLocaleString("de-DE")} €</p>
                    {claim.retailPriceSource && (
                      <p className="truncate">Source: {claim.retailPriceSource}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Estimate not available. Upload your invoice to calculate.
              </p>
            )}
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="space-y-3">
          <Button size="lg" className="w-full h-14" onClick={() => {}}>
            Finish on a bigger screen
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            We'll email you a link to upload your invoice and complete the claim.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/dashboard")}
          >
            Back to dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}
