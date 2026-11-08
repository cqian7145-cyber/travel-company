# Verified Data Center V1 — local acceptance

Branch: `feature/verified-data-center`. Date: 2026-11-08. All six requested development items are implemented locally; no merge, commit, push, production deployment, database, city expansion or paid-AI enablement.

| Item | Result | Evidence |
| --- | --- | --- |
| Nine-place migration | PASS | Stable IDs and every legacy flat catalog value regression-tested against a pre-migration fixture; `hoursVerified` remains a deprecated computed compatibility field. |
| Unified reservation facts | PASS | Venue facts own reservation/ID/link evidence; `bookingRules` is a derived compatibility export. |
| Field status and expiry | PASS | Unknown/estimate/conflict/verified states, date validation, review-due expiry and content-version fingerprint checks. |
| Visitor evidence UI | PASS | Independent per-field status, verification/review/access dates, source, explicit guide versus transaction semantics. |
| Offline compatibility | PASS | Saved metadata/version, actual save time, online version mismatch, unknown legacy metadata and overdue warnings; addresses remain readable. |
| Tests/runtime/browser | PASS locally | 54 tests, build, data audit, Wrangler dry run, local Workers API and isolated browser scenarios. |

## Commands and observed results

- `npm run check`: PASS, **54 tests = original 42 + 12 VDC tests**, TypeScript, Vite production build, offline worker generation. No original test was removed. The offline/Workers smoke scripts were updated for metadata and the isolated test port.
- `npm run data:audit`: PASS, **9 places / 99 fields**, zero structural errors, **2 verified snapshots / 9 estimates / 88 unknown fields** evaluated 2026-11-08. Full table: VENUE-FIELD-AUDIT.md. The 88 notices are unresolved human review needs, not proof of incorrect facts and not silently promoted to verified.
- The two verified records are museum hours and reservation rules, carried forward from the previous documented 2026-11-07 operator review. No source was freshly verified during this migration. All booking-link statuses remain unknown; guide URLs are not treated as checkout URLs. Unsupported individual review/access dates are null.
- `npm run cf:dry-run`: PASS; static assets, Worker API and existing disabled-AI bindings bundle without publishing. No Cloudflare account/deployment command was used for this VDC branch.
- Isolated local runtime: `wrangler dev --local --ip 127.0.0.1 --port 8788 --persist-to .wrangler/state-vdc --show-interactive-dev-session=false`.
- `node scripts/verify-workers.mjs http://127.0.0.1:8788`: PASS, real local runtime status, curated planning, static cache headers, index without redirect, API JSON errors, origin/input/body bounds and four offline app assets. No paid call.
- Browser runner `scripts/verify-vdc-browser.js` receives `tests/fixtures/bookings-v1.json` as its second argument. Executed through Playwright's run-code tool with that fixture injected by the orchestration call. PASS, zero JavaScript page errors.

## Browser evidence

- A fixed 2026-11-08 browser clock and synthetic legacy plan/confirmation fixture preserved four venue/rail user confirmations in Booking Assistant.
- Yu Garden details showed unknown hours, explicit field dates and official-city-guide link semantics with no claimed ticket checkout.
- Expanded evidence rows had no dialog overflow at 375, 390 and 1440 px. Tab remained inside the modal and Escape closed it; reduced-motion preference was enabled. Screenshots: ignored `output/playwright/vdc-detail-375.png`, `vdc-detail-390.png`, `vdc-detail-1440.png`. Mobile screenshot visually inspected.
- Offline save produced version/save-time metadata. A simulated different online manifest triggered an update warning. Removing only the cached metadata demonstrated that a legacy cache is reported unknown rather than current.
- After refreshing the kit, moving the browser clock to 2026-11-15, disabling networking and reloading, the review-overdue warning appeared. A confirmed synthetic Chinese hotel address still opened in Speak Local. Museum evidence expiry reset only the affected venue confirmation; the other three retained confirmations remained.
- Downloaded `output/playwright/vdc-offline.html` opened via file:// with networking disabled. It contained dataset version, review dates and the explicit limit that a script-free file cannot detect later updates. It did not block reading.

## Boundaries

GitHub Actions is **configured, NOT RUN on GitHub**: the branch has not been pushed. Workflow is read-only and runs application/data/build/dry-run checks; it has no deployment step. Branch protection remains unconfigured. Browser checks are focused acceptance evidence, not a complete accessibility audit or tourist field test.

Production remains on the previously deployed code. No database, Cloudflare setting, key, billing, DNS or production artifact was changed. The local runtime uses isolated state. Airport, telecom and entry field-level evidence are P2, with legacy source dates explicitly retained. Photo rights, real visitor comprehension and provider access/cost controls remain recorded debt.
