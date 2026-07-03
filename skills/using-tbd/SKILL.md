---
name: using-tbd
description: Use when starting work on an epic or any multi-PR feature, when the user wants trunk-based development discipline, when work looks too big for one pull request, or when the user invokes /using-tbd — establishes that work must be decomposed into small, independently shippable pull requests before implementation planning begins.
---

# Using Trunk-Based Development

**Announce at start:** "Using tbd:using-tbd to apply trunk-based development discipline to this work."

## Mindset

One trunk, always releasable. Every merge leaves trunk green and shippable; a red trunk is everyone's top priority. Work reaches trunk through **short-lived branches** (target 1–2 days each) that end in exactly one review-sized pull request — never through direct trunk commits, and never through a long-lived branch.

The core inversion this skill enforces: **the branch never grows to fit the work; the work is cut to fit the branch.** When work is bigger than one PR, the answer is a sequence of small PRs planned up front — not a bigger branch. Incomplete work hides behind a mechanism (naturally-safe ordering, a feature toggle, or branch by abstraction), not behind a branch.

Slicing decisions come **before** build decisions. Deciding where the PR boundaries are is a separate, earlier act than planning how to implement any one slice.

## First Action: Scale Check

Estimate the total work against the size budgets in `tbd:sizing-pull-requests` (target ≤600 reviewable lines per PR, cap 1000).

- **Fits one review-sized PR** → say so explicitly: "This fits a single PR — TBD adds nothing here; proceeding normally." Then step aside entirely. Do not create a map, do not add ceremony.
- **Clearly multi-PR, or unsure** → treat as multi-PR and continue below. When in doubt, decompose — an unnecessary two-slice map is cheap; a 3,000-line PR is not.

## Second Action: Discovery

Run this resolution once, lightly, and announce findings in 2–3 lines. Write no files.

1. **Installed/project skills** — scan the available-skills list for project capabilities this session will need: PR creation (branch naming, PR templates), feature toggles, verify/CI commands. If found, use them when the time comes; do not reimplement their job.
2. **Project docs** — `AGENTS.md` / `CLAUDE.md` and docs they reference: trunk branch name, toggle conventions, generated-code definitions, build-and-test commands.
3. **Gaps** — note what's unknown. Ask the user only when a gap actually blocks a decision, one precise question at a time.

## The Overlay Rules

These rules constrain the rest of the session, whatever process, workflow, or plugins the session otherwise uses. They say nothing about *how* to spec, plan, test, or implement — only where the PR boundaries are and what may merge.

1. **No implementation of multi-PR work before a user-approved decomposition map exists.** Produce it with `tbd:decomposing-into-pull-requests`. Understanding the work (reading code, discussing requirements, writing specs) is fine before the map; writing implementation code is not.
2. **One slice at a time.** Whatever process the session uses (spec → plan → implement, TDD, anything else) runs *inside* the current slice. Each slice is a short-lived branch (target ≤ 1–2 days) ending in exactly one PR to trunk.
3. **Every slice merges trunk-safe.** Green CI, no half-built UX exposed. The mechanism (naturally-safe / toggle / branch by abstraction) is decided per slice via `tbd:integration-strategy`.
4. **Every diff is size-checked before its PR opens.** Use `tbd:sizing-pull-requests`. A ballooning diff triggers re-slicing — carving a smaller trunk-safe PR out of what exists — never a bigger PR.
5. **Between slices, re-enter the map.** Update the slice status, append to the decision log if anything changed, and re-validate the remaining slices against what was just learned. Adjust the map before starting the next slice.
6. **Cleanup is planned work.** Toggle removal and old-path deletion are real slices with rows in the map — never "we'll do it later."

## Routing

| Situation | Invoke |
|---|---|
| Work needs splitting into an ordered PR sequence; or resuming a mapped epic | `tbd:decomposing-into-pull-requests` |
| Checking a planned slice's budget, or a live diff's size; deciding what counts as reviewable lines | `tbd:sizing-pull-requests` |
| A slice can't ship self-complete and needs a mechanism to stay trunk-safe | `tbd:integration-strategy` |

## Red Flags — Stop and Re-Slice

| Thought | Reality |
|---|---|
| "I'll keep building on this branch a bit longer" | Branch age > 2 days means the slice was too big. Stop, split, PR what's done. |
| "The PR is big but it's all related" | Related ≠ reviewable. Run `tbd:sizing-pull-requests`; re-slice. |
| "We'll remove the toggle later" | "Later" is a slice in the map or it doesn't exist. |
| "This refactor can ride along with the feature" | Mechanical and semantic changes never share a PR. |
| "The next PR only makes sense with this one" | Then the boundary is wrong — re-cut so each stands alone. |
| "It's easier to review everything at once" | Nobody reviews 3,000 lines. They skim it. |
| "The map is approved, no need to revisit it" | Reality diverges from plans. Re-validate remaining slices after every merge. |
| "This task is small, but let's map it anyway" | Single-PR work gets no map and no ceremony. Step aside. |
