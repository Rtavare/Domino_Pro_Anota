# CLAUDE.md — Domino Pro Scoreboard

## Project Overview

**Domino Pro Scoreboard** is a bilingual (English/Spanish) domino scoreboard app being packaged as a native mobile app for iOS and Android using Capacitor.

- Paid app: $0.99
- No ads, no account, no tracking
- Local-only data via localStorage (v1)

## Repository

- GitHub: `https://github.com/Rtavare/Domino_Pro_Anota.git`
- Current branch: `feat/capacitor-setup`
- Local path: `/home/ric/Domino_Pro_Anota/`

## Project Structure

```
Domino_Pro_Anota/
  www/
    index.html        ← entire app: UI, logic, styles, scoring
  package.json
  capacitor.config.ts
  PRIVACY.md
  CLAUDE.md
```

The whole app lives in `www/index.html` — one self-contained file.

## Capacitor Config

```
App Name: Domino Pro Scoreboard
App ID: com.placeholder.dominoproscoreboard   ← TODO: finalize before store submission
Web Dir: www
```

Install deps (from `/home/ric/Domino_Pro_Anota`):
```bash
npm install
```

Android/iOS platforms are not added yet — that requires Android Studio / Xcode on a Mac or Windows machine.

## App Features (v1)

- Manual point entry + +25 quick buttons
- CAPICÚA button (currently scores +25 — confirm correct capicúa value)
- Best of 3 / 5 / 7 tournament mode
- Undo last entry
- Win animation + custom modals (no browser alerts)
- Recent tournament champion history
- Bilingual EN/ES toggle
- Player name persistence via localStorage

## Web Hosting (Pi)

The web version of the app can be served on the Pi via Apache at a second domain.
New domains are routed via Cloudflare Tunnel — no open ports required.
See `/home/ric/.cloudflared/config.yml` for current tunnel routing.

## Webhook / Auto-Deploy

- GitHub repo: `https://github.com/Rtavare/Domino_Pro_Anota.git`
- No webhook configured yet on the GitHub repo
- Goal: auto-deploy the web version on push (same pattern as cheyla site)

## Deployment (web version)

TBD — depends on which domain and Apache vhost are set up.

## Store Readiness Checklist

- [ ] Finalize App ID (replace `com.placeholder`)
- [ ] Add `android/` platform (`npx cap add android` on a dev machine)
- [ ] Add `ios/` platform (`npx cap add ios` on macOS)
- [ ] App icon 1024×1024 PNG
- [ ] Splash screen asset
- [ ] Privacy policy hosted at a public URL
- [ ] Store screenshots (iOS + Android)
- [ ] Set price to $0.99
- [ ] Android: generate `.aab` release build
- [ ] iOS: archive and upload via Xcode
