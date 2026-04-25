"use client";
import { ConvexReactClient, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { ReactNode, useEffect } from "react";
import { api } from "@/convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Ensures a Convex user record exists for every authenticated Clerk session.
// Must be inside ConvexProviderWithClerk so useMutation works.
function UserSync() {
  const { isSignedIn } = useAuth();
  const store = useMutation(api.users.store);
  useEffect(() => {
    if (isSignedIn) store();
  }, [isSignedIn, store]);
  return null;
}

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <UserSync />
      {children}
    </ConvexProviderWithClerk>
  );
}
