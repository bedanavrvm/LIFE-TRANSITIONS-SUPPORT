# Life Transitions Support Partners

A nurse-led initiative in Nairobi, Kenya, supporting individuals and families through childbirth, caregiving, serious illness, bereavement, and recovery after hospital discharge.

> No one should navigate life's transitions alone.

## Current stage

This workspace now contains a runnable local MVP: an Astro public website, a Payload/Next.js content editor and staff backend, and a SQLite development database. The user explicitly authorised application implementation after the original documentation-only stage.

The requirements and their status are recorded in [the decision register](docs/DECISIONS.md). Astro and Payload are selected. Production database/hosting, payment provider, final visual identity and detailed operating rules remain open. See [the MVP plan](docs/MVP_PLAN.md) for implemented behaviour and development defaults.

## Run locally

From this directory in PowerShell:

```powershell
npm.cmd ci
npm.cmd run setup
npm.cmd run admin
npm.cmd run dev
```

Public website: [http://127.0.0.1:4321](http://127.0.0.1:4321). Staff sign-in: [http://127.0.0.1:3000/admin/login](http://127.0.0.1:3000/admin/login).

The admin command prompts for a name, email and a hidden password of at least 12 characters. It creates the first administrator only; additional accounts are managed through Payload. Public first-user registration is disabled. No default live credentials are supplied.

Setup creates an ignored .env with random secrets. Development seeds missing services/courses without replacing edits. Local data and SQLite sidecars live under ignored data/. The project includes a task-local Node 24.22.1 used by npm scripts; an older system Node may warn during installation. Payload requires Node ^22.23.4 or >=24.22.1. No system Node installation is changed.

## Try the workflow

1. Edit Services, Courses or Site settings in Payload. Add confirmed phone, WhatsApp, email and response information when available.
2. Submit a fictional request on the website and find it under Support Requests.
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

The build command creates the CMS production build and Astro standalone server build. Production hosting, database/migrations, backups and integrations remain separate work. Final verification results are recorded with the implementation handoff.

Latest verification on 2026-10-26: TypeScript/Astro checks passed with zero diagnostics; all 39 Playwright browser/API tests passed; Payload/Next and Astro production builds passed. Coverage includes the short first enquiry, email-only and WhatsApp contact, all five request kinds, conditional courses, validation/backend-error preservation, legacy detailed records and use without JavaScript, alongside the original workflow/security checks. Responsive coverage includes 320/390/768/1440/1920px layouts, doubled text, header behaviour, snapping/parallax, hover feedback, keyboard access and reduced motion. Screenshots are saved under ignored `test-results/`. The [visual refresh notes](docs/RESEARCH_AND_OPTIONS.md#adopted-local-visual-refresh) cover asset credits, [scrolling and page structure](docs/RESEARCH_AND_OPTIONS.md#scrolling-depth-and-page-structure), and the latest [form and typography changes](docs/RESEARCH_AND_OPTIONS.md#short-first-enquiry-and-text-hierarchy).

The latest read-only runtime check started both built servers against an isolated synthetic database. Eight route/viewport combinations passed, including conditional contact/course controls, canonical-origin server validation, cross-origin rejection and private-record denial; no records were created and no browser script errors were observed. The earlier standalone Astro pass covered 40 route/viewport combinations, photograph decoding and scrolling fallbacks. The initial dependency audit reported no high/critical advisories and five moderate SQLite-tooling advisories; dependencies were not changed by these presentation passes. These results are not production acceptance, a complete accessibility audit or physical-device/screen-reader testing. Parallax has a static fallback in browsers without view-timeline support; snap feel is browser-dependent.

The smoke command starts both built servers temporarily on 3000/4321, checks public pages, server validation and private-data denial, then stops its servers without creating records. Stop normal development servers first and seed the local content before running it. These commands assume the default local URLs.

The dependency lock pins the resolved versions. Use npm ci to preserve the patched graph. Keep the DOMPurify security override when updating packages and verify the installed graph: npm's workspace resolver may report Monaco's old exact pin as invalid even when the patched version is installed, and regenerating an old lock with npm install can restore the vulnerable copy. The SQLite tooling currently inherits five moderate Drizzle/esbuild advisories; these remain a production-readiness review item, not a clean-audit claim.

## Documentation index

| Document | Purpose | Use it when |
| --- | --- | --- |
| [Business brief](docs/BUSINESS_BRIEF.md) | The complete founder-supplied description and editorial interpretation notes. | Understanding services, identity, commitments, or public wording. |
| [MVP plan](docs/MVP_PLAN.md) | Initial scope, local implementation, defaults and launch prerequisites. | Understanding first-release behaviour and limits. |
| [Decisions and open questions](docs/DECISIONS.md) | Confirmed requirements, delegated defaults, proposals, superseded advice, and unresolved questions. | Checking scope or recording a change in direction. |
| [Research and options](docs/RESEARCH_AND_OPTIONS.md) | Website references, design and stack alternatives, workflows, source evidence, corrections, and limitations. | Comparing approaches or continuing research and design. |
| [Agent instructions](AGENTS.md) | Persistent working rules and task-specific context pointers. | Working in this folder with an agent. |

For an initial human review, read the business brief, the decision register, and then the research sections relevant to the discussion.

## How to interpret the records

The documents consolidate substantive discussion rather than reproduce a verbatim chat transcript. The original business description is preserved in the business brief.

The pasted earlier conversation has no known original date. Its contents and the subsequent discussion were first recorded here on 2026-10-26. That recording date is not evidence of when the earlier statements were made.

The decision register is the authority for whether a project choice has been made. Research recommendations remain proposals unless accepted or explicitly adopted within delegated authority. Founder-supplied organisational claims are not independently verified by inclusion in these documents.

## Workspace baseline

At the documentation baseline on 2026-10-26, this folder was empty and had no Git repository, application manifest, dependencies, build configuration, or test suite.

The initial documentation task created five Markdown files without application setup. The later MVP instruction added the application and MVP plan. No Git initialisation or production deployment has been performed.

## Documentation maintenance

- Update the decision register when a requirement or choice changes, and link to the relevant detail.
- Keep the business description separate from proposed website copy.
- Give external research direct links, access dates, and evidence limits.
- Record an unavailable source or unperformed check explicitly rather than implying verification.
- Keep real client data and secrets out of these files.

## Verification status

The documentation checks cover business content, decision labels and relative links. Local application checks cover types, builds, browser journeys, API persistence and access boundaries; the exact result is reported with the handoff.

Published pages and official documentation informed the original research; rendered reference-site layouts remain unverified. Local browser checks do not establish physical-device behaviour, full accessibility, live payment-provider integration, legal compliance or hosting suitability. See [research limitations](docs/RESEARCH_AND_OPTIONS.md#research-method-and-limits).
