"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { POLICY_TEMPLATES, getPolicyTemplate } from "@/convex/policyTemplates";

export default function PlansPage() {
  const currentUser = useQuery(api.users.currentUser);
  const router = useRouter();

  const activePolicyTypes = currentUser?.activePolicyTypes ?? [];
  const plans = activePolicyTypes
    .map((id) => getPolicyTemplate(id))
    .filter((t): t is NonNullable<typeof t> => t != null);

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
          {currentUser === undefined ? (
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
            plans.map((plan) => (
              <Card key={plan.id}>
                <CardContent className="py-4 px-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{plan.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm">{plan.title}</p>
                      <p className="text-xs text-muted-foreground">{plan.insurer} · {plan.policyNumber}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{plan.coverageSummary}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span><span className="text-muted-foreground">Deductible </span>€{plan.deductibleEur}</span>
                    {plan.coverageLimitEur && (
                      <span><span className="text-muted-foreground">Limit </span>€{plan.coverageLimitEur.toLocaleString()}</span>
                    )}
                    {plan.depreciationRule && (
                      <span className="text-muted-foreground">{plan.depreciationRule}</span>
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
            ))
          )}
        </div>
      </div>
    </main>
  );
}
