# Arrival tools — local validation, 2026-11-08

## Implemented locally

China Connectivity, Speak Local and First 90 Minutes extend the existing Shanghai companion. No dependency installation, paid AI call, commit, push or deployment was performed for this extension.

## Automated verification

`npm run check`: PASS, 29 Node tests, TypeScript check and Vite production build. Nine new tests cover airport/terminal separation, unknown terminal, late-night/heavy-luggage choices, reference-fare boundaries, three connectivity capabilities, 24 unique templates, confirmed personal data, allergy wording and escaped standalone HTML.

Offline build emits four local app files in its manifest. The worker excludes API requests and remote assets. Browser testing caught and fixed an undefined version variable in its readiness message; readiness is now confirmed from actual cached entries.

## Browser verification

Playwright against the built app at http://localhost:5175, isolated browser contexts with synthetic hotel details:

- PASS: PVG T1 pickup and late-night warning; no People's Square taxi fare applied to an arbitrary hotel.
- PASS: user-confirmed hotel address reaches the driver card; changing that address disables the card until confirmed again.
- PASS: explicit offline save reports readiness; inspected cache contains only index HTML, favicon, JavaScript and CSS from localhost, with no API or remote resource.
- PASS: network disabled, page reload succeeds, Connectivity airport Wi-Fi guide remains readable, and personalized Speak Local driver card opens and copies Chinese to the clipboard.
- PASS: downloaded standalone HTML opens through file:// with network disabled and retains the synthetic address and recovery guide text.
- PASS: all three modules have no document-level horizontal overflow at 375, 390 and 1440 px.
- PASS: full-screen allergy card occupies viewport width at those sizes; keyboard Tab remains inside the dialog and Escape closes it. Reduced-motion preference enabled during these checks.
- PASS: empty search state and Clear filters restore all 24 cards; unconfirmed address cards are disabled.

Offline smoke scenario: `scripts/verify-arrival-browser.js`, executed through Playwright's run-code filename tool with the built server running. Local ignored artifacts: `output/playwright/arrival-desktop.png`, `speak-card-375.png`, `speak-card-390.png`, `speak-card-1440.png`, and the synthetic `china-closer-offline.html` backup. Desktop arrival and mobile allergy screenshots visually inspected.

## Sources and boundaries

Primary sources retrieved/reviewed 2026-11-07; exact URLs and publication notes are stored in `shared/arrival.mjs`:

- Shanghai Government, 24 Apr 2026: Pudong passport photo-page Wi-Fi verification and communication-service backups.
- Shanghai Government transport guide: page states updated 4 Jun 2026, despite its 13 Aug URL; terminal taxi gates and People's Square reference fares.
- Apple Support: travel eSIM and roaming guidance, plus China mainland model/carrier limitations.
- Shanghai Airport: Hongqiao official Wi-Fi information. Pudong's passport process is not asserted for Hongqiao.
- FARE: avoiding allergen cross-contact.

NOT VERIFIED: current transport operating hours, exact communication-counter positions/hours, device/carrier compatibility, network or SMS delivery, actual hotel locations, live fares, real tourist comprehension and allergy-card professional/clinical review. Chinese templates are communication assistance, not food-safety clearance. Browser checks do not establish iOS/Android device acceptance, storage durability, staging or production readiness. No deployment performed.
