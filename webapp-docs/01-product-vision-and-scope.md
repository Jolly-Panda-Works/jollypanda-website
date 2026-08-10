# 01 — Product Vision & Scope

## Product identity

**Restaurant CFO Web** is the web-based evolution of the Restaurant CFO Excel toolkit. It keeps
the same mission: help restaurant owners see where they make and lose money, and tell them what
to do about it. It replaces spreadsheet mechanics (Tables, XLOOKUP, LET, FILTER) with a real
database and a server-side calculation engine, exposed through a clean web dashboard.

It should still feel like **a virtual CFO**, not a data-entry tool. Every screen that shows a
number should also be able to say *why it matters* and *what to do next*.

## Who uses it

Same target users as the Excel product:

- Independent restaurants, cafés, coffee shops
- Fast food, pizza, burger shops
- Cloud kitchens
- Small restaurant chains (2–10 locations) — see multi-location note below
- Businesses with no ERP / accounting software

## Access model (important — drives the whole architecture)

There is **no self-service sign-up**. This is a deliberate product decision for the MVP:

- The Jolly Panda team creates an account manually on the server (via a CLI script or an
  internal admin-only page — see `04-auth-and-account-management.md`).
- The owner receives a **username + password** out of band (email/WhatsApp/etc.).
- The web app exposes **only a login screen**. There is no "Create account" link anywhere in
  the public-facing UI.
- Password reset in the MVP is also manual (the team resets it on request) — self-service
  "forgot password" is a documented fast-follow, not MVP.

This shapes the architecture: we do not need public registration flows, email verification,
CAPTCHA, or anti-abuse sign-up protection in the MVP. We do need a **secure, low-friction way
for the internal team to create/manage accounts** (Phase 1).

## Core value loop (must work end-to-end for MVP)

1. Owner logs in.
2. Owner enters/edits: business profile, ingredients, recipes, packaging, operating expenses.
3. System computes: recipe cost → menu item total cost → pricing → margins → food cost % →
   profit status, automatically, for every menu item.
4. Owner records sales (manually, or via CSV import in a later phase).
5. Dashboard shows: revenue, profit, health score, menu engineering quadrant, profit leakage,
   and 3–5 concrete recommendations.
6. Owner can export a printable Executive Report (PDF).

If steps 1–6 work end-to-end, the MVP is viable even before every worksheet from the Excel spec
is ported.

## MVP scope (in / out)

**In scope for MVP (Phases 0–7):**
- Login-only auth, admin-provisioned users
- Business Profile
- Ingredients Database (with cost breakdown: per gram / per piece / per liter)
- Recipe Builder
- Packaging (linked to menu items)
- Operating Expenses + overhead allocation
- Menu Pricing engine with automatic profit status
- Sales entry (manual + CSV import)
- Inventory summary (stock levels, reorder alerts)
- Dashboard with KPIs and charts
- Restaurant Health Score (0–100)
- Menu Engineering (Star/Plow Horse/Puzzle/Dog)
- Profit Leakage detector
- Opportunity Score
- Scenario Simulator (what-if sliders)
- Recommendations engine (rule-based, human-readable)
- Executive Report (print-friendly + PDF export)
- One account = one restaurant (single-tenant-per-account) in MVP

**Out of scope for MVP (future phases, not blocking launch):**
- Multi-location / multi-restaurant per account (schema should not block this later — see
  `03-data-model-and-formula-engine.md`)
- Self-service sign-up and payment/billing
- POS integrations (Square, Toast, etc.) — CSV import is the MVP substitute
- Native mobile apps
- Multi-language UI (Persian/RTL) — the marketing/landing page is already bilingual
  (English/Persian toggle, matching jollypanda.ir); build the app's schema and copy layer so a
  matching in-app bilingual toggle is easy to add later, but ship the app itself English-only
  first
- Role-based multi-user access per restaurant (owner + manager + accountant) — MVP is
  one login = one restaurant, full access

## Success criteria for the MVP

- An admin can create a working login for a new restaurant in under 5 minutes.
- A restaurant owner with no accounting background can, unaided, get from "empty account" to
  "sees their health score and top 3 recommendations" in under 30 minutes.
- Every number on the dashboard is traceable back to an editable input (no magic numbers).
- The Executive Report looks credible enough to hand to a business partner or lender.

## Relationship to the Excel product

The Excel version remains the current shippable product and the **source of truth for the
financial formulas**. The web app is a re-platforming, not a redesign of the financial logic —
`03-data-model-and-formula-engine.md` maps each Excel worksheet's formulas to the equivalent
backend logic so nothing gets lost in translation.
