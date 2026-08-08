# Restaurant CFO — Web Application Technical Documentation

> Status: **Planning document for a future web version.**
> This folder does **not** replace the existing Excel product (see `/templates`, `/demo`, `/docs`).
> It defines how "Restaurant CFO" — currently an Excel financial toolkit — will be rebuilt as a
> web application (SaaS-style, but with **admin-provisioned accounts only**, no public sign-up).

## Why this exists

The original brief (see the project's top-level spec) asked for a commercial-grade Excel
toolkit. This document set is the natural next step: turning that same financial engine
(recipe costing, menu pricing, health score, menu engineering, profit leakage, scenario
simulation, executive reporting) into a proper web product with a database, a real
calculation engine, and a dashboard — instead of spreadsheet formulas.

## How to read this folder

Read in this order:

1. `01-product-vision-and-scope.md` — what we are building and for whom, MVP boundaries.
2. `02-tech-stack-and-architecture.md` — stack choices, system architecture, project structure.
3. `03-data-model-and-formula-engine.md` — database schema + how every Excel formula maps to
   backend calculation logic.
4. `04-auth-and-account-management.md` — how login-only, admin-provisioned accounts work
   (no self-registration, ever).
5. `05-roadmap-phases-overview.md` — the full phased roadmap at a glance (table + sequencing).
6. `phases/phase-0-setup.md` … `phases/phase-8-polish-deploy.md` — one file per phase, each
   containing goals, deliverables, acceptance criteria, and a **ready-to-use implementation
   prompt** you can paste into an AI coding agent (e.g. Claude Code) to build that phase.

## How the phase prompts are meant to be used

Each phase file ends with a fenced block labeled `PROMPT FOR CODING AGENT`. These prompts are
self-contained: paste one into Claude Code (or any capable coding agent) *after* the previous
phase's code exists in the repo, and it will implement that phase's slice of the product,
referencing this documentation set as ground truth. Do the phases **in order** — each one
assumes the previous phase's code and schema already exist.

## Non-goals for the MVP web version

- No public sign-up / self-service registration (accounts are created manually on the server).
- No payment/billing integration in the MVP.
- No native mobile app (responsive web only).
- No multi-language UI in the MVP (English first; Persian/RTL is a documented fast-follow,
  see `01-product-vision-and-scope.md`).
