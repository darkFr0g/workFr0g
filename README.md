# Field Hub — XCMG

Personal PWA hub for gas utility construction field tools.  
Dark theme · Mobile-first · Offline-capable · GitHub Pages hosted.

---

## Repo Structure

```
/                          ← hub homepage (this repo root)
├── index.html             ← hub home screen
├── manifest.json          ← PWA manifest
├── sw.js                  ← service worker (offline caching)
├── icons/
│   ├── icon-192.png       ← PWA icon (192×192)
│   └── icon-512.png       ← PWA icon (512×512)
│
├── xcmg-reference/
│   └── index.html         ← XCMG Gas Reference Tool
│
└── quick-reference/
    └── index.html         ← Quick Reference Guide
```

---

## Adding a New Tool

1. Create a subfolder: `my-tool/index.html`
2. Add a tile in `index.html` (copy an existing `.tool-card` block)
3. Add its URL to `PRECACHE_URLS` in `sw.js`
4. Bump `CACHE_VERSION` in `sw.js` so users get the updated cache

---

## Icons

You'll need two PNG icons for the PWA manifest:

| File | Size | Notes |
|------|------|-------|
| `icons/icon-192.png` | 192×192 | Android home screen, splash |
| `icons/icon-512.png` | 512×512 | Play Store / install prompt |

Recommended: dark background `#0f1117`, "CE" monogram in Con Ed blue `#4ab3e8`.  
Generate free at: https://maskable.app/editor or https://realfavicongenerator.net

---

## Deploying to GitHub Pages

1. Create a new repo (e.g. `field-hub`)
2. Push all files to the `main` branch
3. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
4. Your hub will be live at: `https://<username>.github.io/field-hub/`

> **Tip**: Set `"start_url": "/field-hub/"` and `"scope": "/field-hub/"` in  
> `manifest.json` if GitHub Pages serves from a subdirectory path.

---

## Updating the Cache

Whenever you deploy changes:
1. Open `sw.js`
2. Bump `CACHE_VERSION` (e.g. `v1.0.0` → `v1.1.0`)
3. The new service worker will automatically clear the old cache on next visit

---

## Color Palette

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#0f1117` | Page background |
| `--bg-card` | `#161b24` | Card background |
| `--blue` | `#4ab3e8` | Con Ed blue, accents |
| `--green` | `#4ae87a` | Online status, offline-ready |
| `--amber` | `#e8a34a` | In-progress badges |
| `--red` | `#e84a4a` | Offline status |
