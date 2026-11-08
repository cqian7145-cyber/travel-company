# Discover China V0.1

Local scope: three short, sourced English stories; three linked self-guided experiences; a Voices of China empty state and consent-gated schema. React/Vite/Workers and static JSON remain. No database, paid AI, stranger matching, checkout, interview fabrication or production change.

Visual thesis: the existing warm paper, olive and burgundy travel companion becomes a quiet city journal. Use one rights-cleared documentary image with its actual date, generous serif headings and numbered editorial rows. Do not reuse illustrative venue imagery as evidence or invent portraits.

Content plan: a Travel / Discover choice leads to story index, then Hook / Context / Human perspective / Look closer / Go deeper. A related experience provides actionable steps, cost nature, duration estimates, VDC access/booking facts, alternatives, Chinese communication and optional private reflection. Voices explains what authorized portraits will offer; it does not solicit meetings.

Interaction thesis: links preserve spatial/browser navigation; a restrained hover underline/arrow indicates story links; native details reveal evidence; activity checkboxes communicate user-reported progress. Honor reduced motion. Independent static HTML includes the complete story before JavaScript, title/description/canonical/Open Graph and sitemap. Interactive controls progressively enhance it; factual content is not generated in the browser.

Content types are separate: Story (narrative and cited assertions), Experience (editorial task design and venue references), Voice (authorized person's account and publication/withdrawal controls). VDC retains authority over address, opening, price and booking evidence. A story's editorial review never upgrades VDC verification. No actual breakfast vendor is named without evidence.

First stories: shikumen/Xintiandi, Shanghai breakfast, and Fuxing Park. The third is an observational story, not an invented shopkeeper interview. The interview slot remains empty until actual recording, consent, translation review and rights records exist. Original English synthesis is labeled as editorial writing; sourced facts and interpretation are separated. Activities are editorial suggestions, not field-tested tours or guarantees of food safety/access.

Privacy: saves, experience checklists and short reflections stay in this browser. No analytics endpoint or subscription is added. Sharing uses an explicit system-share/copy action, not a tracking request. Private interview permission records must stay outside public JSON, deployment assets and Git; only approved public metadata may be exported. Actual tourist comprehension, completion, willingness to pay and distribution remain unverified.

## Editorial and technical workflow

- `content/stories/*.json`: Hook, Context, Human perspective, Look closer, Go deeper; 200–350 English words, exact source references for factual blocks, stable venue links, editorial review/version and rights.
- `content/experiences.json`: independent activity objects with estimated duration, cost nature, steps, conditions/risks, Chinese phrase and alternative. No duplicated opening/admission verification; venue evidence resolves through VDC at rendering time. The breakfast activity has no verified vendor and does not invent one.
- `content/voices.json`: empty. `content/schemas/voice.schema.json` defines the private editorial record. V0.1 explicitly rejects published portraits; it is not yet an interview publishing/media-player system. Actual consent and identity materials belong outside the public bundle, for example ignored `content/private/`. That directory is not a secure vault—choose appropriate access-controlled storage before collecting sensitive records.
- `shared/story-catalog.mjs`: register published story files and stable relationships. `npm run stories:check` audits source references, length, review/rights, experiences and the portrait gate. Keep draft material outside public imports.
- `scripts/build-culture.mjs`: outputs nine independent HTML routes with full text, unique title/description, canonical/Open Graph, sitemap and robots. Default canonical origin is the existing workers.dev site; `PUBLIC_SITE_URL` may specify the approved final HTTPS origin. No search-indexing or social-preview success is claimed merely from producing metadata.
- React adds saving, private notes, progress, sharing/copy, Chinese display and explicit itinerary-day selection. Browser data uses a separate culture key and existing itinerary IDs; no remote profile or metrics are collected. “Saved story” is a bookmark; downloading app files is a separate offline action.
- The service worker stores local story pages, shared assets and the licensed local image. Offline navigation resolves each saved route's own HTML rather than replacing a story with the travel homepage. The script-free HTML backup includes story/experience text and sources, with no images or audio. VDC version and culture edition remain distinct.

Run `npm run check`, `npm run cf:dry-run`, then local runtime smoke scripts and browser checks. Current CI already runs `npm run check`; that now includes `stories:check`. This branch has not been pushed, so no new GitHub CI run is claimed. No deploy step was added.

## Sources and media provenance

Official cultural source pages were read on 2026-11-08; precise assertions and scope are linked through `content/story-sources.json`. Publication/update dates come from page text, not inferred URL dates. These cultural source checks intentionally do not update VDC's separate operational evidence or dataset version.

The new local photo `public/culture/xintiandi-2006.jpg` is the original 132,948-byte Wikimedia Commons file [Xintiandi1.jpg](https://commons.wikimedia.org/wiki/File:Xintiandi1.jpg), credited to Brad & Sabrina under [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). File source and licence were inspected on 2026-11-08. Original file is preserved; CSS may crop its display. Caption uses 2006 because the source description and EXIF differ on the exact day. It is historical photography, not proof of today's conditions. There is no implied photographer endorsement. Existing travel photos remain subject to the earlier project's rights-review debt; this task does not clear those rights.

Before expanding: manually review narrative accuracy and English with real target readers, field-test activity instructions, establish an interview/translation/withdrawal process, and test search/social previews. Do not treat technical test passes as proof of cultural comprehension, real task completion, market demand or licensed interview rights.
