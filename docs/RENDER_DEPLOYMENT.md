# One Render service with Neon PostgreSQL

Selected in C37, 2026-11-02; adjusted for Render Free in C38, 2026-11-03. C39 connected, migrated, seeded and verified Neon; [the Neon report](NEON_SETUP.md) records that evidence. On 2026-11-03 the user reported that the Render application is live; its URL and dashboard have not been independently checked. C40 adds environment-managed administrator credentials and runtime error reporting. Deployment alone does not resolve the [launch prerequisites](MVP_PLAN.md#launch-prerequisites-still-open).

## Architecture

One Render **Node Web Service** runs [the production launcher](../scripts/start.mjs). It starts both production servers on loopback and exposes a single HTTP proxy on Render's `PORT`.

| Public route | Destination |
| --- | --- |
| `/admin`, `/admin/...`, `/api`, `/api/...`, `/_next/...` | Payload/Next.js, internal port 3000 |
| Other routes, including `/support`, `/payment/...`, `/_astro/...` | Astro, internal port 4321 |
| `/healthz` | Launcher readiness/liveness |

Neon stores PostgreSQL data. No SQLite disk is needed. Existing photos/fonts ship with the app; staff public uploads use the optional R2 configuration described in [the CMS guide](CMS_STAFF_GUIDE.md). Without credentials, bundled photos work and new uploads are unavailable. Both apps share memory, CPU, deployment and availability. The Blueprint uses Render Free for preview; capacity on that instance remains unverified.

The launcher admits traffic only after successful CMS/public-page startup checks. Child process failure terminates the combined service. `/healthz` reports startup completion and child survival; it does not query Neon on every probe or guarantee continued database availability.

## 1. Create Neon

The supplied Neon project is connected under C39; do not create a duplicate. The C39 verification found only schema/public defaults and no client/staff test records; the subsequently deployed application may have added records. For a different staging environment, use an isolated branch/database. Supply its pooled `DATABASE_URL` and direct `DATABASE_URL_UNPOOLED` to Render from the private env file, retaining TLS parameters. Do not commit or paste connection strings into chat.

Payload allows five pool connections per process and disables automatic schema push/database creation. The database must already exist. The committed migration creates an empty schema; it does not convert SQLite data. Seeding adds missing public defaults without overwriting edits. Existing local content, staff and private records require a separate reviewed transfer if they need to be retained.

## 2. Create the Render service

Push the reviewed source to the repository connected to Render, excluding `.env` and local/test databases. Choose **New > Blueprint** with [render.yaml](../render.yaml), or **New > Web Service**, runtime **Node**, with:

| Setting | Value |
| --- | --- |
| Root directory | Leave blank; shared workspaces require the repository root |
| Build command | `npm ci --include=dev && npm run check && npm run build` |
| Start command | `node scripts/start.mjs` |
| Health check | `/healthz` |
| Node version | `24.22.1` |
| Compute | Free for preview; measure both apps together |

The Blueprint declares one Free service and no Render database/disk. No pre-deploy field is required. On Render, the launcher itself applies pending migrations, seeds missing public services/training and configures administrator access before starting either app or opening the public port. Failure at any step stops startup. Applied migrations are skipped and edited content is preserved. `INITIAL_ADMIN_*` creates only the first account; optional `SUPERUSER_*` updates only the matching administrator as described below. Keep schema changes backwards-compatible with any old version still serving during deployment handover.

This also protects existing services whose dashboard still uses `node scripts/start.mjs`: updating `render.yaml` alone does not change a manually configured service. The older shell-chain start command remains safe but repeats the idempotent setup; replace it with the command above. `npm start` also loads an optional local `.env`. Outside Render, the launcher starts the apps without automatic database setup. Free services sleep after 15 idle minutes and can take about a minute to wake, plus bootstrap/application startup. They have no Render Shell/SSH or one-off jobs; the setup below uses the dashboard only. Free-tier limits and unmeasured memory make this a preview arrangement; Neon data persists independently of Render's ephemeral filesystem.

## Troubleshooting: build succeeds, runtime reports PostgreSQL `42703`

On 2026-11-04 the supplied Render log showed a successful build followed by `node scripts/start.mjs` and repeated API failures with SQLSTATE `42703` (`undefined_column`). A read-only inspection of the configured Neon database confirmed that only `20261102_134951_initial` was recorded and the new service columns `body`, `_status` and `meta_title` were absent. The CMS workspace upgrade migration had not run. The initial readiness 503, TLS deprecation warning and npm audit summary are separate from this missing-column failure.

C42 moves setup into the shared launcher so an older dashboard command cannot bypass it. Deploy the revision containing C42 and keep **Start Command** set to `node scripts/start.mjs`. No pre-deploy command or hosted shell access is required. Expected runtime messages, in order:

```text
Preparing production migrations.
Preparing production public content.
Preparing production administrator.
Production bootstrap complete.
Combined production service ready on port ...
```

If a stage fails, neither app starts; inspect the preceding configuration/migration error in Render's runtime logs. Preserve the existing database, secrets and administrator settings. Do not reset the database, run `migrate:fresh`, or use a destructive `down` migration to resolve this error. Back up the database before a schema upgrade, as described in [the CMS rollout guide](CMS_STAFF_GUIDE.md#operator-setup-and-rollout).

`npm run test:render-startup` exercises that exact launcher with `RENDER=true` and an isolated local PostgreSQL database populated using the original migration. Build both apps first and leave ports 8080/3000/4321 free; the test expects the local synthetic PostgreSQL cluster on port 5547 used by the existing deployment integration checks. Before the fix it reproduced HTTP 500 with `42703`; after the fix the CMS API returned HTTP 200, the legacy service retained its content and publication state, rich text was backfilled and the configured administrator existed before serving requests. Separate migration, seed and administrator failures each blocked both servers. Repeated setup preserved public content and the unchanged administrator password hash. Ten proxy/logging unit checks also passed. This test reaches the built CMS over loopback; it does not establish live Render recovery or test Render's HTTPS edge. Production recovery remains unverified until the new revision is deployed and observed.

Primary sources checked 2026-11-04: [PostgreSQL SQLSTATE reference](https://www.postgresql.org/docs/current/errcodes-appendix.html), [Render start-command configuration](https://render.com/docs/blueprint-spec) and [Render deploy behaviour](https://render.com/docs/deploys). The root-cause conclusion also uses the supplied runtime log, the read-only schema inspection and the local failing/passing reproduction.

A fresh private production backup was created with verified TLS and restored successfully into an isolated local database before publishing this fix. Backup files remain outside source control; no production records were changed by the inspection or recovery tests.

## 3. Set environment variables before building

| Variable | Value |
| --- | --- |
| `NODE_VERSION` | `24.22.1` |
| `WEB_URL` | Exact public HTTPS origin, e.g. `https://your-service.onrender.com` |
| `DATABASE_URL` | Neon's pooled runtime connection string including TLS settings |
| `DATABASE_URL_UNPOOLED` | Neon's direct connection string for migrations |
| `PAYLOAD_SECRET` | Strong random secret, at least 32 characters; keep stable |
| `INTERNAL_API_KEY` | A different strong random secret, at least 32 characters |
| `INITIAL_ADMIN_EMAIL` | Email to use for the first administrator |
| `INITIAL_ADMIN_PASSWORD` | Unique password, at least 12 characters; required only before the first account exists |
| `INITIAL_ADMIN_NAME` | Optional; defaults to `Website administrator` |
| `SUPERUSER_EMAIL` | Optional managed administrator email; use with `SUPERUSER_PASSWORD` |
| `SUPERUSER_PASSWORD` | Unique password, at least 12 characters; applied to that administrator on startup |
| `SUPERUSER_NAME` | Optional managed administrator display name; email remains the sign-in identifier |
| `DEMO_MODE` | `true` during synthetic staging |

The Blueprint generates the application secrets and initial administrator password, and asks for the initial email. For a manually created service, enter those values in Render's **Environment** tab. Retrieve the generated initial password there when signing in. With create-once `INITIAL_ADMIN_*` settings, remove `INITIAL_ADMIN_PASSWORD` after the first successful login; changing those settings does not reset an existing password. For the user's selected managed-account behaviour, use the `SUPERUSER_*` settings below. Public signup remains closed. Render supplies `PORT` and `RENDER=true`. Leave the app ports at their defaults. Do not set `HOST` to localhost on Render or enable `LTSP_TEST_MODE` there.

Use the final Render hostname shown in the dashboard as `WEB_URL` before the first successful build. If necessary, save it after service creation and redeploy. Astro compiles the hostname into its allowlist: changing to a custom domain requires updating `WEB_URL` **and rebuilding**. Other hosts receive 421; `/healthz` remains available to health probes. Use one canonical hostname.

The launcher derives public `CMS_URL` from `WEB_URL` and sets private `CMS_INTERNAL_URL` to Payload's loopback listener. Browser code never receives the internal API key or database credentials.

Legacy `DATABASE_URI` remains supported and takes precedence. Remove an obsolete value if configuring the Neon variables above; local tests deliberately use that override to remain isolated. Neon CLI writes `.env` if it exists, otherwise `.env.local`; application commands load either file.

### Managed administrator credentials

In Render **Environment**, set the following keys privately, then save and redeploy the revision containing C40. Local development can use the same keys in ignored `.env`/`.env.local`, followed by `npm run admin`; outside Render, `npm start` does not run bootstrap itself.

```dotenv
SUPERUSER_EMAIL=administrator@example.com
SUPERUSER_PASSWORD=replace-with-a-unique-password-of-at-least-12-characters
SUPERUSER_NAME=Website administrator
```

Use your actual administrator email and a unique password; the values above are examples. Do not upload the local env file or share credentials in chat. Both email and password are required when managed mode is enabled. `SUPERUSER_*` takes precedence over `INITIAL_ADMIN_*`.

Startup creates that administrator if absent, or updates the administrator with the matching email. It never changes other staff accounts. An email belonging to a non-admin stops bootstrap rather than silently promoting that person. Changing the email creates another administrator; it does not rename or delete the previous account. Removing these variables leaves the account in place.

Unchanged settings preserve the existing password hash. Changing the configured password or display name applies at the next bootstrap. A password changed manually in Payload is restored to the env value at the next bootstrap, so rotate a managed password through Render's Environment settings. Only keyed fingerprints are stored for change detection; plaintext passwords are not stored in that bookkeeping or printed in logs. `SUPERUSER_NAME` is a display name, not a separate login username. Sign in with email at `/admin/login`.

## 4. Initialise and verify

1. Enter the environment values above and deploy from Render's dashboard. The start command automatically migrates, seeds and bootstraps the first administrator. Missing/invalid initial credentials on an empty database stop startup with a configuration message; they never open public registration or create default test credentials.
2. In Render's **Logs**, confirm migration completion, seed readiness and administrator creation or the existing-account message. Any failure blocks application startup. Never use reset/fresh/down commands as a routine deployment fix.
3. Open `WEB_URL/admin/login` and sign in with the configured email/password. Remove the initial password only when using create-once `INITIAL_ADMIN_*`; retain `SUPERUSER_*` to keep managing that account. Manage later accounts through Payload and check that editors cannot access care/payment records.
4. Browse services/training, make a synthetic enquiry and find it in the staff interface. Edit a service, redeploy and confirm the edit persists. Seeding only fills missing default entries and must not overwrite the edited value.

These setup steps require no terminal or Render Shell. Developers can additionally run `npm run smoke:deployment` for automated routing, validation and anonymous-access checks without creating records. Email delivery/password recovery is still disabled. `DEMO_MODE=true` disables public checkout but **still stores enquiries**. Keep staging private and synthetic until live-intake permissions, retention, email delivery and operational/security reviews are complete.

## Runtime logs and user-creation errors

Open the Render dashboard, select this **Web Service**, then **Logs**. Choose **Live tail**, clear search/level filters, reproduce the problem and inspect the new lines. Build/deploy output is separate from the runtime log view. Application logging here uses stdout/stderr and needs no additional logging service. Render's provider-generated HTTP request logs require a Pro workspace or higher; our application error events do not depend on that feature. See [Render's logging guide](https://render.com/docs/logging), checked 2026-11-03.

Search for these event names or a request ID:

| Event | Meaning |
| --- | --- |
| `superuser_configuration_failed` | Managed credentials are missing/invalid or collide with a non-admin account; bootstrap stops. |
| `payload_request_failed` | Payload handled a failed API request, including permission and validation failures. |
| `http_request_failed` | The combined proxy completed an HTTP 4xx/5xx response. |
| `admin_server_action_failed` | A staff-interface server action threw an exception. |
| `payload_error` | A Payload error was sanitised before its logger wrote it. |

The response's `X-Request-ID` header links a failed request to runtime events. Payload error JSON also includes `requestId`; unexpected server-error messages include that reference. In browser developer tools, find the failed Network request and read its response headers/JSON. Share only the reference and safe error text, not cookies, authentication headers or request bodies. Validation/permission failures are recorded at warning level, so an error-only filter can hide them.

Logs retain method, a general route label, status, error class, safe database codes/constraint names, validation field names and source locations. They omit request bodies, passwords, tokens, SQL/parameters, raw error messages and care details. Logging is diagnostic metadata, not an audit trail of private records. The supervisor forwards both child servers' stdout/stderr to Render. Keep `DISABLE_LOGGING` unset; do not enable verbose body/query logging to investigate a client issue.

One reproduced cause of the generic unknown-error message was the closed `/api/users/first-register` endpoint returning `{error: ...}`. Payload's form expects its standard error shape; over HTTP/2 the empty status text left the UI with no message. The endpoint now throws Payload's `APIError`, so the UI explains that public registration is closed and administrator access must be configured in the environment. Signed-in administrators can still create staff in **Administration > Users**. Other live failures need their request ID; this reproduction does not establish the cause of every unknown-error report.

## Migrations and recovery

Generate schema changes against a separate PostgreSQL development database using `npm run payload -- migrate:create change_name`. Review and commit the SQL migration and snapshot; test on staging first. The initial `down` migration removes application tables. A code rollback does not reverse schema changes. Prefer backwards-compatible changes for deployment handover and do not run overlapping migrations/deployments.

Keep independent PostgreSQL backups and test restoration into a separate database. Check Neon's current storage, compute, transfer and restore limits before live intake; free allowances do not establish a sufficient backup policy.

## Local checks and limits

Normal `npm run dev` retains SQLite defaults. To test the combined production service, set `WEB_URL=http://127.0.0.1:8080` before `npm run build`, then run `npm start`. Staff login is on the same origin at `/admin/login`. If changing `PORT`, change `WEB_URL` too. `CMS_PORT` and `ASTRO_PORT` allow unused loopback ports for isolated verification.

`npm run test:deployment` tests routing, security/error handling and log redaction without a database. `npm run test:bootstrap` checks create-once and managed administrator behaviour in isolated synthetic databases. `npm run test:admin` runs a built-server Chromium check of the initial-account error, managed login, staff creation and duplicate-email runtime reporting; build first with the local `WEB_URL` above and leave ports 8080/3000/4321 free. `npm run smoke:deployment` checks an already running combined service. The existing Playwright suite uses isolated synthetic SQLite databases; it is separate evidence from PostgreSQL migration and combined production checks.

`npm run test:deployment:integration` additionally checks the built service in Chromium against a dedicated local PostgreSQL database ending in `_test`. Set `DEPLOYMENT_TEST_DATABASE_URI` to that database after applying migrations and seeding with `LTSP_TEST_MODE=true` in the isolated test environment. Its default is the workspace's synthetic test cluster on port 5547. This check deliberately creates fictional enquiries, payments and an editor, verifies a restart, and stops the servers; never point it at development/client data. Build with `WEB_URL=http://127.0.0.1:8080` first. Test ports 8080/3000/4321 must be free.

The proxy trusts a valid `CF-Connecting-IP` only when `RENDER=true`, following Render's Cloudflare guidance, and replaces incoming forwarding chains. Verify actual edge behaviour on Render, especially when adding another proxy. The enquiry limiter is per process and resets on restart; use shared limits before scaling. `/healthz` is process liveness, not continuous database monitoring. WebSocket forwarding is not implemented because the current production workflows do not use it; this is not a development/HMR launcher.

## Verification recorded 2026-11-02

- CMS and Astro type checks passed (29 Astro files); both production builds passed.
- All 76 existing Playwright browser/API tests passed on isolated SQLite fixtures. All seven deployment unit checks passed.
- The combined PostgreSQL build passed a Chromium workflow covering staff login/session cookies, CMS edits appearing without rebuilding, intake without JavaScript, private payment summaries, editor access denial and persistence across a graceful combined-service restart. Its invalid/cross-origin smoke checks created no records; the broader integration workflow created only synthetic records in its dedicated database.
- The initial migration applied to fresh local PostgreSQL databases and a repeat migration was a no-op. Seeding preserved existing public content and exited successfully. The interactive first-admin command created exactly one administrator in a separate empty synthetic database, hid the password, printed the correct public login URL and exited; repeat bootstrap refused to add an account.
- A synthetic PostgreSQL backup restored to a separate database with matching service/request/payment counts. This is local recovery evidence, not Neon backup commissioning.
- The Blueprint passed Render's current structural JSON Schema (format annotations excluded); npm's installation dry-run accepted the lockfile. Documentation links and Git whitespace checks passed.

`npm audit --omit=dev` reported six low and six moderate advisories, no high/critical findings. No forced dependency upgrades were applied; advisory reachability and launch dependency review remain open. No Render/Neon account operation, paid resource, cloud deployment/migration, TLS connection to Neon, actual Render edge-header test, Linux memory measurement, live email/payment or physical-device/screen-reader check was performed. Provider setup and production readiness remain separate from these local results.

## Free bootstrap verification, 2026-11-03

CMS and Astro type checks passed with zero diagnostics across 29 Astro files. Documentation links and Git whitespace checks passed.

`npm run test:bootstrap` passed against a fresh isolated SQLite database: missing/short initial credentials failed without creating an account, valid environment credentials created one administrator without prompts or password logging, repeat seed preserved a content edit, and repeat bootstrap preserved the original account/password. The Render/test-mode guard rejected known synthetic-account seeding. All seven deployment unit checks also passed. The actual Blueprint start-command string was exercised with stub subprocesses in Bash: migration, seed and admin ran in order, and failure at each stage prevented app launch. The Free Blueprint passed structural schema validation. These checks do not claim actual Render/Neon startup; the PostgreSQL browser/recovery evidence above predates this bootstrap update. The full UI suite was not repeated for the CLI/configuration change.

## Troubleshooting: build fails loading a missing `.env`

If the build reports `scripts/next.mjs:5` calling `loadEnvFile` unconditionally, Render is building the older helper. A deployed service does not need a committed `.env`; use Render's injected environment variables. The corrected helper checks for optional `.env.local`/`.env` files before loading them, preserves injected values, and keeps env-file flags out of Next worker `NODE_OPTIONS`.

On 2026-11-03, the failing stack matched GitHub/main commit `4665d01`; the approved deployment changes still existed only in the workspace. An isolated reproduction of that committed helper failed with `ENOENT`, while the corrected helper passed the same real Next CLI invocation without either env file. Three regression checks cover missing files, local-file priority and injected-value priority; run them with `npm run test:build-env`. Full CMS/Astro type checks and both production builds then passed in a clean source copy with `RENDER=true`, only injected synthetic settings, no env files and no reachable database. Deploy the new revision containing these approved changes; rebuilding the old revision or adding secrets to Git will not fix the source mismatch.

## Administrator and logging verification, 2026-11-03

CMS and Astro checks passed with zero diagnostics (29 Astro files), and both production builds passed. All 76 existing browser/API tests passed. Ten deployment/logging unit checks passed, including error metadata redaction and the actual Pino hook. Two bootstrap regressions passed: create-once behaviour and managed creation/rotation, unchanged password hashes on repeat startup, other staff unchanged, no plaintext password in bookkeeping/output and rejection of a matching non-admin account.

`npm run test:admin` passed against the compiled combined service in Chromium with a fresh synthetic SQLite database. The browser recreated HTTP/2's empty status text for the blocked first-account POST, displayed the setup message, then signed in with an env-managed administrator, created a staff user through the UI and received an actionable duplicate-email validation response. Its request ID matched runtime events; captured logs contained none of the submitted passwords, emails or names.

The user's report that the site is live is not an independent check of the current Render revision or the reported live failure. These tests did not change production credentials/records, contact a payment provider or repeat PostgreSQL/Neon integration. The initial-account failure is one confirmed local reproduction; a different live failure requires the failed request's reference and context.

## Primary sources

Administrator/error-reporting sources, checked 2026-11-03: [Payload root afterError hooks](https://payloadcms.com/docs/hooks/overview#root-hooks), [Payload logger configuration](https://payloadcms.com/docs/configuration/overview), [Render runtime logs, filtering and Live tail](https://render.com/docs/logging). Installed Payload source and the actual browser form were also inspected to reproduce its error-response handling.

Accessed 2026-11-02: [Render port binding](https://render.com/docs/web-services#binding-to-multiple-ports), [deploy/pre-deploy commands](https://render.com/docs/deploys), [Blueprint specification](https://render.com/docs/blueprint-spec), [Render client-IP guidance](https://render.com/articles/host-pocketbase-on-render), [Payload PostgreSQL](https://payloadcms.com/docs/database/postgres), [Payload migrations](https://payloadcms.com/docs/database/migrations), [Neon connections](https://neon.com/docs/connect/connect-from-any-app). Rechecked 2026-11-03: [paid pre-deploy restriction](https://render.com/docs/deploys#pre-deploy-command) and [Free limits, sleep and lack of shell/one-off jobs](https://render.com/docs/free). Local checks do not establish a cloud deployment or compliance result.
