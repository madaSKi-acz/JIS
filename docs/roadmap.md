# Roadmap

## v1

| Milestone                     | Scope                                                                                   | Status  |
| ----------------------------- | --------------------------------------------------------------------------------------- | ------- |
| **M0 – Foundation**           | Repo structure, tooling, CI, licenses, docs                                             | ✅ Done |
| **M1 – Data pipeline**        | `pnpm data:build`: Geofabrik extract → filtered `tourism.geojson` / `transport.geojson` | ✅ Done |
| **M2 – Base map**             | MapLibre + OpenFreeMap; test Khmer label rendering early                                | ✅ Done |
| **M3 – Layers**               | Tourism and transport points, icons, popups, layer toggles                              | ✅ Done |
| **Bus lines**                 | Pick a bus line to highlight its route and ordered stops                                | ✅ Done |
| **M4 – Language & polish**    | Khmer/English switch, Noto Sans Khmer, mobile layout                                    | ✅ Done |
| **M5 – Open to contributors** | Labels, `good first issue`s, release `v1.0.0`                                           | ⏳ Next |

### v1 is done when

- A new contributor can go from `git clone` to seeing the map in under 10 minutes.
- CI is green on every PR.
- The UI works in Khmer and English, on phone and desktop.
- Running locally costs $0.

## Later (not in v1)

Search, routing/directions (OSRM or Valhalla), a backend/database, offline mode, more countries.

**Connectivity layer.** Mobile towers (OpenCelliD, CC BY-SA), schools (OSM `amenity=school`) and measured internet speed (Ookla open data, non-commercial licence), with pulsing towers and schools coloured by speed or distance to the nearest tower. Tower-to-school links would not be drawn, since which tower serves which school is unknown.

**Live bus positions.** OpenStreetMap only has routes and stops, not where buses are right now. Showing moving buses needs a real-time GPS feed from the bus operator (usually GTFS-Realtime) and a small server to relay it. The bus line view is built so a live vehicle layer can be added on top once such a feed is available.
