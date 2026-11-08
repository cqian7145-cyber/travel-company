# Separate DeepSeek variant

The original `server.mjs`, `.env.example`, frontend and npm startup commands remain unchanged. `server-deepseek.mjs` is an independent launcher sharing the current UI, catalog and deterministic planner. Its small HTTP handler is intentionally separate to preserve the original; future server security fixes must be applied to both launchers.

## Configure locally

An ignored `.env.deepseek` file is prepared with an empty key. Edit it locally:

```dotenv
DEEPSEEK_API_KEY=your_private_key
DEEPSEEK_MODEL=deepseek-flash
DEEPSEEK_PORT=5176
```

Do not paste keys in chat, frontend code or `VITE_` variables. Obtain a key through [DeepSeek Platform](https://platform.deepseek.com/). The safe template is `deepseek.env.example`; never commit `.env.deepseek`. No key is generated or supplied by this project.

```powershell
# Built app (uses the existing dist output)
node server-deepseek.mjs
# Or development UI
node server-deepseek.mjs --dev
```

Open http://localhost:5176. Restart this launcher after changing configuration. The original remains available at its existing port and continues using only its original OpenAI configuration. DeepSeek uses `DEEPSEEK_PORT`, not the original `PORT`. Missing/blank key leaves the separate variant in curated mode. `/api/status` reports only whether a key is configured, not whether it is valid or funded.

## Provider contract and validation

Official docs checked 2026-11-08: [first API call](https://api-docs.deepseek.com/) and [JSON output](https://api-docs.deepseek.com/guides/json_mode/). Current documented default is `deepseek-flash`; the model is configurable. Calls use HTTPS `/chat/completions`, JSON-object output, explicit JSON example, nonstreaming and thinking disabled. No new SDK/dependency is required.

Only validated trip preferences and public catalog fields are sent to DeepSeek. User hotel addresses, nationality, phone numbers, passport and payment data are excluded. Model output is limited to catalog IDs and revalidated; schedules and prices continue to come from the shared curated planner. Empty/truncated/invalid output is rejected. A provider failure returns a generic error; no automatic paid retries or silent OpenAI fallback. User can explicitly choose curated planning.

Tests use mocked responses and cover request format, no-key mode, invalid/empty/truncated output, redacted failures and HTTP curated bypass. No live paid DeepSeek call is made during setup. Account validity, balance and a real generated itinerary remain NOT VERIFIED until a key is privately configured and an authorized real request is made. Local development only; no deployment or push.

Local verification 2026-11-08: `npm run check` PASS (34 tests, TypeScript and production build); five adapter tests rerun and PASS after trimming whitespace in configuration status. Original `server.mjs`, `package.json` and `.env.example` SHA-256 hashes match their pre-change values. DeepSeek launcher started on loopback port 5176 in curated mode; UI and status endpoints return HTTP 200. `.env.deepseek` is confirmed ignored by Git.
