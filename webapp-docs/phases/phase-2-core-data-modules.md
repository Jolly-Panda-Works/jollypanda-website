# Phase 2 — Core Data Modules

## Goal
Full CRUD for the five data-entry worksheets that every downstream calculation depends on:
Business Profile, Ingredients, Recipes, Packaging, Operating Expenses.

## Deliverables
- Full Prisma schema for `BusinessProfile`, `Ingredient`, `Recipe`, `RecipeIngredient`,
  `PackagingItem`, `OperatingExpense` per `03-data-model-and-formula-engine.md`, migrated.
- `/business-profile` page: single-record edit form (all fields from the spec), Zod-validated.
- `/ingredients` page: table (Excel-Table-like: sortable, filterable by category/supplier),
  add/edit/delete, showing computed `realUnitCost`/`costPerGram`/`costPerPiece`/`costPerLiter`
  live as the user types (client-side preview using the same calc function used server-side).
- `/recipes` page: recipe list + a recipe editor where you add ingredient lines (searchable
  ingredient picker), see live recipe cost total as you build it.
- `/packaging` page: packaging items CRUD (name, type, unit cost).
- `/expenses` page: operating expense line items CRUD by category, with a running
  monthly/daily/per-order overhead summary shown on the same page.
- All forms use shared Zod schemas (client validation = server validation, single source).
- Empty states for every list (helpful copy + a clear "add your first X" CTA, not a blank table).

## Acceptance criteria
- An admin-created, freshly logged-in account can fill in a business profile, add ingredients,
  build a recipe, add packaging, and add operating expenses — entirely through the UI, no DB
  access needed.
- All computed fields (unit costs, recipe cost total, overhead cascade) match the formulas in
  `03-data-model-and-formula-engine.md` exactly — covered by unit tests.
- Every table/form respects tenant scoping (verified by a test: user from Account A cannot see
  or mutate Account B's ingredients/recipes/etc.).

---

## PROMPT FOR CODING AGENT

```
You are implementing Phase 2 of "Restaurant CFO Web." Phases 0–1 (scaffolding, auth) already
exist in this repo. Read /webapp-docs/03-data-model-and-formula-engine.md carefully — sections
2–6 (BusinessProfile, Ingredient, Recipe, PackagingItem, OperatingExpense) are the exact spec
for this phase's schema and formulas. Also read
/webapp-docs/02-tech-stack-and-architecture.md for the calculation-engine location convention
(lib/calc/*.ts, pure functions, unit-tested).

Task: implement full CRUD for the five foundational data modules. Do NOT build Menu Pricing,
Sales, Dashboard, or any analytics yet — those are later phases and depend on this one.

Requirements:
1. Extend prisma/schema.prisma with BusinessProfile, Ingredient, Recipe, RecipeIngredient,
   PackagingItem, and OperatingExpense models, with every field listed in
   /webapp-docs/03-data-model-and-formula-engine.md, all money/quantity fields as Decimal, all
   business tables scoped by accountId FK to Account. Generate and apply the migration.
2. Implement lib/calc/ingredientCost.ts and lib/calc/recipeCost.ts as pure, unit-tested
   TypeScript functions implementing exactly the formulas from
   /webapp-docs/03-data-model-and-formula-engine.md sections 3 and 4 (realUnitCost, costPerGram/
   Piece/Liter, recipeCost). Write unit tests covering normal cases, zero-waste/zero-yield edge
   cases, and unit conversions.
3. Implement lib/calc/overheadAllocation.ts per section 6 (monthlyOverhead → dailyOverhead →
   costPerOrder), unit-tested.
4. Build the /business-profile page as a single-record form (create-if-missing, then edit),
   Zod-validated, using Server Actions for the mutation.
5. Build the /ingredients page: a data table (add/edit/delete, sort, filter by category and
   supplier) using Zod-validated forms. As the user edits purchase price/package size/waste %/
   yield %, show the computed real unit cost and per-gram/piece/liter costs live, using the
   SAME calc function from lib/calc/ingredientCost.ts (call it from a Server Action on
   change/blur, or mirror it client-side from a shared module — do not duplicate the formula).
6. Build the /recipes page: list + editor. The editor lets the user name the recipe, pick a
   category, and add ingredient lines via a searchable picker (search by ingredient name),
   each line showing quantity, unit, and computed line cost; show a running recipe cost total
   using lib/calc/recipeCost.ts.
7. Build the /packaging page: simple CRUD table for packaging items (name, type enum, unit
   cost).
8. Build the /expenses page: CRUD table of operating expense lines grouped/filterable by
   category, with a summary panel showing monthlyOverhead, dailyOverhead, and costPerOrder
   computed via lib/calc/overheadAllocation.ts (which needs BusinessProfile's workingDays and
   avgDailyOrders — read them from the account's BusinessProfile).
9. Every query and mutation must scope by the accountId from the server session (use the
   helper from Phase 1) — never trust a client-supplied accountId. Add a test that confirms
   cross-tenant access is impossible (create two accounts, verify account A's session cannot
   read/write account B's ingredients).
10. Add empty-state UI for every list page (clear "add your first ingredient/recipe/..." CTA
    with a one-line explanation of why it matters), matching the "business-friendly, minimal"
    design direction from /webapp-docs/01-product-vision-and-scope.md and
    /webapp-docs/02-tech-stack-and-architecture.md.

Run lint, typecheck, build, and the full test suite yourself and fix any failures before
finishing. Report which pages are now functional and any formula edge cases you had to make a
judgment call on.
```
