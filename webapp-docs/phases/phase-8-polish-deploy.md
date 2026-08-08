# Phase 8 — Polish, QA & Deployment

## Goal
Take the fully-featured app from Phase 7 and make it production-ready: consistent design,
robust error/empty states, accessibility pass, and a real deployment with the admin CLI usable
against production.

## Deliverables
- A design consistency pass across every page against the design tokens from
  `02-tech-stack-and-architecture.md` (colors, radii, shadows, spacing, typography) — matching
  the "professional, modern, minimal, business-friendly, print-friendly" brief from the
  original product spec.
- Loading states, error states, and empty states audited across every page (not just the ones
  built with them originally).
- Basic accessibility pass (keyboard navigation for all forms/tables, color contrast on status
  badges, alt text on charts/icons where meaningful).
- Production deployment: Dockerized app + Postgres behind Nginx with TLS (or Vercel + managed
  Postgres, per the architecture doc's either/or) — pick one and document the actual steps
  taken, not just the option.
- Environment/secrets management documented (how `.env` is populated in production, how the
  admin CLI is run against production — e.g. `ssh` + `npm run create-account` inside the
  container, or a documented equivalent).
- Backups: at minimum, a documented (and ideally scripted/scheduled) Postgres backup strategy.
- A short internal runbook: "how to create a new account," "how to reset a password," "how to
  deploy a new version," "how to check logs," "how to restore from backup."

## Acceptance criteria
- A fresh visitor to the production URL sees only the login page — no route in the app is
  reachable without authentication except `/login` itself.
- Lighthouse (or equivalent) accessibility score is reasonable (no hard target mandated here,
  but no glaring failures like unlabeled form inputs or unreadable contrast on status badges).
- The team can create a real account on production and log in, end to end, following only the
  runbook.
- A database backup can be restored successfully in a test (documented as a runbook step and
  actually exercised once).

---

## PROMPT FOR CODING AGENT

```
You are implementing Phase 8, the final phase, of "Restaurant CFO Web." Phases 0–7 already
exist and are feature-complete. Read /webapp-docs/02-tech-stack-and-architecture.md (hosting
section) and /webapp-docs/01-product-vision-and-scope.md (success criteria) before starting.

Task: harden the app for production and ship it. Do not add new business features — this phase
is entirely about consistency, robustness, and deployment.

Requirements:
1. Do a design-consistency sweep across every page built in Phases 1–7: confirm consistent use
   of the Tailwind design tokens (colors, radii, shadows, spacing, type scale) established in
   Phase 0. Fix any page that visibly diverges (inconsistent card styles, button variants,
   spacing rhythm, etc.).
2. Audit every page for three states: loading (skeleton or spinner, not a blank flash),
   error (a clear message + retry action, not an unhandled exception page), and empty (a
   helpful message + next-step CTA, not a bare empty table) — fix any page missing one of these.
3. Run an accessibility pass: every form input has an associated label, every icon-only button
   has an aria-label, color is never the only signal for status (add text/icon alongside
   status-badge colors), and keyboard navigation works through every data-entry table and form
   without a mouse. Fix issues found.
4. Prepare production deployment. Choose ONE of the two hosting options from
   /webapp-docs/02-tech-stack-and-architecture.md:
   a. VPS path: finalize docker-compose.yml for production (app + Postgres), add an Nginx
      reverse-proxy config with TLS (Let's Encrypt/certbot), and document the exact deploy
      steps (build, push/pull, migrate, restart).
   b. Vercel + managed Postgres path: document environment variable setup, connection pooling
      considerations for serverless (e.g. Prisma + PgBouncer or a pooled connection string),
      and the deploy process.
   Implement and document whichever path is chosen; do not leave both half-done.
5. Confirm zero authenticated routes are reachable without a valid session in production
   (write or extend an integration test hitting every route under (dashboard) while logged out
   and asserting a redirect to /login).
6. Write a short internal runbook (RUNBOOK.md at the project root) covering: creating a new
   account (exact CLI command), resetting a password (exact CLI command), deploying a new
   version, viewing logs, and restoring from a database backup.
7. Set up a Postgres backup strategy appropriate to the chosen hosting path (e.g. a scheduled
   pg_dump to object storage, or the managed provider's built-in backups) and document/verify
   it in the runbook — actually perform one backup-and-restore cycle in a non-production
   environment and note the result in RUNBOOK.md.

Run lint, typecheck, build, and the full test suite yourself and fix any failures. Report the
final production URL structure, the chosen hosting path, and a summary of the runbook.
```
