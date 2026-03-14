# Architecture

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth + DB)
- Three.js / react-three-fiber (3D views)

## Core Modules

- app/: pages, server actions, route handlers
- components/: presentation and feature UI
- contexts/: auth/cart/orders state providers
- lib/: data clients and utility logic
- hooks/: reusable behavior

## Runtime Flow

1. Client UI renders from app and components.
2. Data/auth requests go through Supabase clients in lib.
3. Server actions and API routes handle secure operations.
4. Contexts synchronize user/cart/order state across pages.