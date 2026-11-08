# Cloudflare Workers — local validation, 2026-11-08

## Outcome

Worker request handler, Workers Static Assets configuration, native rate-limit binding, server-side DeepSeek environment bindings, explicit paid-AI switch, static security/cache headers, local templates and npm workflows implemented. Original `server.mjs` is unchanged. The separate Node DeepSeek status endpoint now identifies its provider so the shared UI displays the correct data recipient.

## Evidence

- `npm run check`: PASS, 42 Node tests, TypeScript check, production Vite build and offline manifest generation. Eight new Worker tests cover routing, origin/method/content validation, byte-bounded bodies, safe status, limiter behavior, curated bypass and DeepSeek binding contracts.
- Project-local Wrangler 4.158.0 installed and pinned as a development dependency, using the repository `.npm-cache`. No global installation or runtime dependency upgrade requested. npm reported skipped approval-gated postinstall scripts for esbuild/workerd; the packaged binaries nevertheless passed the local runtime checks below. No host-wide npm allowlist was changed.
- `npm run cf:dry-run`: PASS. Worker bundle 17.61 KiB / gzip 6.34 KiB; bindings validated for ASSETS, PLAN_RATE_LIMITER, AI_ENABLED=false and DEEPSEEK_MODEL. No upload/deployment occurs in dry-run mode.
- Local `wrangler dev --local --ip 127.0.0.1 --port 8787`: PASS, workerd starts with static assets and the native local rate-limit binding. Wrangler could not fetch sample Request.cf metadata and used its documented placeholder; this did not prevent the runtime checks. No remote development resource was started.
- `node scripts/verify-workers.mjs`: PASS against the actual local runtime: homepage/security headers, `/index.html` HTTP 200 without redirect, service-worker no-cache headers, four offline assets, immutable hashed files, JSON API 404 despite browser-navigation headers, safe status, curated plan, rejected foreign origin, invalid input and oversized body.
- Playwright `scripts/verify-workers-browser.js`: PASS on 390 px viewport: generate a curated three-day itinerary, save offline kit, disable networking, reload successfully, open airport Wi-Fi recovery guide offline. Synthetic/local browser context only. Screenshot: ignored `output/playwright/workers-offline-mobile.png`.
- `npm run cf:whoami`: NOT AUTHENTICATED. Output requests `wrangler login`; no account, existing Worker, namespace uniqueness, billing plan, deployment target or public URL can be verified yet. Wrangler exits zero even when unauthenticated; the actual output, not exit code, determines this status.

## Production deployment — subsequent authorized action

The user subsequently authorized deployment to the currently authenticated personal account, Worker name `china-closer`. `wrangler whoami` confirmed that account. The pre-deployment `deployments list` returned Cloudflare error 10007 (Worker does not exist), establishing this as a new Worker rather than replacement of an existing deployment.

`npm run cf:deploy`: PASS. New Worker deployed to https://china-closer.cqian7145.workers.dev with `AI_ENABLED=false`. Version `10fcb372-e59f-45e5-92dc-8bcc7ece7b30`, confirmed by the subsequent deployment listing at 100% traffic. Cloudflare recorded creation 2026-11-08 03:20:54 UTC (11:20:54 Asia/Shanghai).

Production HTTP checks: homepage and direct `/index.html` return 200/no-cache; `/sw.js` returns JavaScript/200/no-cache; `/api/status` returns `{aiConfigured:false,aiProvider:"DeepSeek"}` with no-store; unknown API returns JSON 404; explicit curated planning returns HTTP 200, curated mode and three days. No paid upstream API call.

Production Playwright on a 390 px viewport: PASS, curated itinerary generation, explicit offline save, network disabled, successful page reload and airport Wi-Fi guide readable offline. These establish the tested production flows, not comprehensive public-launch acceptance or every mainland network's reachability.

No DeepSeek key uploaded, DNS/custom domain changed, billing setting altered, temporary account used or Git commit/push made. Account usage plan/limits and account-wide rate-limit namespace uniqueness remain NOT VERIFIED. Native rate limits are approximate and location-specific, not a global cost cap. AI remains disabled until access/cost controls and a specific enablement are reviewed. DeepSeek account validity and upstream performance remain NOT VERIFIED.

This was the first deployment, so there is no previous production version to roll back to. Existing local Node launchers remain usable. Record this version as the recovery baseline for future code deployments; do not delete the Worker as an automatic rollback. Future remote changes require their own applicable approval.
