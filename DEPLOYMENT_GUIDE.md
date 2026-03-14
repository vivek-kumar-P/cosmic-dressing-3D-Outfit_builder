# Deployment Guide

## Target

Deploy to Vercel with Supabase as backend.

## Steps

1. Push repository to Git provider.
2. Import project in Vercel.
3. Set environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
4. Build command: pnpm build
5. Output: Next.js default
6. Deploy.

## Verify

- Homepage loads.
- Auth pages work.
- API health route responds.
- Supabase reads/writes succeed.