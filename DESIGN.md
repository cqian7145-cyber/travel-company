# China, Closer · Astryx Matcha

Current visual direction: official Astryx Matcha across the entire site.
This supersedes the editorial palette and the initial My Trip-only pilot.
Keep the established layouts, destination photographs and travel behavior.

## Official integration

- Core, Matcha and CLI are pinned together at 0.7.16.
- MatchaTheme wraps both React entry points. HTML templates carry the same
  theme/mode attributes so pre-rendered city and Culture pages are themed
  before JavaScript starts.
- src/matcha.css is the shared final stylesheet. Legacy semantic aliases
  resolve to official tokens; preceding stylesheets retain layout.
- Use official Button and Card components for React actions and discrete cards.
  MatchaButton preserves native disabled state, form type, labels and callbacks.
  Links remain links. Generated Culture HTML retains its delegated actions
  and receives the same public theme tokens.
- Retain the existing reset; use Astryx's compiled component stylesheet.

## Visual contract

| Role | Official Matcha light value |
| --- | --- |
| Canvas | --color-background-body · #f0f0e0 |
| Surface | --color-background-surface · white |
| Text/action | --color-text-primary / --color-accent · #3e481d |
| Secondary text | --color-text-secondary · #5a6b2a |
| Border | --color-border · #dce3ce |
| Inner/control/container/page radius | 6 / 12 / 18 / 42 px |
| Buttons | Official capsule shape; large size for touch targets |
| Body | DM Sans with Chinese system sans-serif fallbacks |
| Display | Playwrite US Trad with Chinese serif/platform fallbacks |

Reserve handwriting for major headings; use sans-serif for dense place titles,
controls and Chinese communication cards. Preserve evidence status labels and
warning/error colors. Green branding never implies operational verification.

Fonts are local in public/fonts/astryx-matcha with SHA-256 provenance and SIL OFL
licenses. The Vite font loader replaces the package's remote font CSS without
editing the CLI-generated module. App offline caching includes these fonts.
The standalone HTML backup uses Matcha colors and system fonts to stay portable.

## Acceptance

Check 375, 390 and 1440 CSS pixels, keyboard focus, dialog Escape/focus restoration,
native disabled states, reduced motion and pre-rendered reading without JavaScript.
Photo strips may scroll inside their own containers; pages must not overflow.
Preserve source content, saved IDs, storage keys, APIs, confirmation meanings
and all factual uncertainty disclosures.

Validation: docs/ASTRYX-MATCHA-ROLLOUT.md.
Historical pilot: docs/ASTRYX-MATCHA-PILOT.md.

References checked 2026-11-16:
https://astryx.atmeta.com/themes?theme=matcha
https://astryx.atmeta.com/docs/theme
