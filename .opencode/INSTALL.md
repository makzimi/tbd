# Installing tbd for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## Installation

Add tbd to the `plugin` array in your `opencode.json` / `opencode.jsonc`
(global — `~/.config/opencode/` — or project-level):

```json
{
  "plugin": ["tbd@git+https://github.com/makzimi/tbd.git"]
}
```

Restart OpenCode. The plugin installs through OpenCode's plugin manager and
registers the four tbd skills with OpenCode's native `skill` tool.

To pin a version:

```json
{
  "plugin": ["tbd@git+https://github.com/makzimi/tbd.git#v0.1.0"]
}
```

## Usage

tbd is opt-in — it never injects itself into a session. At the start of an
epic or any feature that looks bigger than one PR, activate it:

```
Load the using-tbd skill and then: build <your epic>
```

or just ask for trunk-based development discipline in your own words — the
skill descriptions carry the triggers. For small tasks it will tell you it
adds nothing and step aside.

Verify the install by asking:

```
use the skill tool to list skills
```

You should see `using-tbd`, `decomposing-into-pull-requests`,
`sizing-pull-requests`, and `integration-strategy`.

## Tool mapping

The skills speak in actions, not tool names. On OpenCode these resolve to:

- "invoke / load a skill" → OpenCode's native `skill` tool
- "read the map" / read files → `read`
- "write the map" / edit files → `apply_patch`
- "check git", size measurements (`git diff --stat`) → `bash`
- "search project docs" → `grep`, `glob`

## Troubleshooting

Plugin not loading?

1. Check logs: `opencode run --print-logs "hello" 2>&1 | grep -i tbd`
2. Verify the `plugin` entry in your `opencode.json`
3. OpenCode pins git-backed plugins in a lockfile/cache; if an update doesn't
   appear after restart, clear OpenCode's package cache or reinstall.
