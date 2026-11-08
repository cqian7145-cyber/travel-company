# Discover China V0.1 — local validation, 2026-11-08

Branch `feature/discover-china`, based on the existing VDC branch. No production deployment, commit, push, database, paid AI call, public analytics or interview publication.

## Implemented

- Understand China: three original English starter stories, 271/273/272 words, five sections each, sources and separate editorial labels. Linked to the stable Xintiandi and Fuxing Park IDs; breakfast does not invent a verified shop.
- Experience China: three optional self-guided activities with steps, duration estimates, cost nature, conditions, VDC lookups, alternatives, Chinese/pinyin/English display, user-reported progress and private reflection. Explicit add-to-itinerary day selection preserves existing stops and IDs and prevents duplicate same-day additions.
- Meet the People: Voices of China landing/empty state and private editorial-record schema. No portraits, voice players, transcripts, meeting/matching or contact functionality are represented as available. V0.1 rejects published portrait data until actual permission and reviewed publication/withdrawal handling exist.
- Nine independently accessible pre-rendered routes: story index, three stories, experience index, three activities and Voices. Complete text, individual title/description/canonical/Open Graph, sitemap and robots. React progressively enhances controls; static reading works without JS.
- Offline app kit saves each culture HTML page and the licensed local photo. Standalone HTML backup includes culture text/steps/Chinese/source notices without scripts or media. Culture and VDC versions remain separate.

## Verification

`npm run check`: PASS, **68 tests = previous 54 + 14 culture tests**, TypeScript, validators, production build and offline generation. Existing Worker configuration test was extended to require the new culture route prefixes as well as the unchanged API prefixes; no baseline tests were removed. Node and DeepSeek launchers' clean culture routes are tested, including unknown-story/API 404 behavior.

`npm run cf:dry-run`: PASS, local bundle only. Existing ASSETS, rate-limit binding and AI_ENABLED=false retained. No account/deployment command or remote resource creation was used for this feature.

Local runtime on `http://127.0.0.1:8789`, using `.wrangler/state-culture`. `node scripts/verify-workers.mjs http://127.0.0.1:8789`: PASS, API/curated planning/input bounds and all versioned assets. `node scripts/verify-culture.mjs`: PASS, all nine clean routes and their underlying HTML assets, SEO metadata, unpublished-story 404 and correct local photo MIME.

Playwright `scripts/verify-culture-browser.js`: PASS, isolated context and zero JavaScript page errors:

- Save-story state and private reflection persist after reload; clipboard share fallback copies the clean story URL. Native operating-system share sheet was not tested.
- A curated itinerary is created; explicit activity-place/day handoff updates it. Existing stops survive.
- Activity progress persists; Chinese copies and opens full-screen; keyboard Tab remains in the dialog and Escape closes it.
- Story index/detail, breakfast activity and Voices landing have no horizontal document overflow at 375, 390 and 1440 px; reduced motion enabled.
- Save the offline kit, disable network, reload the direct story URL: the correct story and locally licensed photo remain readable. Navigating to its related experience also works offline.
- Downloaded standalone HTML opens through file:// offline and includes the culture experiences.

Additional JS-disabled browser check: full story and evidence text readable; enhanced controls hidden rather than appearing functional. The pre-rendered index works at desktop/mobile widths. Desktop and mobile index screenshots were visually inspected. Ignored artifacts: `output/playwright/culture-index-desktop.png`, `culture-index-mobile.png`, `culture-story-desktop.png`, `culture-no-js.png`, `culture-voices-*.png`, `culture-offline.html`.

## Evidence and limits

Official source URLs, actual page update/access dates and claim scopes are in `content/story-sources.json`. They support the cited cultural paragraphs; they do not upgrade operational VDC fields. The VDC content fingerprint/version and 88 unresolved notices are unchanged. No museum/site opening-hour re-verification was performed as part of this content work.

Photo: Commons `Xintiandi1.jpg`, Brad & Sabrina, CC BY 2.0, 2006. Local SHA-256 `39e90f922f5c57e238189028e4a77e3463bf4ba43cb14057994793fe87261e64`. Original licence/source inspected; visible credit/source/licence and CSS-crop disclosure provided. Exact day differs between source description and EXIF, so caption uses year only. No endorsement or current-condition claim. No official-site photographs or AI breakfast images were copied.

NOT VERIFIED: target-reader comprehension, activity field safety/usability, actual visitor completion, willingness to pay, acquisition/retention, Google indexing, social-platform previews, native Android sharing/installation and full accessibility audit. Analytics is deliberately absent; the two audience journeys are navigable product paths, not measured funnels yet. GitHub CI includes the expanded checks through `npm run check`, but no run for this unpushed branch is claimed. Production remains unchanged.
