# China, Closer · visual contract

Current direction: **Story-led × Cultural × Minimal**, with cinematic destination photography and practical travel interfaces. This supersedes the earlier vivid blue/green treatment while retaining readable navigation and body sizes. The user's four attached reference boards guide composition, not copied branding or illustrative travel facts.

## Brand and type

| Role | Token |
| --- | --- |
| Warm ivory canvas | `#F7F5F0` |
| Warm neutral surface/divider family | `#E8E4DB` / `#DDD9CF` |
| Charcoal text | `#292E29` |
| Muted olive | `#4B5547` |
| Deep teal | `#334C49` |
| Restrained burgundy action | `#823E44` |
| Editorial headings | Cormorant Garamond, self-hosted Latin WOFF2, Georgia fallback |
| Body and controls | Inter, self-hosted Latin WOFF2, platform/CJK sans-serif fallback |

Current brand tokens and overrides are centralized in `src/editorial.css`, imported after the existing layout sheets in both entry points. Earlier files retain layout scaffolding for the travel tools and city pages; do not restore their previous saturated palette. This deliberate override avoids a broad legacy CSS rewrite during the visual iteration.

Fonts use SIL Open Font License 1.1. Copies and source/hash records live in `public/fonts`. Both files together are 85,896 bytes. Fonts are local and included in the optional offline kit; no third-party font requests are made by the app. Large Chinese communication cards use the sans-serif/CJK fallback, not a decorative Latin heading face.

## Composition and usability

- Maximum outer content width 1400 px. Asymmetric image/copy introductions, alternating image proportions, 80–100 px desktop section spacing and 55–65 px mobile spacing.
- Headlines generally 56–84 px on desktop and 47–62 px on mobile. Reading text 16–17 px, line height 1.7–1.85. Desktop navigation remains 17 px; source/caption text 12–14 px. Never shrink practical information to imitate tiny reference-board text.
- Photography stays primary. Use 20–28 px frames, thin warm dividers, capsule actions, restrained shadow, and honest image provenance. The reference board images themselves are not product assets.
- Distinguish storytelling from travel execution. Do not apply decorative serif typography to Chinese help cards or remove VDC status/source disclosures for visual cleanliness.
- Mobile quick navigation exposes Discover, Cities, Culture and My Trip. Travel Tools has its own header entry. Native dialogs remain above it; safe-area padding protects bottom content. Culture pages provide equivalent travel/story/itinerary/preparation links in prerendered HTML.
- Keep keyboard focus, all existing tools, saved trip IDs and booking confirmation semantics intact. Avoid inventing portraits, availability or reservations to fill a visual layout.

## Motion

| Interaction | Behavior |
| --- | --- |
| First viewport entry | Opacity 0→1, translateY 24→0 px, 600 ms; never hide content until an observer fires |
| Photograph hover | Fine pointer only, image scale 1.04 inside its frame, 600–650 ms |
| Action hover | Lift 2 px, arrow moves 4 px, 220 ms; no cursor tracking or spring bounce |
| City card → Hangzhou | Native same-document shared-image transition, 420 ms; ordinary navigation when unsupported, reduced motion, keyboard input or image not ready |
| Repeated selections | Existing brief feedback retained; no decorative loops |

The shared-image helper uses React `flushSync` only inside the browser snapshot callback. It restores temporary transition names/listeners, handles rejected readiness, cancels on reduced-motion change and preserves ordinary anchors/modifier-key navigation. Scroll reveals yield to a shared transition and visible keyboard focus. Reduced motion removes spatial movement; interfaces remain usable immediately.

## Architecture boundary

Culture Highlights V0.4 uses city/place entry points, complete 50–90-word snapshots, explicit cultural types and optional reading/source/travel disclosures. Do not reintroduce task progress, compulsory reflections or an empty interview section. Preserve historical article links and browser-local travel data. The detailed implementation and verification contract is in `docs/CULTURE-HIGHLIGHTS-V0.4.md`.

React + Vite + Cloudflare Workers remain the current delivery stack. The requested visual language does not require Next.js, Tailwind or another motion dependency. Existing culture prerendering provides standalone article HTML and metadata. A stack migration would need a separate product/engineering decision.

References for implementation: [native View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition), [React DOM flushSync](https://react.dev/reference/react-dom/flushSync). Retrieved 2026-11-08. Use feature detection and progressive enhancement rather than assuming universal browser support.
