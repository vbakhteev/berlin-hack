"use client";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import ModeToggle from "../mode-toggle";
import { Button } from "../ui/button";
import { UserProfile } from "../user-profile";

export default function NavBar() {
  const { userId } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md bg-white/80 dark:bg-black/80">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <Link href="/" prefetch={true} className="font-semibold">
          App
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" prefetch={true}>
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/axa" prefetch={true}>
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          {!userId && (
            <Link href="/sign-in" prefetch={true}>
              <Button variant="default">Sign in</Button>
            </Link>
          )}
          {userId && <UserProfile />}
        </div>
      </div>
    </div>
  );
}
