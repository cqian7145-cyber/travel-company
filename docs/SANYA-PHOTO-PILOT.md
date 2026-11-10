# Sanya photo discovery

The city route is `/cities/sanya`. It is linked from the homepage chapters, city directory, desktop city dropdown, mobile city selector and content filters. Its text and SEO metadata are pre-rendered, and the route, bounded WebP assets and content version are included in the offline bundle.

The first upload is the city cover, labeled **Sanya · 三亚**. The remaining uploads follow the contributor’s mapping:

| Upload | Place | Display |
| --- | --- | --- |
| 2 | 南山寺 / Nanshan Temple | Own gallery |
| 3 | 西岛 / West Island | Own gallery |
| 4 | 大东海沙滩酒吧 / Dadonghai beach bar | Grouped with Dadonghai |
| 5 | 椰梦长廊 / Coconut Dream Corridor | Own gallery |
| 6 | 天涯海角 / Tianya Haijiao | Own gallery |
| 7 | 太阳湾 / Sun Bay | Own gallery |
| 8 | 海棠湾 / Haitang Bay | Own gallery |
| 9 | 大东海 / Dadonghai | Grouped with upload 4 |
| 10 | Exact duplicate of upload 6 | Contributor confirmed keeping one copy under Tianya Haijiao |
| 11 | 蜈支洲岛 / Wuzhizhou Island | Own gallery |

This yields eight destinations and ten unique photos including the city cover. The provenance file keeps all eleven upload records, hashes and the duplicate decision. Originals outside the repository are preserved.

Design contract: reuse the established warm ivory, serif headings, thin dividers and editorial photography. Show all destination photos together without hidden carousel content. Desktop uses an offset two-column layout, with grouped Dadonghai views spanning both columns. Mobile stacks the galleries and preserves native image links, keyboard focus, readable captions and reduced-motion behavior. Primary action: browse photographs; each place also has an explicitly labeled Amap name search.

Location labels are contributor-supplied. Operational facts, exact entrances, public access, reservations, ferries, weather and image-use rights remain unverified. No Sanya itinerary, stories or Experience Journeys are manufactured from the photographs. This pilot was verified locally before release; deployment details are recorded in `docs/DEPLOYMENT-2026-11-09.md`.

Validation on 9 November 2026: `npm run check` passed (97 tests). Playwright MCP executed `scripts/verify-sanya-browser.js` against the local production build at port 8797: all ten photos decoded, eight destination groups rendered, the existing Shanghai trip survived reload, homepage/directory/mobile navigation and the Sanya story filter worked. No horizontal overflow at 320, 375, 390, 768, 1024 or 1440 px. Native photo links received keyboard focus; reduced motion removed zoom transitions. After service-worker installation, the city route and all ten photos reloaded with the browser network disabled. No page errors were recorded. Screenshots: `output/playwright/sanya-desktop.png`, `sanya-dadonghai-desktop.png`, `sanya-mobile.png`.
