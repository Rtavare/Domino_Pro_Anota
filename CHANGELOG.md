# Changelog

All notable changes to Domino Pro Anota are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [Unreleased]

### Planned
- iOS native build support (requires macOS runner in CI)
- Signed Android release APK via GitHub Actions
- Custom app icon and splash screen
- Discord/Slack webhook notification template

---

## [2.1.0] - 2026-05-17

### Added
- Capacitor 8 Android native wrapper (`com.dominopro.anota`)
- GitHub Actions CI pipeline (web build + Android debug APK)
- GitHub Actions release pipeline (tag-triggered, APK artifact)
- Dependabot for weekly npm + GitHub Actions dependency updates
- `SECURITY.md` with vulnerability policy and branch protection guide
- `CODEOWNERS` assigning review responsibility
- `docs/CICD_PLAN.md` full pipeline roadmap
- Webhook notifications on CI failure and release publish
- `npm run sync:android` and `npm run open:android` convenience scripts

---

## [2.0.0] - 2026-05-17

### Added
- Complete rewrite: React 18 + Vite 5
- Two-team scoring with 200-point limit
- Capicúa support: +25 bonus when last tile fits both sides, with live
  point preview in the entry modal
- Game state persisted to `localStorage` — survives page refresh
- Multi-game match history stored across sessions (up to 100 entries)
- Undo last round (reverses score and win count if game was over)
- Win overlay with animated celebration, showing scores and cumulative
  game wins per team
- Editable team names (inline input on each team card)
- Round history list (newest first) with Capicúa badge
- Bold dark UI: purple (Team A) / red (Team B) color system, gradient
  glow effects, slide-up bottom sheets, pop-in overlays

### Changed
- Architecture: single monolithic HTML → React component tree
  (`App`, `TeamCard`, `PointEntryModal`, `RoundHistory`,
  `MatchHistory`, `WinOverlay`, `Header`)
- State management: ad-hoc globals → `useReducer` with localStorage sync

### Removed
- English/Spanish language toggle (simplified UX)
- Best-of-5 mode (replaced with unlimited multi-game match tracking)
- Hardcoded "P1" / "P2" labels (now fully editable team names)
- Capicúa as a duplicate of +25 (now correctly adds +25 bonus on top
  of entered round points)

---

## [1.0.0] - 2024-01-01

### Added
- Single-file HTML/CSS/JS domino scorer
- Two-player (P1 green / P2 red) scoring
- 200-point game limit
- Best-of-5 match mode
- Quick +25 button per player
- Capicúa button (functionally identical to +25 — not implemented)
- Undo last move
- Full reset
- Round history table
- Recent wins strip
- English/Spanish language toggle
- iOS PWA meta tags and inline SVG icon
