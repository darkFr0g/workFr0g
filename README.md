# Field Hub (workFr0g)

A single-page web app of quick-reference tools for Con Edison / XCMG gas-utility
construction work in the Bronx. It runs entirely in the browser, works offline,
and installs to the iPhone home screen as a PWA.

**Live:** https://darkfr0g.github.io/workFr0g/

## Tools

- **XCMG Item Search** — searchable list of XCMG construction items and codes
  (item, description, unit, type, categories), with a "commonly used" set.
- **Quick Reference** — at-a-glance reference guide for common field lookups.
- **Gas Symbols** — gas-utility map symbols and what they mean.
- **Charging Guide** — POET / charging codes reference.

All data ships with the app — nothing is sent to a server, and everything works
with no signal once installed.

## Project structure

```
index.html                  Hub home screen (tool tiles)
xcmg-reference/index.html    XCMG Item Search
quick-reference/index.html   Quick Reference guide
gas-symbols/index.html       Gas Symbols
charging-guide/index.html    Charging Guide (POET codes)
icons/                       PWA / home-screen icons
manifest.json                PWA manifest
sw.js                        Service worker (offline cache)
```

No build step — these are plain static files.

## Deployment

Pushing to `main` publishes the repo to GitHub Pages
(**Settings → Pages → Source**). The app is live at the URL above within a
minute or two.

### Adding a new tool

1. Create a subfolder: `my-tool/index.html`.
2. Add a tile in `index.html` (copy an existing `.tool-card` block).
3. Add its URL to `PRECACHE_URLS` in [`sw.js`](sw.js).
4. Bump `CACHE_VERSION` in `sw.js` so devices fetch the update.

## Local development

It's just static files, but a service worker requires `http://`, not `file://`.
Serve the folder with any static server, e.g.:

```powershell
# Python 3
python -m http.server 8000
# then open http://localhost:8000/
```

## Installing on iPhone

1. Open the live URL in **Safari**.
2. Tap the **Share** button → **Add to Home Screen**.
3. Launch from the home-screen icon — it opens full-screen and works offline.

## Offline behaviour

The service worker is network-first for the app shell (so deploys go live when
online) and cache-first for static assets. To force a hard refresh of all cached
assets, bump `CACHE_VERSION` in [`sw.js`](sw.js).

## Related projects

- **[Field Log](https://github.com/darkFr0g/FieldLog)** — sibling PWA for daily
  route-sheet extraction and Daily Log Reports.
- _Retired:_ **GasReferenceTool** — its tools were folded into this hub.
