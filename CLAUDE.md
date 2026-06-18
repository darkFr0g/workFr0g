# CLAUDE.md — Field Hub (workFr0g) project brief

Context for any Claude Code session working on this repo. Read this first.

## What this is

**Field Hub** (a.k.a. **workFr0g**) — a single-page web app of quick-reference
tools for a Con Edison **Construction Representative** doing **XCMG** gas-utility
construction work in the **Bronx, NY**. It runs entirely client-side, works
offline, and installs to the iPhone home screen as a PWA. **Primary device is an
iPhone** — optimize for that.

**Live:** https://darkfr0g.github.io/workFr0g/
**Repo:** https://github.com/darkFr0g/workFr0g

This is the **sibling** of **Field Log** (https://github.com/darkFr0g/FieldLog),
which handles route sheets + Daily Log Reports. Field Hub is the *reference*
half. It supersedes the retired **GasReferenceTool** repo.

### Four tools inside the app (each its own folder)
- **XCMG Item Search** (`xcmg-reference/`) — searchable list of XCMG construction
  items/codes (code, description, unit, type, categories), with a "commonly
  used" starred set.
- **Quick Reference** (`quick-reference/`) — at-a-glance field lookups (stip
  schedule, pressure testing, conversions, UG clearances).
- **Gas Symbols** (`gas-symbols/`) — gas-utility map symbols and meanings.
- **Charging Guide** (`charging-guide/`) — POET / charging codes reference.

The hub `index.html` is just the tile launcher for the four tools. All data
ships inline in the app — nothing is sent to a server.

## Architecture / conventions

- **No build step.** Plain static files served as-is. Don't add a bundler,
  framework, or npm unless explicitly asked — the simplicity is intentional.
- **Vanilla JS**, no modules/TypeScript. Idiom is mixed `var`/`function` with
  some `const`/`let`/arrow functions — match whatever the file you're editing
  already uses.
- **Relative paths everywhere** (`./...`), including the service worker precache
  list in `sw.js` — these resolve correctly under the `/workFr0g/` Pages subpath
  without hard-coding it (matches the Field Log sibling). Do **not** switch
  `sw.js` back to absolute `/workFr0g/...` paths. `manifest.json`
  `start_url`/`scope` remain `/workFr0g/`.
- Structure:
  - `index.html` — hub home screen (tool tiles)
  - `xcmg-reference/index.html` — XCMG Item Search (the big one)
  - `quick-reference/index.html`, `gas-symbols/index.html`,
    `charging-guide/index.html` — the other three tools
  - `manifest.json`, `sw.js` — PWA
  - `icons/` — `icon-192.png`, `icon-512.png`

## Design / visual style (matte — matches Field Log)

As of v1.3.0 the app uses the **Field Log "matte" look**, not the old dark
navy/glow theme. Keep all pages on this system:
- **Palette:** matte grey bg `#EBEBEB`, white card surfaces `#fff`, grey borders
  `#D0D0D0`, near-black ink `#111` / `#1A1917` for the top bar + primary buttons.
  Tiny uppercase labels (weight 800, wide letter-spacing). Flat — no glows, no
  grid texture, light shadows only.
- **Accents (card stripes):** blue `#2563EB`, green `#059669`, purple `#7C3AED`,
  amber `#D97706`. Status tints: green/amber/blue `*-bg`/`*-text` pairs.
- **Fonts:** `DM Sans` (body) + `DM Mono` (mono), loaded from Google Fonts with a
  system-font fallback so it still looks right offline.
- Each tool page carries its **own inline `<style>`** (no shared CSS file — the
  no-build rule stands), so the matte tokens are duplicated per page. When
  editing one tool, match these exact values.
- **Rollout status:** ✅ matte across the whole app — hub `index.html` and all
  four tool pages (`xcmg-reference`, `quick-reference`, `gas-symbols`,
  `charging-guide`) reskinned as of v1.3.0.

## Deploy

- **Push to `main` → auto-publishes** to GitHub Pages (Pages source is the
  repo branch; there is **no** `.github/workflows/` Action here — unlike
  FieldLog). Live site updates in ~1–2 min.
- Verify via the public API
  (`https://api.github.com/repos/darkFr0g/workFr0g/...`) and by fetching the
  changed file from the live URL.

## Service worker / caching (important when shipping updates)

- `sw.js`: **network-first** for HTML (so deploys go live when online),
  **cache-first** for static assets. Precache list (`PRECACHE_URLS`) names each
  tool's `index.html` by **relative `./...` path**.
- **Bump `CACHE_VERSION`** in `sw.js` on every release (currently **`v1.3.0`**)
  so devices re-fetch. **Also update the footer version** in the hub
  `index.html` (`.footer-version`, currently `v1.3.0`) to match — keep the two
  in sync.
- iOS home-screen icons do NOT auto-update — the user must delete and re-add the
  home-screen shortcut to get a new icon.

## XCMG data model (the heart of the app)

Lives **inline** in `xcmg-reference/index.html`:
- `const ITEMS = [{code, desc, unit, type, cats:[], note?}]` — the full item
  list (grouped by section comments like `// ── RESTORATION ──`).
- `const COMMON = new Set([...])` — the starred "commonly used" codes.

**Source of truth (regenerate `ITEMS`/`COMMON` from here):**
`C:\Users\jflav\iCloudDrive\!Work Hub iOS\iDrive (Latest)\XCMG_Gas_Reference_Tool_v4_2.xlsx`
— sheets: "Item Search" (~564 rows), "★ Commonly Used", "Quick Reference",
Gas/Electric Transmission Guides, Work Area Protection.

Spreadsheet column quirks when re-parsing: starred rows put the star marker in
col A and the code in col B; un-starred rows put the code in col A; when Item
Type is blank, the Category value drifts left into the Type column. SheetJS full
build crashes under Node on this machine — instead unzip the `.xlsx` and
regex-parse `sharedStrings.xml` + `worksheets/*.xml`.

## Local development

Static files, but the service worker needs `http://` (not `file://`). Serve the
folder with any static server (Node/Python not guaranteed on the Windows dev
machine — see the FieldLog repo's `.claude/` for a no-dependency static server).

## Repo / clone notes

- **Real git clone (use this):** `C:\Users\jflav\workFr0g\` — push to `main` to
  deploy. Files use CRLF endings.
- **Do NOT edit** the stale loose copy at
  `C:\Users\jflav\iCloudDrive\!Work Hub iOS\GitHub\Field hub\workFr0g 2\` — it
  diverged from the live repo and is retired.

## How we work together (sessions & memory)

This brief is written here on purpose: **`CLAUDE.md` is committed to the repo, so
it syncs across every device through GitHub** — including the user's iPhone, which
is the primary device. It is the one piece of context guaranteed to load in any
session working in this repo, on any device.

- **`memory/` does NOT sync across devices** and is scoped per-repo. It lives in
  the local `.claude` folder of whichever machine wrote it (desktop), under a
  path keyed to *this* repo. iOS sessions can't see it. So anything durable the
  iPhone needs belongs **here in `CLAUDE.md`**, not in a memory note.
- **Organize chats by workstream, not by device.** Field Hub work goes in its own
  chat (ideally on the iPhone, the primary device), rooted in the `workFr0g`
  repo so this brief loads. Field Log work lives in a separate chat against the
  FieldLog repo. Cross-repo / setup work goes in a general desktop chat.
- A fresh chat loses nothing important as long as durable facts live in this file
  (and the code). Don't rely on reading old conversations — write it down here.

## Related projects

- **[Field Log](https://github.com/darkFr0g/FieldLog)** — sibling PWA (route
  sheets + DLR). The two are separate apps with separate repos and memory.
- _Retired:_ **GasReferenceTool** — its tools were folded into this hub.
