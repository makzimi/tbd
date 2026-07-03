# tbd — Trunk-Based Development for Coding Agents

Trunk-based development in one breath: everyone integrates small changes into a single trunk continuously, and the trunk is releasable at all times. Big features don't get big branches — they get decomposed into a sequence of small, independently shippable changes, with incomplete work hidden behind feature toggles or branch-by-abstraction seams instead of behind a branch. Decades of industry evidence (DORA research, Fowler, Hammant) point the same way: teams that integrate small and often ship faster with fewer defects.

Coding agents are naturally bad at this. Given an epic, an agent happily produces one giant branch, one 4,000-line pull request, and a plan whose steps only make sense as a whole. The knowledge of *how to slice work into review-sized, trunk-safe PRs* has to be re-explained in every session — so this plugin packages it once, as a set of skills the agent applies automatically.

The variant this plugin enforces is **short-lived feature branches**: every change reaches trunk through a branch that lives a day or two at most and ends in exactly one review-sized pull request. It does not preach committing straight to trunk, and it does not touch your release process.

One thing it deliberately does **not** do: tell the agent how to spec, plan, test, or implement anything. It only owns *where the PR boundaries are*. Everything inside a slice is up to you and whatever workflow you already use.

## Install & Usage

Install as a Claude Code plugin:

```bash
# from a marketplace that carries it
/plugin install tbd

# or manually: clone this repo and add it as a local plugin
/plugin marketplace add <path-or-repo>
```

Then, at the start of an epic or any feature that smells bigger than one PR:

```
/using-tbd
```

The agent sizes the work first. If it fits one review-sized PR, TBD says so and steps aside — no ceremony. If it's bigger, the agent decomposes it into an ordered sequence of PR-sized slices and writes a **decomposition map** to `docs/tbd/decompositions/`, which you approve before any implementation starts.

### A worked mini-example

Say the epic is "add gift cards to the store checkout". The map might look like:

| # | PR title | Purpose | Strategy | Size budget | Depends on | Status |
|---|----------|---------|----------|-------------|------------|--------|
| 1 | Gift card domain model + storage | Card entity, balance operations, persistence | safe | ~400 lines | — | planned |
| 2 | Redemption API endpoint | Validate + redeem a card server-side | safe | ~350 lines | 1 | planned |
| 3 | Checkout UI: gift card field | Entry field and balance display, gated | toggle:gift-cards | ~450 lines | 2 | planned |
| 4 | Apply card to order total | Wire redemption into payment flow, gated | toggle:gift-cards | ~500 lines | 3 | planned |
| 5 | Enable + remove gift-cards toggle | Flip on, delete the gate | safe | ~100 lines | 4 | planned |

Slices 1–2 are *naturally safe* — new code nothing calls yet. Slices 3–4 hide behind one feature toggle, off by default. Slice 5 is the cleanup slice, planned from day one. Each slice is one short-lived branch, one PR, merged to a green trunk.

## The Four Skills

**`using-tbd`** — the umbrella, invoked as `/using-tbd`. Establishes the mindset (the branch never grows to fit the work; the work is cut to fit the branch), sizes the task, discovers project conventions, and sets the session-wide rules: no multi-PR implementation before an approved map, one slice at a time, every merge trunk-safe.

**`decomposing-into-pull-requests`** — the core. Turns a body of work into an ordered sequence of slices — vertical by default, dependency- and risk-ordered, each with a purpose, size budget, and integration strategy — and records them in the decomposition map you approve. Also handles resuming a mapped epic mid-flight.

**`sizing-pull-requests`** — defines *reviewable lines* (added + removed, excluding generated code, lockfiles, vendored code, and docs), the budgets (target ≤600, hard cap 1000), the rule that mechanical and semantic changes never share a PR, and the re-slicing procedure when a diff balloons.

**`integration-strategy`** — decides how a slice that can't ship self-complete still merges safely: naturally-safe ordering (preferred), a feature toggle (off by default, removal planned), or branch by abstraction (seam → route consumers → new implementation → switch → delete old path). Non-trivial choices are always presented to you with concrete options, not made silently.

## Composition

`tbd` is an overlay, not a pipeline. It works alongside any process plugin — spec-first workflows, planning workflows, TDD enforcement — or none at all. Whatever your session's process is, it runs *inside* each slice; TBD only inserts one artifact (the map) between understanding the work and implementing it, and enforces the PR boundaries the map defines. Nothing to configure, no integration points needed.

## Recommended Companion Skills

The plugin is generic by design: it contains nothing about your language, platform, or tooling. At runtime it looks for project-side skills and docs, uses them when present, and asks you when they're absent. It shines when your project provides:

- **a branch-naming + PR-creation skill** (or a documented convention) — how branches are named, what the PR template is;
- **a feature-toggle skill or doc** — how toggles are declared, checked, and cleaned up in this repo;
- **a branch-by-abstraction how-to** for your architecture — preferred seam style, DI conventions;
- **a verify/CI skill or a documented build-and-test command** — what "green" means locally.

The plugin discovers and uses these automatically if present; without them it will ask.

## Boundaries — what this plugin will never do

- **Dictate your process.** No opinions on specs, plans, TDD, or subagents — inside a slice, your workflow rules.
- **Contain project- or platform-specific content.** Everything project-specific is discovered at runtime or asked.
- **Write configuration or profile files.** The plugin is stateless; the only artifact it produces is the decomposition map, which is your work product — edit or delete it freely.
- **Force itself on a session.** No hooks, no auto-injection. It activates only when you invoke `/using-tbd` (or clearly ask for TBD discipline).
- **Own your release process.** Release branches, release-from-trunk, deploy mechanics — all yours.

## License

MIT
