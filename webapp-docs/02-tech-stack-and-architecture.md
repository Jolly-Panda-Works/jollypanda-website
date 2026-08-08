# 02 — Tech Stack & Architecture

## Guiding principles

- **Boring, well-supported technology.** This is a small team shipping a business tool, not an
  experimental platform. Prefer stacks with excellent docs and one obvious way to do things.
- **One deployable unit for the MVP.** Full-stack framework over separate frontend/backend repos
  — less operational overhead, faster to ship, easy for a solo/small dev team to reason about.
- **Server-side calculation engine.** All financial formulas (recipe cost, margins, health
  score, etc.) live on the server, in one shared TypeScript module, and are unit-tested. The
  frontend never re-implements a formula — it only renders numbers the server already computed.
- **No public sign-up surface at all** in the code — this removes a whole category of security
  work (email verification, abuse prevention, CAPTCHA) from the MVP.

## Chosen stack

| Layer | Choice | Why |
|---|---|---|
| Frontend + Backend | **Next.js 14+ (App Router), TypeScript** | Single codebase for UI + API routes/Server Actions; great DX; easy deploy. |
| Styling | **Tailwind CSS** + a small design-token file | Fast, consistent, matches the "modern, minimal, business-friendly" design goal from the Excel spec. |
| Database | **PostgreSQL** | Relational integrity matters here (recipes → ingredients → menu items → sales all reference each other). Numeric precision for money via `NUMERIC`/`DECIMAL`, never `FLOAT`. |
| ORM | **Prisma** | Type-safe queries, migrations, good fit with Next.js + TypeScript. |
| Auth | **NextAuth.js (Auth.js) — Credentials provider only** | No OAuth, no magic links, no sign-up UI. Server-side session, password hashed with **bcrypt/argon2**. |
| Charts | **Recharts** | Covers all chart types needed (bar, line, pie/donut, quadrant scatter for Menu Engineering). |
| PDF export | **Puppeteer** (render the Executive Report HTML route to PDF) or **@react-pdf/renderer** | Puppeteer is simpler if the report is already a styled HTML page; react-pdf if we want a dedicated PDF layout. Decide in Phase 7. |
| CSV import (Sales) | **PapaParse** (client) + server-side validation | Matches the Excel product's "Sales" worksheet import use case. |
| Validation | **Zod** | Shared schema between form validation (client) and API input validation (server). |
| State/data fetching | **React Server Components + Server Actions**, with **TanStack Query** for client-side interactive bits (Scenario Simulator sliders, etc.) | Keeps most pages server-rendered (fast, simple); only truly interactive widgets go client-side. |
| Hosting | **VPS (Docker Compose: app + Postgres) behind Nginx**, or **Vercel + managed Postgres (Neon/Supabase)** | Either works; Phase 8 documents both. Given "manually create accounts on server," a VPS with SSH access for the admin CLI script is the simpler default. |
| Background jobs (future) | Not needed for MVP (no email sending, no scheduled jobs required for core loop) | Keep out of MVP scope. |

## High-level architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (owner)                       │
│   Next.js pages (Server Components) + a few Client Islands   │
│   (Scenario Simulator, data-entry tables, charts)             │
└───────────────────────────┬───────────────────────────────────┘
                             │ HTTPS (session cookie, NextAuth)
┌───────────────────────────▼───────────────────────────────────┐
│                     Next.js App (single deploy)                │
│  ┌───────────────┐  ┌───────────────────┐  ┌────────────────┐ │
│  │ App Router     │  │ Server Actions /   │  │ Calculation    │ │
│  │ pages (RSC)    │→ │ API routes          │→│ Engine (pure   │ │
│  │                │  │ (CRUD, validation)   │  │ TS functions)  │ │
│  └───────────────┘  └───────────────────┘  └────────┬───────┘ │
│                                                       │          │
│                       ┌───────────────────────────────▼───────┐ │
│                       │  Prisma ORM                            │ │
│                       └───────────────────┬───────────────────┘ │
└───────────────────────────────────────────┼─────────────────────┘
                                             │
                                   ┌─────────▼─────────┐
                                   │   PostgreSQL        │
                                   │  (one DB, tenant-   │
                                   │   scoped tables)     │
                                   └─────────────────────┘

  Separate, offline path:
  ┌────────────────────────────┐
  │ Admin account-creation CLI  │  → writes directly to the same
  │ (Node script, run over SSH) │    Postgres `users`/`accounts` table
  └────────────────────────────┘
```

## Project structure (proposed)

```
restaurant-cfo-web/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                # auth guard, nav shell
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── business-profile/page.tsx
│   │   │   ├── ingredients/page.tsx
│   │   │   ├── recipes/page.tsx
│   │   │   ├── packaging/page.tsx
│   │   │   ├── expenses/page.tsx
│   │   │   ├── menu-pricing/page.tsx
│   │   │   ├── sales/page.tsx
│   │   │   ├── inventory/page.tsx
│   │   │   ├── health-score/page.tsx
│   │   │   ├── menu-engineering/page.tsx
│   │   │   ├── profit-leakage/page.tsx
│   │   │   ├── opportunity/page.tsx
│   │   │   ├── simulator/page.tsx
│   │   │   ├── recommendations/page.tsx
│   │   │   └── report/page.tsx
│   │   └── api/
│   │       └── ... (only where Server Actions don't fit, e.g. PDF export, CSV import)
│   ├── lib/
│   │   ├── calc/                         # the calculation engine (pure functions, unit-tested)
│   │   │   ├── ingredientCost.ts
│   │   │   ├── recipeCost.ts
│   │   │   ├── menuPricing.ts
│   │   │   ├── overheadAllocation.ts
│   │   │   ├── healthScore.ts
│   │   │   ├── menuEngineering.ts
│   │   │   ├── profitLeakage.ts
│   │   │   ├── opportunityScore.ts
│   │   │   ├── simulator.ts
│   │   │   └── recommendations.ts
│   │   ├── auth.ts                       # NextAuth config, Credentials provider
│   │   ├── db.ts                         # Prisma client singleton
│   │   └── validation/                   # Zod schemas
│   ├── components/
│   │   ├── ui/                           # buttons, tables, cards, badges (design system)
│   │   ├── charts/
│   │   └── forms/
│   └── scripts/
│       └── create-account.ts             # admin CLI (Phase 1)
├── tests/
│   └── calc/                             # unit tests for every formula module
├── docker-compose.yml
├── .env.example
└── package.json
```

## Multi-tenancy model

Even though MVP is "one login = one restaurant," design the schema as tenant-scoped from day
one (every business table has an `accountId` foreign key) so that:
- Adding a second restaurant to the same login later is a UI change, not a schema migration.
- Adding roles (owner/manager/accountant) later doesn't require re-keying data.

See `03-data-model-and-formula-engine.md` for the full schema.

## Security baseline (MVP, no self-registration simplifies this a lot)

- Passwords: bcrypt/argon2 hashed, never stored/logged in plaintext.
- Sessions: httpOnly, secure cookies via NextAuth; short-ish session lifetime with silent renew.
- All business data endpoints check `session.accountId` against the row's `accountId` — no
  cross-tenant data leakage, enforced at the query layer (helper: `scopedPrisma(accountId)`).
- Rate-limit the login route (e.g. 5 attempts / 15 min per IP+username) even though there's no
  sign-up — credential-stuffing is still a risk against known usernames.
- HTTPS everywhere (Nginx + Let's Encrypt, or platform-managed TLS).
- Admin CLI script requires server SSH access — it is **not** exposed as a public HTTP endpoint
  in the MVP (see `04-auth-and-account-management.md` for the optional internal-admin-page
  fast-follow, gated behind a separate superadmin role).
