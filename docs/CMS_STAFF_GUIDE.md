# Staff workspace: editing, publishing and public media

The workspace upgrade implements the three-phase plan approved on 2026-11-04. The existing administrator, care-team and editor roles retain their responsibilities. No client-account or automatic booking system is added.

## Find your work

Open `/admin` after signing in. Administrators and care staff see new enquiries, callback requests, today's confirmed appointments and pending payments. Editors see public-content counts instead. All staff get training dates, quick actions and a short help panel. Dates use Africa/Nairobi. Refresh reloads the dashboard; there is no background polling.

If an older personalised dashboard layout is still selected, use the dashboard menu's Reset Layout action to restore the new default. Dashboard customisation never grants additional record access.

An unavailable panel means its query failed, not that there are no records. Retry it; administrators can correlate failures in Render's runtime logs. Review an enquiry before confirming care, and verify the provider transaction before marking a payment paid.

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

Dependencies are pinned to Payload 3.92.0: Lexical, S3 storage and SEO. The CMS import map is committed; regenerate it after changing registered components. The existing automatic startup sequence remains migration → seed/content upgrade → administrator bootstrap → application start.

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
