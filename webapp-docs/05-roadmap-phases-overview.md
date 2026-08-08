# 05 — Roadmap: Phases Overview

Nine phases, meant to be built in order. Each has its own file under `phases/` with full
detail and a ready-to-use coding-agent prompt.

| Phase | Name | Goal | Depends on |
|---|---|---|---|
| 0 | Project Setup & Foundations | Repo, tooling, DB, CI, empty deployable app | — |
| 1 | Auth & Account Provisioning | Login-only auth, admin CLI to create accounts | Phase 0 |
| 2 | Core Data Modules | Business Profile, Ingredients, Recipes, Packaging, Operating Expenses (full CRUD) | Phase 1 |
| 3 | Pricing Engine & Menu Pricing | The core calculation engine + Menu Pricing UI with profit status | Phase 2 |
| 4 | Sales & Inventory | Sales entry (manual + CSV), Inventory summary & alerts | Phase 3 |
| 5 | Dashboard & Core Analytics | Dashboard KPIs/charts, Health Score, Menu Engineering, Profit Leakage, Opportunity Score | Phase 4 |
| 6 | Scenario Simulator & Recommendations | What-if simulator, rule-based recommendations engine | Phase 5 |
| 7 | Executive Report & Export | Print-friendly report page + PDF export | Phase 6 |
| 8 | Polish, QA, Deployment | Design pass, empty/error states, accessibility, tests, deploy to production | Phase 7 |

## Sequencing rationale

- **Phase 1 before anything else** because every other phase's data is tenant-scoped; there's
  nothing meaningful to build without a logged-in account.
- **Phase 3 (pricing engine) before Phase 5 (dashboard)** because the dashboard, health score,
  menu engineering, and profit leakage all *consume* the pricing engine's output — building them
  first would mean building on numbers that don't exist yet.
- **Phase 6 (simulator) after Phase 5** because the simulator re-runs the same calculation
  functions used by the dashboard — those need to exist and be correct first.
- **Phase 7 (report) last among features** because the Executive Report is explicitly a
  composition of everything from Phases 3–6 (health score, opportunity score, profit leakage,
  recommendations) into one printable page.
- **Phase 8 is deliberately last** — polish and deployment hardening apply across the whole
  surface area built in Phases 0–7; doing it earlier means redoing it.

## Suggested pacing (indicative only — depends on team size)

- Phases 0–1: foundation week (get to "I can log in and see an empty dashboard shell").
- Phases 2–3: the financial core — the phase most worth spending real time on, since every
  number downstream depends on it being correct.
- Phases 4–5: turns raw data into the insight layer the product is actually sold on.
- Phases 6–7: the "virtual CFO" differentiators (simulation, recommendations, boardroom-ready
  report).
- Phase 8: hardening before real restaurant owners touch it.

## Cross-cutting rule for every phase

Every phase's coding-agent prompt should be run against a repo that already has:
- This `webapp-docs/` folder present, so the agent can read `03-data-model-and-formula-engine.md`
  for exact formulas instead of guessing at financial logic.
- All previous phases' code committed.

Each phase should end with a passing test suite (`npm test`) and a working `npm run dev` before
moving to the next phase.
