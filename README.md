# Life Transitions Support Partners

A nurse-led initiative in Nairobi, Kenya, supporting individuals and families through childbirth, caregiving, serious illness, bereavement, and recovery after hospital discharge.

> Walking life’s seasons with you.

## Current stage

This workspace now contains a runnable local MVP: an Astro public website, a Payload/Next.js content editor and staff backend, and a SQLite development database. The user explicitly authorised application implementation after the original documentation-only stage.

The requirements and their status are recorded in [the decision register](docs/DECISIONS.md). Astro and Payload are selected, as are the supplied official logo and gold/cream/black brand direction. C37/C38 select one Render Free service with automatic bootstrap. C39 connected, migrated, seeded and verified the supplied Neon production branch; see [Neon setup and proof](docs/NEON_SETUP.md). On 2026-11-03 the user reported the app live on Render; its URL/dashboard have not been independently verified. C40 adds managed administrator credentials and runtime diagnostics in [the deployment guide](docs/RENDER_DEPLOYMENT.md). Hosting capacity, payment provider, organisation photography and operating rules remain open. See [the MVP plan](docs/MVP_PLAN.md) for launch boundaries and [hosting options](docs/RESEARCH_AND_OPTIONS.md#hosting-deployment-options) for alternatives.

## Run locally

From this directory in PowerShell:

```powershell
npm.cmd ci
npm.cmd run setup
npm.cmd run admin
npm.cmd run dev
```

Public website: [http://127.0.0.1:4321](http://127.0.0.1:4321). Staff sign-in: [http://127.0.0.1:3000/admin/login](http://127.0.0.1:3000/admin/login).

To share the public website temporarily using your ngrok account, follow [the ngrok preview setup](docs/NGROK_PREVIEW.md). It covers account authentication, matching WEB_URL, and tunnelling port 4321 while the staff backend remains local.

Without env-managed credentials, the admin command prompts for a name, email and a hidden password of at least 12 characters and creates the first administrator only. Optional `SUPERUSER_EMAIL`, `SUPERUSER_PASSWORD` and `SUPERUSER_NAME` instead create/update the matching administrator whenever bootstrap runs. See [managed administrator behaviour](docs/RENDER_DEPLOYMENT.md#managed-administrator-credentials). Additional staff accounts are managed through Payload. Public first-user registration is disabled. No default live credentials are supplied.

Setup creates an ignored .env with random secrets. Development seeds missing services/courses without replacing edits. Local data and SQLite sidecars live under ignored data/. The project includes a task-local Node 24.22.1 used by npm scripts; an older system Node may warn during installation. Payload requires Node ^22.23.4 or >=24.22.1. No system Node installation is changed.

## Try the workflow

1. Edit Services, Courses or Site settings in Payload. Services contains seven services and three signature packages; its Category field controls their listing group. Both use the existing detail page and short enquiry. Add confirmed phone, WhatsApp, email and response information when available.
2. Submit a fictional request on the website and open Request inbox in Payload. Original details are read-only; review, close/reopen or add an attributed follow-up note. Phone/WhatsApp enquiries can be recorded through the dedicated capture form.
3. Review the request before confirming an appointment; coordinate availability manually.
4. For an agreed paid service, create a linked Payment with a genuine provider-hosted HTTPS checkout URL and share its generated public URL privately.
5. Verify the transaction in the provider dashboard and record its reference before marking paid. Returning from checkout is not payment proof. Complimentary services cannot be charged.

Demo mode is on by default: use fictional details only; public checkout buttons are disabled. Email delivery is disabled, without logging message content. Follow-up and payment reconciliation are manual. A live provider account and the [launch prerequisites](docs/MVP_PLAN.md#launch-prerequisites-still-open) must be resolved before accepting real client information or payments.

## Checks and builds

```powershell
npm.cmd run check
npx.cmd playwright install chromium
npm.cmd test
npm.cmd run build
npm.cmd run smoke
```

Tests use isolated servers on ports 3100/4421 and new ignored .test-data databases. They do not reset development data or contact payment providers. Synthetic fixture credentials exist only in test databases. Tests can run alongside the normal development preview: the test CMS uses its own `.next/test` build directory and the test Astro process leaves the existing preview's server lock untouched. One-shot seeding disables Payload live reload so it exits even when the development CMS is open.

Run checks and builds sequentially; Next regenerates its type files during a build.

The build command creates the CMS production build and Astro standalone server build. Both accept host-injected environment variables without requiring a local `.env`; when the file exists, injected values take precedence. Set WEB_URL before building because Astro compiles its allowed hostname. `npm start` runs the combined production service; its default public port is 8080 and private app ports are 3000/4321. `npm run test:deployment` checks its proxy/logging, and `npm run smoke:deployment` verifies a running combined build without creating records. PostgreSQL uses committed, reviewed migrations through `npm run payload -- migrate`; local development still defaults to SQLite. See [deployment and bootstrap steps](docs/RENDER_DEPLOYMENT.md). Actual Render behaviour, cloud recovery and live-provider integrations remain independently unverified.

The current C32/C33 presentation uses light cream/gold surfaces and a continuous background of connected vines and flowers from the introduction through the footer. The pale navbar, light gold reassurance section and champagne footer replace large black areas; black remains text and logo detail. Asymmetric branches extend behind the content rather than restarting in cropped section gutters. Cards, photographs, forms and navigation remain in front, with quieter vines on phones and darker secondary/gold text for contrast. See the [current brand specification](docs/RESEARCH_AND_OPTIONS.md#official-brand-and-service-alignment).

Restoration, C36, 2026-11-02: the user rejected the C34/C35 floral-kit redesign and requested a full revert. All application source and tracked tests were restored exactly to the pre-kit commit `4665d01`, including flowing vines, the light surfaces and earlier scrolling behaviour. Added kit assets/components/scripts/tests were removed from the application and archived under ignored `.test-data/reverted-decor-kit/`; the original supplied kit remains untouched. All 24 focused branding/scrolling/sticky-navigation tests passed, type checks reported zero diagnostics, and the Astro build and built-server smoke check passed. Chromium confirmed restored vines and light surfaces on three local and three public ngrok pages, with no kit borders, spots, motion controls, overflow or script errors. No records were created. The rebuilt preview is running through the same ngrok link. The full suite and physical-device/screen-reader checks were not repeated for this exact-source restoration.

Light-surface verification, 2026-10-31: all 24 focused branding, scrolling and sticky-navigation tests passed, including header/footer link hover and focus contrast, care-section text contrast, light surface colours, five distinct homepage bands and the retained vine background. Type checks reported zero diagnostics and the Astro build and built-server smoke check passed. A read-only compiled-browser probe passed 26 route/viewport combinations with all rendered images decoded and no browser script errors or created records. The updated compiled preview is running on 4321/3000. Screenshots are under ignored `.test-data/light-surfaces/`. This was a focused UI run; the full 76-test result below predates the light-surface adjustment. Physical-device, screen-reader and public-tunnel checks remain unperformed.

Continuous-background verification completed 2026-10-31: all 76 browser/API tests passed, including page/footer coverage at 320/390/1440/1920px, foreground layering, whole-card interaction and conservative decorated-text contrast. CMS and 29-file Astro checks reported zero diagnostics; both production builds and the built-server smoke check passed. A fresh read-only compiled-browser probe passed 26 route/viewport combinations, rendered-image decoding, compact header heights, configured/foreign form origins and private/source-route denial, with no browser script errors or created records. The compiled preview is running again on 4321/3000; screenshots are under ignored `.test-data/vine-background/verified-2026-10-31/`. Physical-device, screen-reader and public ngrok access were not checked in this follow-up.

Official branding and service alignment, 2026-10-28: the public website uses the supplied logo and tagline, gold/cream/black surfaces and the original floral edge decoration, subsequently revised under C32. Seven services and three editable signature packages are available. All 76 Playwright browser/API tests passed, including package enquiries without JavaScript, staff category editing without private-data access, original-logo fidelity, rendered colour contrast, and existing workflow/navigation regressions. CMS/29-file Astro type checks and both production builds passed. The built-server smoke check passed, including the configured proxy origin and foreign-origin rejection, without creating records. The [current brand specification](docs/RESEARCH_AND_OPTIONS.md#official-brand-and-service-alignment) records palette roles, content interpretation and source provenance; earlier design passes remain history.

A read-only check of the compiled preview passed 26 route/viewport combinations at 390/1440/1920px, decoded all rendered images, checked compact header heights, form origins and private/source-route denial, and observed no browser script errors. The existing SQLite database was backed up before its additive schema/content update; only services, courses and development migration metadata changed, with all 11 other table fingerprints unchanged. Ordinary seeding still preserves existing edits. The compiled preview was restarted on 4321/3000; screenshots and the local update/probe artifacts are ignored under `.test-data/official-brand/`. These checks do not establish production readiness, physical-device or screen-reader results.

Previous verification on 2026-10-27: all 67 browser/API tests, type checks and both builds passed for the professional-icon/colour/carousel pass. C29–C31 supersede its green palette and temporary branding while preserving Lucide, the manual carousel, short enquiry and sticky/directional navigation. Earlier evidence follows for continuity.

The root built-server smoke check passed without creating records. A separate read-only runtime check ran both compiled servers against an isolated synthetic database and passed 35 route/viewport combinations, carousel controls, colour/copy checks, pinned section/breadcrumb navigation, directional-header interaction, whole-card photo navigation, doubled-text controls, no-JavaScript links and access/origin denial. No records were created and no browser script errors were observed. An additional development-browser pass checked eight route/viewport combinations and navbar/lead text contrast; Chromium touch emulation confirmed swipe navigation and off-screen link focus. The normal preview was restarted successfully, with application-record fingerprints unchanged. These results do not establish production acceptance, a full accessibility audit or physical-device/screen-reader behaviour.

The smoke command starts both built servers temporarily on 3000/4321, checks public pages, server validation and private-data denial, then stops its servers without creating records. Stop normal development servers first and seed the local content before running it. It connects locally and supplies the configured WEB_URL as the forwarded host/origin for form validation, so a configured ngrok origin also works. Use the configured HTTPS URL for actual browser form submissions when ngrok is selected.

The dependency lock pins the resolved versions. Use npm ci to preserve the patched graph. Keep the DOMPurify security override when updating packages and verify the installed graph: npm's workspace resolver may report Monaco's old exact pin as invalid even when the patched version is installed, and regenerating an old lock with npm install can restore the vulnerable copy. The initial SQLite-tooling review recorded five moderate advisories; that count is historical. This UI installation added only @lucide/astro 1.62.0, preserved existing resolved versions and reported no advisories. Recheck dependency advisories before a public release.

## Documentation index

Neon connection and verification: [Neon setup report](docs/NEON_SETUP.md), including CLI results, environment mapping, schema/public seed, actual database/browser proof and remaining warnings.

Render Free setup uses automatic migrations, seeding and administrator configuration before starting either app. Use `SUPERUSER_EMAIL/PASSWORD/NAME` to manage one administrator on redeploy, or `INITIAL_ADMIN_EMAIL/PASSWORD` for create-once bootstrap. Existing content edits and other staff accounts survive repeated bootstrap; no shell commands are needed for hosted setup. See [the deployment guide](docs/RENDER_DEPLOYMENT.md), including [where to find runtime logs](docs/RENDER_DEPLOYMENT.md#runtime-logs-and-user-creation-errors).

Deployment setup: [one Render service with Neon](docs/RENDER_DEPLOYMENT.md), including environment variables, migrations, first administrator, verification and recovery.

| Document | Purpose | Use it when |
| --- | --- | --- |
| [Business brief](docs/BUSINESS_BRIEF.md) | The complete founder-supplied description and editorial interpretation notes. | Understanding services, identity, commitments, or public wording. |
| [MVP plan](docs/MVP_PLAN.md) | Initial scope, local implementation, defaults and launch prerequisites. | Understanding first-release behaviour and limits. |
| [Decisions and open questions](docs/DECISIONS.md) | Confirmed requirements, delegated defaults, proposals, superseded advice, and unresolved questions. | Checking scope or recording a change in direction. |
| [Research and options](docs/RESEARCH_AND_OPTIONS.md) | Website references, design and stack alternatives, workflows, source evidence, corrections, and limitations. | Comparing approaches or continuing research and design. |
| [CMS staff guide](docs/CMS_STAFF_GUIDE.md) | Dashboard, drafts, preview, media, SEO and upgrade operations. | Using or deploying the upgraded staff workspace. |
| [Payload CMS options](docs/PAYLOAD_CMS_OPTIONS.md) | Dashboard, editing and plugin research with version checks, priorities and integration limits. | Planning improvements to the nurse-facing CMS; recommendations remain proposals. |
| [Agent instructions](AGENTS.md) | Persistent working rules and task-specific context pointers. | Working in this folder with an agent. |

For an initial human review, read the business brief, the decision register, and then the research sections relevant to the discussion.

## How to interpret the records

The documents consolidate substantive discussion rather than reproduce a verbatim chat transcript. The original business description is preserved in the business brief.

The pasted earlier conversation has no known original date. Its contents and the subsequent discussion were first recorded here on 2026-10-26. That recording date is not evidence of when the earlier statements were made.

The decision register is the authority for whether a project choice has been made. Research recommendations remain proposals unless accepted or explicitly adopted within delegated authority. Founder-supplied organisational claims are not independently verified by inclusion in these documents.

## Workspace baseline

At the documentation baseline on 2026-10-26, this folder was empty and had no Git repository, application manifest, dependencies, build configuration, or test suite.

The initial documentation task created five Markdown files without application setup. The later MVP instruction added the application and MVP plan. No production deployment was performed as part of these local implementation tasks.

## Documentation maintenance

- Update the decision register when a requirement or choice changes, and link to the relevant detail.
- Keep the business description separate from proposed website copy.
- Give external research direct links, access dates, and evidence limits.
- Record an unavailable source or unperformed check explicitly rather than implying verification.
- Keep real client data and secrets out of these files.

## Verification status

Protected request inbox, C43, 2026-11-05: the full 90-test browser/API suite passed, followed by 15 focused CMS/inbox checks after the final catalogue-deletion safeguard. CMS/Astro checks and both production builds passed. Nine inbox regressions cover protected original submissions, attributed append-only notes/status history, concurrency, manual/linked capture, access denial, filters, pagination and phone layouts. Legacy PostgreSQL/SQLite upgrades and the compiled PostgreSQL/browser/restart workflow passed; a fresh private backup restored successfully. See [staff workflow, rollout and exact verification limits](docs/CMS_STAFF_GUIDE.md#manage-requests-in-the-inbox). Actual Render deployment and real staff acceptance remain separate.

Render startup fix, C42, 2026-11-04: an isolated legacy PostgreSQL database reproduced the reported HTTP 500/SQLSTATE `42703`. The exact `node scripts/start.mjs` Render command now migrates, backfills public content and configures the administrator before the built CMS returns HTTP 200. Migration, seed and administrator failures each prevent app launch; repeated setup preserves content and unchanged credentials. Ten proxy/logging checks passed. See [recovery steps and precise test boundaries](docs/RENDER_DEPLOYMENT.md#troubleshooting-build-succeeds-runtime-reports-postgresql-42703). Actual Render recovery remains unverified pending deployment of this fix.

CMS workspace upgrade, C41, 2026-11-04: the role-aware dashboard, Lexical public editing, drafts/history, protected preview, R2-ready public media and SEO are implemented. All 82 browser/API tests passed, together with focused content/permission checks, bootstrap/logging tests, legacy PostgreSQL/SQLite upgrade checks and the administrator build regression. A temporary schema-only Neon branch passed the migration and compiled browser/restart workflow, then was deleted. See [the staff/operator guide](docs/CMS_STAFF_GUIDE.md#verification-recorded-2026-11-04) for exact evidence and limitations. R2 credentials and live delivery are deferred; no production records or deployment were changed by these checks.

Managed administrator and runtime diagnostics, C40, 2026-11-03: CMS/Astro checks and both production builds passed, together with all 76 browser/API tests, ten proxy/logging unit checks and two bootstrap regressions. The built-server Chromium check (`npm run test:admin`) passed for an HTTP/2-style empty-status-text first-account failure, env-managed administrator login, staff creation, duplicate-email reporting and correlated logs without credentials/user values. Credential rotation, unchanged-hash restart behaviour and preservation of other staff were checked using isolated SQLite databases. See [detailed evidence and limits](docs/RENDER_DEPLOYMENT.md#administrator-and-logging-verification-2026-11-03). No live Render account or production record was changed by these checks.

Neon setup, C39, 2026-11-03: authenticated CLI deployment pulled pooled/direct URLs without changing existing app settings. Both builds and type checks passed. Real Neon branch Chromium workflows verified staff cookies, immediate CMS edits, no-JavaScript intake, payment privacy, roles and restart persistence; that temporary branch was deleted. Production received the tested migration and public seed, then passed a non-writing app smoke with pooled TLS/certificate verification and zero staff/intake/payment records. See [the complete evidence and recovered failures](docs/NEON_SETUP.md). Render app deployment remains pending.

Render Free bootstrap, C38, 2026-11-03: the new headless bootstrap regression and seven deployment unit checks passed. Missing/short credentials are rejected; initial creation, preservation of edited content/accounts/passwords and rejection of Render test credentials were checked in an isolated SQLite database. The Free Blueprint and ordered startup/failure gating were checked locally. See [bootstrap evidence](docs/RENDER_DEPLOYMENT.md#free-bootstrap-verification-2026-11-03). Actual cloud deployment and Free instance capacity remain unverified.

Combined-service preparation, C37, 2026-11-02: all 76 existing browser/API tests and seven deployment unit checks passed; CMS/Astro type checks and both production builds passed. The combined production build passed a separate PostgreSQL/Chromium workflow for staff cookies, immediate content updates, no-JavaScript intake, payment privacy, editor restrictions and restart persistence. Fresh/repeated migrations, interactive first-admin bootstrap and an isolated synthetic backup/restore were checked. The Render Blueprint passed structural schema validation. Exact boundaries and the pending dependency advisories are recorded in [deployment verification](docs/RENDER_DEPLOYMENT.md#verification-recorded-2026-11-02). No actual cloud deployment or live-data migration occurred.

The documentation checks cover business content, decision labels and relative links. Local application checks cover types, builds, browser journeys, API persistence and access boundaries; the exact result is reported with the handoff.

Published pages and official documentation informed the original research; rendered reference-site layouts remain unverified. Local browser checks do not establish physical-device behaviour, full accessibility, live payment-provider integration, legal compliance or hosting suitability. See [research limitations](docs/RESEARCH_AND_OPTIONS.md#research-method-and-limits).
