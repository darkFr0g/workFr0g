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

### Five tools inside the app (each its own folder)
- **XCMG Item Search** (`xcmg-reference/`) — searchable list of XCMG construction
  items/codes (code, description, unit, type, categories), with a "commonly
  used" starred set.
- **Charging Guide** (`charging-guide/`) — POET / charging codes reference.
- **Quick Reference** (`quick-reference/`) — at-a-glance field lookups (stip
  schedule, pressure testing, conversions, UG clearances).
- **Gas Symbols** (`gas-symbols/`) — gas-utility map symbols and meanings.
- **Glossary** (`glossary/`) — gas terms, acronyms, pressure classes & suffix
  keys; client-side search. Seeded as a starter set, **meant to grow** (more
  sections/terms to come).

Hub-tile + nav order is **Items → Charging → Quick → Symbols → Glossary**
(Charging follows Items, by request). The hub `index.html` is the tile launcher.
All data ships inline in the app — nothing is sent to a server.

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
  - `charging-guide/index.html`, `quick-reference/index.html`,
    `gas-symbols/index.html`, `glossary/index.html` — the other four tools
  - `manifest.json`, `sw.js` — PWA
  - `icons/` — `icon-192.png`, `icon-512.png`

## Design / visual style (matte monochrome — matches Field Log)

As of v1.5.0 the app uses a **matte, near-monochrome** take on the Field Log
look. Keep all pages on this system:
- **Palette:** matte grey bg `#EBEBEB`, white card surfaces `#fff`, grey borders
  `#D0D0D0`, near-black ink `#111` / `#1A1917` for the top bar + nav. Tiny
  uppercase labels (weight 800, wide letter-spacing). Flat — no glows, no grid
  texture, light shadows only.
- **Mostly monochrome, one minimalist accent colour per section.** Each tool owns
  one colour — used for its hub-card stripe + icon and its active nav tab (and on
  a tool page, its logo badge + section headers): **Items `#2563EB` blue,
  Charging `#D97706` amber, Quick `#0891B2` teal, Gas Symbols `#65A30D` lime,
  Glossary `#7C3AED` violet.** Don't bring back a multi-colour rainbow on the hub
  *chrome*. (XCMG's internal category colours stay for functional code
  colour-coding.)
- **Nav:** shared dark icon bar across all 6 pages (Home + 5 tools) — line-art SVG
  icons (`stroke:currentColor`) stacked over tiny uppercase labels, Field Log
  style. Active tab = that page's accent colour (white on Home). Labels:
  **Home**, Items, Charging, Quick, Symbols, Glossary. **No emoji.** The nav is
  the **topmost, sticky, notch-safe** bar on every page — uniform across all six;
  on Home the "Field Hub" title bar sits *below* the nav (like the tool pages'
  logo bars). Markup is duplicated per page.
- **Fonts:** `DM Sans` (body) + `DM Mono` (mono), Google Fonts + system fallback.
- Each tool page carries its **own inline `<style>`** (no shared CSS file — the
  no-build rule stands), so tokens + nav markup are duplicated per page; a
  nav/icon change means editing all **six** files (hub + 5 tools).
- **Value-column text uses the sans `--font`, not `--mono`** — DM Mono mangles
  fraction glyphs (¼, ½). Keep code/acronym cells mono, but plain values sans.
- **Rollout status:** ✅ matte monochrome across the whole app as of v1.5.0.

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
- **Bump `CACHE_VERSION`** in `sw.js` on every release (currently **`v1.5.7`**)
  so devices re-fetch. **Also update the footer version** in the hub
  `index.html` (`.footer-version`, currently `v1.5.7`) to match — keep the two
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

## Backlog / to-do (live list — keep updated)

Open items as of v1.5.0. Tick/trim as they ship.

**Review / decide (user's call):**
1. **Symbols icon** — confirm the GIS-map-with-route icon, or redraw (two prior
   icons were rejected: a map emoji and a shapes icon).
2. **Accent colours** — confirm the five: Items blue `#2563EB`, Charging amber
   `#D97706`, Quick teal `#0891B2`, Symbols lime `#65A30D`, Glossary violet
   `#7C3AED`.
3. **Glossary terms** — verify the seeded set; add more (user to paste a list).
4. **XCMG tag colours** — keep the category tags colour-coded (functional) or
   grey them for full monochrome.

**Fix:**
5. **Page logos/headers → match section accent** — Charging & Quick still show a
   blue `XCMG` logo despite amber/teal accents; Symbols & Glossary already match.
6. **Faint Gas Symbols line-colours** — lighter green/blue symbol strokes may be
   hard to read on the white background; darken for the field.
7. ✅ **Freeze header + nav + clear the Dynamic Island** (done v1.5.1) — the nav is
   sticky and safe-area-padded (`padding-top:env(safe-area-inset-top)`) on every
   page so it sits below the notch; the hub wraps header+nav in a sticky
   `.topzone`; XCMG pads its `.sticky-top`.
8. **Remove the status dot** from the hub header (online/offline indicator + its
   small script).

**Build:**
9. **XCMG source attribution** — credit the *construction trenching manual* on the
   Items page. **Need the exact manual name from the user.**
10. **Grow the Glossary** — more terms/sections over time.
    - ⏳ **REMINDER: get IP8 / IP9 procedure definitions** — placeholders ("summary
      to be added") are live in the new **Procedures** section; user to pull the
      exact wording from the procedure docs (no access at the moment).
11. **Future sections** — more tools planned (TBD).

**Parked (optional/minor):**
12. **Auto-deploy GitHub Action** — needs a one-tap Pages-source flip in repo
    settings; current branch-source deploy works fine without it.
13. **Offline fonts** — DM Sans/Mono aren't runtime-cached yet (falls back to
    system fonts offline).
14. **Confirm Field Log `CLAUDE.md` drift fixed** (was being handled in a FieldLog
    session).
15. **Trim MCP servers** — drop Notion + tldraw from the workFr0g session (unused
    here; GitHub is the only one needed).
16. **Optional: shared nav/styles file** — pull the duplicated icon-nav markup +
    base tokens into one file the pages link to (a small `<script src>`/`<link>`,
    still no build step), so a nav/icon change is one edit instead of six. Only
    worth it if the 6-file duplication keeps biting. A full css/js split (Field
    Log-style) is **not** recommended — the app works and users can't tell; it'd
    also flip the GitHub language label from HTML to JavaScript, but that's
    cosmetic.

## Related projects

- **[Field Log](https://github.com/darkFr0g/FieldLog)** — sibling PWA (route
  sheets + DLR). The two are separate apps with separate repos and memory.
- _Retired:_ **GasReferenceTool** — its tools were folded into this hub.
