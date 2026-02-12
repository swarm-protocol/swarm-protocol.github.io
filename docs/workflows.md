# GitHub Actions Workflows

This repository includes two GitHub Actions workflows that validate the application structure, test connections, and ensure all components are working correctly.

## CI - Validate Applications (`ci.yml`)

**Triggers:** Push to `main`, Pull Requests to `main`, Manual dispatch

### Jobs

#### `validate-structure`
Checks that all required files and application directories are present:
- Root files: `index.html`, `manifest.json`, `service-worker.js`, icons
- Application directories under `public/`: emotes, blog, filehost, nopaste, feeds, irc
- Each application has an `index.html`

#### `validate-html`
Runs basic HTML validation on all `.html` files:
- Checks for DOCTYPE declaration
- Checks for `<html>` opening and closing tags

---

## Test Connections (`test-connections.yml`)

**Triggers:** Push to `main`, Pull Requests to `main`, Weekly schedule (Monday 6 AM UTC), Manual dispatch

### Jobs

#### `test-service-worker`
Validates service workers are properly configured:
- Root `service-worker.js` exists and has a `CACHE_NAME`
- Emotes `service-worker.js` exists
- All cached asset references in `CORE_ASSETS` resolve to existing files

#### `test-manifests`
Validates PWA manifest files:
- Root and emotes `manifest.json` files are valid JSON
- Icon paths referenced in manifests point to existing files

#### `test-application-pages`
Spins up a local HTTP server and tests that all application endpoints return HTTP 200:

| Endpoint | Application |
|----------|-------------|
| `/` | Root landing page |
| `/public/` | Public index |
| `/public/emotes/` | Emotes app |
| `/public/blog/` | Blog app |
| `/public/filehost/` | File host app |
| `/public/nopaste/` | Nopaste app |
| `/public/feeds/` | Feeds reader |
| `/public/irc/` | IRC client |

## Running Manually

Both workflows support `workflow_dispatch`, so you can trigger them manually from the **Actions** tab in GitHub.
