# Phase 4 — Sales & Inventory

## Goal
Let the owner record what actually sold (manually or via CSV) and track stock levels, so the
analytics phases have real data to work with.

## Deliverables
- `Sale` and `InventoryLevel` schema per `03-data-model-and-formula-engine.md` sections 8–9.
- `/sales` page: manual entry form (date, menu item, quantity) + a CSV import flow (upload,
  column mapping preview, validation errors shown per row before committing) + a sales log
  table with monthly filter and per-item ranking.
- `lib/calc/sales.ts`: per-sale and aggregate (grouped) gross/net profit calculations.
- `/inventory` page: current stock vs. minimum stock per ingredient, estimated inventory value,
  low-stock alert badges, quick "adjust stock" action.

## Acceptance criteria
- Manually adding a sale immediately reflects in that item's monthly sales ranking.
- A CSV with a bad row (unknown menu item name, negative quantity, malformed date) shows a
  clear per-row error and does not partially commit the file.
- Inventory page correctly flags every ingredient where `currentStock < minStock`.
- All sales/inventory data is tenant-scoped like every prior phase.

---

## PROMPT FOR CODING AGENT

```
You are implementing Phase 4 of "Restaurant CFO Web." Phases 0–3 (scaffolding, auth, core data
modules, menu pricing engine) already exist. Read /webapp-docs/03-data-model-and-formula-engine.md
sections 8 and 9 ("Sale" and "InventoryLevel") for the exact schema and formula spec.

Task: implement Sales entry (manual + CSV import) and Inventory Summary. Do NOT build Dashboard,
Health Score, Menu Engineering, Profit Leakage, or the Simulator yet — those are later phases
and will consume this phase's Sale/InventoryLevel data.

Requirements:
1. Add Sale and InventoryLevel models to prisma/schema.prisma exactly per
   /webapp-docs/03-data-model-and-formula-engine.md sections 8–9, scoped by accountId,
   referencing MenuItem and Ingredient respectively. Migrate.
2. Implement lib/calc/sales.ts: per-sale grossProfit/netProfit (reusing the pricing numbers
   from lib/calc/menuPricing.ts for the referenced MenuItem — do not duplicate margin logic),
   plus grouped aggregation helpers (by menu item, by category, by month) using Prisma groupBy
   or raw aggregation queries. Unit-test the per-sale calculation and at least one grouped
   aggregation.
3. Build the /sales page:
   a. A manual entry form: date, menu item (searchable picker), quantity, optional revenue
      override. On submit, compute and store (or compute-on-read, your choice, but be
      consistent and document it) gross/net profit.
   b. A CSV import flow: file upload (use PapaParse client-side to parse), a preview step
      showing the parsed rows with per-row validation (Zod schema: valid date, menu item name
      that resolves to an existing MenuItem for this account, positive integer quantity), and a
      commit step that only writes if ALL rows are valid — a bad row must block the whole
      import with a clear list of which rows failed and why, not a silent partial commit.
   c. A sales log table: filterable by month/date range and by menu item, with a "ranking" view
      (top-selling items by quantity and by profit for the selected period).
4. Build the /inventory page: a table of all Ingredients showing currentStock, minStock,
   estimatedValue (currentStock * realUnitCost, reusing lib/calc/ingredientCost.ts), and a
   "Reorder needed" badge when currentStock < minStock. Include a quick inline "adjust stock"
   action (e.g. set new currentStock value) that updates InventoryLevel.
5. Add a low-stock summary count/badge suitable for later reuse on the Dashboard (Phase 5) —
   expose it as an exported function (e.g. getLowStockCount(accountId)) rather than page-only
   logic, so Phase 5 can import it.
6. Ensure all queries/mutations are scoped by the session's accountId.
7. Write tests for: the per-sale profit calculation, the CSV validation logic (valid file,
   file with one bad row rejects the whole import, file with unknown menu item name), and the
   low-stock detection logic.

Run lint, typecheck, build, and the full test suite yourself and fix any failures. Report a
short summary of the CSV import's expected column format (document it clearly since owners will
need to prepare their file to match).
```
