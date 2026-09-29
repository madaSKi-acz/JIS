# Architecture

## Big picture

```
OpenStreetMap ──► Geofabrik Cambodia extract (.osm.pbf, ~50 MB)
                        │
                        ▼
            data/scripts  (filter by rules in data/config/)
                        │
                        ▼
      data/out/*.geojson  ──copy──►  apps/web/public/data/   (all gitignored)
                                              │
                                              ▼
       apps/web (MapLibre) ── loads from VITE_DATA_URL ──► browser
                 └── base map from OpenFreeMap (VITE_BASEMAP_STYLE_URL)
```

## Key decisions

1. **Code and data are separate.** GitHub stores only code. Data is rebuilt from OSM by a script, so anyone can reproduce it and the repo stays small and free.
2. **The app never hardcodes the data location.** It reads `VITE_DATA_URL`. Locally that's `/data` (served by Vite); when deployed it points to wherever the files are uploaded. Deploying is a config change, not a code change.
3. **No backend in v1.** The app is static files, so it can be hosted for free (GitHub Pages, Netlify, Cloudflare Pages). A backend (PostGIS, routing) comes later only if needed.
4. **We don't host the base map.** OpenFreeMap provides free vector tiles, so we only serve our own small tourism/transport layers.
5. **Khmer map labels use real font files.** Map glyph servers send one character at a time, which breaks Khmer (stacked consonants, vowel signs). We bundle Noto Sans Khmer and register it with MapLibre's `font-faces`, so the browser shapes whole Khmer syllables. See `apps/web/src/map/fonts.ts`.
6. **Fix data upstream.** Wrong data is fixed in OpenStreetMap, not patched in this repo.

## Workspaces

The repo uses pnpm workspaces (`pnpm-workspace.yaml`). Tooling (ESLint, Prettier, Vitest, TypeScript) is configured once at the root.

| Path       | Purpose                             |
| ---------- | ----------------------------------- |
| `apps/web` | The map web app (`@jis/web`)        |
| `data`     | Data pipeline scripts and tag rules |
| `scripts`  | Repo tooling                        |
