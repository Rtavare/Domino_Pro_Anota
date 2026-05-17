# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.x     | ✅ Active |
| 1.x     | ❌ End of life |

## Security Model

Domino Pro Anota is a **client-only** application:

- No backend server, no API, no user accounts
- All data (scores, history) stays in the device's `localStorage`
- No network requests at runtime — the app works fully offline
- No sensitive data is collected or transmitted

The main attack surfaces are:

| Area | Risk | Mitigation |
|------|------|-----------|
| npm dependencies | Supply-chain vulnerabilities | Dependabot weekly scans + `npm audit` in CI |
| localStorage | XSS could read game data | No external content rendered; no `dangerouslySetInnerHTML` |
| Android WebView | Known CVEs in older Android | Capacitor keeps WebView updated via Play Store |

## Reporting a Vulnerability

If you discover a security issue, **do not open a public GitHub issue**.

1. Email the maintainer directly (contact via GitHub profile)
2. Include: description, reproduction steps, and potential impact
3. You will receive a response within **72 hours**
4. If confirmed, a patch will be released within **14 days**

## Branch Protection (Required Setup)

The following branch protection rules must be enabled on `main` via
**GitHub → Settings → Branches → Add rule**:

- ✅ Require pull request before merging
- ✅ Require status checks to pass (select: `Web Build & Security Audit`)
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings
- ✅ Restrict force pushes
- ✅ Restrict deletions

## Dependency Policy

- All dependencies are pinned by `package-lock.json`
- Major version bumps are reviewed manually (Dependabot ignores them by default)
- `npm audit --audit-level=high` runs on every CI build; high/critical findings block merges

## Secrets Management

GitHub repository variables and secrets used by CI:

| Name | Type | Purpose |
|------|------|---------|
| `WEBHOOK_URL` | Variable (`vars`) | CI/release notification endpoint |

Secrets for future Android signing:

| Name | Type | Purpose |
|------|------|---------|
| `ANDROID_KEYSTORE_BASE64` | Secret | Base64-encoded release keystore |
| `ANDROID_KEY_ALIAS` | Secret | Key alias |
| `ANDROID_KEY_PASSWORD` | Secret | Key password |
| `ANDROID_STORE_PASSWORD` | Secret | Keystore password |

Never commit keystores, `.env` files, or credentials to the repository.
