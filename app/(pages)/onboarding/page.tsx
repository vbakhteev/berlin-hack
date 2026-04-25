"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { POLICY_TEMPLATES } from "@/convex/policyTemplates";

export default function OnboardingPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const updatePolicyTypes = useMutation(api.users.updatePolicyTypes);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const router = useRouter();

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDone = async () => {
    setLoading(true);
    try {
      await updatePolicyTypes({ policyTypes: [...selected] });
      await completeOnboarding();
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col p-6">
      <div className="mx-auto max-w-lg w-full flex flex-col flex-1">
        <div className="mb-8 pt-4">
          <h1 className="text-2xl font-bold">Your plans</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select your active plans so Lina knows your coverage.
          </p>
        </div>

        <div className="space-y-3 flex-1">
          {POLICY_TEMPLATES.map(({ id, emoji, title, description }) => {
            const isSelected = selected.has(id);
            return (
              <Card
                key={id}
                className={`cursor-pointer transition-all border-2 ${
                  isSelected ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => toggle(id)}
              >
                <CardContent className="flex items-center gap-4 py-4 px-4">
                  <span className="text-3xl">{emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        viewBox="0 0 12 12"
                        className="w-3 h-3 text-white fill-white"
                      >
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} fill="none" />
                      </svg>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 space-y-3">
          <Button
            size="lg"
            className="w-full h-14 text-base"
            onClick={handleDone}
            disabled={loading || selected.size === 0}
          >
            {loading ? "Setting up…" : `Add ${selected.size} plan${selected.size === 1 ? "" : "s"}`}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Sample plans from HUK24, Allianz, DEVK, and Petolo are pre-loaded for demo.
          </p>
        </div>
      </div>
    </main>
  );
}
