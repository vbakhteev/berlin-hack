import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

console.log("[clerk-debug] env keys present:", {
  CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
  CLERK_SECRET_KEY_len: process.env.CLERK_SECRET_KEY?.length ?? 0,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_len: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.length ?? 0,
  all_clerk_keys: Object.keys(process.env).filter(k => k.includes("CLERK")),
});

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
