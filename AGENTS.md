# Project instructions

These instructions apply throughout the Life Transitions Support Partners workspace.

## Context and scope

This is a nurse-led family and community support initiative in Nairobi, Kenya. The workspace contains an Astro public website, a Payload/Next.js staff backend, shared form validation and project documentation. Development uses SQLite and synthetic data; public launch is a separate milestone.

Implement the task the user actually requests. A documentation or research request authorises that work, while application features require an implementation task. Complete authorised work and its proportionate checks without repeatedly requesting permission.

## Use the relevant context

- For service descriptions, organisation identity, or public copy, consult [the business brief](docs/BUSINESS_BRIEF.md). Preserve the organisation name and exact tagline.
- For scope, architecture choices, or changes in direction, consult [the decision register](docs/DECISIONS.md). A proposal is not an approved requirement.
- For MVP behaviour, development defaults, or launch boundaries, consult [the MVP plan](docs/MVP_PLAN.md).
- For design, navigation, technical comparisons, or external evidence, consult the relevant section of [research and options](docs/RESEARCH_AND_OPTIONS.md).
- For workspace orientation, use [the documentation index](README.md).

Read what the task needs rather than loading every document for every edit.

## Decisions and documentation

- Follow the latest user direction. When it changes an earlier decision, update the register and the affected document, retaining the earlier rationale as superseded history.
- Distinguish confirmed requirements, delegated defaults, proposals, superseded suggestions, and unresolved questions.
- Preserve the distinction between founder-supplied business claims, externally supported facts, and our recommendations.
- Record substantive new findings and choices in the appropriate existing document. Keep each detailed explanation in one place and link to it.
- Astro and Payload are selected. Keep local development defaults distinct from production decisions; providers, hosting, final identity and operating details remain open until selected.

## Research and content

- Use primary sources for current technical, accessibility, payment, or regulatory claims. Record the source URL, access date, and any material uncertainty.
- Mark inherited claims that have not been checked as unverified. Recheck changing provider details before relying on them.
- Use compassionate, plain language for families under stress. Explain what happens next and distinguish free services from paid services.
- Substantiate credentials, certifications, testimonials, partnerships, and outcome claims before presenting them as verified public facts.
- Use references for inspiration and create original branding. Accessibility primitives and design-system adoption do not establish whole-site accessibility.

## Confidentiality

- Use synthetic examples and fixtures. Keep client records, personal health information, secrets, and payment credentials out of source files and project documentation.
- Keep private intake, appointment, and payment records outside public content feeds and static builds. Restrict staff access according to actual responsibilities.
- Exclude sensitive form values from analytics, public logs, notification previews, and payment descriptions. Define necessary collection, retention, and deletion before live intake.
- Record privacy and regulatory questions accurately; a selected framework, local host, or consent checkbox does not establish compliance.

## Engineering and verification

- Make the smallest complete change. Reuse the project's actual components and dependencies before adding alternatives.
- Inspect affected callers, data boundaries, and existing patterns before changing behaviour. Preserve relevant user work.
- Use commands appropriate to the actual environment; the initial environment is Windows with PowerShell.
- Use the root scripts and README for setup, checks and builds. The Playwright suite uses isolated synthetic databases; it does not reset development data or contact payment providers.
- Public first-user registration is closed. Use the local admin command for initial access. Preserve the distinction between content editors and staff with private-record access.
- Payload Local API operations bypass access checks by default. Pass req and overrideAccess: false for staff calls; deliberate bypass in the internal intake endpoint must retain its validated allowlist and server-computed status.
- Check documentation for coverage, decision status, and working local links. For future application changes, run checks appropriate to the behaviour changed, including security and accessibility where affected.
- Report what changed, what was verified, and what remains unverified. Do not describe source inspection as browser testing or a passing build as a complete production check.
