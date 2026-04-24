"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-4 text-muted-foreground">You are authenticated.</p>
      <button
        onClick={() => signOut(() => router.push("/"))}
        className="mt-6 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
      >
        Sign out
      </button>
    </main>
  );
}
