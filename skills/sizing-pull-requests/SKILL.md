---
name: sizing-pull-requests
description: Use when checking whether a diff or planned slice is review-sized, when a PR is ballooning past budget, when deciding what counts toward PR size (generated code, lockfiles, docs, renames), or before opening any pull request on a multi-PR effort.
---

# Sizing Pull Requests

**Announce at start:** "Using tbd:sizing-pull-requests to check this diff/slice against the review-size budgets."

## Why size matters

Small PRs get reviewed in minutes; big PRs sit for days, and review latency is the main killer of short-lived branches. Reviewers read a 400-line diff; they skim a 3,000-line one. The budget exists to keep review honest, not to make PRs an inconvenient shape.

## The Metric: Reviewable Lines

**reviewable lines = added + removed lines (`git diff --stat` semantics) across included files only.**

For a live diff, measure against trunk (e.g. `git diff --stat <trunk>...HEAD`), sum insertions + deletions, then subtract excluded files. For a planned slice, estimate the same number.

## Budgets

| Reviewable lines | Verdict |
|---|---|
| ≤ 600 | **Target.** Proceed. |
| 600–1000 | **Justify explicitly** in the map and the PR description — why this can't reasonably split. |
| > 1000 | **Not acceptable — re-slice.** Single escape hatch: a pure-mechanical change isolated in its own PR and labeled as such (see below). |

## Exclusions — what does NOT count

Resolve in this order; stop at the first source that answers:

1. **Project docs' definition** of generated/vendored code — `AGENTS.md` / `CLAUDE.md` and any docs they reference.
2. **`.gitattributes`** — files marked `linguist-generated` or `-diff`.
3. **Default pattern list:** lockfiles (`package-lock.json`, `*.lock`, …); snapshot/screenshot test outputs; codegen output (protobuf, GraphQL, DI codegen, API-client generators); vendored third-party code; large data fixtures.
4. **Documentation** — `*.md` and equivalents are excluded by default; docs don't count against the budget unless the user says otherwise.
5. **Genuinely unsure** whether something is generated? Ask the user — one question, not a survey.

Excluded lines still ship in the PR; they just don't count against the budget.

## Mechanical-Change Rule

Bulk mechanical edits — renames, formatting, import reshuffles, mass migrations by script — go in **their own PR**, clearly labeled as mechanical, reviewable by sampling. They may exceed the budgets. A 3,000-line pure rename is a fine PR; the same rename buried inside a feature PR is not.

**Never mix mechanical and semantic changes in one PR.** The mechanical bulk hides the semantic diff from the reviewer.

## Re-Slicing a Ballooning Diff

When a diff outgrows its budget mid-slice:

1. **Stop adding.** More code makes it worse.
2. **Find the coherent core** — the subset of the diff that is already trunk-safe (green CI, guarded per its strategy) and has one purpose.
3. **Carve that into the current PR**; open it at or under budget.
4. **Move the remainder** into a new slice in the decomposition map, with its own purpose, budget, and strategy.
5. **Update the map** — statuses and a decision-log entry.

The answer to "the diff is too big" is never "make the PR bigger."

## Common Sense Clause

Budgets are heuristics, not laws. When an edge case genuinely resists the numbers, state the count, state the reason, and let the user decide. What is not negotiable: measuring the number and saying it out loud before the PR opens.

## Red Flags

| Thought | Reality |
|---|---|
| "It's 900 lines but it's all one feature" | 600–1000 needs an explicit justification the user accepts — not a shrug. |
| "The generated code makes it look bigger than it is" | Then exclude it *by the rules above* and state both numbers. Don't eyeball. |
| "Splitting now would waste the work" | Nothing is wasted — the remainder becomes the next slice, already written. |
| "I'll note the size in the PR after opening it" | Size check happens before the PR opens. That's the point where re-slicing is still cheap. |
