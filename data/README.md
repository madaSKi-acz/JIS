# Data

Scripts that build the map data from OpenStreetMap. **Nothing generated here is committed.**

| Path       | Committed?      | Contents                                    |
| ---------- | --------------- | ------------------------------------------- |
| `scripts/` | yes             | Download, filter and export scripts         |
| `config/`  | yes             | Which OSM tags count as tourism / transport |
| `raw/`     | no (gitignored) | Downloaded Geofabrik extract                |
| `out/`     | no (gitignored) | Generated GeoJSON                           |

The pipeline (`pnpm data:build`) is coming in **M1**. See [docs/roadmap.md](../docs/roadmap.md).
