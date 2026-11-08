# Hangzhou and colour update · 2026-11-08

## Design contract

Goal: make the navigation and practical text easier to read, give the existing product a stronger lake-blue/tea-green identity, and add a bounded second-city discovery experience using the user's supplied images.

The uploaded navigation screenshot is the baseline. The blue lake and green tea-field uploads guide the palette. Existing travel tools, stable Shanghai IDs, local itineraries, booking confirmations and the Shanghai planner API retain their contracts.

| Before | After | Why |
| --- | --- | --- |
| 12 px desktop navigation; 13 px drawer entries | 17 px desktop navigation and drawer entries; 25–26 px wordmark | More readable labels and a clearer menu hierarchy |
| Burgundy and muted grey dominate | Lake blue actions, tea green accents, pale blue/green sections and deeper green activity panel | Stronger visual identity anchored in the supplied photography |
| Several 8–12 px practical labels and notes | 12 px eyebrow labels, 13–14 px source/status text, 15–17 px controls and reading text | Keep verification and practical details usable |
| One city chapter | Shanghai and Hangzhou destination entries, explicit separate scope | Add a second destination without mixing city facts or saved trip IDs |
| Existing photo reveals | City-cover depth, brief filtered-card entrance, hover zoom and directional link feedback | Communicate selection and spatial continuity; no looping decoration |

Motion stays progressive: content is readable without animations; transforms/opacity only for movement, fine-pointer hover only, immediate keyboard actions, live reduced-motion cancellation, no new animation dependency. Original uploaded files are preserved.

## Hangzhou discovery pilot

- Route: `/?page=hangzhou`; place deep link: `/?page=hangzhou&place=hz-west-lake`.
- Stable IDs: `hz-west-lake`, `hz-longjing`, `hz-gongchen`. Separate `closer-hangzhou-saved-v1` bookmark storage.
- Place cards: Chinese area search, large Chinese communication card, Amap city-qualified search, official context link, individual unknown operational facts, source publication/access dates, and practical cautions.
- Filters, bookmark persistence, photo enlargement and a short self-guided lakeside observation activity.
- Nine supplied travel images, 18 bounded WebP renditions (4,095,548 bytes), with hashes/provenance. Images are illustrative; exact shooting locations and public-use licences remain unverified. `AI_` filenames alone are not proof that an image was AI-generated.
- Offline app kit includes all Hangzhou data and local images; manifest records `hangzhouVersion`. The independent HTML emergency backup retains its existing Shanghai scope.
- Shanghai itinerary generation, Trip Mode and airport arrival guides continue to cover Shanghai. This update does not claim Hangzhou itinerary/airport coverage or a live intercity route.

## Evidence boundary

The official city articles below were accessed on 2026-11-08. They support context and candidate areas, not current entrance locations, opening hours, fees, passport requirements, reservation availability or checkout URLs. Each operational field stays `unknown`, with `verified_at: null`. The current pilot validator rejects attempts to promote context into operational verification. Broader verified operational support requires its own evidence workflow.

- [Hangzhou West Lake, published 2018-06-14](https://www.ehangzhou.gov.cn/2018-06/14/c_242880.htm).
- [Longjing Imperial Tea Garden, published 2018-08-15](https://www.ehangzhou.gov.cn/2018-08/15/c_262281.htm).
- [Six scenic routes, published 2025-03-19](https://www.ehangzhou.gov.cn/2025-03/19/c_293059.htm).

City guides are labelled as information links. No ticket checkout link is fabricated. Chinese addresses are expressly area searches, not verified entrance or hotel addresses. The lakeside activity's duration is an editorial estimate excluding travel/queues; it does not require approaching strangers.

## Validation and delivery

Local validation passed:

- `npm run check`: 81 tests, TypeScript, nine-venue VDC audit, Hangzhou pilot audit, story validation, Vite build, prerendering and offline generation. The existing 88 Shanghai VDC review notices remain unresolved; passing structural checks does not verify those facts.
- `npm run cf:dry-run`: PASS; Worker bundling and asset preparation succeeded, with paid AI disabled. Offline manifest version `43b68e4d6dcb688f`, 54 local files.
- `node scripts/verify-workers.mjs http://127.0.0.1:8791`: real local Workers static/API routing, MIME/cache headers, offline files, curated planning and input/origin/body bounds passed; no paid AI call.
- `scripts/verify-hangzhou-browser.js` through Playwright MCP: destination navigation, persisted bookmarks, filters, visible unknown facts, Chinese card, city-qualified map links, gallery controls, keyboard focus containment/restoration, all travel views at 375/390/768/1440 without horizontal overflow, and Hangzhou offline restoration/image decoding passed. No page errors.
- Normal-motion browser check observed cover depth (`scale(1.01545)`) and filtered-card entrance; switching to reduced motion left zero running animations. Keyboard category selection had zero animations.
- Screenshots inspected: `output/playwright/colour-hangzhou-1440.png` and `colour-home-390.png`; the same directory contains home/Hangzhou captures for all four widths.

An initial rerun against a dev server that remained running during a clean rebuild returned the SPA document for the service worker. After restarting Wrangler against the final build on 8791, both the MIME/API smoke and offline browser checks passed. This was a local runtime restart, not a production change.

This update is intended for publication to GitHub branch `feature/discover-china`; no new Cloudflare production deployment is included in this request. Physical-device Safari, screen-reader use and live Hangzhou travel conditions remain unverified.
