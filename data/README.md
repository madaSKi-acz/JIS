# Data

Builds the map layers from OpenStreetMap. **Nothing generated here is committed.**

## Build the data

```bash
pnpm data:build
```

This will:

1. Download the Cambodia extract from [Geofabrik](https://download.geofabrik.de/asia/cambodia.html) to `data/raw/cambodia-latest.osm.pbf` (about 50 MB). It is skipped if the local copy is less than 7 days old.
2. Keep only the features that match the rules in [`config/layers.ts`](config/layers.ts).
3. Write `tourism.geojson`, `transport.geojson` and `meta.json` to `data/out/`.
4. Copy them to `apps/web/public/data/`, where `pnpm dev` serves them at `/data`.

Already downloaded the file yourself? Put it at `data/raw/cambodia-latest.osm.pbf`, or point to it:

```bash
pnpm data:build --input path/to/cambodia-latest.osm.pbf
```

Other options: `--refresh` (always download), `--offline` (never download), `--max-age-days <n>`, `--help`.

## Folders

| Path       | Committed?      | Contents                                    |
| ---------- | --------------- | ------------------------------------------- |
| `config/`  | yes             | Tag rules: which OSM tags go in which layer |
| `scripts/` | yes             | The pipeline and its tests                  |
| `test/`    | yes             | Test helpers and a tiny sample dataset      |
| `raw/`     | no (gitignored) | Downloaded extract                          |
| `out/`     | no (gitignored) | Generated GeoJSON                           |

## Output format

Each layer is a GeoJSON `FeatureCollection`. Tourism places and stops are `Point`s; bus, ferry and train routes are `MultiLineString`s. Places mapped as areas are placed at the average of their outline.

Feature properties:

| Property                                                                                     | Example                   |
| -------------------------------------------------------------------------------------------- | ------------------------- |
| `id`                                                                                         | `node/123`, `way/456`     |
| `category`                                                                                   | `temple`, `bus_stop`      |
| `name`                                                                                       | from the OSM `name` tag   |
| `name_km`, `name_en`                                                                         | from `name:km`, `name:en` |
| `opening_hours`, `website`, `phone`, `operator`, `ref`, `network`, `from`, `to`, `wikipedia` | when present              |

`meta.json` holds the data date, source and feature counts per category.

## Changing what's on the map

Edit the rules in [`config/layers.ts`](config/layers.ts), add a test in `scripts/lib/classify.test.ts`, and run `pnpm data:build`. If a place is **missing or wrong in OSM itself**, fix it in OpenStreetMap instead: [docs/fix-data-in-osm.md](../docs/fix-data-in-osm.md).
