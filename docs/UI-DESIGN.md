# China, Closer · photography and motion pass

## Design contract · 2026-11-08

Visual thesis: quiet white and graphite surfaces, confident typography and real Shanghai photography, with the established burgundy action colour. Apple-inspired hierarchy and restraint; no Apple branding, proprietary fonts, imagery or copied product copy.

Content plan: a single photographic welcome with a clear discovery action → existing micro-adventure selector → practical planning/arrival tools → a user-controlled Shanghai photo essay → existing place collection and preparation tools. Keep every existing feature, stable data ID, local state key and trust warning. Cultural articles inherit the typography and surface treatment without changing sourced narrative or rights records.

Interaction thesis: a short welcome entrance, a bounded photo depth effect as the hero leaves view, and immediate pointer feedback / small recommendation crossfade. Use transform/opacity only for movement, no scroll hijacking, autoplay, WebGL, persistent animation loop or new dependency. Keyboard actions and reduced motion are immediate; content never depends on animation completing. Native scroll-snap gallery supports touch, explicit buttons, enlarged images and keyboard access.

Navigation: a compact translucent top bar gives access to Explore, Stories, My itinerary and all travel tools. The full existing tools list opens as a modal navigation sheet at every viewport, with focus trapping, Escape/backdrop close, scroll lock and trigger focus restoration. No tool disappears.

Tokens are in `src/polish.css`: neutral surfaces, burgundy accent, system sans typography and a small radius scale. Keep utility text readable and forms dense enough for actual travel use. Desktop at 1440 px; verify 375/390 px, an intermediate tablet width, keyboard, reduced motion, empty/search states, dialogs, saved offline assets and original itinerary/Chinese-card interactions. A build alone is not browser acceptance.

## Reference evidence

- [Apple iPhone](https://www.apple.com/iphone/), inspected 2026-11-08: dominant product imagery, short hierarchy and a small number of clear actions. Reinterpret as a travel image and task hierarchy.
- [Apple Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion): reference entry; initial web extraction required JavaScript. Do not claim the inaccessible text was read.
- [Originkit Image Reveal](https://www.originkit.dev/components/image-reveal), inspected through MCP: noise-dissolve WebGL/Three.js implementation. Rejected for this product's battery, accessibility and offline requirements; no source code copied and no dependency added.
- React official effect cleanup documentation retrieved through Context7 MCP: subscriptions/observers and animations must clean up under Strict Mode and unmount.

## Supplied photographs

Eight files supplied by the user are used in this local design preview. `scripts/prepare-ui-images.py` creates bounded WebP renditions and a provenance manifest, removing embedded metadata from the web copies. Originals in Downloads are never modified. Artist names in Pexels filenames are filename-derived attribution hints, not verified licence evidence. The first four images have no verified photographer/licence record. User supply authorizes this local use; independent public-use rights remain **UNVERIFIED** for all eight. No image is used as evidence of current venue access, historical narrative, location precision or opening hours. Do not overwrite the separately licensed culture-story photograph or VDC records.

## Finish review

| Before | After | Why |
| --- | --- | --- |
| Persistent dense sidebar and competing homepage introductions | Compact top navigation, one photographic welcome, original tools in a modal sheet | Establish a clear first action while preserving tool access |
| Remote welcome photo and unbounded source files | Eight local images, 16 responsive renditions totalling 2,174,334 bytes | Predictable offline availability and bounded image transfer; original downloads untouched |
| Static recommendation replacement | Interruptible 180 ms pointer transition; keyboard selection immediate | Make state changes legible without delaying repeated keyboard use |
| Browser focus briefly passed to body at the dialog boundary | Explicit visible-control focus wrapping and trigger restoration | Keep long navigation and existing Chinese dialogs usable with a keyboard |
| Viewport-width image overflow with Windows scrollbars | Container-relative full-bleed image; filters constrained to content width | Preserve edge-to-edge photography without a horizontal page scrollbar |

## Validation evidence · local only

- `npm run check`: PASS, 77 tests (including Node WebP MIME and responsive/offline image provenance checks), TypeScript, VDC/content validators, build and offline generation. VDC retains 88 review notices; no venue evidence or confirmation keys changed.
- `npm run cf:dry-run`: PASS, local bundling, AI disabled; no deployment.
- Playwright MCP `scripts/verify-ui-polish.js`: PASS, zero page errors in the main acceptance context. All ten tools, navigation focus wrapping/Escape/trigger restoration, keyboard-immediate dialog, discovery anchor, manual gallery, enlarged image previous/next, empty search/recovery and existing venue modal.
- Home, arrival, planner and China Ready checked at 375/390/768/1440 px. Overflow is measured against **document clientWidth**, excluding the Windows scrollbar. Desktop/mobile viewport screenshots visually inspected. Gallery images were decoded before judging availability.
- Normal-motion browser check observes welcome entrance, bounded photo depth and result transition. Switching the media preference to reduced motion cancels outstanding Web Animations and clears the photo transform. Pointer image hover is restricted to fine hover-capable devices. No autoplay or continuous rendering loop.
- Failed-image requests show readable fallback copy and leave discovery usable. Saved offline kit contains all 16 responsive images; offline homepage hero and enlarged photograph decode successfully.
- Existing culture and discovery browser scripts: PASS, including saved stories/private notes, explicit itinerary handoff, Chinese copy/full-screen, activity progress, nine interest/time combinations, short-time fallback, offline culture pages and standalone HTML backup.
- Local Workers and culture smoke scripts: PASS for existing API boundaries/assets and all nine culture routes.
- Ignored artifacts: `output/playwright/polish-viewport-{375,390,768,1440}.png`, navigation/gallery screenshots and a short motion recording under `output/playwright/ui-motion/`.

No physical-device Safari, screen-reader session, external accessibility scanner, real visitor outcome, licensed-publication clearance or production release was performed. This feature remains uncommitted on `feature/discover-china`, preserving the prior local culture/discovery work. A next useful validation is an observed first-time visitor choosing a micro adventure and locating the travel tools.
