# Phase 3 — Pricing Engine & Menu Pricing

## Goal
The core "virtual CFO" calculation engine: turn a recipe + packaging + overhead + a selling
price into full cost/margin/status breakdown for every menu item. This is the single most
important phase — almost everything in Phases 5–7 consumes its output.

## Deliverables
- `MenuItem` + `MenuItemPackaging` schema per `03-data-model-and-formula-engine.md` section 7.
- `lib/calc/menuPricing.ts`: pure, unit-tested function(s) implementing the full formula
  cascade (recipeCost → totalCost → grossProfit/Margin → netProfit/Margin → foodCostPct →
  markupPct → breakEvenPrice → recommendedPrice → priceGap → profitStatus).
- `classifyProfitStatus` as a separate, documented, config-driven function (thresholds not
  hard-coded inline).
- `/menu-pricing` page: table of all menu items with every computed column from the spec,
  color-coded profit status badges (Excellent/Healthy/NeedsReview/LowMargin/LosingMoney),
  sortable/filterable, add/edit menu item form (pick recipe, attach packaging items, set
  selling price, optional overrides for labor cost/delivery commission/target price).
- Inline "why" affordance: clicking a menu item's status badge shows a short breakdown of which
  numbers drove that status (traceability requirement from the product vision doc).

## Acceptance criteria
- Every computed column matches the formulas in `03-data-model-and-formula-engine.md` section 7
  exactly, verified by unit tests covering: healthy item, losing-money item, break-even item,
  and an item with a labor cost override.
- Changing an ingredient's purchase price and revisiting `/menu-pricing` reflects the new cost
  everywhere it should (recipe cost → menu item cost → margins → status) with no stale values.
- Profit status thresholds live in one named config object, not scattered magic numbers.

---

## PROMPT FOR CODING AGENT

```
You are implementing Phase 3 of "Restaurant CFO Web." Phases 0–2 (scaffolding, auth, core data
modules — BusinessProfile, Ingredient, Recipe, PackagingItem, OperatingExpense with their calc
functions) already exist in this repo. Read /webapp-docs/03-data-model-and-formula-engine.md
section 7 ("MenuItem — replaces: Menu Pricing worksheet") very carefully — it is the exact
formula spec for this phase. Do not invent or simplify any formula; if something is ambiguous,
make the most literal translation of the Excel logic described and leave a comment explaining
the choice.

Task: build the menu pricing calculation engine and its UI. Do NOT build Sales, Dashboard,
Health Score, or any other analytics yet — those are later phases that will import and reuse
this phase's calc functions.

Requirements:
1. Add MenuItem and MenuItemPackaging models to prisma/schema.prisma exactly per
   /webapp-docs/03-data-model-and-formula-engine.md section 7 and section 5 (packaging join),
   scoped by accountId, referencing Recipe and PackagingItem. Migrate.
2. Implement lib/calc/menuPricing.ts as a pure function `computeMenuItemPricing(menuItem,
   recipe, recipeIngredients, ingredients, packagingLines, packagingItems, operatingExpenses,
   businessProfile)` (or a sensibly decomposed set of functions) that returns an object with
   every field listed in the spec: recipeCost, packagingCost, laborCost, allocatedOverhead,
   vatAmount, totalCost, deliveryFee, grossProfit, grossMarginPct, netProfit, netMarginPct,
   foodCostPct, markupPct, breakEvenPrice, recommendedPrice, priceGap, profitStatus. Reuse
   lib/calc/recipeCost.ts, lib/calc/ingredientCost.ts, and lib/calc/overheadAllocation.ts from
   Phase 2 rather than re-implementing their logic.
3. Implement classifyProfitStatus(foodCostPct, netMarginPct, businessProfile) in its own
   function with a clearly named, exported config object for the thresholds (e.g.
   PROFIT_STATUS_THRESHOLDS), documented with a comment explaining each band, matching the
   Excellent/Healthy/NeedsReview/LowMargin/LosingMoney bands from the spec.
4. Write a thorough unit test suite for lib/calc/menuPricing.ts covering: a clearly healthy
   item, a clearly losing-money item, a break-even edge case, an item using laborCostOverride,
   an item with 0% delivery commission vs. a nonzero one, and an item whose recommendedPrice is
   below its current sellingPrice (negative priceGap) vs. above it (positive priceGap).
5. Build the /menu-pricing page: a table listing every MenuItem for the account with columns
   for selling price, total cost, gross margin %, net margin %, food cost %, and a color-coded
   profit status badge (define a small, reusable Badge component with a color per status).
   Support sorting and filtering by category and by profit status.
6. Build the add/edit MenuItem form: name, category, recipe picker (searchable, from existing
   Recipes), packaging picker (multi-select existing PackagingItems with quantity per item),
   selling price, and optional overrides (labor cost, delivery commission %, target price).
   Show a live computed preview of the full pricing breakdown as the user fills the form in,
   using the same computeMenuItemPricing function (via a Server Action).
7. Add a small "why this status" popover/panel on each status badge that lists the 3–4 numbers
   that most influenced the classification (e.g. "Food cost 38% vs target 30%; Net margin 4%
   vs target 15%") — plain language, no jargon.
8. Confirm recomputation correctness: write an integration test that changes an Ingredient's
   purchasePrice, re-fetches a MenuItem's pricing, and asserts the new recipeCost/totalCost/
   margins reflect the change with no caching/staleness.
9. Ensure all queries/mutations are scoped by the session's accountId (per the Phase 1 helper).

Run lint, typecheck, build, and the full test suite yourself and fix any failures. Report a
short summary of the final formula implementation and any thresholds you chose for
classifyProfitStatus.
```
