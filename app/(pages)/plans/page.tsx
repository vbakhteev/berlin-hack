"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

const TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  electronics: { label: "Electronics", emoji: "💻" },
  kfz_haftpflicht: { label: "Car (Liability)", emoji: "🚗" },
  kfz_kasko: { label: "Car (Vollkasko)", emoji: "🚗" },
  hausrat: { label: "Home contents", emoji: "🏠" },
  privat_haftpflicht: { label: "Personal liability", emoji: "🛡️" },
  travel: { label: "Travel", emoji: "✈️" },
  pet: { label: "Pet", emoji: "🐾" },
};

export default function PlansPage() {
  const plans = useQuery(api.policies.byUser);
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background p-4 pb-8">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center gap-2 mb-6 pt-4">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">My plans</h1>
        </div>

        <div className="space-y-3">
          {plans === undefined ? (
            [1, 2].map((i) => (
              <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
            ))
          ) : plans.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground text-sm">
                No plans yet.
              </CardContent>
            </Card>
          ) : (
            plans.map((plan) => {
              const meta = TYPE_LABELS[plan.type] ?? { label: plan.type, emoji: "📄" };
              return (
                <Card key={plan._id}>
                  <CardContent className="py-4 px-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{meta.emoji}</span>
                      <div>
                        <p className="font-semibold text-sm">{meta.label}</p>
                        <p className="text-xs text-muted-foreground">{plan.insurer} · {plan.policyNumber}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{plan.coverageSummary}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      <span><span className="text-muted-foreground">Deductible </span>€{plan.deductibleEur}</span>
                      {plan.coverageLimitEur && (
                        <span><span className="text-muted-foreground">Limit </span>€{plan.coverageLimitEur.toLocaleString()}</span>
                      )}
                    </div>
                    {plan.exclusions.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Exclusions: </span>
                        {plan.exclusions.join(", ")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
