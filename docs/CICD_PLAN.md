# CI/CD Plan — Domino Pro Anota

## Overview

```
Developer push / PR
        │
        ▼
┌───────────────────────────────────┐
│         GitHub Actions CI         │
│                                   │
│  1. npm audit (security)          │
│  2. Vite build                    │
│  3. Capacitor sync + Android APK  │
│  4. Upload artifacts              │
└───────────┬───────────────────────┘
            │  pass
            ▼
      Merge to main
            │
            │  (manual) git tag v*.*.* + push
            ▼
┌───────────────────────────────────┐
│       GitHub Actions Release      │
│                                   │
│  1. Build release APK             │
│  2. Publish GitHub Release        │
│  3. Fire release webhook          │
└───────────────────────────────────┘
```

---

## Current State (v2.1.0)

| Component | Status | File |
|-----------|--------|------|
| CI — web build + audit | ✅ Live | `.github/workflows/ci.yml` |
| CI — Android debug APK | ✅ Live | `.github/workflows/ci.yml` |
| CI failure webhook | ✅ Live | `.github/workflows/ci.yml` |
| Release pipeline | ✅ Live | `.github/workflows/release.yml` |
| Release webhook | ✅ Live | `.github/workflows/release.yml` |
| Dependabot (npm + Actions) | ✅ Live | `.github/dependabot.yml` |
| Branch protection rules | ⚙️ Manual setup | See SECURITY.md |
| Signed Android APK | 🔜 Planned | See Phase 2 below |
| iOS build (macOS runner) | 🔜 Planned | See Phase 2 below |
| Play Store deploy | 🔜 Planned | See Phase 3 below |

---

## Workflow Details

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers:** every push to `main`, `claude/*`, `feature/*`, `fix/*`;
every PR targeting `main`.

**Concurrency:** one run per branch — new pushes cancel the previous run.

**Jobs:**

```
web  ──────────────────────────────────────────────────────────────
  checkout → setup-node → npm ci → npm audit → vite build
  → upload artifact: web-dist-{sha}

android  (needs: web) ────────────────────────────────────────────
  checkout → setup-node → setup-java 17 → install Android build tools
  → npm ci → vite build → cap sync android
  → ./gradlew assembleDebug
  → upload artifact: app-debug-{sha}.apk (14-day retention)

notify-failure  (if: failure()) ──────────────────────────────────
  POST $WEBHOOK_URL { event, repo, branch, run_url, triggered_by }
```

**Required status checks** (set in branch protection):
- `Web Build & Security Audit`

### Release Workflow (`.github/workflows/release.yml`)

**Trigger:** push of a tag matching `v[0-9]+.[0-9]+.[0-9]+`

**Jobs:**

```
build ────────────────────────────────────────────────────────────
  npm ci → npm audit → vite build → cap sync android
  → ./gradlew assembleRelease
  → upload: app-release-unsigned-{tag}.apk

publish  (needs: build) ──────────────────────────────────────────
  download APK → softprops/action-gh-release
  (auto-generates release notes from commits since last tag)

notify  (needs: build, publish) ──────────────────────────────────
  POST $WEBHOOK_URL { event, repo, version, release_url, triggered_by }
```

---

## Webhook Integration

Both workflows post JSON to `vars.WEBHOOK_URL` (a GitHub repository variable,
not a secret, since the URL itself is not sensitive).

### Setting up the webhook URL

1. **GitHub** → repo → **Settings** → **Variables** → **Actions** →
   **New repository variable**
   - Name: `WEBHOOK_URL`
   - Value: your endpoint URL (see options below)

2. The payload sent is:

```json
// CI failure
{
  "event": "ci_failure",
  "repo": "rtavare/domino_pro_anota",
  "branch": "main",
  "run_url": "https://github.com/.../actions/runs/123",
  "triggered_by": "rtavare"
}

// Release published
{
  "event": "release_published",
  "repo": "rtavare/domino_pro_anota",
  "version": "v2.1.0",
  "release_url": "https://github.com/.../releases/tag/v2.1.0",
  "triggered_by": "rtavare"
}
```

### Webhook endpoint options

| Option | Setup effort | Use case |
|--------|-------------|----------|
| **Discord** | Low — paste webhook URL from channel settings | Team notifications |
| **Slack** | Low — Slack incoming webhook app | Team notifications |
| **Netlify deploy hook** | Low — copy from Netlify site settings | Auto-deploy web build |
| **Custom server** | Medium — small Express/Flask endpoint | Full control, logging |
| **Make / Zapier** | Low — visual automation | Multi-step flows |

#### Discord example
1. Discord channel → **Edit** → **Integrations** → **Webhooks** → **New Webhook** → copy URL
2. Add as `WEBHOOK_URL` in GitHub Variables
3. That's it — Discord accepts any JSON POST (ignores unknown fields)

#### Slack example
1. [Slack API](https://api.slack.com/apps) → **Create App** → **Incoming Webhooks** → copy URL
2. Add as `WEBHOOK_URL`

---

## Phase 2 — Signed Android + iOS (Roadmap)

### Signed Android APK

Replace the unsigned release step with a signing step using GitHub Secrets:

```yaml
- name: Sign APK
  uses: r0adkll/sign-android-release@v1
  with:
    releaseDirectory: android/app/build/outputs/apk/release
    signingKeyBase64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
    alias: ${{ secrets.ANDROID_KEY_ALIAS }}
    keyStorePassword: ${{ secrets.ANDROID_STORE_PASSWORD }}
    keyPassword: ${{ secrets.ANDROID_KEY_PASSWORD }}
```

Secrets to add in **GitHub → Settings → Secrets → Actions**:

| Secret | How to generate |
|--------|----------------|
| `ANDROID_KEYSTORE_BASE64` | `base64 -w 0 my-release.jks` |
| `ANDROID_KEY_ALIAS` | chosen during keytool generation |
| `ANDROID_STORE_PASSWORD` | chosen during keytool generation |
| `ANDROID_KEY_PASSWORD` | chosen during keytool generation |

Generate keystore:
```bash
keytool -genkey -v -keystore domino-pro-release.jks \
  -alias domino-pro -keyalg RSA -keysize 2048 -validity 10000
```

### iOS Build (macOS runner)

Add a job to `ci.yml` (after merging `@capacitor/ios`):

```yaml
ios:
  name: iOS Build
  runs-on: macos-latest   # only macOS runners have Xcode
  needs: web
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "20"
        cache: "npm"
    - run: npm ci && npm run build
    - run: npx cap add ios || true   # already added locally
    - run: npx cap sync ios
    - name: Build iOS app
      run: |
        xcodebuild -workspace ios/App/App.xcworkspace \
          -scheme App \
          -configuration Release \
          -destination generic/platform=iOS \
          CODE_SIGNING_ALLOWED=NO \
          build
```

> Note: `macos-latest` runners cost ~10× more GitHub Actions minutes than
> `ubuntu-latest`. Limit iOS builds to release tags to control spend.

---

## Phase 3 — Store Deployment (Roadmap)

### Google Play Store

Use [Fastlane Supply](https://docs.fastlane.tools/actions/supply/) or
the [Google Play GitHub Action](https://github.com/r0adkll/upload-google-play):

```yaml
- name: Upload to Play Store (internal track)
  uses: r0adkll/upload-google-play@v1
  with:
    serviceAccountJsonPlainText: ${{ secrets.PLAY_SERVICE_ACCOUNT_JSON }}
    packageName: com.dominopro.anota
    releaseFiles: android/app/build/outputs/apk/release/app-release.apk
    track: internal
```

Prerequisites:
1. Google Play Developer account ($25 one-time)
2. Create app in Play Console
3. Generate a service account JSON with Play API access
4. Add as `PLAY_SERVICE_ACCOUNT_JSON` secret

### Apple App Store

Use [Fastlane Deliver](https://docs.fastlane.tools/actions/deliver/) with
an App Store Connect API key. Requires an Apple Developer account ($99/year).

---

## Versioning Workflow

```bash
# 1. Update CHANGELOG.md — move items from [Unreleased] to new version
# 2. Commit
git add CHANGELOG.md && git commit -m "chore: prepare release v2.2.0"

# 3. Tag and push — triggers the release workflow automatically
git tag v2.2.0
git push origin main v2.2.0
```

Version bump guide:

| Change type | Example | Bump |
|-------------|---------|------|
| New game mode or major feature | Best-of-N mode | MINOR |
| Bug fix or style change | Fix score not resetting | PATCH |
| localStorage format change | Breaks existing save data | MAJOR |
| New platform | iOS build added | MINOR |
| Security patch | Dependency CVE fix | PATCH |

---

## Cost Estimate (GitHub Free tier)

| Job | Runner | Time est. | Monthly (20 runs) |
|-----|--------|-----------|-------------------|
| Web build | ubuntu | ~1 min | ~20 min |
| Android debug APK | ubuntu | ~4 min | ~80 min |
| Release APK | ubuntu | ~5 min | ~10 min (tag only) |
| iOS build (future) | macos | ~6 min | ~120 min mac |

GitHub Free: 2,000 ubuntu-minutes/month, 200 macos-minutes/month.
Current setup is well within free limits.
