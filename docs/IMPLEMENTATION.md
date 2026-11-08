# China, closer — MVP scope

English-first China travel companion; Shanghai is the only city. Visual direction: warm paper, muted olive, burgundy actions, editorial photography, restrained motion. Main workflow: discover → save → plan → edit/export → prepare.

Implemented: nine bilingual place cards, categories/search, Chinese addresses/copy, Amap links, official information and ticket instructions, saved places, a 1–7 day planner with interest and pace matching, daily editing, indicative budget, text export, and five persistent preparation guides. Preparation takes nationality/departure as research context; it never calculates entry eligibility.

Architecture: React/TypeScript + Vite, native Node HTTP server, curated shared catalog and deterministic planner. Browser localStorage only, no account/database. Optional server-side OpenAI Responses API ranks catalog selections, with structured output; catalog data remains authoritative. No key means explicitly labeled curated mode. No fabricated AI, prices, ticket availability, current hours, or visa verdicts.

Alternative considered: framework with database/auth. Deferred because the scoped MVP requires neither accounts nor shared records. Local persistence makes initial validation reversible and avoids collecting identity/payment data.

Not included: community, hotel booking, chat, merchant onboarding, other cities, payments, account sync, live routing, live ticket inventory. A source link is a handoff, not an in-app booking.

Known limits: only museum hours directly verified with its operator; other schedules deliberately require a check. Sources are dated snapshots, not continuously refreshed. Most city guide links are general handoffs and require editorial refinement. Admission/hotel/food costs are estimates. Shared illustrative Unsplash imagery is not guaranteed to depict the named venue. External imagery/fonts require network and have not been downloaded. No live AI provider verification without a configured key. Loopback server is a local MVP, not a hardened public deployment. Before launch: photo licensing/attribution review, venue-by-venue address/hours/booking review, official-policy refresh process, real visitor testing, accessibility audit, authenticated AI access and durable rate limiting, provider budget caps, privacy/legal review, production hosting preflight.

Source retrieval: 2026-11-07. See `shared/catalog.mjs` for exact URLs, publication notes, review dates and verification boundaries. No automatic policy eligibility rules are encoded.

## Companion extension

Added Trip Mode, Booking Assistant, and China SOS. See COMPANION-MODULES.md for scope and state contracts, and COMPANION-VALIDATION.md for checks. These extend execution and preparation; they do not add ticket sales, live geolocation, provider booking verification, or a general-purpose chatbot. Dates for Trip Mode use Asia/Shanghai. Progress uses stop occurrence IDs with compatibility for existing saved plans. Booking confirmations include itinerary and rule fingerprints so relevant edits invalidate previous user checks. New personal address data remains browser-local and is not sent to AI.

## Arrival and communication extension

Added China Connectivity, 24 Speak Local templates and First 90 Minutes. See ARRIVAL-TOOLS.md and ARRIVAL-VALIDATION.md. A user-triggered service worker caches only versioned local app assets; navigation can reload offline after saving. A script-free, escaped standalone HTML snapshot provides an additional backup. Changing hotel name/address invalidates its personal-card confirmation. Connection settings never certify eSIM compatibility or service availability. Airport reference costs remain tied to People's Square, and operating hours require current operator checks. No new dependencies or remote storage were added.
