# Editorial redesign · 2026-11-08

Implemented against the user's supplied Story-led/Cultural/Minimal, Editorial/Cinematic/Minimal, Gallery Travel and Heritage boards. `DESIGN.md` is the current visual contract; the original board graphics are references rather than deployed page imagery.

| Before | After | Why |
| --- | --- | --- |
| Bright blue/green identity, sans-serif headlines | Warm ivory, olive/teal, restrained burgundy, Cormorant Garamond headings and Inter controls | Match the new story-led direction while preserving text legibility |
| Centred introduction followed by a full-width skyline | Asymmetric street-level portrait, editorial introduction, small photographic notebook | Invite a closer look at everyday places |
| Two dark overlay city tiles | Offset city editorials with distinct images and readable text beneath | Give each destination space and a different rhythm |
| Cultural stories accessible through navigation | Explicit sourced story feature on the homepage | Connect discovery to understanding and self-guided experiences |
| Drawer-only mobile tool access | Persistent mobile navigation alongside the full tools drawer | Make discovery, stories, itinerary and tools easier to reach |
| Abrupt city navigation | Native shared-image transition with immediate fallbacks | Maintain image continuity without making navigation depend on animation |

## Verified locally

- `npm run check`: PASS, **83 tests**, TypeScript, VDC/Hangzhou/content checks, build, nine prerendered culture routes and optional offline generation.
- `npm run cf:dry-run`: PASS. No production upload. Final offline build `b70fb425315f50d9`, 59 local files, including both font files and their licences.
- Local Workers smoke: `node scripts/verify-workers.mjs http://127.0.0.1:8793`, PASS. Static files, cache/MIME headers, API-before-SPA, curated planning and request bounds passed. No paid provider call.
- Playwright MCP: `scripts/verify-editorial-browser.js`, PASS, no page errors. All existing travel views plus Hangzhou, stories and an experience page checked at **375, 390, 768 and 1440 px** without horizontal document overflow.
- Real font loading, readable desktop navigation, warm canvas, a working homepage→story link and the enlarged culture wordmark were checked. Both Node launchers serve WOFF2 correctly; font hashes, licences and offline coverage are unit-tested.
- Mobile bottom navigation reaches the itinerary and opens the tools dialog; Escape restores focus to its trigger. The offline kit restores the editorial homepage, fonts and standalone story.
- Chromium executed the native city-image transition: its `ready` promise resolved and its `finished` promise completed, with temporary names/state cleaned up. A running scroll reveal stopped after changing the reduced-motion preference. Navigation also worked with the native transition API explicitly unavailable under normal-motion settings.
- Final screenshots inspected: `output/playwright/editorial-home-1440.png`, `editorial-home-390.png`, `editorial-hangzhou-390.png`, and `editorial-stories-1440.png`. Home/Hangzhou/stories captures at all four widths are in the same directory.

## Boundaries

The React/Vite/Workers stack, API/planner data contracts and all existing place IDs remain. No new database, paid AI activation or content-verification claim is introduced. The original photo-rights uncertainties and 88 unresolved VDC review notices remain. Fonts have verified redistribution licences; this does not establish rights to other imagery.

Physical-device Safari, assistive-technology testing and production deployment of this revision are not verified. The native transition is progressive enhancement; unsupported browsers use ordinary navigation. GitHub delivery and CI status are reported separately after push.
