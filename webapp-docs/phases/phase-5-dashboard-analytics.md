# Phase 5 — Dashboard & Core Analytics

## Goal
Turn all the data entered so far into the insight layer the product is actually sold on:
Dashboard, Restaurant Health Score, Menu Engineering, and Profit Leakage.

## Deliverables
- `lib/calc/dashboard.ts`, `lib/calc/healthScore.ts`, `lib/calc/menuEngineering.ts`,
  `lib/calc/profitLeakage.ts`, `lib/calc/opportunityScore.ts` per
  `03-data-model-and-formula-engine.md` sections 10–14.
- `/dashboard` page: KPI cards + charts (Revenue by Category, Profit by Category, Top 10 /
  Bottom 10 menu items) via Recharts.
- `/health-score` page: 0–100 score, performance band, color indicator, and a breakdown of the
  contributing factors (so the number is explainable, not a black box).
- `/menu-engineering` page: quadrant chart (Star/Plow Horse/Puzzle/Dog) plus a list view with
  per-item recommendation text.
- `/profit-leakage` page: list of detected leakage issues with estimated monthly $ loss each,
  and a total.
- `/opportunity` page: overall opportunity score, estimated monthly/annual profit increase.

## Acceptance criteria
- Every number/chart on the Dashboard traces back to Sales/MenuItem/Ingredient data already
  entered — nothing hardcoded or mocked.
- Health Score weighting is a single documented config object (testable independent of the UI).
- Menu Engineering quadrant placement matches the two-axis (popularity × profitability) logic
  from the spec, verified with unit tests using synthetic data across all four quadrants.
- Profit Leakage correctly flags each of the seven example issue types from the spec when
  synthetic test data is constructed to trigger them.

---

## PROMPT FOR CODING AGENT

```
You are implementing Phase 5 of "Restaurant CFO Web." Phases 0–4 (scaffolding, auth, core data,
menu pricing engine, sales & inventory) already exist. Read
/webapp-docs/03-data-model-and-formula-engine.md sections 10–14 (Dashboard, Restaurant Health
Score, Menu Engineering, Profit Leakage, Opportunity Score) carefully — they are the exact spec
for this phase.

Task: build the analytics/insight layer. Do NOT build the Scenario Simulator, Recommendations
engine, or Executive Report yet — those are later phases and will reuse these calc functions.

Requirements:
1. Implement lib/calc/dashboard.ts: an aggregation function that computes total revenue, gross
   profit, net profit, average food cost %, average margin, most/least profitable menu item,
   highest-cost ingredient, most expensive recipe, average profit per sale, and a simple
   monthly-estimated-profit projection (based on current run-rate from recorded Sales), for a
   given account and date range. Reuse lib/calc/menuPricing.ts and lib/calc/sales.ts — do not
   duplicate margin/profit formulas.
2. Implement lib/calc/healthScore.ts: a documented, exported config object listing each scoring
   factor (food cost, net margin, gross margin, waste, packaging cost, overhead, profitability,
   pricing accuracy, inventory health, low-margin item count) with its weight, a normalization
   function per factor (0–100), and a combining function producing the final 0–100 score plus
   the performance band (Excellent 90–100 / Healthy 75–89 / NeedsAttention 60–74 / Poor 40–59 /
   Critical 0–39) exactly as specified. Unit-test with synthetic accounts engineered to land in
   each band.
3. Implement lib/calc/menuEngineering.ts: classify each MenuItem into Star/PlowHorse/Puzzle/Dog
   based on popularity (sales volume relative to the account's average) and profitability (net
   margin relative to the account's average), matching the two-axis logic from the spec. Each
   quadrant should carry a short rule-based recommendation string (e.g. Dogs: "consider removing
   or reworking this item"). Unit-test with synthetic data placing items in all four quadrants.
4. Implement lib/calc/profitLeakage.ts: a rules engine scanning MenuItems/Ingredients/
   OperatingExpenses for each of the seven leakage patterns from the spec (high food cost,
   large waste %, expensive supplier vs. category average, high packaging cost relative to
   price, mispriced items i.e. large negative priceGap, large delivery fees, high overhead
   share), each producing an estimated monthly $ loss, summed into a total. Unit-test each
   pattern independently with synthetic data engineered to trigger it, and confirm it does NOT
   fire on healthy synthetic data.
5. Implement lib/calc/opportunityScore.ts: derive an overall improvement score and estimated
   monthly/annual profit increase from the gap between current pricing and each item's
   recommendedPrice (from menuPricing) combined with the Profit Leakage total.
6. Build /dashboard: KPI cards (using the numbers from lib/calc/dashboard.ts) and Recharts
   visualizations for Revenue by Category, Profit by Category, and Top 10 / Bottom 10 menu
   items by profit. Handle the empty-data case gracefully (no sales recorded yet) with a clear
   "not enough data yet" state rather than a broken/empty chart.
7. Build /health-score: the score, its performance band with the specified color indicator, and
   an expandable breakdown showing each factor's contribution (so the score is explainable).
8. Build /menu-engineering: a quadrant scatter chart (popularity x-axis, profitability y-axis)
   using Recharts, plus a list view grouped by quadrant with each item's recommendation text.
9. Build /profit-leakage: a list of detected issues (type, affected item/ingredient/expense,
   estimated monthly loss) sorted by loss descending, with a total loss figure at the top.
10. Build /opportunity: the opportunity score and estimated monthly/annual profit increase,
    with a short breakdown of what's driving the number (top price gaps + top leakage items).
11. All calc functions must be pure and independently unit-tested (no direct DB calls inside
    them — pass in already-fetched data); page-level Server Components/Actions do the fetching
    and call the pure functions.

Run lint, typecheck, build, and the full test suite yourself and fix any failures. Report a
short summary of the health score weights you chose and why.
```
