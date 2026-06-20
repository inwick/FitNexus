# FitNexus

A gym & fitness SaaS marketplace that connects **members** with **coaches** and helps coaches manage their clients.

## Tech stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS v4**
- **In-memory store** (no database required for now — MySQL/Prisma can be added later)
- **NextAuth (Auth.js v5)** — email/password auth with role-based access

## Demo accounts

No setup required. Start the app and log in with any of these (password: `password123`):

| Email | Role |
| --- | --- |
| member@fitnexus.com | Member |
| coach@fitnexus.com | Coach |
| admin@fitnexus.com | Admin |

The demo includes a coach with an active subscription and package, and a member who is already a client with workout/meal plans and progress data.

## Getting started

```bash
npm install
cp .env.example .env   # set AUTH_SECRET (or use the included .env)
npm run dev
```

Open http://localhost:3000

## Features

- **Members** — profile, browse coaches, purchase packages, log workouts, track progress
- **Coaches** — profile, subscription gate, packages, client management, workout/meal plans, WhatsApp notify
- **Admin** — revenue dashboard, confirm payments, user management

## Data storage

Data lives in an in-memory store ([`src/lib/store.ts`](src/lib/store.ts)) seeded on startup. Changes persist while the dev server is running but reset on restart. The Prisma schema in [`prisma/schema.prisma`](prisma/schema.prisma) is kept for future MySQL integration.

## MySQL (later)

When ready to integrate MySQL:

1. Install Prisma: `npm install @prisma/client prisma`
2. Set `DATABASE_URL` in `.env`
3. Replace the in-memory client in [`src/lib/prisma.ts`](src/lib/prisma.ts) with `PrismaClient`
4. Run `npx prisma migrate dev`
