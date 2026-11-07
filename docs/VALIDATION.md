# Local validation — 2026-11-07

## Automated checks: PASS

- `npm run check`: 10 Node tests passed, TypeScript check passed, Vite production build passed.
- Tests cover input boundaries, trip duration/pace, unique catalog stops, museum Tuesday closure, explicit free time when the catalog is exhausted, interest/budget/AI-order effects, budget arithmetic, catalog-constrained AI IDs, no-key behavior, mocked provider output, and HTTP origin/content-type/input/body-size handling.
- `npm audit --omit=dev`: 0 known vulnerabilities reported at retrieval time.
- `git diff --check`: passed. Repository contains only new local files; no commit/push/deployment performed.

## Real browser checks: PASS for the checks below

Playwright used the actual local development server and separately the built application served by Node on port 5174.

- Home and preparation layouts: 375, 390 and 1440 px; no horizontal document overflow observed.
- Mobile itinerary: three days, six stops; no horizontal overflow at 390 px.
- Curated trip generation succeeded. A personal note remained after reload.
- Save a place, navigate to saved places, and see that place.
- Open place details, inspect map handoff, dismiss with Escape.
- Search with no results and clear filters.
- Preparation nationality and completed-check state survived reload. Test nationality/check completion was subsequently cleared.
- Payment guide expansion showed setup steps.
- Reduced-motion preference emulated; media query matched. Styles explicitly disable animation/transitions under that preference. No vestibular user study performed.
- Dialog Tab focus remained inside the native modal, and Escape closed it. This is a targeted keyboard check, not a complete accessibility audit.
- Export triggered a download named `shanghai-itinerary.txt`.
- Home hero and all three initial card images successfully decoded.
- Built app loaded bundled assets and `/api/status` returned `aiConfigured: false`. Fresh built-app console had no errors or warnings.
- Built-app planner displayed a simulated 503 error, then successfully generated through the explicit curated fallback. A ¥100 trip budget produced an over-budget warning.

Screenshots (local, git-ignored): `output/playwright/desktop-final.png`, `output/playwright/mobile-planner.png`.

## NOT VERIFIED / remaining release work

- Live OpenAI call, account permissions, provider costs and model availability: not exercised; no API key configured. Provider contract is covered with mocks only.
- Staging/production deployment, public endpoint hardening and real network/device coverage: not performed. Serving the production build locally is not production verification.
- Every venue’s address, opening hours, live admission price, booking availability and exact transfer route: not fully verified. Museum operator hours were directly reviewed; other cards show explicit recheck prompts.
- Entry eligibility is deliberately not determined. Source review dates do not guarantee policy validity for a future trip.
- Full accessibility audit, screen reader testing and measured performance budget: not performed.
- Full image provenance/public-release rights review: not complete; see PHOTO-CREDITS.md.
