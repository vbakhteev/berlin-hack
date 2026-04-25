"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const POLICY_TYPES = [
  {
    type: "electronics" as const,
    label: "Electronics",
    emoji: "💻",
    desc: "Laptops, phones, tablets",
  },
  {
    type: "kfz_kasko" as const,
    label: "Car (Vollkasko)",
    emoji: "🚗",
    desc: "Collision, theft, vandalism",
  },
  {
    type: "hausrat" as const,
    label: "Home contents",
    emoji: "🏠",
    desc: "Hausrat & accidental damage",
  },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const seedSample = useMutation(api.policies.seedSample);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const router = useRouter();

  const toggle = (type: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleDone = async () => {
    setLoading(true);
    try {
      for (const type of selected) {
        await seedSample({ type: type as "electronics" | "kfz_kasko" | "hausrat" });
      }
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
          {POLICY_TYPES.map(({ type, label, emoji, desc }) => {
            const isSelected = selected.has(type);
            return (
              <Card
                key={type}
                className={`cursor-pointer transition-all border-2 ${
                  isSelected ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => toggle(type)}
              >
                <CardContent className="flex items-center gap-4 py-4 px-4">
                  <span className="text-3xl">{emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
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
            Sample plans from HUK24, Allianz, and DEVK are pre-loaded for demo.
          </p>
        </div>
      </div>
    </main>
  );
}
