"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { POLICY_TEMPLATES, getPolicyTemplate } from "@/convex/policyTemplates";

export default function PlansPage() {
  const currentUser = useQuery(api.users.currentUser);
  const updatePolicyTypes = useMutation(api.users.updatePolicyTypes);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const activePolicyTypes = currentUser?.activePolicyTypes ?? [];
  const plans = activePolicyTypes
    .map((id) => getPolicyTemplate(id))
    .filter((t): t is NonNullable<typeof t> => t != null);

  useEffect(() => {
    if (currentUser) {
      setSelected(new Set(currentUser.activePolicyTypes ?? []));
    }
  }, [currentUser]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePolicyTypes({ policyTypes: [...selected] });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelected(new Set(currentUser?.activePolicyTypes ?? []));
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-background p-4 pb-8">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center gap-2 mb-6 pt-4">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2"
            onClick={isEditing ? handleCancel : () => router.back()}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold flex-1">My plans</h1>
          {currentUser !== undefined && !isEditing && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
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
            <Button
              size="lg"
              className="w-full h-14 text-base mt-2"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {currentUser === undefined ? (
              [1, 2].map((i) => (
                <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
              ))
            ) : plans.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground text-sm">
                  No plans yet.{" "}
                  <button
                    className="underline text-foreground"
                    onClick={() => setIsEditing(true)}
                  >
                    Add one
                  </button>
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
        )}
      </div>
    </main>
  );
}
