import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-sm">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
          Built for Inca · Berlin Hack 2026
        </p>
        <h1 className="text-4xl font-bold leading-tight mb-4">
          File a claim in 90 seconds.
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Talk to Lina. Show the damage. Walk away knowing your deductible,
          depreciation, and expected payout — before you've uploaded a single document.
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="h-14 text-base">
            <Link href="/sign-in">Get started</Link>
          </Button>
          <Button asChild variant="outline" className="h-12">
            <Link href="/sign-up">Create account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
