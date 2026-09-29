# Changelog

All notable changes to this project are listed here. The format follows [Keep a Changelog](https://keepachangelog.com), and versions follow [Semantic Versioning](https://semver.org).

## [1.0.0] – 2026-09-29

First public version: an open-source tourism and transport map of Cambodia built on OpenStreetMap.

### Added

- **Data pipeline** (`pnpm data:build`): downloads the Geofabrik Cambodia extract, keeps tourism and transport features using the rules in `data/config/layers.ts`, and writes GeoJSON locally. Map data is never committed.
- **Base map** with OpenFreeMap tiles and correctly shaped Khmer labels (bundled Noto Sans Khmer via MapLibre font faces).
- **Tourism layer**: heritage sites, temples, museums, attractions, viewpoints and accommodation.
- **Transport layer**: bus stops and stations, train stations, ferry terminals, airports, bus/ferry/train routes and railway tracks.
- **Popups** with Khmer and English names, opening hours, phone, website and a link to edit the place on OpenStreetMap.
- **Layer panel** to switch groups and categories on and off, with counts.
- **Bus lines**: search and pick a line to highlight its route and ordered stops.
- **Khmer | English switch**, remembered per browser.
- Phone-friendly layout, loading indicator, and a clear message when data has not been built.
- Tooling: TypeScript, ESLint, Prettier, Vitest, commit hooks, and CI with a large-file guard.

[1.0.0]: https://github.com/madaSKi-acz/JIS/releases/tag/v1.0.0
