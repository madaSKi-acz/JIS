# JIS – Cambodia Tourism & Transport Map

[ភាសាខ្មែរ](README.km.md)

An open-source web map of Cambodia focused on **tourism** and **public transport**, built on free [OpenStreetMap](https://www.openstreetmap.org) data. Started as a self-study project, built to grow, and open to contributions from the Khmer developer community.

> Status: **v1.0.0** — see the [changelog](CHANGELOG.md) and [roadmap](docs/roadmap.md). New here? Look for issues labelled [`good first issue`](https://github.com/madaSKi-acz/JIS/labels/good%20first%20issue).

**Live map:** https://madaski-acz.github.io/JIS/

## Features

- Map of Cambodia with tourist attractions, hotels, temples, museums and viewpoints
- Transport layer: bus stops, stations, ferry terminals, airports and bus routes
- Pick a bus line to see its route and stops in order
- Khmer / English interface
- Works on phone and desktop
- Costs $0 to run locally

## Quick start

Requires Node.js 20+ (22 recommended, see `.nvmrc`) and [pnpm](https://pnpm.io/installation) 10+ (`corepack enable` sets it up).

```bash
git clone https://github.com/madaSKi-acz/JIS.git
cd JIS
pnpm install
cp .env.example .env
pnpm data:build   # download + build map data (see data/README.md)
pnpm dev
```

Then open http://localhost:5173. The map is in Khmer by default; use the **ខ្មែរ | EN** button at the top right to switch.

Map data is **not stored in this repo**. `pnpm data:build` generates it locally from OpenStreetMap. See [data/README.md](data/README.md).

## Scripts

| Command           | What it does                                                         |
| ----------------- | -------------------------------------------------------------------- |
| `pnpm dev`        | Start the web app locally                                            |
| `pnpm data:build` | Download OSM data and build the map layers                           |
| `pnpm build`      | Production build                                                     |
| `pnpm test`       | Run tests (Vitest)                                                   |
| `pnpm lint`       | Lint with ESLint                                                     |
| `pnpm format`     | Format with Prettier                                                 |
| `pnpm check`      | Everything CI runs: format, lint, typecheck, tests, large-file check |

## Project structure

```
apps/web/     the map app (TypeScript + Vite + MapLibre)
data/         scripts that build map data from OSM (output is gitignored)
docs/         architecture, data sources, guides
scripts/      repo tooling (e.g. large-file check)
.github/      CI, issue and PR templates
```

More detail: [docs/architecture.md](docs/architecture.md).

## Deployment

The live map is hosted for free on GitHub Pages by [`.github/workflows/pages.yml`](.github/workflows/pages.yml). It rebuilds the data from OpenStreetMap and redeploys on every push to `main`, every Monday, and on demand (**Actions → Deploy map → Run workflow**).

It costs nothing for a public repository. To pause updates, disable the workflow in the **Actions** tab; to take the site offline, use **Settings → Pages → Unpublish site**.

## Contributing

Contributions are welcome — code, translations, docs, or fixing map data in OpenStreetMap. Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

Found a wrong or missing place? Please fix it in OpenStreetMap: [docs/fix-data-in-osm.md](docs/fix-data-in-osm.md).

## License

- **Code:** [MIT](LICENSE)
- **Map data:** © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), available under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/)
- **Base map tiles:** [OpenFreeMap](https://openfreemap.org)
