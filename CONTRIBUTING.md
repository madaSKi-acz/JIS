# Contributing to JIS

Thank you for helping! អរគុណសម្រាប់ការចូលរួម! Beginners are very welcome — look for issues labelled **`good first issue`**.

## Ways to help

- **Code** – features, bug fixes, tests
- **Translations** – Khmer and English UI text
- **Docs** – guides, especially in Khmer
- **Map data** – fix places in [OpenStreetMap](docs/fix-data-in-osm.md), not in this repo

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

`pnpm install` also sets up git hooks that format and lint your changes when you commit.

## Workflow

1. Fork the repo and create a branch: `feat/tourism-popup`, `fix/khmer-font`, `docs/setup-km`
2. Make your change. Keep PRs small and focused on one thing.
3. Run `pnpm check` — this is exactly what CI runs.
4. Open a pull request and fill in the template.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org). A git hook checks this for you.

```
feat: add layer toggle for transport
fix: show Khmer name when English name is missing
data: include ferry terminals in transport layer
docs: add Khmer setup guide
```

Allowed types: `feat`, `fix`, `data`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Rules for data and large files

- **Never commit map data.** Generated files go in `data/out/` and `apps/web/public/data/`, which are gitignored.
- **No file over 10 MB.** CI fails if one is added (`pnpm check:large-files`).
- If data is wrong or missing, fix it in OpenStreetMap. If our _filtering_ is wrong (e.g. a tag we should include), change the rules in `data/config/`.

## Code style

- TypeScript with `strict` mode
- Prettier formats everything; ESLint catches mistakes. Don't argue with the formatter.
- Every user-visible string goes in the translation files (from M4), never hardcoded.
- Add tests for logic (data filtering, config, helpers). UI polish doesn't need tests.

## Code of Conduct

Be kind and respectful. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
