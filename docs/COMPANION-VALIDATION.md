# Companion modules — local validation, 2026-11-07

## Automated checks

`npm run check`: 20 tests pass (10 original + 10 companion tests); TypeScript and Vite production build pass.

New domain checks cover Shanghai midnight, next-stop ordering, skip/done/undo without deleting itinerary stops, progress isolation across trips and stop edits, old saved plans without IDs, unknown catalog entries, bounded/sorted nearby suggestions, venue-task derivation, opt-in train preparation, itinerary/guidance/hotel changes invalidating user confirmations, HTTPS operator links, empty days, and repeated venue occurrences.

## Built application — browser verified

Playwright used an isolated browser context against the built app served locally at http://localhost:5175. Existing user browser data was not modified. API configuration was checked before creating a curated itinerary; no live AI call or paid request was made.

- Trip Mode empty state routes toward itinerary creation.
- No-plan Booking Assistant shows hotel preparation only; it does not invent a train booking.
- Creating an itinerary for Shanghai's current date opens a correctly labeled today view.
- Next-stop map action contains the Chinese destination/address in an Amap search URL. External map results/navigation were not exercised.
- Chinese destination dialog opens with a large address. Tab focus remained inside the native modal; Escape dismissed it.
- Skipping advanced the next stop; undo restored it. Marking done persisted after reload.
- Selecting another day showed an explicit preview label.
- Booking tasks included relevant itinerary venues. User confirmation showed the explicit “not system-verified” caveat.
- Opting into train travel added the 12306 check.
- Invalid/executable hotel URL disabled confirmation; an HTTPS operator-link input allowed user confirmation. Test address was synthetic and never transmitted.
- Editing the planned visit time cleared the affected venue's earlier confirmation.
- Choosing a nearby alternative replaced the itinerary's pending stop.
- SOS payment flow advanced through its steps to official-support escalation, went back, accepted user-reported resolution, and restarted.
- SOS Chinese card opened and closed.
- After the page loaded, disabling network access still allowed switching to and reading the mobile-data guide. This original check did not establish offline reload support. The subsequent arrival extension adds and browser-verifies explicit offline saving; see ARRIVAL-VALIDATION.md.
- All three module landing views checked at 375, 390, and 1440 px: no horizontal document overflow. Itinerary-bearing Trip Mode and populated Booking Assistant were used.
- Reduced-motion emulation matched the stylesheet fallback; the next-stop panel had no animation.
- No JavaScript page errors occurred in the isolated functional run.
- Final browser followup opened all six SOS flows and their Chinese cards on mobile; no horizontal overflow was observed. Booking user-confirmation persisted after reload with the final rule fingerprint. A day with all stops done/skipped showed the finished state, and undo restored a pending next stop.

Visual review: desktop and mobile Trip Mode screenshots inspected. Local artifacts (git-ignored): `output/playwright/trip-mode-desktop.png`, `trip-mode-mobile.png`, `bookings-desktop.png`, `sos-desktop.png`.

## Boundaries

Local implementation and targeted browser verification only. No staging/production deployment, commit, push, ticket purchase, payment attempt, live traffic, geolocation, actual bank/carrier recovery, or real booking confirmation. Venue/rail rules are dated source snapshots. Unverified rules, hotel details, and generic troubleshooting suggestions remain explicitly labeled. Full accessibility audit and real tourist field testing remain outstanding.

Primary sources consulted on 2026-11-07:

- Shanghai Museum East operator visit rules: https://www.shanghaimuseum.cn/mu/frontend/pg/m/service/visit-east
- China Railway English ticketing FAQ: https://www.12306.cn/en/faq.html
- Government background on foreign-passport online verification, updated 2023-11-28: https://english.www.gov.cn/news/202311/28/content_WS6565e903c6d0868f4e8e1b58.html
- Shanghai Government overseas-card guidance: https://english.shanghai.gov.cn/en-Individuals-BankingandPayments-Payments/20260921/c2c94d06a0454c8fa05386b80d0ae865.html
