# Homepage discovery · local V0.1

The Explore Shanghai homepage now places **Go beyond sightseeing** before the skyline hero. It replaces the previous Discover banner and preserves the travel tools and existing culture routes. Native radio groups select one interest and 15, 45 or 90 minutes; the result updates without a request, account, location permission or AI call.

## Matching contract

`content/experiences.json` owns structured editorial duration ranges, interest tags and short summaries. `shared/micro-adventures.mjs` matches published experiences to published stories and valid VDC references. It uses the **upper** duration estimate when deciding whether an activity fits. Travel and queues are excluded, and live availability is never calculated.

- Food → breakfast observation; history → doorway observation; perspectives → park observation. The third is expressly observation with historical context, not local introductions or published personal interviews.
- At 15 minutes none of the current full activities fits. Offer its short story and explain that the outing needs separate planning. At 90 minutes do not invent a longer activity to fill the time.
- Missing venue references, conflicting or overdue operational evidence prevent an outing suggestion; the related story remains readable. Checked fields: address, hours, normal closure, admission, reservation, identity requirements and booking link.
- Unknown/estimated evidence permits only a clearly labelled **direction requiring checks**, not a verified-ready activity. All three existing activities remain untested in the field. Breakfast has no verified vendor; the card explicitly says so. No VDC statuses or dates were upgraded.
- Invalid choices, unpublished/malformed activities and unavailable stories return an honest empty state. Ties use stable IDs; no random ranking or inferred nearby location.

The result shows estimated activity duration, location limitation, cost nature and a link to existing steps, conditions, alternatives, Chinese card, sources and evidence. This is an editorial discovery experiment, not proof of demand or willingness to pay. No analytics or new personal-data collection was added.

## Verification

`npm run check`: PASS, **75 tests** (previous 68 plus seven discovery tests), including TypeScript, data/content validators, build and offline generation. VDC remains at 88 unresolved review notices.

Browser acceptance: **PASS**, `scripts/verify-discovery-browser.js` in an isolated local context against `http://127.0.0.1:8789`, with reduced motion and zero JavaScript page errors. It covers all nine combinations, keyboard radio interaction, 15-minute reading fallback, correct experience links, uncertainty copy, 375/390/1440 px overflow checks and saved offline matching/navigation. Desktop and 375 px screenshots were visually inspected; screenshots are ignored artifacts under `output/playwright/discovery-*.png`.

`npm run cf:dry-run`: PASS, local bundle only, AI remains disabled. `node scripts/verify-workers.mjs http://127.0.0.1:8789` and `node scripts/verify-culture.mjs`: PASS against the final local build, covering existing API boundaries, offline assets and nine culture URLs. `git diff --check`: PASS (Windows line-ending notices only).

Local development branch only. No production promotion, remote analytics, real visitor completion rate or paid-conversion result is claimed. A useful next validation is to observe first-time visitors choosing a result and attempting its steps; record where they hesitate before expanding the catalogue.
