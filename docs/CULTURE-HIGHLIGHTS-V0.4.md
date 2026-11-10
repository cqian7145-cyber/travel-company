# Culture Highlights V0.4 · local implementation · 2026-11-10

## Product decision

The supplied brief and follow-up define a place-first cultural handbook: discover a place, read a short cultural snapshot, optionally open sources or travel help. This implementation covers Phase 1 and the four-card West Lake pilot, with the existing Shanghai material adapted into the same model. Guiyang and Sanya retain their photo collections without artificial cultural categories.

Navigation is Discover / Cities / Culture / My Trip. Travel Tools stays in the header. The homepage leads to cities and four West Lake highlights; the full Story Invitation and interest/time task matcher are no longer displayed. All ten existing tool destinations remain in four named groups, alongside a direct Offline Kit link.

## Content and evidence

- Canonical data: `content/culture/hangzhou/*.json` (four new records), `content/culture/shanghai/*.json` (three short adaptations), and `content/culture/sources.json`.
- `shared/culture-highlights.mjs` composes legacy Shanghai articles with the short adaptations. The earlier article blocks remain in their original files and are available under an optional earlier-edition disclosure; a second full article is not maintained.
- Each summary is 50–90 English words. History, Legend, Literary heritage, Intangible heritage, and Food & customs are explicit types. Sources, further reading, and travel information are separate native disclosures.
- Publication validation rejects missing evidence, unsupported/wrong-city place associations, invalid review dates, unsafe source URLs, and legends presented as historical fact. Draft records need not be complete and are excluded from published lookups and routes.
- The West Lake cards reference existing `hz-west-lake` and `hz-longjing` area records. Su Causeway, Leifeng Pagoda and Xiling Bridge are named cultural subjects and map searches; no invented operational venue IDs or confirmed entrances were added.
- Main sources checked on 10 November 2026: [ICOMOS evaluation, printed p. 142](https://whc.unesco.org/document/152404), [Hangzhou poet-mayors account](https://www.ehangzhou.gov.cn/2018-08/16/c_271333.htm), [White Snake national record](https://www.ihchina.cn/project_details/12185.html), [Hangzhou literary account of Su Xiaoxiao](https://www.hzzx.gov.cn/hzzx/content/2012-05/04/content_5141252.htm), and [Longjing craft national record](https://www.ihchina.cn/Article/Index/detail?id=14605). Shanghai's four existing municipal sources were reopened for the short adaptations; the original archive source dates remain intact.
- The causeway card uses late-eleventh-century wording and dates the dredging to 1090 in further reading, following ICOMOS rather than repeating the brief's 1089 construction date. White Snake is folklore; Su Xiaoxiao's romantic biography is not promoted to established history; the 2008 craft listing does not certify tea vendors.
- A Palace Museum journal PDF appeared in indexed results but full retrieval timed out. It is not a published source dependency. The directly readable Hangzhou literary account supports the stated uncertainty.
- Existing local photographs are reused with contextual captions. The Beishan Street photo is never labelled as the pavilion, Su Causeway or Gongchen Bridge. No reference-board, third-party article or newly generated image was imported. Public-use rights and precise location of the supplied atmosphere photos remain unverified.

Source checking is an editorial synthesis, not independent expert or native-English copy approval, venue verification, or actual traveler research.

## Compatibility

- `/culture` is the new directory, filterable by city and cultural type. Four new detail pages use `/culture/:slug`.
- Published Shanghai URLs `/stories/:slug` remain 200 and canonical. Their first screen is a short snapshot; earlier long-form content is still readable.
- `/experiences/:slug` remains an optional practical guide with current-field evidence, alternatives, Chinese phrases and the existing add-to-Shanghai-trip helper. The start/pause/next/complete/self-report/checklist/reflection UI is not mounted.
- `/stories`, `/experiences`, and `/voices` issue 308 redirects to `/culture`, preserving query strings in both Node launchers and Workers. `/voices` is absent from the sitemap and offline file list. Unknown detail slugs still return 404. The pre-existing `/culture/xintiandi-2006.jpg` asset bypasses content-slug routing.
- `closer-culture-highlights-v1` stores culture bookmarks. On first use it imports recognized saved IDs from `closer-culture-v1`; an intentional empty new collection is not reimported. The old store and `closer-experience-journeys-v1` are never migrated destructively or reset. Earlier private notes can be read from Saved / Culture.
- My Trip / Saved has Places and Culture views. Legacy place bookmarks, itinerary IDs, hotel/travel details, readiness and booking confirmations keep their existing stores. Planning remains Shanghai-only.
- Standalone backup and Service Worker include the cultural summaries, source text, Chinese phrases and practical notes. Saved-at, content-version and travel-fact expiry feedback remain in Offline Kit. Source links themselves need a connection; their titles and context are saved locally.

## Design contract

Use the existing ivory / olive / burgundy tokens and local fonts. The card hierarchy is contextual photography, cultural type, specific place, short title, complete snapshot, then optional actions. Source and operational detail stay behind native disclosures. Save must retain disclosure state and keyboard focus. Mobile stacks the cards and keeps four primary destinations and the tool entry available. No new framework, dependency or account system is needed.

## Acceptance evidence

- `npm run check`: content/data validators, TypeScript, Vite, prerendering and 103 tests pass.
- `npx wrangler deploy --dry-run --outdir .wrangler/dry-run`: packaged 130 assets successfully with `AI_ENABLED=false`; no production upload. `git diff --check` passed after normalizing the edited text files' line endings.
- Local Cloudflare runtime at `http://127.0.0.1:8798`: `scripts/verify-workers.mjs` checks manifest assets and static headers, curated API, disabled paid AI, origin/input/body limits. `scripts/verify-culture.mjs` checks 11 public culture routes, direct HTML, metadata, true 404s and the legacy photograph MIME type.
- Playwright MCP ran `scripts/verify-culture-highlights-browser.js` in isolated Chromium contexts: four West Lake cards; reading/source disclosures stay open through save/unsave; actual clipboard fallback and Chinese copy; mocked native-share API handoff; modal Escape; filter persistence; legacy index redirect and detail URLs; Saved Places/Culture and earlier notes; ten tool buttons and Offline Kit entry. No page errors.
- Synthetic legacy culture notes/progress, journey progress, Shanghai plan, booking confirmations and both city bookmark stores were compared before and after browsing/saving and remained byte-for-byte unchanged.
- Responsive checks at 320, 375, 390, 768 and 1440 px found no horizontal overflow on ten key routes. The acceptance script covers seven of those routes; an additional browser diagnostic covered city directory, Shanghai and the legacy practical guide. The narrow Hangzhou hero/grid overflow found during review was corrected.
- Explicit Save offline kit, then browser networking disabled: Hangzhou, new cultural details, a legacy Shanghai article and the retired-index redirect remained readable; source disclosures and the local photo worked offline.
- JavaScript disabled: native reading/source disclosures and the four Hangzhou card links remained usable. Reduced motion removed picture transitions.
- Additional final browser assertions passed for keyboard Enter on Sources, focus returning to the Chinese-card trigger after Escape, the active mobile Cities link, the legacy optional-guide link, and a simulated blocked-storage error with an in-memory bookmark still usable. No page errors occurred.
- Screenshots reviewed under ignored `output/playwright/`: `culture4-hangzhou-top.png`, `culture4-hangzhou-cards.png`, `culture4-detail-desktop.png`, `culture4-mobile.png`.

## Delivery and remaining validation

Local implementation only. This iteration has not been committed, pushed, merged or deployed. The existing `artifacts/guiyang-mobile.png` was preserved. Production still serves the previous release until a new release is requested.

Not verified: Safari, real phones, the operating system's native share sheet, independent cultural/English editorial review, photo rights, current venue operations, or a 5–10-person English-user study. The next product validation is to ask target readers to find a place, explain the snapshot in their own words and choose whether to save or share it; no user-research result is claimed here.
