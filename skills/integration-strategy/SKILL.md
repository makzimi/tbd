---
name: integration-strategy
description: Use when a planned slice cannot ship self-complete and a mechanism is needed to keep trunk releasable, when deciding how incomplete work merges safely, or when choosing between a naturally-safe slice, a feature toggle, and branch by abstraction.
---

# Integration Strategy

**Announce at start:** "Using tbd:integration-strategy to decide how this slice ships trunk-safe."

## Overview

Every slice must merge to trunk leaving it green and releasable, even though the overall feature is incomplete. Three mechanisms make that possible. Evaluate them **in order** — each is cheaper than the next.

## Decision Guide

### 1. Naturally safe — prefer whenever possible

The slice is inert until a final wiring step connects it. Nothing at runtime changes, so nothing can break and nothing needs cleanup later.

Forms it takes:
- a **new module nothing references yet**;
- an **additive API** (new endpoint, new method, new optional field) with no callers yet;
- a **dead code path** — reachable only by code that doesn't exist yet;
- **backend before frontend** (or producer before consumer) ordering.

If reordering slices can make a slice naturally safe, prefer the reorder. Zero runtime risk, zero cleanup debt.

### 2. Feature toggle — for new user-visible behavior built across several PRs

The behavior exists on trunk but is switched off until complete.

Rules:
- Gate at the **smallest number of entry points** — ideally exactly one. Many toggle points = many places to break and to clean up.
- **Off by default.** Trunk stays behaviorally unchanged until the deliberate flip.
- **Name and mechanics per project convention** — discover the project's toggle framework and naming via project skills/docs; ask if neither exists (see Delegation below).
- **A removal slice exists in the decomposition map from day one.** A toggle without a planned removal is permanent debt.

### 3. Branch by abstraction — for replacing or reworking existing behavior

When users already exercise the code being changed, it can't be dark-launched by ordering, and toggling raw duplication is messy. Build the replacement *behind a seam*, on trunk, in small steps:

1. **Introduce a seam** — an interface/abstraction in front of the old implementation. This alone is a slice.
2. **Route all consumers through the seam** — possibly several mechanical slices.
3. **Build the new implementation behind the seam** — one or more slices; optionally toggle which implementation the seam serves.
4. **Switch** to the new implementation.
5. **Delete the old implementation** — a cleanup slice; if the seam earns nothing after that, delete the seam too.

Every step merges trunk-safe and PR-sized.

### Combinations are normal

The common pairing: a BbA seam plus a toggle choosing which implementation the seam serves — letting the switch (step 4) be a runtime flip instead of a code change.

## Cost Table

| Mechanism | Upfront cost | Ongoing cost | Cleanup debt |
|---|---|---|---|
| Naturally safe | none (maybe a reorder) | none | none |
| Feature toggle | gate code at entry points | a runtime branch; testing both states | removal slice |
| Branch by abstraction | seam + consumer routing | temporary duplication of implementations | old-path (± seam) deletion slices |

Choose the **cheapest mechanism that keeps trunk releasable**.

## Present the Decision to the User — Mandatory

For any non-trivial slice, never silently pick a strategy. Present 2–3 concrete options with trade-offs and a recommendation, then wait for the decision. Concrete means derived from actually reading the code:

- **Toggle option:** the proposed toggle name (per project convention) and the exact gate location(s) — file and entry point.
- **BbA option:** the proposed interface — name and rough shape (key methods) — and which callers move behind it, listed from the real call sites.
- **Naturally-safe option:** what reordering or restructuring makes the slice inert, and what the final wiring step is.

Trivially safe cases (a genuinely unreferenced new module) can be stated rather than debated — one line in the map's "ships safely because" field.

## Delegation

This skill owns the *choice* of mechanism, never the mechanics:

- **Toggle mechanics** (framework, declaration, naming, cleanup tooling) → project skill or docs; if none, ask the user.
- **Seam style** (interface conventions, DI patterns) → project architecture rules; if none, ask.
- **Release/flip process** → project's own release process; out of scope here.

## Red Flags

| Thought | Reality |
|---|---|
| "I'll just merge it half-done; nobody uses that screen" | "Nobody uses it" is an assumption, not a guard. Pick a real mechanism. |
| "A toggle everywhere the behavior differs" | Many toggle points = unbounded cleanup. Gate at the entry point(s), ideally one. |
| "We can toggle the old code path away instead of deleting it" | Dead code behind a permanent toggle is debt. Deletion is a slice in the map. |
| "The seam is overkill; I'll modify the old code in place across PRs" | In-place rework leaves trunk broken between PRs. That's what the seam prevents. |
| "I'll pick the strategy myself to save the user a question" | Strategy choices shape the whole slice sequence. Present options; the user decides. |
