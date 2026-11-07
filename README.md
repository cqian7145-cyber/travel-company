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

All user preferences are stored on the current browser only. Clearing browser data removes them. No account or remote synchronization. Admission and budget amounts are estimates; route times and live ticket availability are not supplied. Recheck official sources before travel. Images are illustrative, externally hosted Unsplash photographs. See [implementation boundaries](docs/IMPLEMENTATION.md).

No community, hotel booking engine, live chat, merchant portal or nationwide database. No deployment or GitHub push performed as part of the local build.
