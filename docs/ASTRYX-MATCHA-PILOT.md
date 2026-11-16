# Astryx Matcha: My Trip pilot

This page-specific visual pilot was requested on 2026-11-16. It supersedes the
abandoned Y2K trial. Other pages retain the editorial design in DESIGN.md.

- Stack: React/React DOM 19.3.1, Vite 8.3.6, Node 24.22.1.
- Astryx Core, CLI and Matcha are pinned together at 0.7.16; React >=19 is required.
- Official setup: `astryx init --features template`, `theme add matcha`,
  `theme use matcha`, then `theme remove y2k`.
- The CLI owns src/astryx-themes.ts. Do not manually edit its generated imports.
- My Trip alone lazy-loads the official Theme, Button, Card and compiled styles.
  No StyleX source compiler, stack migration or global reset is needed.
- The pilot uses the package's warm green surfaces, typography and rounded controls.
  English display text uses Playwrite US Trad; body/controls use DM Sans.
  Chinese uses system CJK fallbacks, with sans-serif for practical place details.
- Official font files are self-hosted under public/fonts/astryx-matcha with
  SHA-256 provenance and SIL OFL licenses. The narrowly targeted Vite font loader
  substitutes local font CSS for the package's Google Fonts import, leaving the
  generated theme module intact. They are included in the optional offline kit.
- Existing planner callbacks, data, storage keys, API calls and tool routes are
  unchanged. Card wrappers and button components are presentation changes only.
- Check empty and populated plans at 375, 390 and 1440 CSS pixels, visible keyboard
  focus, reduced motion, dialog close/focus restoration, and theme cleanup when
  navigating away. Official buttons use the large size for 44px touch targets.
- `npm run check` verifies data, culture, types, build and tests. Additional font
  tests check hashes, licenses, offline inclusion and absence of remote font hosts
  in the compiled pilot stylesheet.

Release targets: cqian7145-cyber/travel-company on GitHub and the existing
china-closer Cloudflare Worker. Before this release the production Worker version
was 9d559028-8f6d-4d8c-a63f-91d1c38553b3; it remains the rollback target.

References: https://astryx.atmeta.com/themes?theme=matcha and
https://astryx.atmeta.com/docs/theme (checked 2026-11-16).
