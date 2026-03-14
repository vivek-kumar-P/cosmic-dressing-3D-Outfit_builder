# 3D Outfit Builder

Next.js 15 app for 3D outfit customization, product browsing, cart, checkout, auth, and Supabase integration.

## Quick Start

1. Install dependencies:
   pnpm install
2. Create env file:
   .env.local with
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
3. Run dev server:
   pnpm dev
4. Open:
   http://localhost:3000

## Main Commands

- pnpm dev
- pnpm build
- pnpm start
- pnpm lint

## Project Layout

- app/: routes and API handlers
- components/: UI and feature components
- lib/: utilities and Supabase clients
- contexts/: React app state
- hooks/: reusable hooks
- scripts/: SQL setup scripts