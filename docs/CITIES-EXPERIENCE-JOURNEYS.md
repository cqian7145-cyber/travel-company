# Cities + Experience Journey · implementation scope

User brief: two pasted product notes supplied 2026-11-09. Implement their navigation/city-discovery contract and the P0/P1 improvements to the existing three experiences. Preserve the story bodies, stable IDs, legacy culture state, Shanghai plans/booking confirmations, clean story/experience URLs, offline reading and the Beishan Street photo correction.

1. Shared Discover / Cities / Experiences / Stories / My Trip navigation; top city selection and tools, four mobile primary links.
2. Independent prerendered city directory and Shanghai/Hangzhou entrances, with four consistent content regions and honest empty states.
3. Canonical city ownership and city/topic filters; one copy of each story/experience.
4. Story discovery questions/promises/first observations, without rewriting the five existing body sections.
5. Experience decisions: six first-screen facts, risk-prioritized field evidence, optional observations, Chinese card, Plan B, local journey status and private reflection. User reports never prove attendance, access or booking.
6. Compatibility/data/state/routing tests, real Workers runtime and responsive/offline browser validation.

Out of scope: new city content invented to fill lists, a CMS/database, paid AI activation, GPS, gamification, stranger matching, anonymous analytics collection (P2), and production deployment. Existing unrelated changes to `docs/VALIDATION.md` and the local deployment record are preserved.

## Acceptance evidence · 2026-11-09

Implemented on `codex/cities-experience-journeys` and deployed to the existing production Worker after explicit release approval. No commit or push performed. No dependencies added. Paid AI remains disabled.

- `npm run check`: data/content validation, TypeScript, Vite, prerender and tests passed. After adding the final Node-route regression test, `npm test` passed **94/94**. Existing 83 tests remain passing.
- `npx wrangler deploy --dry-run --outdir .wrangler/dry-run`: passed with Wrangler 4.158.0, `AI_ENABLED=false`. This was packaging validation, not a deployment.
- `node scripts/verify-workers.mjs http://127.0.0.1:8795`: passed against the real local Workers runtime. Validated all manifest files, headers, curated API, request bounds and disabled paid provider.
- `scripts/verify-cities-journeys-browser.js` executed through Playwright MCP against that runtime: no browser JavaScript errors. Verified five primary destinations, dropdown Escape/focus, all ten tools, city reloads, filters/URL persistence, Hangzhou empty states, Chinese card/copy, add-to-selected-day, paused/resumed observations and private reflection/self-report persistence.
- Browser viewports 375, 390, 768 and 1440 px: key city, directory, journey and My Trip routes had no horizontal overflow. Mobile/tablet navigation stays reachable. Reduced-motion switching stops the active reveal animations.
- Saved Shanghai plan and actual `closer-booking-confirmations-v1` storage were unchanged by city browsing. The selected-day add operation preserved the other itinerary day. Hangzhou bookmarks use their separate existing key and are accessible from Saved places.
- Explicit Save offline kit, then Playwright network disabled: `/cities`, `/cities/shanghai`, `/cities/hangzhou`, journey progress and Chinese card all remained usable. The standalone backup also includes six decision facts, field-level snapshot evidence, both observations and a reflection prompt; unit tests verify it stays script-free.
- Compared all three story `blocks` arrays with the branch base: unchanged. Added discovery metadata has its own review date. Culture edition is `2026-11-09.culture2`; offline app fingerprint is `fdd2bc1cc65b86e2`, 62 local files.
- Beishan Street caption and contributor identification are preserved. Gongchen Bridge has no mismatched location photograph; it uses an explicit missing-photo state. Contributor identification is not independent location verification or proof of image rights.

Screenshots: `artifacts/cities-journeys/experience-desktop.png`, `artifacts/cities-journeys/hangzhou-mobile.png`, and `artifacts/cities-journeys/hangzhou-top-mobile.png`. Full-page captures may show unloaded lazy images below the viewport; the top mobile screenshot waits for the local cover image and stopped animations.

Limits: Chromium/local Workers verification does not establish Safari, actual handset, production or field usability. Hangzhou has no published story or Experience Journey yet. Existing VDC still reports 88 review notices; unknown facts were not promoted to verified. No new interviews or public-use image rights were verified. P2 metrics and real traveler testing remain deferred.


## Production deployment follow-up · 2026-11-09

- Cloudflare account: `188f9d50900037fbd678f179ba78671a`; Worker: `china-closer`; URL: `https://china-closer.cqian7145.workers.dev`.
- Wrangler `4.158.0` deployment succeeded. New version: `6986c6b3-ae41-4618-a5bb-c1287a220bd8`; prior rollback version: `6024a497-5f2d-40d9-9d41-ac2f288c135b`.
- Deployed offline manifest: `fdd2bc1cc65b86e2`, 62 local files. `AI_ENABLED=false`.
- Production HTTP and browser: `/`, `/cities`, both city routes, story/experience indexes, an experience detail and `/trip` returned 200. At 390 px there was no horizontal overflow across these routes; ten Travel Tools were present; no page errors. Live `/api/status` reports `aiConfigured:false`.
- Actual Worker release is production-verified for route delivery and mobile browser loading. Full journey interaction and offline network-disconnect were verified against local Workers; those were not repeated against production after deployment.
