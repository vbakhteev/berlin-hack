"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";

const nanoid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-blue-500",
  in_review: "bg-purple-500",
  accepted: "bg-emerald-500",
  call: "bg-blue-400",
  rejected: "bg-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  accepted: "Accepted",
  call: "In call",
  rejected: "Rejected",
};

export default function DashboardPage() {
  const { user } = useUser();
  const claims = useQuery(api.claims.byUser);
  const currentUser = useQuery(api.users.currentUser);
  const createClaim = useMutation(api.claims.create);
  const router = useRouter();

  const handleOpenClaim = async () => {
    const sessionId = nanoid();
    await createClaim({ sessionId });
    router.push(`/claim/${sessionId}`);
  };

  if (currentUser && !currentUser.onboardingComplete) {
    router.replace("/onboarding");
    return null;
  }

  return (
    <main className="min-h-screen bg-background p-4 pb-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 pt-4">
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl font-bold">{user?.firstName ?? "Friend"}</h1>
        </div>

        {/* Primary CTA */}
        <Button
          size="lg"
          className="w-full h-16 text-lg font-semibold mb-3 bg-primary"
          onClick={handleOpenClaim}
        >
          Open a claim
        </Button>

        {/* Claims list */}
        <div className="space-y-3 mb-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Recent claims
          </h2>
          {claims === undefined ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : claims.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground text-sm">
                No claims yet. Open your first claim above.
              </CardContent>
            </Card>
          ) : (
            claims.map((claim) => (
              <Card
                key={claim._id}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() =>
                  claim.stage !== "closed"
                    ? router.push(`/claim/${claim.sessionId}`)
                    : router.push(`/claim/${claim.sessionId}/confirm`)
                }
              >
                <CardContent className="py-4 px-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      {claim.productBrandModel ?? claim.incidentType ?? "Claim"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {claim.incidentDate ?? new Date(claim.createdAt).toLocaleDateString()}
                      {claim.damageSummary ? ` · ${claim.damageSummary.slice(0, 40)}` : ""}
                    </p>
                  </div>
                  <Badge
                    className={`text-white text-xs ${STATUS_COLORS[claim.status] ?? "bg-gray-400"}`}
                  >
                    {STATUS_LABELS[claim.status] ?? claim.status}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/plans")}
        >
          My plans
        </Button>

      </div>
    </main>
  );
}
