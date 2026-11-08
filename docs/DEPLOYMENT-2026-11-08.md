# China, Closer · production update · 2026-11-08

User requested publishing the reviewed current product update to the existing personal-account Cloudflare Worker `china-closer`. This releases the local VDC, culture/discovery and photography/motion work; it does not commit or push Git changes.

## Preflight

- Account authenticated through Wrangler OAuth; selected account ID `188f9d50900037fbd678f179ba78671a`.
- Target: `https://china-closer.cqian7145.workers.dev`.
- Existing deployment ID: `76a7bf89-dde4-4ebe-bd32-af81af2019b1`.
- Existing active version: `10fcb372-e59f-45e5-92dc-8bcc7ece7b30`, 100% traffic, confirmed from Cloudflare deployments list immediately before release.
- Local branch: `feature/discover-china`, with reviewed work uncommitted. No unrelated files discarded or staged.
- `npm run check`: PASS, 77 tests plus TypeScript, data/content validation, build and offline generation.
- `npm run cf:dry-run`: PASS. Offline app hash: `84fe542d6c6a374d`; VDC `2026-11-08.vdc1`; culture `2026-11-08.culture1`.
- AI_ENABLED=false; existing rate-limit binding retained. No secrets read, uploaded or rotated; no new database, DNS, billing or account settings are requested.
- Uploaded photographs have user-supplied provenance and unverified independent public-use rights, as disclosed in the prior delivery and `UI-DESIGN.md`. No licence verification is claimed.

## Recovery

If the release fails its live checks, restore the recorded previous Worker version with:

```powershell
npx wrangler rollback 10fcb372-e59f-45e5-92dc-8bcc7ece7b30 --name china-closer --message "Restore previous release after failed update validation"
```

This changes the active remote deployment. No database migration is involved. Existing browser-only trip data is not migrated or deleted. Previously saved offline kits can remain old snapshots until users reconnect and save a fresh kit; an already open tab may need a reload.

## Release outcome

Deployment succeeded. Cloudflare reports deployment `7de1365e-f7c0-4eb6-88e8-cf995d15ee75`, created at `2026-11-08T09:11:52Z`, assigning 100% of that deployment's traffic to version `96e985cf-9df9-461a-8c2e-494477662979`. The live manifest and page checks below confirm the updated assets are served at the production URL.

Live checks passed against `https://china-closer.cqian7145.workers.dev`:

- Homepage and standalone `/stories`, story detail, `/experiences`, experience detail, `/voices`, and `/sitemap.xml` returned 200. Unknown API route returned the expected JSON 404.
- `/api/status` reports `aiConfigured: false`; no AI provider call was made.
- `/offline-manifest.json` reports the preflight build hash `84fe542d6c6a374d`. Every listed local photography rendition returned 200 as `image/webp`; the hero photograph decoded in a 390 px mobile browser viewport.
- Production browser check confirmed the discovery finder is reachable and interactive, navigation opens and closes with Escape, the story page has its own title and canonical URL, and no page errors occurred. At the tested 390 px viewport, document width was 375 px, with no horizontal overflow.
- Pre-release checks remain PASS: `npm run check` (77 tests) and `npm run cf:dry-run`.

Status: deployed and production smoke-tested. The change remains uncommitted on `feature/discover-china`; no push was performed. Previous saved offline kits may remain snapshots until refreshed, and open tabs may need a reload. Photograph public-use rights remain unverified as documented above.
