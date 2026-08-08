# Phase 7 — Executive Report & Export

## Goal
A single, print-friendly, boardroom-ready report page composing everything built so far, plus a
PDF export.

## Deliverables
- `/report` page: Business Summary, Financial Health (Health Score), Opportunity Score, Profit
  Leakage summary, Top Opportunities, Critical Problems, a Monthly Action Plan / Priority List,
  and Estimated Financial Improvement — composed from Phases 3, 5, and 6's data, not
  re-implemented.
- Print stylesheet (clean on physical paper / "print to PDF" from the browser).
- A "Download PDF" button producing a polished PDF export (Puppeteer route or
  @react-pdf/renderer — decide based on how much the print stylesheet already achieves; if the
  browser print view is already good, Puppeteer rendering that same route is the simpler path).

## Acceptance criteria
- The report contains no numbers that aren't traceable to Phases 2–6's data/calculations.
- Printing the page (Ctrl/Cmd+P) produces a clean, correctly paginated document with no cut-off
  charts/tables.
- The "Download PDF" button produces a file that matches the on-screen report.
- Report renders sensibly even for a very new account with minimal data (doesn't crash, shows
  appropriate "not enough data yet" messaging where relevant sections are empty).

---

## PROMPT FOR CODING AGENT

```
You are implementing Phase 7 of "Restaurant CFO Web." Phases 0–6 already exist, including
lib/calc/healthScore.ts, lib/calc/opportunityScore.ts, lib/calc/profitLeakage.ts, and
lib/calc/recommendations.ts. Read /webapp-docs/03-data-model-and-formula-engine.md section 17
("Executive Report") for the exact spec.

Task: build the Executive Report page and its PDF export. This phase should not introduce any
new calculation logic — it only composes and formats output from Phases 3–6.

Requirements:
1. Build /report as a server-rendered page composing, in order: a Business Summary (business
   name, period covered, revenue/profit headline numbers from lib/calc/dashboard.ts), the
   Restaurant Health Score with its band and a short factor breakdown, the Opportunity Score
   with estimated monthly/annual profit increase, a Profit Leakage summary (top issues + total
   estimated loss), a "Top Opportunities" section (highest-impact items from
   lib/calc/recommendations.ts), a "Critical Problems" section (any menu items with
   profitStatus LosingMoney, and any Profit Leakage issues above a configurable severity
   threshold), a Monthly Action Plan / Priority List (the top 5 recommendations, ordered by
   impact), and an Estimated Financial Improvement summary (tie together Opportunity Score and
   Profit Leakage numbers into one clear "if you act on this, here's the estimated upside"
   statement).
2. Add a dedicated print stylesheet (CSS @media print rules, or a Tailwind print: variant
   approach) ensuring: no navigation/sidebar chrome shows when printed, charts/tables don't get
   cut across page breaks awkwardly, and headings act as sensible page-break anchors.
3. Implement PDF export: add a "Download PDF" button. Implement it either via a Puppeteer-based
   API route that renders the /report page's HTML to PDF server-side, or via
   @react-pdf/renderer with a dedicated PDF layout — choose based on how well the print
   stylesheet from step 2 already reproduces the desired output; document your choice and
   reasoning in a code comment at the top of the export route.
4. Handle the low-data case gracefully: if an account has no Sales recorded yet, the report
   should still render (Business Summary and static config data are always available) but show
   clear "not enough sales data yet for this section" messaging in the sections that need it
   (Dashboard-derived numbers, Menu Engineering-derived items), rather than crashing or showing
   blank/zero values without explanation.
5. Add a basic integration/rendering test (e.g. a test that renders the report for a fully
   populated synthetic account and asserts each major section is present, plus one for a
   near-empty account asserting it renders without throwing).

Run lint, typecheck, build, and the full test suite yourself and fix any failures. Report which
PDF generation approach you chose and why.
```
