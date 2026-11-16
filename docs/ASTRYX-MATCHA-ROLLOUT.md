# Site-wide Matcha rollout · 2026-11-16

Authorized scope: all remaining pages, GitHub and the existing Cloudflare Worker.

Both React roots and the pre-rendered HTML now apply official Matcha. This covers
Home, Cities, Shanghai, Hangzhou, Guiyang, Sanya, Culture, highlight details,
historical reading links, My Trip, Saved, Trip Mode, booking checks, China Ready,
arrival preparation, connectivity, Speak Local, China SOS, dialogs and navigation.
The standalone HTML backup uses the Matcha palette with system fonts and retains
its restrictive CSP. Its content, personal-data escaping and independence from
external resources remain intact.

Official Button/Card components replace compatible React presentation elements.
Stateful filters and delegated Culture HTML keep their event structure. No source
facts, itinerary algorithms, verification rules, confirmation meanings, API
handlers, storage keys or product copy were changed.

## Evidence

Chromium checks against the production build served locally:

- Home, city directory, all four cities, Culture, Su Causeway, My Trip and eight
  tool/Saved views at 375, 390 and 1440px: no page-level horizontal overflow.
- Official fonts load; Chinese dialogs use the sans-serif/CJK font stack.
- Shanghai place and Culture bookmarks remain retrievable in Saved.
- Planner disabled state, generation, persisted time edits, export, Trip Mode
  and Chinese dialog remain functional. Escape restores keyboard focus.
- External navigation remains an anchor with its original map URL and target.
- China Ready completion persists. SOS advances. Connectivity and Speak Local
  dialogs open and close. Reduced-motion preference is respected.
- Automated tests cover initial HTML theming for all pre-rendered city/Culture
  routes plus font hashes, licenses, no remote font hosts and offline inclusion.
- A JavaScript-disabled browser confirms themed reading on city and Culture
  routes. Saving the app kit and going offline preserves the Su Causeway page
  and both official font families.

Screenshots are local review artifacts. Real iOS/Android hardware and Safari
are not verified by the Chromium checks.

## Release

Run npm run check and Cloudflare dry run before release. Push to the existing
feature branch and main without force. Target china-closer. Preserve resource
bindings and AI_ENABLED=false. The previous production Worker version
f287ebd0-305a-4a06-8d96-1098da9cfe97 is the rollback target.
