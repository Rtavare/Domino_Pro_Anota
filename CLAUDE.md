# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # start Vite dev server (localhost:5173)
npm run build            # production build → dist/
npm run preview          # serve dist/ locally (localhost:4173)

npm run sync:android     # build web + npx cap sync android
npm run open:android     # open android/ in Android Studio
```

There are no tests and no linter configured. There is no `npm test` script.

After any code change that targets Android, always run `npm run sync:android` before opening Android Studio — Capacitor does not auto-watch for changes.

## Architecture

### State management

All game state lives in a single `useReducer` in `src/App.jsx`. There is no external state library. The reducer handles five actions: `ADD_POINTS`, `UNDO`, `SET_TEAM_NAME`, `NEW_GAME`, `RESET_MATCH`.

Two pieces of state live outside the reducer:
- `matchHistory` — a `useState` array, separate from the reducer because it only grows (archived games) and never needs to participate in undo
- `entryFor` / `showHistory` — transient UI visibility flags, also in `App.jsx`

Both `game` (reducer state) and `matchHistory` are synced to `localStorage` via `useEffect` on every change. Storage keys are `dpa_game_v2` and `dpa_history_v2`. The `_v2` suffix exists to avoid collisions with the old v1 single-file app's storage. If the data shape ever changes in a breaking way, increment the key suffix.

### Data flow

```
App.jsx (useReducer + localStorage sync)
  ├── TeamCard         — receives team object + teamIdx; dispatches nothing directly,
  │                      calls onAddPoints() / onNameChange() callbacks up to App
  ├── PointEntryModal  — local state only (points string, capicua bool);
  │                      calls onSubmit(teamIdx, points, capicua) up to App
  ├── RoundHistory     — display only, no callbacks
  ├── WinOverlay       — calls onNewGame / onResetMatch up to App
  ├── MatchHistory     — calls onClose / onClear up to App
  └── Header           — calls onHistory / onReset up to App
```

Components are purely presentational; all business logic (scoring, undo, archiving) stays in `App.jsx`.

### Styling

All styles are in a single `src/index.css` — no CSS modules, no Tailwind. Design tokens are CSS custom properties on `:root`. Team identity is encoded by a numeric index (0 = purple `--a`, 1 = red `--b`); components apply it via class suffixes like `team-card-0`, `score-number-1`, `btn-submit-0`. When adding new team-colored elements, follow this pattern rather than hardcoding colors.

The layout is fixed-height (`html, body, #root { height: 100%; overflow: hidden }`). The scrollable area is `.main` only. Do not add `overflow` to parent elements.

### Capacitor / Android

`capacitor.config.ts` points `webDir` at `dist/`. The Android project in `android/` is a standard Capacitor-generated Gradle project. `MainActivity.java` contains only a `BridgeActivity` subclass — all app logic runs in the WebView. Do not edit files inside `android/` directly unless configuring native permissions or plugins; use `capacitor.config.ts` for Capacitor-level settings.

### CI/CD

- CI runs on push to `main`, `claude/*`, `feature/*`, `fix/*` branches and on PRs to `main`
- Jobs: web build + `npm audit` (high+), then Android debug APK (needs web job to pass)
- Release pipeline triggers on tags matching `v[0-9]+.[0-9]+.[0-9]+`
- Webhook notifications use `vars.WEBHOOK_URL` (a GitHub repository variable, not a secret)
- See `docs/CICD_PLAN.md` for the full pipeline design and roadmap

### Versioning

Tag format: `v{MAJOR}.{MINOR}.{PATCH}`. Update `CHANGELOG.md` (move items from `[Unreleased]`) before tagging. Bump MAJOR only when the `localStorage` data shape changes in a way that breaks existing saved games.
