# China, closer

A focused, English-first Shanghai travel companion for international visitors to China.

## Run locally

Requires Node.js 22.12+ (validated using Node 24.22.1).

```powershell
cd D:\旅游
npm install
npm run dev
```

Open http://localhost:5173. The app works without an API key in clearly labeled curated mode.

```powershell
npm run check
npm run build
npm start
```

`npm start` serves the built application and API on loopback. Stop the development server before starting the build on the same port.

## Optional live AI

Copy `.env.example` to `.env`, set `OPENAI_API_KEY` privately and optionally `OPENAI_MODEL`, then restart. Never put secrets in `VITE_` variables. Calls are server-side and opt-in via the planner; no call occurs without a key. Only trip preferences and public catalog information are sent. Nationality, passport data, checklist and saved places are not sent. API calls incur provider charges. Live provider integration requires verification with your account before being considered ready.

## Features

- Editable 1–7 day itinerary, interest/pace matching, closure-day avoidance, CNY estimates with contingency and over-budget indication, Chinese addresses, transport guidance, official ticket instructions and text export.
- China Ready: source-linked entry research, Alipay/WeChat setup, eSIM, Railway 12306, maps/taxis/apps. Review dates are explicit; no entry eligibility guarantee.
- Nine curated bilingual Shanghai cards, category/search, place details, Amap handoff, address copy and local saved places.
- **Trip Mode:** Shanghai-local today/explicit date previews, next planned stop, one-tap navigation/large Chinese address, persistent done/skip/undo, and approximate nearby alternatives with direct itinerary replacement.
- **Booking Assistant:** itinerary-derived admission followups, opt-in Railway 12306 task, Chinese hotel-address preparation, official sources and explicit verification dates/unknowns. User confirmation is never represented as a successful booking. Relevant itinerary or guidance changes reset confirmations.
- **China SOS:** six bundled guided troubleshooting flows for payment, SMS, directions, rail, mobile data and Chinese help. Large Chinese cards, escalation links and user-reported resolution; no AI call or live agent.
- **China Connectivity:** personalized preparation distinguishes internet, home-number SMS and overseas app access; four separate recovery guides include sourced Pudong passport Wi-Fi instructions.
- **Speak Local:** 24 fixed bilingual communication cards, confirmed hotel/destination insertion, train details, copy and full-screen Chinese. Allergy cards address cross-contact and require restaurant confirmation.
- **First 90 Minutes:** PVG/SHA arrival action cards for terminal, arrival period, luggage and accommodation. Five practical steps, source-linked pickup information and explicit night-service uncertainty.
- **Offline kit:** explicitly save local app files for offline reload, or download a standalone HTML snapshot. Four recovery guides and communication cards remain readable without a connection; maps, booking and live checks need internet.

All user preferences are stored on the current browser only. Clearing browser data removes them. No account or remote synchronization. Admission and budget amounts are estimates; route times and live ticket availability are not supplied. Recheck official sources before travel. Images are illustrative, externally hosted Unsplash photographs. See [implementation boundaries](docs/IMPLEMENTATION.md).

Module behavior and validation are recorded in [COMPANION-MODULES.md](docs/COMPANION-MODULES.md), [COMPANION-VALIDATION.md](docs/COMPANION-VALIDATION.md), [ARRIVAL-TOOLS.md](docs/ARRIVAL-TOOLS.md) and [ARRIVAL-VALIDATION.md](docs/ARRIVAL-VALIDATION.md). Offline saving requires the built app on HTTPS or localhost. Browser storage can be evicted; test disconnected use and keep a downloaded backup. Hotel addresses and website links are user-provided and remain unverified.

No community, hotel booking engine, live chat, merchant portal or nationwide database. No deployment or GitHub push performed as part of the local build.

## Cloudflare Workers

Workers migration is available alongside the existing Node launchers. Use `npm run cf:dev` for the local Workers runtime, `npm run cf:dry-run` to validate the bundle without publishing, and `npm run cf:whoami` for account authentication status. See [Cloudflare setup and publishing gates](docs/CLOUDFLARE.md) and [validation evidence](docs/CLOUDFLARE-VALIDATION.md).

Static assets and the planner API share one Worker. Paid DeepSeek calls are disabled by default; secrets belong in Worker bindings, never frontend variables. Browser data does not automatically transfer from localhost to a new hosted origin.

Live Workers deployment: [China, closer](https://china-closer.cqian7145.workers.dev). Published with user authorization on 2026-11-08; curated planning and mobile offline reload verified. DeepSeek remains disabled and no key has been uploaded.
