# 04 — Auth & Account Management (Login-Only, No Self-Registration)

## Principle

There is **no sign-up flow anywhere in the product**, public or hidden. Accounts are created by
the Jolly Panda team, on the server, and credentials are handed to the restaurant owner directly.
This is a permanent MVP constraint, not a temporary shortcut — design for it cleanly rather than
building a registration system and disabling it.

## What the owner sees

- A single `/login` page: username + password fields, "Sign in" button. Nothing else.
- No "Forgot password" link in MVP (reset is handled manually by the team — see below). If this
  is confusing to owners, a short "Trouble logging in? Contact us" line linking to a support
  channel is enough; do not build self-service reset in the MVP.
- After login: straight into the dashboard for their account. No account picker (MVP is one
  account per user).

## How accounts get created

### MVP mechanism: a CLI script run on the server

`src/scripts/create-account.ts`, run via `npx tsx scripts/create-account.ts` (or `npm run
create-account`) over SSH by a Jolly Panda team member. It:

1. Prompts for (or accepts as flags): restaurant/business name, desired username.
2. Generates a strong random password (or accepts one), hashes it with bcrypt/argon2.
3. Creates the `Account` row and the `User` row (linked), and an empty `BusinessProfile` row
   pre-filled with sensible defaults (currency, target food cost %, etc. — ask interactively or
   default to common values, editable later in-app).
4. Prints the plaintext username/password **once**, to the terminal, for the operator to copy
   and send to the client. It is never stored in plaintext, never logged, never emailed
   automatically by the system in MVP.

Example CLI usage to document in the script's own `--help`:
```
npm run create-account -- --business "Golden Fork Bistro" --username goldenfork
# → generates password, prints it once, creates Account + User + default BusinessProfile
```

### Fast-follow (post-MVP, optional): internal admin page

If manually running a CLI over SSH becomes a bottleneck, a **separate, superadmin-only**
internal route (e.g. `/internal/admin`, gated by a distinct `role = SUPERADMIN` on `User`, only
ever assigned manually in the database — never selectable in any UI) can wrap the same logic in
a simple form. This is explicitly **not** part of the MVP; document it here so it's not
forgotten, but do not build it in Phase 1–8 unless requested.

## Password reset (MVP)

Manual: the team runs a `reset-password.ts` script (same pattern as `create-account.ts`) that
generates a new password for a given username and prints it once. No email-based reset flow in
MVP (there is no verified email on file, and we're deliberately not building email
infrastructure for the MVP).

## Session & security details

- **NextAuth.js, Credentials provider only.** No OAuth providers configured (there is nothing
  to "sign in with Google" into — accounts don't self-create).
- Passwords hashed with bcrypt (cost factor 12) or argon2id — pick one and use the library's
  Node bindings; never roll custom hashing.
- Session strategy: **database sessions** (not pure JWT) so a team member can force-invalidate a
  session (e.g. if the team resets a password) by deleting the session row — simple and matches
  the "we manage everything manually" operating model.
- Rate-limit `/api/auth/callback/credentials` (5 failed attempts / 15 minutes per IP+username
  combination) to blunt credential stuffing, even without public sign-up — usernames may be
  guessable (restaurant name based).
- All authenticated routes live under a route group (e.g. `app/(dashboard)/`) with a shared
  `layout.tsx` that redirects to `/login` if there is no valid session — implemented once,
  inherited everywhere, so no individual page can accidentally skip the auth check.
- Every data-access function takes `accountId` from the **server-side session**, never from a
  client-supplied parameter, to prevent tenant-boundary bugs (owner A editing owner B's data by
  tampering with a request).

## Data model additions for auth

```prisma
model User {
  id           String    @id @default(uuid())
  username     String    @unique
  passwordHash String
  role         Role      @default(OWNER)   // OWNER in MVP; SUPERADMIN reserved for future internal admin page
  accountId    String
  account      Account   @relation(fields: [accountId], references: [id])
  createdAt    DateTime  @default(now())
  lastLoginAt  DateTime?
}

enum Role {
  OWNER
  SUPERADMIN
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  expires      DateTime
}
```

## What NOT to build in the MVP

- No public `/register` or `/signup` route — do not scaffold one "just in case."
- No email verification.
- No CAPTCHA (not needed without a public sign-up surface — revisit only if login brute-forcing
  becomes an observed problem).
- No OAuth/social login.
- No self-service password reset.
- No per-restaurant multi-user roles (owner/manager/accountant) — single `OWNER` login per
  account is enough for MVP; the `role` enum exists only to make the future `SUPERADMIN`
  internal-admin fast-follow additive, not a breaking migration.
