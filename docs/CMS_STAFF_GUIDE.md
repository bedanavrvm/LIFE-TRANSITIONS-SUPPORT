# Staff workspace: editing, publishing and public media

The workspace upgrade implements the three-phase plan approved on 2026-11-04. The existing administrator, care-team and editor roles retain their responsibilities. No client-account or automatic booking system is added.

## Find your work

Open `/admin` after signing in. Administrators and care staff see new enquiries, callback requests, today's confirmed appointments and pending payments. Editors see public-content counts instead. All staff get training dates, quick actions and a short help panel. Dates use Africa/Nairobi. Refresh reloads the dashboard; there is no background polling.

If an older personalised dashboard layout is still selected, use the dashboard menu's Reset Layout action to restore the new default. Dashboard customisation never grants additional record access.

An unavailable panel means its query failed, not that there are no records. Retry it; administrators can correlate failures in Render's runtime logs. Review an enquiry before confirming care, and verify the provider transaction before marking a payment paid.

## Manage requests in the inbox

Open **Request inbox** in the navigation or use **Review enquiries** on the dashboard. The inbox defaults to New requests, oldest first. Filter New, Reviewed, Closed or All, choose a request type, or search by reference/name. Times use Africa/Nairobi. Lists are paginated and omit contact details and messages.

Open the reference to see the original request, follow-up timeline and related appointments/payments. Original submitted fields are read-only for administrators and care staff, including API access. Website submission remains the family's first enquiry, not an appointment confirmation.

- **Mark reviewed** records the staff member and time. Continue arranging care through the existing appointment workflow.
- **Close request** requires a short reason. **Reopen as reviewed** returns a closed request to follow-up.
- **Add note** records necessary operational information, author and time. Notes cannot be edited or deleted through the application. Correct a mistake with another note.
- If the screen reports that the request changed, refresh before repeating the status action. A status and its history entry are saved together.

Names, contact details, messages, requested service/training and privacy acknowledgement cannot be rewritten. Record corrected contact details in a follow-up note; displayed contact fields remain the original values. Staff must consult the notes before contacting the family. The application does not infer new contact details or change payment eligibility from notes.

Use **Record an enquiry** for a Phone or WhatsApp request. Record the short details and confirm that privacy information was communicated and acknowledgement received; this does not assert that the person used the website checkbox. The server records the capturing staff member and source. Once saved, that submission is read-only too.

For different requested support, open the earlier request and choose **Record a linked enquiry for different support**. Enter the new request and explain why it is needed. Both timelines reference the follow-up; the original service and any existing appointments/payments remain as they were. Any new charge still requires review and agreement, and complimentary services cannot be charged.

Existing records show **Legacy / source not recorded**, without guessing where they came from. Their former editable staffNotes appears under **Legacy staff notes** without invented authorship/time. Values overwritten before this change cannot be reconstructed from this migration. Service/training labels come from the current catalogue; this update does not reconstruct historical catalogue titles.

Services and training referenced by an original request cannot be deleted through the application, because deletion would clear the request's saved relationship. Unpublish an unavailable item instead. Unreferenced catalogue items retain the existing deletion permissions.

The first inbox intentionally has no assignments, due dates, notifications or new workflow stages. Editors and anonymous visitors cannot access request data or the inbox actions. Administrators retain their existing deletion permission outside the inbox; append-only history is application protection, not protection from a database operator. Retention and authorised deletion remain an organisation policy decision.

### Inbox rollout

Back up production and verify the additive migration in an isolated database before deployment. The existing Render launcher applies the migration before starting either app. Existing references, links, request status values and legacy notes are retained. SQLite development preflight takes a backup beside the database and adds the new structures transactionally; SQLite transactions are now enabled for application operations as well.

Deploy the application and migration together. Older code permits original-field edits, so do not use it as a routine rollback; prefer a forward fix. Do not run migration down to recover from an application error: it removes the new attribution and activity data. The standard request collection remains a read-only fallback for original fields; use the inbox commands to manage work.

### Inbox verification — 2026-11-05

The full 90-test browser/API suite passed. After adding the final catalogue-reference deletion safeguard, all 15 focused CMS/inbox tests passed, including nine inbox tests for original-field protection, triage/history, simultaneous notes and status actions, manual and linked capture, author/source spoofing, cross-origin denial, restricted roles, phone layouts, filters and pagination. Referenced service/course deletion was denied while unreferenced deletion remained available. An initial focused dashboard run hit its 60-second cold development-compilation timeout; the final focused run used 120 seconds and passed without removing assertions. The older enquiry and CMS test fixtures now use the controlled commands instead of raw request edits.

CMS/Astro checks passed with zero diagnostics, and both production builds passed. Ten proxy/logging checks, two administrator bootstrap regressions, the additive SQLite backup/repeat-upgrade check and the legacy PostgreSQL migration/reseed check passed. PostgreSQL verification compared every pre-existing request column before/after migration; new source attribution remains explicitly legacy.

The compiled combined service passed a separate PostgreSQL/Chromium workflow. It verified the request detail screen, two concurrent notes, competing status updates admitting only one change, five truthful timeline entries, original-name edit denial, phone layout, and persistence after restart, alongside existing cookies, public intake, payment privacy and editor restrictions. Desktop/phone screenshots were reviewed using synthetic records. A fresh private production backup was created with verified TLS and restored successfully into an isolated local database before publishing.

These checks did not modify production request records or verify live Render recovery, real staff usability, physical devices, screen readers or retention policy. Application-level append-only history does not establish regulatory compliance.

## Edit and publish

1. Open Services or Courses and choose an existing record or create one.
2. Update the structured details and detailed description. The toolbar supports H2/H3 headings, bold, italic, lists and links. The public page already supplies its H1 title.
3. Save a draft. Autosave runs every five seconds while editing; it is not publication.
4. Open Preview in a separate tab to see the draft in the public layout. Sign-in is required. Preview links must not be sent to families.
5. Publish when the copy is ready. Administrators, care staff and editors can publish. Deletion remains administrator-only.

The last published version stays public while a draft is edited. Unpublished services/courses cannot be selected for new public enquiries. Versions retain up to 20 entries per record; restoring a version prepares a draft, which still needs publication.

Existing plain text is preserved in compatibility fields and backfilled into the editor. Summaries and contact details remain plain text. Private care notes do not use rich text. Publication changes do not cancel existing appointments or erase historical relationships.

## Add a public image or PDF

Media is for approved public assets only. Do not upload care records or client documents. Supply a title, image alt text, an optional credit/caption and approval for public use. Supported files: JPEG/PNG/WebP up to 5 MB, PDF up to 10 MB. File content is checked, not only the filename.

Choose an image and PDF downloads on the service/course, preview, then publish. Bundled stock photographs remain when no replacement is selected. Image sizes are generated for public layouts. Referenced assets, including assets in retained versions, cannot be deleted; editors and care staff cannot delete media.

If R2 is unconfigured, uploads show a configuration error. Existing bundled photographs continue working. A failed upload must not replace the currently selected image.

## Edit search and share information

Use the SEO tab on Services, Courses or Site settings. Set the title, description and share image, or generate starting values from the current public content. Check wording before publishing. The website emits metadata and canonical URLs; demo mode and preview remain non-indexable. Metadata does not guarantee search rankings.

## Operator setup and rollout

Dependencies are pinned to Payload 3.92.0: Lexical, S3 storage and SEO. The CMS import map is committed; regenerate it after changing registered components. On Render, `node scripts/start.mjs` enforces migration → seed/content upgrade → administrator bootstrap → application start. Outside Render, the launcher starts the apps without automatic database setup. See [missing-column startup failures](RENDER_DEPLOYMENT.md#troubleshooting-build-succeeds-runtime-reports-postgresql-42703).

Configure these private environment keys together, locally and in Render as appropriate:

```dotenv
R2_BUCKET=your-public-media-bucket
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-bucket-scoped-access-key
R2_SECRET_ACCESS_KEY=your-private-secret
```

Use separate staging/production buckets and tokens. Keep public bucket access disabled: Payload serves files through `/api/media/file/...`, with server-side S3 access and region `auto`. No public bucket domain or browser storage credential is required. Schema generation stays consistent without credentials. The user explicitly deferred adding live R2 credentials; production R2 delivery must be verified after configuration.

Before deploying the schema migration, back up the database and test the upgrade on an isolated database. The migration preserves existing service publication and maps the legacy course checkbox. Startup backfills missing rich-text bodies only for legacy records without version history. Existing SQLite development databases are upgraded transactionally before schema push, with a backup beside the database, integrity/foreign-key checks and refusal to discard unexpected fields. Subsequent edits are not replaced by seeding. Never run migration `down` as routine rollback: it removes the new content/history/media structures. After drafts exist, do not roll back to code that exposes all services publicly. Prefer a compatible revision or forward fix.

Automated browser/API tests use isolated SQLite databases and a local S3-compatible test service on loopback port 4578. They do not contact R2 or payment providers. PostgreSQL migration/build and real-provider results must be recorded separately in the implementation handoff.

Related: [CMS research](PAYLOAD_CMS_OPTIONS.md), [Render setup](RENDER_DEPLOYMENT.md), [MVP boundaries](MVP_PLAN.md).

## Verification recorded 2026-11-04

- The complete 82-test browser/API suite passed, including administrator/care-team/editor dashboards, phone layout, editor rich-text typing/autosave/publishing, draft and version isolation, authenticated preview, public media validation/delivery, SEO output and the existing care/payment/navigation checks.
- Later focused CMS checks passed all six tests after the upload-permission safeguard. Both bootstrap regressions, ten proxy/logging checks and content unit checks passed. The administrator browser regression passed against the production build. Final CMS/Astro type checks reported zero diagnostics across 34 Astro files; both production builds passed.
- `npm run test:media-deployment` passed against the compiled combined service on both SQLite and a dedicated local PostgreSQL database: upload/download, application restart persistence, unavailable object storage and recovery preserved the previous file. This used local synthetic S3 storage, not real R2. Run it after a build with `WEB_URL=http://127.0.0.1:8080` and ports 8080/3000/4321/4578 free. The optional `MEDIA_TEST_DATABASE_URI` accepts only a dedicated loopback PostgreSQL database ending in `_test`; it applies migrations and creates synthetic fixtures.
- The PostgreSQL upgrade was tested from the previous schema with synthetic public/draft content and a private-record fingerprint. Text and publication states survived; repeated migration/bootstrap preserved later edits. An independent legacy SQLite upgrade also preserved text and public/draft states after the automatic backup/transactional preflight.
- A temporary schema-only Neon branch passed migration/backfill and the compiled combined-service workflow: staff browser cookies, immediate content edits, no-JavaScript intake, payment privacy, editor restrictions and restart persistence. No production rows were copied or changed; the temporary branch was deleted.
- Before source publication, a private pre-upgrade production backup was saved under ignored `.test-data/private-backups/`, using `verify-full` TLS with Node's trusted root certificate bundle. The Windows libpq system trust store initially failed certificate verification; using the trusted certificate bundle resolved it without disabling verification. The archive restored successfully into an isolated local database, which was removed after verification. No records or credentials were printed or committed. Retain the private archive securely for recovery.
- Production dependency audit after a clean install reported ten low and six moderate findings, zero high/critical. Happy DOM is explicitly overridden to 21.0.4 because Lexical's original transitive release had high-severity advisories. A regression verifies the resolved patched version; the existing DOMPurify override is retained. npm's dependency-tree display can report these overridden upstream ranges as invalid even when the patched versions are installed.

Real R2 credentials/delivery, the new Render deployment, physical-device and screen-reader behaviour remain unverified. Tests use synthetic data. Public media approval is a staff responsibility; this library is not for medical documents. The research report contains primary-source URLs and access dates.
