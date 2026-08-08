# Phase 0 — Project Setup & Foundations

## Goal
A deployable, empty Next.js app with the full toolchain wired up, so every later phase is just
"add features," never "fix the build."

## Deliverables
- Next.js 14+ (App Router) + TypeScript project, Tailwind configured with a small design-token
  file (colors, radii, shadows) reflecting "professional, modern, minimal" per the product brief.
- PostgreSQL running locally via Docker Compose; Prisma initialized with an empty schema plus
  the `Account`/`User`/`Session` models from `04-auth-and-account-management.md`.
- ESLint + Prettier + strict TypeScript config.
- Vitest (or Jest) configured, with one placeholder test passing.
- `.env.example` documenting every required environment variable (`DATABASE_URL`,
  `NEXTAUTH_SECRET`, etc.).
- A basic CI workflow (GitHub Actions or equivalent) running lint + typecheck + tests on push.
- `README.md` in the new repo (separate from this docs set) with local setup instructions.
- App boots (`npm run dev`) and shows a placeholder home page.

## Acceptance criteria
- `npm run build` succeeds with zero TypeScript errors.
- `npm test` passes.
- `docker compose up` brings up Postgres; `npx prisma migrate dev` applies the initial schema
  cleanly.
- No sign-up/register routes exist anywhere in the codebase.

---

## PROMPT FOR CODING AGENT

```
You are setting up Phase 0 of "Restaurant CFO Web" — a Next.js financial toolkit for
restaurants. Read /webapp-docs/00-README.md, /webapp-docs/01-product-vision-and-scope.md,
/webapp-docs/02-tech-stack-and-architecture.md, and /webapp-docs/04-auth-and-account-management.md
in this repo before writing any code — they define the exact stack and constraints.

Task: scaffold the project foundation only. Do NOT build any business features yet (no
ingredients, recipes, menu pricing, dashboard, etc.) — those come in later phases.

Requirements:
1. Initialize a Next.js 14+ App Router project with TypeScript and Tailwind CSS.
2. Set up Prisma with PostgreSQL. Create ONLY the Account, User, Session, and Role enum models
   exactly as specified in /webapp-docs/04-auth-and-account-management.md. Generate and apply
   an initial migration.
3. Add a docker-compose.yml that runs a local Postgres instance suitable for development.
4. Configure ESLint, Prettier, and strict TypeScript (noImplicitAny, strict: true).
5. Set up Vitest with one passing placeholder test under /tests.
6. Create .env.example listing DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, and any other
   variables you introduce — with comments explaining each.
7. Add a minimal GitHub Actions workflow that runs `npm run lint`, `npm run typecheck`, and
   `npm test` on every push.
8. Create the project folder structure exactly as shown in
   /webapp-docs/02-tech-stack-and-architecture.md under "Project structure (proposed)" —
   create the empty directories/placeholder files even for things you're not implementing yet
   (e.g. empty lib/calc/*.ts files with a TODO comment and a phase reference), so later phases
   have a consistent structure to fill in.
9. Home page (`/`) should be a simple placeholder that just redirects to /login (login page
   itself is Phase 1 — for now a stub page is fine).
10. Do NOT create any /register or /signup route, form, or API endpoint. This product has no
    self-service registration, ever — see /webapp-docs/04-auth-and-account-management.md.
11. Write a project-root README.md with local dev setup instructions (docker compose up, prisma
    migrate, npm run dev).

When done, run the build, lint, typecheck, and test commands yourself and fix any failures
before finishing. Report a short summary of what was created and how to run it locally.
```
