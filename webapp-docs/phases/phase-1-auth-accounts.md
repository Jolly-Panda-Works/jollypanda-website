# Phase 1 — Auth & Account Provisioning

## Goal
A working login-only auth system, plus the admin CLI script that creates accounts on the
server. After this phase, a team member can create a restaurant's login from the terminal, and
that owner can log in to an empty dashboard shell.

## Deliverables
- NextAuth.js configured with Credentials provider only, database sessions, bcrypt/argon2
  password hashing — exactly as specified in `04-auth-and-account-management.md`.
- `/login` page: username + password, error states (wrong credentials, rate-limited).
- Rate limiting on the credentials callback (5 attempts / 15 min per IP+username).
- Auth-guarded route group `(dashboard)` with a shared layout that redirects unauthenticated
  users to `/login`, and shows a minimal nav shell (logo, business name, logout button) once
  authenticated — pages behind it can be placeholders for now (filled in Phase 2+).
- `scripts/create-account.ts` CLI: creates `Account` + `User` + a default `BusinessProfile` row
  (BusinessProfile model itself comes from Phase 2's schema additions — if not yet present,
  create the minimal fields needed now and let Phase 2 extend it), prints credentials once.
- `scripts/reset-password.ts` CLI: same pattern, for password resets.
- Every authenticated data-access helper reads `accountId` only from the server session.

## Acceptance criteria
- Visiting any `(dashboard)` route while logged out redirects to `/login`.
- Running the CLI script creates a real, working login.
- Logging in with wrong credentials 6 times in a row gets rate-limited with a clear message.
- No `/register` route exists; grep the codebase to confirm.
- Session persists across page reloads; logout actually invalidates the session (verify by
  checking the `Session` table row is deleted/expired).

---

## PROMPT FOR CODING AGENT

```
You are implementing Phase 1 of "Restaurant CFO Web." Phase 0's scaffolding already exists in
this repo. Read /webapp-docs/04-auth-and-account-management.md carefully — it is the exact spec
for this phase. Also skim /webapp-docs/01-product-vision-and-scope.md for the "access model"
context (no self-registration, ever).

Task: implement login-only authentication and the admin account-provisioning CLI. No business
features (ingredients, recipes, etc.) yet.

Requirements:
1. Configure NextAuth.js (Auth.js) with ONLY a Credentials provider. Use database sessions
   (Prisma adapter), not JWT-only sessions. Hash passwords with bcrypt (cost factor 12) or
   argon2id — your choice, but be consistent and document which in a code comment.
2. Build the /login page: username + password fields, clear error messages for invalid
   credentials and for rate-limiting, no "forgot password" link, no "create account" link
   anywhere on the page or in any layout.
3. Implement rate limiting on the login/credentials callback: 5 failed attempts per
   IP+username pair within 15 minutes, then a clear "too many attempts, try again later"
   response. Implement this with a simple in-memory or DB-backed counter — do not add a new
   external dependency (e.g. Redis) for this in the MVP.
4. Create an app/(dashboard)/layout.tsx that: checks for a valid session server-side, redirects
   to /login if absent, and otherwise renders a minimal shell (top bar with business name from
   BusinessProfile if it exists yet, else Account.name, and a logout button) wrapping a
   {children} slot. Add placeholder pages for every route listed in
   /webapp-docs/02-tech-stack-and-architecture.md's project structure (dashboard, ingredients,
   recipes, etc.) that just render "Coming soon" — these get built out in later phases.
5. Write src/scripts/create-account.ts as a CLI (runnable via `npm run create-account -- --business
   "Name" --username someuser`): generates a strong random password if not provided, hashes it,
   creates Account + User (role OWNER) + a minimal BusinessProfile stub row, and prints the
   username/password to stdout ONCE with a clear "save this now, it will not be shown again"
   warning. Never log the plaintext password anywhere else.
6. Write src/scripts/reset-password.ts as a CLI (`npm run reset-password -- --username someuser`):
   generates a new password, updates the hash, invalidates existing sessions for that user,
   prints the new password once.
7. Add helper lib/getSessionAccountId.ts (or similar) that every future data-access function
   will use to scope queries — throws if called without a valid session. Later phases must use
   this helper rather than trusting any client-supplied accountId.
8. Confirm via a grep/search that no /register, /signup, or similar route/component/API exists
   anywhere in the repo — if you find any leftover scaffolding from Phase 0, remove it.
9. Add tests: rate limiter behavior, password hashing/verification, and that the CLI script
   creates a row with a hashed (not plaintext) password.

Run lint, typecheck, build, and tests yourself and fix any failures. Report how to run the CLI
scripts and log in locally after this phase.
```
