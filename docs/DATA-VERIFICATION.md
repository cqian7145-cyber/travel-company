# Verified Data Center V1

Scope: nine existing Shanghai places, field-level evidence, single-owner reservation facts, visitor evidence display, offline version notices, data quality checks and CI configuration. No new city, database, account system, paid AI enablement or production changes.

## Data ownership

`data/venues.json` owns factual values and field metadata. `data/sources.json` owns source identity, URL, link kind and access history. `data/version.json` identifies the published static dataset. `shared/catalog.mjs` is a compatibility view: existing IDs, `places`, flat fields and planner return structures remain available. The deprecated global `reviewed` export is only a legacy compatibility value, not a fact verification date. Airport/connectivity fact migration is deferred (P2); their source dates remain independent legacy snapshots.

Each fact records `field`, `value`, `status`, `verified_at`, `reviewed_at`, `source_id`, `next_review_at` and `evidence_note`. Status is `verified`, `unknown`, `estimated` or `conflicting`; the computed status may be `expired`. A reviewed/imported record is not necessarily verified. Source publication, source access, field verification, dataset preparation and offline-save times have distinct meanings.

The migration preserves the museum's dated hours and reservation evidence from the 2026-11-07 operator review recorded in COMPANION-VALIDATION.md. It does not claim a fresh website check. Other unsupported fields remain unknown; all nine planning amounts are estimates. Even a verified snapshot is not a guarantee for a future visit. The two volatile verified records receive a next review date of 2026-11-14 under an initial seven-day editorial cadence. This is a team review policy, not a venue rule. Operators should set more frequent review for events, holidays or policy changes. Unknown fields have no invented verification dates or promised review schedule.

Unknown and estimated fields also have null `reviewed_at` when no individual review was recorded. Non-museum venue sources have null `last_accessed_at`; the old global stamp is retained only as `legacy_reviewed_at`. This prevents the migration from pretending the old global date proves every source was accessed or each field was checked. Preparation/airport source records remain explicitly outside this venue migration.

## Edit and verify

1. Work on a feature branch. Locate the stable venue ID and exact field; preserve existing IDs.
2. Open the actual official operator page. Confirm that the source covers this exact venue, field, ticket type and date. A search snippet, city portal or working HTTPS URL is insufficient evidence of a checkout or rule.
3. Record the source, what was checked and any qualification in `evidence_note`; update source `last_accessed_at` only when actually opened. Unknown publication dates remain null. Never globally advance all review dates.
4. Set `verified_at` only for a supported field, record field `reviewed_at`, and schedule `next_review_at` according to change risk. If sources disagree, mark `conflicting`, explain and resolve manually. If no reliable purchase endpoint is found, keep booking link status unknown and its kind as guide/portal. Do not invent a transactional URL.
5. Run `npm run data:version -- YYYY-MM-DD.vdcN` with a new version whenever venue/source content changes. The command records a semantic-content SHA-256 fingerprint; `data:check` rejects unstamped content changes. Keep a concise reason in the change review. Do not refresh verification dates for copy-only, UI-only or dataset-version changes. The fingerprint proves snapshot identity, not factual truth.
6. Run `npm run data:check`, `npm run check`, `npm run data:audit`, local Workers/browser/offline checks. Inspect the audit and diff before any separately approved merge/deployment. CI runs checks only; no secret or deploy step is present.

Structural problems (missing fact/source, invalid date/status, future verification, contradictory source/link kinds or unsupported transactional links) fail the check. Unknown, conflicting and overdue facts generate review notices rather than being automatically promoted or blocking offline access. Run `node scripts/verify-data.mjs --details --as-of=YYYY-MM-DD` to review at a specific date. Automated checks cannot prove that a website says the claimed fact; manual evidence review is essential.

## Booking confirmation compatibility

Booking Assistant still derives tasks from the itinerary and keeps its existing user-confirmed state store. Its reservation and ID facts now resolve through venue records. The legacy `bookingRules` export is derived, not a second editorial data source. Unchanged initial facts preserve existing task keys (regression fixtures captured before migration). A per-venue compatibility checksum of the initial evidence metadata supports this migration only; it is not a security primitive or a claim of verification. Do not regenerate that baseline when editing facts. After a material rule, ID, URL/kind, source, date, caution or effective-expiry change, `taskKey()` includes the changed evidence signature so the user must recheck. Editing unrelated editorial descriptions or dataset versions does not reset confirmations. Hotel/rail tasks and personal-note behavior remain compatible.

## Visitor interface design contract

Use the existing paper/olive/burgundy design and native details/dialog patterns. Venue details get a compact evidence section with plain status text, individual dates, link kinds and source links. Do not show a page-wide verified badge. Separate source access from verification and reservation from ID rules. Unknown and overdue states remain readable and keyboard accessible. At narrow widths, rows stack and long source URLs wrap; focus remains in the existing dialog. No new navigation or admin dashboard is required for this editorial V1.

## Offline semantics

An app build version differs from a dataset version. The offline manifest and worker status carry both, plus an actual offline-save timestamp and review-due date. A local manifest comparison is a synchronization check, not fresh source verification. Offline/unreachable checks report current remote version as unknown. Old worker responses without data metadata are unknown, not current. Refresh updates the saved metadata only after actual cache checks. Venue evidence that is overdue remains viewable; hotel addresses and trips are never hidden because evidence expired.

The script-free standalone HTML backup records dataset version, generation/save time, venue evidence status and review dates, and an unconditional reminder that it cannot detect later updates offline. It cannot dynamically know the current date/version without scripts or connectivity. This is stated explicitly rather than promising automatic expiry detection in a file. No personal data is sent for data-version checks.

## Remaining debt

Airport/telecom/entry fact-level migration, event-sensitive review cadence, photo commercial rights/attribution, real tourist comprehension tests, public AI cost/access controls and branch protection remain separate work. A CI file is only configured locally until pushed and executed by GitHub; no branch-protection or repository settings are changed in this task.
