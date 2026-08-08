# Phase 6 — Scenario Simulator & Recommendations

## Goal
The two "virtual CFO" differentiators: a live what-if simulator, and a ranked, human-readable
list of concrete actions the owner should take.

## Deliverables
- `/simulator` page: sliders/inputs for ingredient price change %, rent change %, salary change
  %, packaging cost change %, food cost target, and selling price changes — recomputes the full
  dashboard/menu-pricing picture live via a Server Action, with a clear before/after comparison.
  No database writes — purely a recompute against modified inputs.
- `lib/calc/recommendations.ts`: composes Menu Pricing price gaps, Profit Leakage, and Menu
  Engineering quadrant placement into a ranked list of plain-language recommendations.
- `/recommendations` page: the ranked list, each item showing the recommendation, the estimated
  impact, and which underlying issue it addresses.

## Acceptance criteria
- Moving a simulator slider updates the before/after comparison within a reasonable time
  (target: under ~1s for a typical account size) without persisting anything to the database.
- Recommendations are ranked by estimated impact, not by insertion order or arbitrary category.
- Every recommendation string is traceable to a specific underlying number (no vague advice).

---

## PROMPT FOR CODING AGENT

```
You are implementing Phase 6 of "Restaurant CFO Web." Phases 0–5 (through Dashboard & Core
Analytics) already exist. Read /webapp-docs/03-data-model-and-formula-engine.md sections 15–16
(Scenario Simulator, Recommendations) for the exact spec.

Task: build the Scenario Simulator and the Recommendations engine. Do NOT build the Executive
Report yet — that is the next phase and will embed this phase's Recommendations output.

Requirements:
1. Implement the Scenario Simulator as a Server Action (not a database write): it accepts the
   account's current data plus a set of percentage/absolute overrides (ingredient price change
   %, rent change %, salary change %, packaging cost change %, a new food cost target, and
   per-item selling price overrides), and returns the recomputed menu pricing + dashboard
   summary using the SAME functions from lib/calc/menuPricing.ts and lib/calc/dashboard.ts —
   just fed modified inputs instead of the stored ones. Do not write a separate, parallel
   calculation path; the simulator must call the real calculation engine so it can never drift
   out of sync with actual pricing.
2. Build the /simulator page: sliders/number inputs for each of the scenario variables listed
   above, a "before" panel (current numbers) and an "after" panel (recomputed numbers) shown
   side by side, updating as the user adjusts inputs (debounce the recompute call so it isn't
   fired on every keystroke). Include a clear "this does not save any changes" note in the UI.
3. Implement lib/calc/recommendations.ts: a function that takes the account's Menu Pricing
   results, Profit Leakage results, and Menu Engineering results (from Phase 5) and produces a
   ranked list of recommendation objects: { text, estimatedImpact, category, relatedItem }.
   Examples of the recommendation templates to implement (fill in real numbers from the data,
   do not hardcode example text): price-increase suggestions for items with a large positive
   priceGap, portion/recipe-cost suggestions for items with high food cost %, supplier-review
   suggestions for ingredients flagged in Profit Leakage as "expensive supplier," packaging-cost
   review suggestions, "promote" suggestions for Star quadrant items, and "remove or rework"
   suggestions for Dog quadrant items with sustained low sales. Rank the final list by
   estimatedImpact descending.
4. Build the /recommendations page: the ranked list, each entry showing the recommendation
   text, its estimated $ impact, and a short "why" line referencing the specific underlying
   metric (e.g. "food cost 42% vs target 30%").
5. Unit-test lib/calc/recommendations.ts with synthetic data covering at least one example of
   each recommendation template, confirming both that the right recommendations fire and that
   they're ordered by impact.
6. Unit/integration-test the simulator's recompute path: confirm that overriding, say,
   ingredient prices by +10% produces the expected downstream change in recipeCost → totalCost
   → margins for at least one menu item, and that nothing is persisted to the database as a
   result of running a simulation.

Run lint, typecheck, build, and the full test suite yourself and fix any failures. Report a
short summary of which recommendation templates you implemented.
```
