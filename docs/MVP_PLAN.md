# Initial MVP plan and local implementation

Recorded: 2026-10-26. The user approved the initial scope plan and clarified that implementation means building a runnable Astro + Payload MVP.

## Goal and chosen approach

Families can understand the six service areas, request support, arrange care after nurse review, and receive an agreed payment link where applicable. Training supports both group-course interest and private-session requests. Nurses edit content and handle requests in Payload.

Astro is the public website. Payload, in its Next.js application, supplies the content editor and staff backend. Local development uses SQLite to avoid requiring an external database; this is a development default, not a production database decision.

## Minimum capabilities

| Area | Local implementation |
| --- | --- |
| Public site | Home, six editable service descriptions, course listings/details, approach, contact, practical resources, privacy, confirmation and payment pages. |
| Contact and intake | Callback/referral/support forms capture contact preferences, service/course, relationship, age category, area, availability and an optional description. Submission gives a reference, not confirmation. Phone/WhatsApp/email actions appear when staff supply confirmed details. |
| Care appointments | Staff review a request in Payload before confirming an appointment. End time must follow start time. Availability is coordinated manually. |
| Training | Editable group-course information, group-interest registration and private-training requests. The team confirms dates, available places, fees and arrangements; there is no instant place reservation or accreditation claim. |
| Payments | Staff create a payment for a reviewed request and supply a provider-hosted HTTPS checkout link. A private public link exposes only amount/status/checkout, not intake details. Staff verify the provider transaction and record its reference before marking paid. Complimentary services cannot be charged. |
| Staff administration | Admin manages staff; care-team members handle private requests, appointments and payments; editors update public content without private-record access. No separate custom dashboard or client account system. |

## Delivery stages

1. Establish scope and record the chosen stack, booking model and training formats.
2. Implement the essential public, care-request, training and payment-record journeys with reversible local defaults.
3. Validate persistence, access boundaries, staff editing, browser journeys and responsive layouts using synthetic fixtures.
4. Before public launch, resolve operating arrangements, review privacy/security and validate the live environment and providers.

The initial implementation targets a local runnable build, not a public launch. Development servers bind to loopback. No deployment or external message delivery is included.

## Defaults and boundaries

- The public presentation uses the approved warm editorial refresh: cream/green/terracotta, larger typography, local fonts and illustrative stock photography. The asset register and design details are in [research and options](RESEARCH_AND_OPTIONS.md#adopted-local-visual-refresh). Production identity and organisation photography remain open.
- The subsequent presentation pass adds desktop-only gentle homepage snapping/parallax, a direction-aware sticky header, distinct colour bands/footer, original desktop gutter decoration, wider article/aside compositions and stronger hover/focus feedback. Small screens and reduced-motion mode preserve free scrolling. See the [scrolling and layout behaviour](RESEARCH_AND_OPTIONS.md#scrolling-depth-and-page-structure) for exact defaults and browser fallbacks.
- Payload's admin is the staff workspace. Public visitors need no account.
- SQLite schema push is for local development. Production storage/migrations, hosting and backups remain open.
- Form rate limiting is process-local and assumes the local direct connection. A public deployment needs a reviewed proxy/rate-limiting setup. No automatic appointment conflict checking is claimed.
- Seeded services reflect the business brief. Training is an editable preview with no invented dates, fees or credentials. Seeding preserves edits.
- Demo mode is on by default: use fictional details and payment buttons stay disabled. A live provider account and verified checkout are needed to collect money.
- Scheduling, follow-up and payment reconciliation are manual. No automatic M-Pesa callbacks, capacity reservations or availability engine are implemented.
- Email delivery is disabled without logging message content. Notifications and password-recovery delivery require an email integration.
- Create the first administrator through the local interactive command. Public first-user registration is closed; no default live credentials are seeded.
- Private intake is created through a server-only endpoint with a validated allowlist and server-computed initial state. A form acknowledgement is not a complete legal-basis or clinical-consent design.
- No medical-record system, uploads, online learning platform, forum, chatbot, donations or client portal.

The implementation pins Payload packages to 3.92.0, Next to 16.4.3, Astro to 7.4.2 and a task-local Node to 24.22.1. A DOMPurify 3.4.17 override addresses a critical advisory in the Payload admin dependency tree. Verify the installed graph after dependency updates; existing workspace locks may not apply new npm overrides automatically.

Primary implementation references checked on 2026-10-26: [Payload installation](https://payloadcms.com/docs/getting-started/installation), [SQLite adapter](https://payloadcms.com/docs/database/sqlite), [access control](https://payloadcms.com/docs/access-control/overview), [tagged blank template](https://github.com/payloadcms/payload/tree/v3.92.0/templates/blank), [Astro Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/), and [DOMPurify advisory](https://github.com/advisories/GHSA-cg2g-xh64-v4q7). Official package metadata and tagged source were used where documentation retrieval was unavailable.

## Acceptance and verification

The local checks cover browsing services and training on mobile, saving requests, group/private request distinction, anonymous access denial, editor/care permissions, nurse review before confirmation, appointment time validation, safe checkout URLs, free-service charging prevention and transaction-reference requirements.

Implementation handoff, 2026-10-26: all 10 browser/API tests passed; type checks and both production builds passed. A separate smoke check started the built servers and confirmed persisted service reads, SSR pages, form validation and private-data denial without creating records. The audit retains five moderate advisories in the SQLite tooling chain; no high or critical advisories remain in the resolved lock.

Visual refresh, 2026-10-26: all 19 browser/API tests passed, including locally loaded photographs/fonts, 320/390/768/1440px layouts, doubled-text reflow at 320/390/1440px, keyboard skip navigation and reduced motion. Existing request, staff-access and payment checks remain included. Type checks passed with no diagnostics and both production builds passed. Eleven specified text/background colour pairs measured at least 4.5:1; the form boundary measured 3.03:1. These palette checks are not a full accessibility audit or a native browser-zoom test. Browser screenshots are saved under ignored `test-results/`.

A separate read-only browser probe of the standalone Astro build passed 20 route/viewport checks, six doubled-text checks and decoding of all five responsive WebP photographs, using the already-running local CMS for public content. At 1440px with device pixel ratio 1, the five selected photograph responses totalled 188,614 bytes; this is an observed asset-size measurement, not a mobile performance benchmark.

The test harness now permits the existing local preview to remain open: the test CMS has a separate build directory, the test Astro process avoids replacing the preview lock, and the seed process disables Payload HMR. This fixes the observed test-startup hang/conflicts without changing care, content, payment or access behaviour. The implementation uses the installed Payload 3.92.0 and Astro 7.4.2 source-supported HMR/CLI controls.

Scrolling/layout pass, 2026-10-26: all 30 Playwright browser/API tests passed. New checks cover direction thresholds, navigation focus, the open phone menu, no-JavaScript navigation, desktop-only proximity snapping, bounded photo movement, long-section/footer reachability, article anchors, hover/focus feedback and article layouts with doubled text at 320/390/768/1440/1920px. The earlier workflow/security tests remain included. Type checks passed without diagnostics and both production builds passed. Eight new header/footer/section text/background pairs measured at least 4.5:1. This does not establish complete accessibility, native browser-zoom behaviour or physical-device results.

The updated standalone Astro build passed an additional read-only browser probe of 40 route/viewport combinations, responsive photograph decoding, header down/up behaviour, desktop snapping, reduced motion and navigation without JavaScript, against the existing development CMS. No browser script errors were observed. The temporary probe server was stopped; the user's development preview remained running. No production deployment or provider interaction occurred.

Use [the README](../README.md) for commands and final verification results. Browser tests do not establish a full accessibility audit, physical-device result, production concurrency model or regulatory compliance.

## Launch prerequisites still open

Confirm identities/credentials, coverage, hours, prices, training details/certification, cancellations/refunds, necessary intake and permissions, retention, final privacy notice, production database/hosting/backups, payment onboarding/reconciliation, email delivery and production security. Review current provider support and dependency advisories before deployment.

The detailed questions and decision statuses remain in [the decision register](DECISIONS.md). Original alternatives and evidence remain in [research and options](RESEARCH_AND_OPTIONS.md).
