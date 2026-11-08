# Cloudflare Workers migration

The React/Vite build is served by Workers Static Assets. `workers/index.mjs` handles `/api/status` and `/api/plan` with standard Request/Response APIs, reusing the catalog, planner and DeepSeek adapter. No Node HTTP server, persistent filesystem, database, container or `nodejs_compat` flag is required. The existing Node launchers remain available for local development.

## Local workflow

Use the project-pinned Wrangler development dependency (Node 22+). Project source, cache and build output remain on D:.

```powershell
npm ci --cache .npm-cache
npm run check
npm run cf:dry-run
npm run cf:dev
```

Open http://localhost:8787. `cf:dev` serves the built UI and Worker in Cloudflare's local runtime. The regular Vite/Node scripts still work. `workers.dev.vars.example` is a safe template for ignored `.dev.vars`. Neither `.env.deepseek` nor the original OpenAI `.env` is loaded into the Worker automatically. Do not copy secrets into Wrangler `vars`, source code, frontend `VITE_` variables, commits or chat.

`html_handling: none` preserves `/index.html` without a redirect so the explicit offline cache can store it. SPA fallback serves browser navigation; `/api` and `/api/*` always run through the Worker first, including unknown routes, so API errors are JSON rather than index HTML. Static `_headers` disable stale HTML/service-worker caching and allow immutable hashed assets. The offline pack excludes Cloudflare control files.

## Deployable target and approval boundary

Proposed Worker name: `china-closer`, public workers.dev endpoint, no custom domain or DNS changes. The account ID is deliberately not guessed or committed. Before publishing, verify the account and check that the name and rate-limit namespace `817460231` do not conflict with existing resources. Namespace IDs share counters within an account. Change the namespace if it is already in use. No remote resource has been created by preparing these files.

Read-only authentication preflight:

```powershell
npm run cf:whoami
# If required, the user signs in locally:
npx wrangler login
```

Then inspect the selected account's existing Worker names, current deployments and Workers billing plan/limits. Prepare exact account/name, whether this creates or replaces a Worker, the expected public URL, secret changes, estimated usage exposure, and rollback before asking for the user's specific publish approval. A generic migration request does not authorize overwriting an existing production Worker, changing DNS/billing or uploading a secret. Do not run `cf:deploy` before that gate.

Approved publishing command:

```powershell
npm run cf:deploy
```

Cloudflare Git integration is optional; no GitHub push or automatic deployment workflow is enabled here. If configuring Workers Builds later, use build `npm run build` and deploy `npx wrangler deploy`, with the repository root as build root and the correct account selected. There is no Pages `_worker.js` or Pages Functions deployment.

## DeepSeek and public endpoint protection

The deployable configuration has `AI_ENABLED=false`. Publishing without a key provides the complete curated travel companion and incurs no DeepSeek calls. `/api/status` reports `aiConfigured=false`. This is an intentional, reviewable starting state.

To enable paid AI after separate authorization, set a server-side Worker secret interactively:

```powershell
npx wrangler secret put DEEPSEEK_API_KEY
```

This is a remote secret/deployment mutation; it is not part of local setup. Set `AI_ENABLED` to `true` in the reviewed config and redeploy only after agreeing how public AI access and provider costs are controlled. The default model is configurable `deepseek-flash`. The app displays DeepSeek as the recipient of trip preferences. Hotel, passport, payment and nationality fields are not sent.

The native rate-limit binding permits approximately 10 plan requests/minute/IP per Cloudflare location. Missing/failing limiter bindings fail closed. It is NOT authentication, a worldwide hard limit or a spending cap. Nonbrowser clients can call a public API despite origin checks. Before enabling a paid anonymous endpoint, agree on access controls (for example a protected pilot or a verified challenge) and provider-side spending constraints; do not assume this limit alone prevents abuse. No paid retries, automatic OpenAI fallback or account-level billing changes are introduced.

## Data and rollback

Local browser data stays at its existing origin. A new workers.dev/custom-domain origin starts with empty localStorage; it cannot read localhost itineraries. Export important itineraries before switching. No remote database migration or deletion is needed.

Existing Node launchers and old hosting remain usable. For a new Worker, rollback can mean leaving the old site in service while a fix is prepared. For an existing Worker, record the current deployment/version before changes and use Cloudflare's verified rollback workflow if needed. No rollback version can be specified until the actual target is inspected. Do not delete the Worker or its assets as a cleanup shortcut. Changing the DeepSeek secret requires its own recovery plan; code rollback does not guarantee restoration of secret values.

## Verification and limitations

See `CLOUDFLARE-VALIDATION.md` for commands and observed results. A dry-run proves bundling/config compatibility, not account access, production routing, native cloud rate-limit behavior or successful paid DeepSeek calls. No claim is made that standard global Workers hosting, external fonts/photos or DeepSeek are equally reachable from every mainland-China network. User field testing and official travel-data refresh remain required before public launch.

Official references checked 2026-11-08: [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/), [HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/), [rate-limit bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), [secrets](https://developers.cloudflare.com/workers/configuration/secrets/) and [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/).
