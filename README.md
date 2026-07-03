# Trunk-Based Development for Coding Agents

TBD in one line: everyone merges small changes into one trunk, constantly, and trunk is always shippable. Big feature? Don't grow a big branch — slice the work into small PRs and hide the unfinished bits behind a feature toggle or an abstraction seam. Not just vibes, either: DORA, Fowler, and Hammant all agree — small frequent merges = ship faster, break less.

Thing is, coding agents are hopeless at this. Give one an epic and boom — monster branch, 4,000-line PR, good luck reviewing that. You can teach an agent to slice properly, but you'd be re-explaining it every session. This plugin does it once, as skills the agent just picks up.

The flavor here: **short-lived branches**. A branch lives a day or two, tops, and ends in one review-sized PR. No "commit straight to trunk" preaching, and your release process is none of our business.

Also none of our business: how you spec, plan, test, or code. The plugin only draws the PR boundaries — inside each slice, do whatever works for you. It plays nice with any process plugin — for example, [Superpowers](https://github.com/obra/superpowers) for the brainstorm → plan → TDD flow — or with no process plugin at all.

## Install & Usage

Install as a Claude Code plugin — this repo is its own marketplace:

```bash
/plugin marketplace add makzimi/tbd
/plugin install tbd@tbd
```

Or from a local clone:

```bash
/plugin marketplace add /path/to/tbd
/plugin install tbd@tbd
```

For **OpenCode**, add the plugin to your `opencode.json` and restart (see
[`.opencode/INSTALL.md`](.opencode/INSTALL.md) for details):

```json
{
  "plugin": ["tbd@git+https://github.com/makzimi/tbd.git"]
}
```

OpenCode has no slash commands, so activate by asking — "load the using-tbd
skill" (or just ask for trunk-based development) at the start of an epic.

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
