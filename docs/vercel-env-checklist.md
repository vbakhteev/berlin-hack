# Vercel Environment Variable Checklist

Set these in the Vercel dashboard under Project → Settings → Environment Variables.
All required for production; all should be set on **Production** + **Preview**.

## Next.js (NEXT_PUBLIC_* are exposed to browser)

| Variable | Where set | Notes |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel env | From Convex dashboard → Settings → URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Vercel env | From Clerk dashboard → API Keys |
| `CLERK_SECRET_KEY` | Vercel env | From Clerk dashboard → API Keys (never expose publicly) |
| `GEMINI_API_KEY` | Vercel env | Used by `/api/gemini/ephemeral-token` route to mint browser key |

## Convex (set via `npx convex env set`)

| Variable | Notes |
|---|---|
| `TAVILY_API_KEY` | Used by `convex/tavily.ts` action — set in Convex dashboard env, NOT Next.js |
| `CLERK_ISSUER_URL` | Clerk JWT issuer URL for Convex auth — from Clerk dashboard |

## Quick deploy commands

```bash
# Pull env vars from Vercel to .env.local for local dev
vercel env pull .env.local

# Set a Convex env var
npx convex env set TAVILY_API_KEY <your-key>

# Deploy to Vercel preview
vercel

# Deploy to production
vercel --prod
```

## Pre-demo checklist

- [ ] `GEMINI_API_KEY` set in Vercel → ephemeral-token route works
- [ ] `NEXT_PUBLIC_CONVEX_URL` matches the prod Convex deployment
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` match prod Clerk app
- [ ] `TAVILY_API_KEY` set in Convex env (not Vercel)
- [ ] Demo account pre-seeded with electronics + kasko policies
- [ ] Test the full call flow on Vercel prod URL before going on stage
