# Domino Pro Anota

Mobile-first domino score tracker. Built with React + Vite, installable as a native Android/iOS app via Capacitor.

[![CI](https://github.com/rtavare/domino_pro_anota/actions/workflows/ci.yml/badge.svg)](https://github.com/rtavare/domino_pro_anota/actions/workflows/ci.yml)

---

## Features

- **2-team scoring** — team names are editable inline
- **200-point limit** with visual progress bars
- **Capicúa** — marks when the last tile fits both sides, adds automatic +25 bonus
- **Undo** — removes the last round and reverses the score
- **Match history** — every completed game is saved to device storage
- **Persistent state** — game survives a page refresh or app restart
- **Win tracking** — cumulative game wins shown as dots per team

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18, Vite 5 |
| Native | Capacitor 8 (Android + iOS) |
| Storage | `localStorage` |
| CI/CD | GitHub Actions |
| Dependencies | Dependabot (weekly) |

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Run in browser

```bash
npm install
npm test
npm run dev
```

### Production web build

```bash
npm run build       # outputs to dist/
npm run preview     # serve the dist locally
```

---

## Native Builds

### Android

Requirements: [Android Studio](https://developer.android.com/studio) with Android SDK 36 and Java 21.

```bash
npm run sync:android    # build web assets + sync into Android project
npm run open:android    # open project in Android Studio
```

In Android Studio: select a device or emulator → **Run**.

### iOS _(macOS only)_

Requirements: Xcode 15+ with Command Line Tools.

```bash
npm install -D @capacitor/ios
npx cap add ios
npm run build && npx cap sync ios
npx cap open ios
```

In Xcode: select your device → **Run (⌘R)**.

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/).

| Increment | When to use |
|-----------|-------------|
| **MAJOR** | Breaking change to scoring rules or localStorage data format |
| **MINOR** | New feature (game mode, UI section, plugin) |
| **PATCH** | Bug fix, style tweak, dependency update |

### Creating a release

```bash
git tag v2.1.0
git push origin v2.1.0
```

GitHub Actions will automatically:
1. Run the full CI suite
2. Build an unsigned Android release APK
3. Publish a GitHub Release with auto-generated notes
4. Fire the release webhook (if `WEBHOOK_URL` is configured)

See [CHANGELOG.md](CHANGELOG.md) for full version history.

---

## CI/CD

See **[docs/CICD_PLAN.md](docs/CICD_PLAN.md)** for the complete pipeline design,
webhook integration guide, and roadmap.

The production web app is deployed to GitHub Pages from the built `dist/`
artifact. Its custom domain is `apunta.net`.

---

## Security

See **[SECURITY.md](SECURITY.md)** for the vulnerability policy, branch protection
setup checklist, and secrets management guide.

---

## Project Structure

```
domino_pro_anota/
├── src/
│   ├── App.jsx                  # root — all game state (useReducer)
│   ├── game.js                  # scoring reducer + game constants
│   ├── index.css                # global styles + design tokens
│   ├── main.jsx
│   └── components/
│       ├── Header.jsx
│       ├── TeamCard.jsx         # score display + add-points button
│       ├── PointEntryModal.jsx  # bottom sheet: point entry + capicúa toggle
│       ├── RoundHistory.jsx     # current-game round list
│       ├── MatchHistory.jsx     # cross-session match log
│       └── WinOverlay.jsx       # game-won celebration modal
├── android/                     # Capacitor Android project
├── .github/
│   ├── workflows/
│   │   ├── ci.yml               # PR/push: build + audit + APK
│   │   └── release.yml          # tag: release APK + GitHub Release
│   ├── dependabot.yml
│   └── CODEOWNERS
├── docs/
│   └── CICD_PLAN.md
├── test/
│   └── game.test.js             # scoring reducer tests
├── capacitor.config.ts
├── vite.config.js
├── CHANGELOG.md
└── SECURITY.md
```
