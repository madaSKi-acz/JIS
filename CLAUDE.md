# CLAUDE.md

Guidance for Claude Code sessions working in this repo.

## Branch rules

- **Always work on the `develop` branch.** Do not create `claude/*` session branches or other feature branches.
- If `develop` is missing locally: `git fetch origin develop && git checkout develop`.
- Commit and push to `origin develop`.
- Never push directly to `main`. `main` is updated only by merging a PR from `develop` when a milestone is done.

## Commit attribution

End every commit message with this co-author line (instead of a Claude co-author line):

```
Co-Authored-By: sok dev <soknhok10@gmail.com>
```

## Project

Open-source tourism and transport map of Cambodia on OpenStreetMap. See `README.md`, `docs/architecture.md` and `docs/roadmap.md` (milestones M0–M5).

## Commands

- `pnpm check` — format, lint, typecheck, tests, large-file check (same as CI). Run before every push.
- `pnpm build` — production build of `apps/web`.

## Conventions

- Use pnpm (not npm or yarn). Add deps with `pnpm add` in the package that uses them.
- Conventional Commits (`feat:`, `fix:`, `data:`, `docs:`, ...), enforced by commitlint.
- Never commit map data or files over 10 MB; generated data lives in gitignored `data/out/` and `apps/web/public/data/`.
- The app reads the data location from `VITE_DATA_URL`; never hardcode it.
