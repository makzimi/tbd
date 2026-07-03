---
name: decomposing-into-pull-requests
description: Use when a body of work is too big for one review-sized pull request and needs to be split into an ordered sequence of independently shippable PRs, when planning an epic's PR boundaries, or when resuming a partially finished epic that already has a decomposition map.
---

# Decomposing Work into Pull Requests

**Announce at start:** "Using tbd:decomposing-into-pull-requests to split this work into an ordered sequence of PR-sized slices."

## Overview

Turns one big body of work into an ordered sequence of small, independently shippable PRs — the **slices** — and records them in a **decomposition map** the user approves before any implementation starts. Each slice will later become one short-lived branch and one PR.

**Precondition:** a shared understanding of the work exists — a spec, a ticket, a design doc, or simply a conversation that settled what's being built. This skill does not create specs; whatever process the session uses produces that understanding first. If the work is still vague, resolve that before slicing it.

**If an approved map already exists for this work, skip to Re-Entry below.**

## Procedure

1. **Inventory.** List the capabilities and changes the work requires as a flat bullet list — every user-visible behavior, data change, API change, and refactor implied by the goal. This is raw material, not slices yet.

2. **Group by cohesion.** Things that change together belong together; things that don't, don't. Aim for low coupling between slices, high cohesion within each — at the PR level.

3. **Cut vertical by default.** Prefer thin end-to-end increments (a small piece of real behavior, wired through every layer it touches) over horizontal layers. Use a horizontal slice only when the layer is genuinely valuable and reviewable on its own. "All the models, then all the UI" produces slices no one can evaluate alone.

4. **Order.** Dependencies first, then value and risk — put the riskiest assumptions early, where learning is cheapest.

5. **Detail each slice:**
   - one-sentence purpose,
   - in-scope / out-of-scope,
   - size budget via `tbd:sizing-pull-requests`,
   - integration strategy via `tbd:integration-strategy` (how it merges trunk-safe),
   - depends-on.

6. **Add cleanup slices.** Every feature toggle gets a toggle-removal slice; every branch-by-abstraction gets old-path-deletion (and, if the seam earns nothing afterward, seam-removal) slices. They are rows in the same table as everything else.

7. **Write the map and review it with the user.** Use the template in `decomposition-map-template.md` (next to this skill). Default location: `docs/tbd/decompositions/YYYY-MM-DD-<epic-slug>.md` in the user's repo — but honor the project's own convention for working documents if one exists. Present the slice table, walk through anything non-obvious (strategy choices, ordering), and iterate until the user approves. **This is a hard gate: no implementation before approval.**

## Slice Quality Checklist

Every slice must pass all five. A failing slice means the boundaries are wrong — re-cut.

- [ ] Merges to trunk alone with green CI.
- [ ] Exposes no broken or half-built UX (or is guarded per its integration strategy).
- [ ] A reviewer can approve it without reading sibling slices.
- [ ] Has one clear purpose statable in one sentence.
- [ ] Doesn't force a later slice to rewrite what this one added.

## Anti-Patterns

| Pattern | Why it fails |
|---|---|
| **Layer cake** — "all DTOs", then "all repositories", then "all UI" | No slice delivers evaluable behavior; review feedback arrives after everything is built on top. |
| **Grab-bag slice** — "misc", "cleanup", "polish" | No single purpose; unreviewable scope magnet. Name the specific change or drop it. |
| **Siamese slices** — a slice that only makes sense together with the next one | The boundary is decorative. Re-cut so each stands alone. |
| **Iceberg wiring** — a "final wiring" slice that secretly contains half the feature | Wiring slices flip a switch. If it's big, the feature wasn't actually built in the earlier slices. |
| **Phantom cleanup** — toggle/old-path removal mentioned in prose but absent from the table | If it isn't a row with a status, it will never happen. |

## Re-Entry (resuming a mapped epic)

When invoked mid-epic — "continue the epic", a new session, or after any slice merges:

1. **Read the existing map** (look in `docs/tbd/decompositions/` or wherever the project keeps it).
2. **Reconcile with reality.** Check git and open PRs: which slices actually merged, which are in review, what landed that the map doesn't know about. Update statuses to match reality, not intention.
3. **Re-validate remaining slices** against what was learned: sizes still plausible? strategies still right? ordering still correct? Amend the map and append to the decision log; get user approval for substantive changes (new/dropped/re-ordered slices — not routine status flips).
4. **Continue from the next unmerged slice.**

## Red Flags

| Thought | Reality |
|---|---|
| "The slicing is obvious, I'll skip the map" | The map is the approval artifact and the cross-session memory. Multi-PR work always gets one. |
| "I'll start coding while the user reviews the map" | Approval can change the boundaries. Code written against unapproved slices is speculative. |
| "Slice 1 is approved, that's enough to build all slices" | Approval covers the whole map. Partial approval means keep iterating on the map. |
| "This slice is mostly cleanup plus one small feature" | Two purposes = two slices. |
