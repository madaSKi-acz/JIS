# Roadmap

## v1

| Milestone                     | Scope                                                                                   | Status  |
| ----------------------------- | --------------------------------------------------------------------------------------- | ------- |
| **M0 – Foundation**           | Repo structure, tooling, CI, licenses, docs                                             | ✅ Done |
| **M1 – Data pipeline**        | `pnpm data:build`: Geofabrik extract → filtered `tourism.geojson` / `transport.geojson` | ✅ Done |
| **M2 – Base map**             | MapLibre + OpenFreeMap; test Khmer label rendering early                                | ✅ Done |
| **M3 – Layers**               | Tourism and transport points, icons, popups, layer toggles                              | ⏳ Next |
| **M4 – Language & polish**    | Khmer/English switch, Noto Sans Khmer, mobile layout                                    |         |
| **M5 – Open to contributors** | Labels, `good first issue`s, release `v1.0.0`                                           |         |

### v1 is done when

- A new contributor can go from `git clone` to seeing the map in under 10 minutes.
- CI is green on every PR.
- The UI works in Khmer and English, on phone and desktop.
- Running locally costs $0.

## Later (not in v1)

Search, routing/directions (OSRM or Valhalla), a backend/database, offline mode, more countries.
