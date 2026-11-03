# Neon PostgreSQL setup and verification

Completed 2026-11-03 under C39. Neon PostgreSQL is configured and the app has been tested against it. This does not deploy Astro/Payload to Render or authorise live client intake.

## Selected project and service

| Setting | Value |
| --- | --- |
| Organisation | `org-muddy-sky-61632399` |
| Project | `gentle-pine-11430068` |
| Branch | `production` (`br-calm-glitter-b9h0egac`) |
| Service | PostgreSQL only |
| App runtime | Existing Astro + Payload/Next.js Node apps; Render remains the hosting target |

The supplied project already provided PostgreSQL. [neon.ts](../neon.ts) declares the PostgreSQL-only starter policy without changing other services, staff authentication or branch expiry. Payload continues to own its schema, permissions and staff authentication. No Neon Auth, Functions or Storage service was added.

## Commands and outcome

The requested global install succeeded with CLI **8.17.1**:

```text
npm i -g neon@latest
added 159 packages
```

The exact initialisation command ran from the repository root:

```text
neon init -y --org-id org-muddy-sky-61632399 --project-id gentle-pine-11430068 --branch production --services postgres
```

It created the ignored `.neon` link and `neon.ts`, installed `@neon/config`/`@neon/env`, and set up detected agents' Neon tooling. Its initial link was offline/unverified. The first browser authentication attempt expired after 60 seconds; a reopened `neon login` succeeded with `Auth complete (profile DEFAULT)`.

Authenticated `neon config plan` then confirmed the intended branch and PostgreSQL-only policy. `neon deploy` succeeded:

```text
Applying to branch production (br-calm-glitter-b9h0egac)
No changes — branch production already matches the policy.
Utilized services: Postgres
Pulled 3 Neon variables into .env
  Postgres        DATABASE_URL, DATABASE_URL_UNPOOLED
  Branch          NEON_BRANCH
```

`.env` already existed, so Neon updated that file. Existing application secrets, URLs and demo-mode settings were preserved. `.env`, `.env.local`, `.neon` and verification env files remain ignored. No connection string, password or account token is recorded here.

## Application wiring

- Payload retains `@payloadcms/db-postgres` and its `node-postgres` connection pool. This suits the existing long-running Node runtime; switching to an HTTP/edge driver is unnecessary.
- Runtime reads Neon's pooled `DATABASE_URL`. The existing explicit `DATABASE_URI` takes precedence for backwards compatibility and isolated SQLite/PostgreSQL test overrides.
- `scripts/payload.mjs` uses `DATABASE_URL_UNPOOLED` for migration commands when no explicit `DATABASE_URI` is set. Seed/admin commands use the ordinary runtime connection. Existing explicit overrides are never silently redirected to a hosted database.
- Root run/bootstrap commands, CMS build/dev and Astro build support `.env` and `.env.local`. Host-injected variables win; `.env.local` wins over `.env` when both files exist. Neon will continue writing the file it chooses through its normal env-pull rules.
- Render's existing automatic migration/seed/first-admin sequence remains selected. In Render's Environment tab, supply `DATABASE_URL` and `DATABASE_URL_UNPOOLED` from the private local env file along with the existing app settings. Clear an obsolete `DATABASE_URI` if it would override the selected Neon connection. No credentials were sent to Render during this setup.

## Schema and data verification

Read-only inspection found **no public tables** in production before setup. The client connection was encrypted and its certificate authorised. Neon terminates client TLS at its proxy: `pg_stat_ssl` on the backend is not the same connection, so client socket encryption/certificate checks were used for the proof.

An expiring schema-only child branch, `ltsp-setup-verification`, was created for migration and write testing. Its connection variables were written to an ignored verification file; the workspace link and normal `.env` stayed on production. The committed initial migration applied, and synthetic test data was confined to this child branch.

The build was run after authenticated deployment and wiring, with the local verification origin set to port 8080:

```text
npm run build
✓ Compiled successfully in 12.3s
Finished TypeScript ...
[build] Server built in 1.87s
[build] Complete!
Exit code: 0
```

The built app then ran against that real Neon branch in Chromium:

```text
PASS: combined public/staff routing, readiness, private-record denial and form validation/origin checks. No records created.
PASS: Neon verification branch combined build, staff browser login/cookies, immediate CMS edits, no-JavaScript intake, private payment view, editor restrictions and persistence across restart. Synthetic test database only.
```

The first line is the non-writing smoke check; the broader workflow deliberately created fictional accounts, enquiries and payments only in the child branch. The verification harness rejects the production branch and host. That branch was deleted after successful verification.

After the migration passed there, the same committed migration applied to production, followed by the normal public seed. The built app was started again against production for a non-writing smoke check:

```text
Migrated: 20261102_134951_initial (488ms)
Service and training seed ready. Existing content preserved; no staff account created.
PASS: combined public/staff routing, readiness, private-record denial and form validation/origin checks. No records created.
PASS: production Neon pooled TLS connection, real Astro/Payload HTTP smoke, 10 services/3 courses, zero synthetic staff/intake/payment records.
```

Production now contains the schema and approved default public content. It contains **zero users, support requests and payments** from this setup. The first real administrator is still created by the configured Render bootstrap environment on deployment. Test servers and the isolated local PostgreSQL cluster were stopped after verification; local development data was not migrated or reset.

Other passing checks: CMS/Astro type checks with zero diagnostics across 29 Astro files, seven deployment unit checks and the headless bootstrap regression. That regression now includes invalid inherited hosted URLs to prove the explicit local database override stays isolated. A migration-status check also succeeded with an intentionally unusable pooled URL and a valid local direct URL, proving direct-connection selection. The earlier 76-test UI run remains recorded separately; that full suite was not repeated for this wiring change.

## Recovered failures and remaining limits

- The first OAuth attempt expired; reopening browser sign-in resolved it. Deployment subsequently succeeded.
- One inline inspection command failed from PowerShell quoting; a file-based read-only probe replaced it. The first TLS assertion inspected backend `pg_stat_ssl`; the corrected probe verified the actual encrypted, authorised client socket.
- Init reported that the optional GitHub Copilot CLI plugin could not run its version command and installed skills/MCP instead. It also emitted system-Node engine warnings. App checks/builds use the project's pinned Node 24.22.1 and passed.
- `pg` emits a forward-looking TLS-mode warning for the CLI-provided `sslmode=require`. With the installed driver, encryption and certificate authorisation were verified; its future-major-version warning remains. Existing dependency advisories were not force-upgraded.
- Render service deployment, deployed edge behaviour/capacity, real email/payment delivery and live-intake commissioning remain open. This setup verified the Neon service and locally running app end to end.

## Sources

Installed [Neon skill](https://github.com/neondatabase/agent-skills/tree/main/skills/neon) and [PostgreSQL skill](https://github.com/neondatabase/agent-skills/tree/main/skills/neon-postgres), CLI help/version/plan/deploy output and actual database/browser results. Primary documentation checked 2026-11-03: [connection methods](https://neon.com/docs/connect/choose-connection), [connection pooling](https://neon.com/docs/connect/connection-pooling). See [Render deployment setup](RENDER_DEPLOYMENT.md) for the remaining app-hosting step.
