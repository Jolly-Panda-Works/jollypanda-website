# 03 — Data Model & Formula Engine

This document maps every worksheet from the original Excel spec to (a) a database table and
(b) the backend calculation logic that replaces the Excel formula. Nothing in the financial
logic changes — only where it lives.

## Design rules

- Money and quantities: `Decimal` (Prisma `Decimal` / Postgres `NUMERIC(14,4)`), never
  floating point.
- Every business table has `accountId` (tenant scope) and `createdAt`/`updatedAt`.
- Derived/calculated values (recipe cost, margins, health score, etc.) are **not** stored as
  static columns where avoidable — they are computed on read by the calculation engine, so they
  are never stale. Where a computed value is expensive (e.g. full dashboard aggregation), cache
  it in a `*_snapshot` table refreshed on relevant writes (see "Caching strategy" below).
- IDs: UUID.

## Entity overview (simplified ER)

```
Account (tenant)
 └─ User (login, 1:1 with Account in MVP)
 └─ BusinessProfile (1:1)
 └─ Ingredient (many)
 └─ Recipe (many) ─── RecipeIngredient (many, join table with quantity)
 └─ PackagingItem (many)
 └─ MenuItem (many) ─┬─ references one Recipe
                      ├─ MenuItemPackaging (join table)
                      └─ pricing fields (selling price, overrides)
 └─ OperatingExpense (many)
 └─ Sale (many) ─── references MenuItem, has date + quantity
 └─ InventoryLevel (1:1 per Ingredient, current/min stock)
```

## Table-by-table mapping

### 1. `Account` / `User` — replaces: (new, no Excel equivalent)
Holds tenant identity and login credentials. See `04-auth-and-account-management.md` for full
field list. One `Account` = one restaurant in MVP; `User.accountId` is nullable-false FK.

### 2. `BusinessProfile` — replaces: **Business Profile** worksheet
Fields: `businessName`, `currency`, `vatRate`, `workingDaysPerWeek`, `targetFoodCostPct`,
`targetGrossMarginPct`, `targetNetMarginPct`, `targetMonthlyProfit`, `expectedMonthlyRevenue`,
`avgDailyOrders`, `avgTicketSize`.

No formulas here — this is the input/config table that every other calculation reads targets
from (via `getBusinessProfile(accountId)`).

### 3. `Ingredient` — replaces: **Ingredients Database** worksheet
Fields: `name`, `category`, `supplier`, `purchaseUnit`, `packageSize`, `purchasePrice`,
`wastePct`, `yieldPct`, `currentStock`, `minStock`, `lastPurchaseDate`, `notes`.

Computed (in `lib/calc/ingredientCost.ts`, not stored):
```
realUnitCost = purchasePrice / packageSize / (yieldPct/100) * (1 + wastePct/100)
costPerGram  = realUnitCost / gramsPerPurchaseUnit   // unit-conversion table, see below
costPerPiece = realUnitCost / piecesPerPurchaseUnit
costPerLiter = realUnitCost / litersPerPurchaseUnit
```
This is a direct translation of the Excel "Real Unit Cost" column, which itself is
`purchasePrice / packageSize`, adjusted for waste and yield. A small `unitConversion.ts` helper
holds the same unit table Excel used (g/kg/ml/l/oz/lb/piece) via `LET`-equivalent named
constants.

### 4. `Recipe` + `RecipeIngredient` — replaces: **Recipe Builder** worksheet
`Recipe`: `name`, `category`, `portionWeight`, `servingSize`, `notes`.
`RecipeIngredient`: `recipeId`, `ingredientId`, `quantity`, `unit`.

Computed (`lib/calc/recipeCost.ts`):
```
ingredientLineCost(ri) = ri.quantity * ingredient.costPer<Unit>
recipeCost(recipe)     = SUM(ingredientLineCost) over all RecipeIngredient rows for that recipe
```
Direct equivalent of the Excel `SUMIFS`/`XLOOKUP` combination used to pull each ingredient's
unit cost into the recipe line and sum it.

### 5. `PackagingItem` + `MenuItemPackaging` — replaces: **Packaging** worksheet
`PackagingItem`: `name`, `type` (container/box/bag/napkin/fork/knife/sauce/label/delivery),
`unitCost`.
`MenuItemPackaging`: join table `menuItemId` ↔ `packagingItemId` with `quantity`.

Computed: `packagingCost(menuItem) = SUM(quantity * unitCost)` over its `MenuItemPackaging` rows.

### 6. `OperatingExpense` — replaces: **Operating Expenses** worksheet
Fields: `category` (rent/electricity/gas/water/internet/insurance/cleaning/marketing/software/
equipment/salaries/taxes/deliveryFees/misc), `monthlyAmount`.

Computed (`lib/calc/overheadAllocation.ts`):
```
monthlyOverhead   = SUM(monthlyAmount)
dailyOverhead     = monthlyOverhead / businessProfile.workingDaysPerMonth
costPerOrder      = dailyOverhead / businessProfile.avgDailyOrders
allocatedOverhead(menuItem) = costPerOrder   // flat allocation in MVP;
                                              // documented upgrade path: allocate by revenue
                                              // share or by prep-time share, Phase 6+
```
This mirrors the Excel worksheet's automatic Monthly → Daily → Per-Order → Per-Item cascade.

### 7. `MenuItem` — replaces: **Menu Pricing** worksheet
Fields: `name`, `category`, `recipeId`, `laborCostOverride` (nullable), `deliveryCommissionPct`,
`sellingPrice`, `targetPriceOverride` (nullable).

Computed (`lib/calc/menuPricing.ts`) — this is the core engine, direct port of the Excel sheet:
```
recipeCost        = recipeCost(recipe)                       // from #4
packagingCost      = packagingCost(menuItem)                  // from #5
laborCost           = laborCostOverride ?? defaultLaborCost()  // config-driven default
allocatedOverhead   = allocatedOverhead(menuItem)              // from #6
vatAmount           = sellingPrice * businessProfile.vatRate
totalCost           = recipeCost + packagingCost + laborCost + allocatedOverhead
deliveryFee         = sellingPrice * deliveryCommissionPct
grossProfit         = sellingPrice - recipeCost - packagingCost
grossMarginPct      = grossProfit / sellingPrice
netProfit           = sellingPrice - totalCost - deliveryFee - vatAmount
netMarginPct        = netProfit / sellingPrice
foodCostPct         = recipeCost / sellingPrice
markupPct           = (sellingPrice - totalCost) / totalCost
breakEvenPrice       = totalCost + deliveryFee + vatAmount
recommendedPrice    = totalCost / (1 - businessProfile.targetFoodCostPct)
priceGap            = sellingPrice - recommendedPrice
profitStatus        = classifyProfitStatus(foodCostPct, netMarginPct)  // see below
```
`classifyProfitStatus` mirrors the Excel nested-IF/status logic:
```
Excellent    if netMarginPct >= target + buffer AND foodCostPct <= target
Healthy      if netMarginPct >= target AND foodCostPct <= target + smallBuffer
NeedsReview  if netMarginPct is within a small band below target
LowMargin    if netMarginPct > 0 but meaningfully below target
LosingMoney  if netMarginPct <= 0
```
Thresholds are configurable constants (documented in the module, not hard-coded magic numbers)
so an admin can tune them per account later without a code change.

### 8. `Sale` — replaces: **Sales** worksheet
Fields: `date`, `menuItemId`, `quantity`, `revenueOverride` (nullable — defaults to
`quantity * menuItem.sellingPrice`).

Computed (`lib/calc/sales.ts`):
```
grossProfit(sale) = quantity * (sellingPrice - recipeCost - packagingCost)
netProfit(sale)    = quantity * netProfitPerUnit(menuItem)
```
Monthly/ranking aggregations are plain SQL `GROUP BY` queries (Prisma `groupBy`), replacing the
Excel `SUMIFS`/ranking formulas.

### 9. `InventoryLevel` — replaces: **Inventory Summary** worksheet
1:1 with `Ingredient` (or could be inlined into `Ingredient` — kept separate for clarity since
it changes at a different cadence than ingredient master data).
Fields: `currentStock`, `minStock`, `estimatedValue` (computed = `currentStock * realUnitCost`).
`reorderNeeded = currentStock < minStock` — a simple boolean flag driving the "Low Stock Alert"
badge and dashboard count.

### 10. Dashboard — replaces: **Dashboard** worksheet
Not a table — an aggregation layer (`lib/calc/dashboard.ts`) that composes: total revenue
(from Sales), gross/net profit, average food cost %, average margin, most/least profitable item
(from Menu Pricing + Sales), highest-cost ingredient, most expensive recipe, average profit per
sale, monthly estimated profit (projected from current run-rate). Powers the KPI cards and
charts (Revenue by Category, Profit by Category, Top/Bottom 10 items) via Recharts.

### 11. Restaurant Health Score — replaces: **Restaurant Health Score** worksheet
`lib/calc/healthScore.ts` — weighted scoring function, 0–100, same factor list as the Excel
sheet (food cost, net margin, gross margin, waste, packaging cost, overhead, profitability,
pricing accuracy, inventory health, low-margin item count). Each factor is normalized to 0–100
and combined with documented weights (a config object, not magic numbers buried in code) so the
weighting can be tuned without touching calculation logic. Maps to the same 5 performance bands
(Excellent 90–100 → Critical 0–39).

### 12. Menu Engineering — replaces: **Menu Engineering** worksheet
`lib/calc/menuEngineering.ts` — classifies every `MenuItem` into Star/Plow Horse/Puzzle/Dog
using popularity (sales volume, relative to menu average) × profitability (net margin, relative
to menu average) — the same two-axis logic as the Excel quadrant, rendered as a scatter/quadrant
chart. Each quadrant carries a rule-based recommendation string.

### 13. Profit Leakage — replaces: **Profit Leakage** worksheet
`lib/calc/profitLeakage.ts` — a rules engine that scans all menu items/ingredients/expenses for
the same leakage patterns as the Excel sheet (high food cost, large waste %, expensive supplier
vs. category average, high packaging cost relative to price, mispriced items, large delivery
fees, high overhead share) and estimates a monthly $ loss per issue, summed into a total.

### 14. Opportunity Score — replaces: **Opportunity Score** worksheet
`lib/calc/opportunityScore.ts` — derives an overall improvement score plus estimated
monthly/annual profit increase, from the gap between current state and each item's
`recommendedPrice`/target margins, combined with the Profit Leakage total.

### 15. Scenario Simulator — replaces: **Scenario Simulator** worksheet
Not persisted — a pure client-driven recompute. The frontend widget calls the same
`menuPricing`/`dashboard` calculation functions with modified inputs (e.g. all ingredient
prices × 1.10, rent × 1.05) via a Server Action, and displays the delta. No database writes;
this is the direct equivalent of Excel's live recalculation, just server-computed instead of
formula-computed.

### 16. Recommendations — replaces: **Recommendations** worksheet
`lib/calc/recommendations.ts` — composes output from Menu Pricing (price gaps), Profit Leakage,
and Menu Engineering into a ranked, human-readable list ("Increase Pizza price by 11%", "Reduce
cheese portion in Recipe X", etc.), same rule templates as the Excel sheet.

### 17. Executive Report — replaces: **Executive Report** worksheet
A server-rendered page (`app/(dashboard)/report/page.tsx`) that composes Business Summary,
Health Score, Opportunity Score, Profit Leakage, Top Opportunities, Critical Problems, and a
Monthly Action Plan into one print-friendly layout, exported to PDF (Phase 7).

## Caching strategy

Per-menu-item pricing and per-account dashboard aggregates are cheap enough to compute on every
request for MVP scale (a single restaurant has dozens, not millions, of menu items/sales rows).
No caching layer in the MVP. If/when this becomes a real SaaS with larger accounts, add a
`dashboard_snapshot` table refreshed via a Postgres trigger or a nightly job — **not** needed for
MVP and explicitly deferred to keep the system simple.

## Prisma schema skeleton (starting point for Phase 1)

```prisma
model Account {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  users     User[]
  profile   BusinessProfile?
  ingredients Ingredient[]
  recipes     Recipe[]
  packagingItems PackagingItem[]
  menuItems   MenuItem[]
  expenses    OperatingExpense[]
  sales       Sale[]
}

model User {
  id           String   @id @default(uuid())
  username     String   @unique
  passwordHash String
  accountId    String
  account      Account  @relation(fields: [accountId], references: [id])
  createdAt    DateTime @default(now())
  lastLoginAt  DateTime?
}

// ... BusinessProfile, Ingredient, Recipe, RecipeIngredient, PackagingItem,
//     MenuItem, MenuItemPackaging, OperatingExpense, Sale, InventoryLevel
//     each with accountId FK — full field lists as specified above.
```
The complete `schema.prisma` (every field, every relation) is generated in Phase 1 using this
document as the spec — see `phases/phase-1-auth-accounts.md` and
`phases/phase-2-core-data-modules.md` prompts.
