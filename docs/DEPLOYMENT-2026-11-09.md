# China, Closer · production update · 2026-11-09

User authorized synchronizing the latest reviewed update to the existing personal-account Cloudflare Worker `china-closer`.

## Preflight

- Target: `https://china-closer.cqian7145.workers.dev`; existing account `188f9d50900037fbd678f179ba78671a`, authenticated through Wrangler OAuth.
- Source commit: `f80039b6e220cda0d03ebf74e03eb71039893d34`, branch `feature/discover-china`; working tree clean before this release record.
- Includes the Hangzhou discovery pilot and subsequent Story-led/Cultural/Minimal editorial redesign. No new database, DNS, billing, authentication or secret changes.
- GitHub CI completed successfully for that exact commit: https://github.com/cqian7145-cyber/travel-company/actions/runs/42558980238 . Local validation records 83 tests, real local Workers smoke, responsive/offline browser checks and dry-run success in `EDITORIAL-VALIDATION.md`.
- Production build regenerated successfully for this release: offline hash `b70fb425315f50d9`, 59 local files, nine prerendered culture routes. No source changes since the tested commit.
- Existing deployment: `7de1365e-f7c0-4eb6-88e8-cf995d15ee75`; prior version `96e985cf-9df9-461a-8c2e-494477662979` at 100% in that deployment, recorded from the newest Cloudflare deployment before upload.
- Paid AI remains disabled (`AI_ENABLED=false`). User-provided photography rights and exact shooting locations remain unverified as already documented. Hangzhou operational facts remain unknown.

## Recovery

```powershell
npx wrangler rollback 96e985cf-9df9-461a-8c2e-494477662979 --name china-closer --message "Restore previous release after failed editorial update validation"
```

No database migration is involved. Browser-local trip and bookmark data are not migrated or deleted. Previously saved offline kits can remain older snapshots until re-saved online.

## Release outcome

Deployment succeeded. Cloudflare created deployment `9652272c-3e62-4196-ae66-1851e43aa17f` at `2026-11-09T04:07:26.824712Z`, assigning 100% of that deployment's traffic to Worker version `6024a497-5f2d-40d9-9d41-ac2f288c135b`. Wrangler completed with exit code 0; the production manifest matches source build `b70fb425315f50d9`.

Live production smoke checks passed:

- All 59 manifest assets returned 200. Self-hosted WOFF2 fonts and WebP photos returned their correct MIME types.
- Editorial homepage, Shanghai portrait and both local font families rendered. The new story invitation opened the independently titled story page.
- Hangzhou page and hero photograph rendered; West Lake details retained five unknown operational fields and the Chinese communication card opened successfully.
- At 390 px, mobile quick navigation, the tools dialog and document width checks passed. No page errors occurred in the production browser smoke context.
- `/api/status` reports `aiConfigured: false`, provider DeepSeek. One explicit curated `/api/plan` request succeeded without a paid provider call.
- Service worker returned JavaScript with `Cache-Control: no-cache`. A fresh isolated browser saved the production offline kit, disconnected, then reopened Hangzhou with its photograph and editorial font successfully.

Status: source commit `f80039b` deployed and production smoke-tested. This local release record was added after the source commit and is not part of its GitHub CI run. The previous version remains the recorded rollback target. Existing users should reload online and re-save their offline kit to replace older snapshots.


## Follow-up release · Cities and Experience Journeys · 2026-11-09

User explicitly requested synchronizing the Cities/Experience Journeys update to Cloudflare and approved the production deployment after reviewable preflight.

- Target: existing `china-closer` Worker at `https://china-closer.cqian7145.workers.dev`, account `188f9d50900037fbd678f179ba78671a`.
- Source: local branch `codex/cities-experience-journeys`; source changes remain uncommitted and unpushed. Existing unrelated working tree changes were not staged or pushed. Wrangler uploaded the built `dist` assets and Worker.
- Preflight: `npm run check` passed (94 tests); `npm run cf:dry-run` passed. Wrangler 4.158.0. `AI_ENABLED=false`.
- Deployment: succeeded with exit code 0. Worker version `6986c6b3-ae41-4618-a5bb-c1287a220bd8`; preceding version `6024a497-5f2d-40d9-9d41-ac2f288c135b` is the rollback target.
- Assets: 21 new/modified assets uploaded, 43 reused; 82 total assets; offline manifest `fdd2bc1cc65b86e2`, 62 local files.
- Production verification: root, city directory, Shanghai/Hangzhou, story/experience indexes, one experience detail and `/trip` returned HTTP 200. Production browser at 390 px confirmed no horizontal overflow on those routes, ten Travel Tools and zero page errors. `/api/status` reports AI disabled.
- Local-only acceptance still covers full experience state flow, offline save/disconnect and narrative preservation. A full offline disconnection test was not repeated on production.
- Roll back with `npx wrangler rollback 6024a497-5f2d-40d9-9d41-ac2f288c135b --name china-closer --message "Restore previous release after failed city and journey validation"`.

## Follow-up release · Guiyang and Sanya · 2026-11-09

- User requested syncing the updated site to GitHub and Cloudflare. Existing production Worker: `china-closer` at `https://china-closer.cqian7145.workers.dev`; account `188f9d50900037fbd678f179ba78671a`.
- Local preflight: `npm run check` passed (97 tests); `npm run cf:dry-run` passed with Wrangler 4.158.0 and `AI_ENABLED=false`. The generated offline manifest contains 101 local files; Wrangler packaged 125 assets.
- Deployment succeeded. Worker version: `5acd09c9-074b-4557-b189-6663619dcdb7`; previous version: `185fe772-34d1-474c-868e-b5c6d3b4b036`.
- Production HTTP checks: `/cities` and `/cities/sanya` returned 200; all nine Sanya place labels appeared in the pre-rendered page, and the cover, Nanshan, Wuzhizhou and provenance assets returned 200 with expected MIME types. `/api/status` returned 200 and reports AI disabled.
- GitHub target: `cqian7145-cyber/travel-company`, branch `codex/cities-experience-journeys`. Source commit and push result will be recorded after Git delivery.
- No database, DNS, billing, authentication or secret settings changed. The rollback target is the previous Worker version listed above.
