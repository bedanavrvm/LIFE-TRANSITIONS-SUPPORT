import { randomUUID, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { APIError, buildConfig, type Access, type CollectionConfig, type PayloadRequest } from 'payload';
import { lexicalEditor, ParagraphFeature, HeadingFeature, BoldFeature, ItalicFeature, OrderedListFeature, UnorderedListFeature, LinkFeature, FixedToolbarFeature } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { syncContent, captureContentInput, mediaFields } from './content';
import { Media, storageReady } from './media';
import { Requests, RequestActivity, requestEndpoints, createWebsiteRequest, preserveRequestedContent } from './requests';
import { requestSchema, safeCheckoutUrl } from '@ltsp/shared';
import { requestId, reportFailure, safePayloadLog } from '../../../scripts/observability.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const databaseURI = process.env.DATABASE_URI || process.env.DATABASE_URL;
const usePostgres = /^postgres(ql)?:\/\//.test(databaseURI || '');
if (process.env.RENDER === 'true' && !usePostgres) throw new Error('Render requires a PostgreSQL DATABASE_URL or DATABASE_URI; local SQLite is not persistent there.');
const isAdmin: Access = ({ req }) => req.user?.role === 'admin';
const isCare: Access = ({ req }) => ['admin', 'care-team'].includes(String(req.user?.role));
const isEditor: Access = ({ req }) => ['admin', 'care-team', 'editor'].includes(String(req.user?.role));
const privateAccess = { read: isCare, create: isCare, update: isCare, delete: isAdmin };
const validAmount = (value: unknown) => value == null || (typeof value === 'number' && Number.isFinite(value) && Number(value.toFixed(2)) === value) || 'Use an amount with at most two decimal places.';
const internal = (req: PayloadRequest) => {
  const expected = process.env.INTERNAL_API_KEY;
  const received = req.headers.get('x-internal-key') || '';
  return Boolean(expected && expected.length >= 32 && Buffer.byteLength(received) === Buffer.byteLength(expected) && timingSafeEqual(Buffer.from(received), Buffer.from(expected)));
};

const Users: CollectionConfig = {
  slug: 'users', auth: true, admin: { useAsTitle: 'email', group: 'Administration', hidden: ({ user }) => user?.role !== 'admin' },
  endpoints: [{ path: '/first-register', method: 'post', handler: () => { throw new APIError('Public account registration is closed. Configure the administrator in the server environment and redeploy.', 403); } }],
  access: { create: isAdmin, read: ({ req }) => req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false, update: isAdmin, delete: isAdmin, admin: ({ req }) => Boolean(req.user) },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'select', required: true, defaultValue: 'care-team', options: ['admin', 'care-team', 'editor'], access: { create: ({ req }) => req.user?.role === 'admin', update: ({ req }) => req.user?.role === 'admin' } },
  ],
  hooks: { beforeChange: [async ({ data, operation, req }) => {
    if (operation === 'create') {
      const existing = await req.payload.count({ collection: 'users', overrideAccess: true, req });
      if (existing.totalDocs === 0) return { ...data, role: 'admin' };
    }
    return data;
  }] },
};

const publicRead: Access = ({ req }) => isContentStaff(req.user) ? true : { _status: { equals: 'published' } };
const isContentStaff = (user: any) => ['admin', 'care-team', 'editor'].includes(user?.role);
const versions = { maxPerDoc: 20, drafts: { autosave: { interval: 5000 } } };
const preview = (collection: string) => (doc: any) => `${process.env.WEB_URL || 'http://127.0.0.1:4321'}/preview/${collection}/${doc.id}`;
const Services: CollectionConfig = {
  slug: 'services', endpoints: [{ path: '/versions/:id', method: 'post', handler: async req => {
    if (!isContentStaff(req.user)) throw new APIError('Sign in to restore content.', 403);
    const result = await req.payload.restoreVersion({ collection: 'services', id: String(req.routeParams?.id || ''), draft: true, req, overrideAccess: false });
    return Response.json({ ...result, message: 'Version restored as draft. Preview and publish when ready.' });
  } }], versions, hooks: { beforeDelete: [preserveRequestedContent('service')], beforeOperation: [captureContentInput('description')], beforeValidate: [syncContent('description')] }, admin: { useAsTitle: 'title', group: 'Website content', preview: preview('services'), defaultColumns: ['title', 'category', '_status', 'updatedAt'] },
  access: { read: publicRead, readVersions: isEditor, create: isEditor, update: isEditor, delete: isAdmin },
  fields: [
    { name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'category', type: 'select', defaultValue: 'service', options: [{ label: 'Service', value: 'service' }, { label: 'Signature package', value: 'package' }] },
    { name: 'number', type: 'text', required: true }, { name: 'summary', type: 'textarea', required: true },
    { name: 'description', type: 'textarea', required: true, admin: { hidden: true } }, { name: 'body', label: 'Detailed description', type: 'richText' }, ...mediaFields, { name: 'audience', type: 'text', required: true },
    { name: 'free', type: 'checkbox', defaultValue: false },
  ],
};
const Courses: CollectionConfig = {
  slug: 'courses', endpoints: [{ path: '/versions/:id', method: 'post', handler: async req => {
    if (!isContentStaff(req.user)) throw new APIError('Sign in to restore content.', 403);
    const result = await req.payload.restoreVersion({ collection: 'courses', id: String(req.routeParams?.id || ''), draft: true, req, overrideAccess: false });
    return Response.json({ ...result, message: 'Version restored as draft. Preview and publish when ready.' });
  } }], versions, hooks: { beforeDelete: [preserveRequestedContent('course')], beforeOperation: [captureContentInput('details')], beforeValidate: [syncContent('details')] }, admin: { useAsTitle: 'title', group: 'Website content', preview: preview('courses'), defaultColumns: ['title', 'date', '_status', 'updatedAt'] },
  access: { read: publicRead, readVersions: isEditor, create: isEditor, update: isEditor, delete: isAdmin },
  fields: [
    { name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'audience', type: 'text', required: true }, { name: 'summary', type: 'textarea', required: true },
    { name: 'details', type: 'textarea', required: true, admin: { hidden: true } }, { name: 'body', label: 'Detailed description', type: 'richText' }, ...mediaFields, { name: 'published', type: 'checkbox', defaultValue: false, admin: { hidden: true, readOnly: true } },
    { name: 'date', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'location', type: 'text' }, { name: 'capacity', type: 'number', min: 1 },
    { name: 'price', label: 'Fee in KES (leave blank until agreed)', type: 'number', min: 0, validate: validAmount },
  ],
};
const Appointments: CollectionConfig = {
  slug: 'appointments', access: privateAccess, admin: { group: 'Care & training', defaultColumns: ['request', 'startsAt', 'status'] },
  fields: [
    { name: 'request', type: 'relationship', relationTo: 'support-requests', required: true },
    { name: 'staff', type: 'relationship', relationTo: 'users' },
    { name: 'startsAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'endsAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'location', type: 'text', required: true },
    { name: 'status', type: 'select', required: true, defaultValue: 'proposed', options: ['proposed', 'confirmed', 'completed', 'cancelled'] },
  ],
  hooks: { beforeValidate: [async ({ data, originalDoc, req }) => {
    const item = { ...originalDoc, ...data };
    if (new Date(item.endsAt).getTime() <= new Date(item.startsAt).getTime()) throw new APIError('The appointment must end after it starts.', 400);
    if (['confirmed', 'completed'].includes(item.status)) {
      const request = await req.payload.findByID({ collection: 'support-requests', id: typeof item.request === 'object' ? item.request.id : item.request, req, overrideAccess: false });
      if (request.status === 'new') throw new APIError('Review the support request before confirming an appointment.', 400);
    }
    return data;
  }] },
};
const Payments: CollectionConfig = {
  slug: 'payments', access: privateAccess, admin: { group: 'Care & training', useAsTitle: 'reference' },
  fields: [
    { name: 'reference', type: 'text', unique: true, required: true, defaultValue: () => randomUUID(), admin: { readOnly: true } },
    { name: 'request', type: 'relationship', relationTo: 'support-requests', required: true },
    { name: 'amount', label: 'Agreed amount in KES', type: 'number', min: 1, required: true, validate: validAmount },
    { name: 'checkoutUrl', label: 'Provider-hosted HTTPS payment link', type: 'text', validate: (value: unknown) => !value || safeCheckoutUrl(value) || 'Use a valid HTTPS checkout URL without embedded credentials.' },
    { name: 'status', type: 'select', required: true, defaultValue: 'pending', options: ['pending', 'paid', 'cancelled'] },
    { name: 'verificationReference', label: 'Provider transaction reference checked by staff', type: 'text' },
    { name: 'publicUrl', type: 'text', admin: { readOnly: true, description: 'Share this link privately with the payer. It reveals only the amount and payment status.' } },
  ],
  hooks: { beforeValidate: [async ({ data, originalDoc, req }) => {
    const item = { ...originalDoc, ...data };
    if (item.status === 'paid' && !String(item.verificationReference || '').trim()) throw new APIError('Verify the transaction in the provider dashboard and record its reference before marking paid.', 400);
    if (item.request) {
      const request = await req.payload.findByID({ collection: 'support-requests', id: typeof item.request === 'object' ? item.request.id : item.request, depth: 1, req, overrideAccess: false });
      if (request.status !== 'reviewed') throw new APIError('Review and agree the request before creating a payment.', 400);
      if (typeof request.service === 'object' && request.service?.free) throw new APIError('Complimentary services must not require payment.', 400);
    }
    return data;
  }], beforeChange: [({ data }) => ({ ...data, publicUrl: `${process.env.WEB_URL}/payment/${data.reference}` })] },
};

if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32) throw new Error('Provide a PAYLOAD_SECRET of at least 32 characters (npm run setup creates a local development secret).');

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET, sharp,
  editor: lexicalEditor({ features: [ParagraphFeature(), HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }), BoldFeature(), ItalicFeature(), OrderedListFeature(), UnorderedListFeature(), LinkFeature({ enabledCollections: [] }), FixedToolbarFeature()] }),
  plugins: [
    s3Storage({ enabled: storageReady, alwaysInsertFields: true, collections: { media: true }, bucket: process.env.R2_BUCKET || 'unconfigured', config: { endpoint: process.env.R2_ENDPOINT, region: 'auto', forcePathStyle: true, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID || 'unconfigured', secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'unconfigured' } } }),
    seoPlugin({ collections: ['services', 'courses'], globals: ['site-settings'], uploadsCollection: 'media', tabbedUI: true, generateTitle: ({ doc }) => `${doc.title || 'Care through life changes'} | Life Transitions Support Partners`, generateDescription: ({ doc }) => doc.summary || '', generateImage: ({ doc }) => doc.image || '' }),
  ],
  logger: { options: { level: 'info', hooks: { logMethod: safePayloadLog } } },
  loggingLevels: { ValidationError: 'warn', Forbidden: 'warn', AuthenticationError: 'warn' },
  hooks: { afterError: [({ error, req, collection, result }) => {
    const id = requestId(req.headers.get('x-request-id'));
    const status = error instanceof APIError ? error.status : 500;
    reportFailure({ event: 'payload_request_failed', id, method: req.method, pathname: collection ? `/api/${collection.slug}` : '/api/other', status, error });
    req.responseHeaders ??= new Headers();
    req.responseHeaders.set('X-Request-ID', id);
    return { status, response: { ...result, requestId: id, ...(status >= 500 ? { errors: [{ message: `We couldn't complete this request. Reference: ${id}` }] } : {}) } };
  }] },
  graphQL: { disable: true },
  email: () => ({ name: 'local-disabled', defaultFromAddress: 'no-reply@example.test', defaultFromName: 'Life Transitions local preview', sendEmail: async () => { console.info('Email delivery is disabled in local preview; no message content was logged.'); } }),
  serverURL: process.env.CMS_URL || process.env.WEB_URL || 'http://127.0.0.1:3000',
  admin: { user: 'users', theme: 'light', importMap: { baseDir: directory }, meta: { titleSuffix: ' | Life Transitions' }, components: { views: { requestInbox: { Component: './components/RequestInboxView', path: '/requests', exact: true }, requestDetail: { Component: './components/RequestInboxView', path: '/requests/:id', exact: true } }, beforeNavLinks: ['./components/RequestInboxLink'], graphics: { Logo: './components/Brand#Logo', Icon: './components/Brand#Icon' } }, dashboard: { widgets: [{ slug: 'staff-home', label: 'Your workspace', Component: './components/StaffHome', minWidth: 'full' }], defaultLayout: [{ widgetSlug: 'staff-home', width: 'full' }, { widgetSlug: 'collections', width: 'full' }] } },
  db: usePostgres ? postgresAdapter({
    pool: { connectionString: databaseURI, max: 5, connectionTimeoutMillis: 15000, idleTimeoutMillis: 30000 },
    disableCreateDatabase: true,
    push: false,
    migrationDir: path.resolve(directory, 'migrations/postgres'),
  }) : sqliteAdapter({ transactionOptions: { behavior: 'immediate' }, client: { url: databaseURI || `file:${path.resolve(directory, '../../../data/development.sqlite').replaceAll('\\', '/')}` } }),
  typescript: { autoGenerate: false },
  collections: [Users, Services, Courses, Requests, RequestActivity, Appointments, Payments, Media],
  globals: [{ slug: 'site-settings', admin: { group: 'Website content' }, access: { read: () => true, update: isEditor }, fields: [
    { name: 'phone', type: 'text' }, { name: 'whatsapp', label: 'WhatsApp number including country code', type: 'text' },
    { name: 'email', type: 'email' }, { name: 'responseNote', type: 'text' }, { name: 'aboutText', type: 'textarea' },
  ] }],
  endpoints: [
    ...requestEndpoints,
    { path: '/intake', method: 'post', handler: async req => {
      if (!internal(req)) return Response.json({ error: 'Unauthorised' }, { status: 401 });
      let raw: unknown;
      try { raw = await req.json?.(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
      const parsed = requestSchema.safeParse(raw);
      if (!parsed.success) return Response.json({ error: 'Please check the form.' }, { status: 400 });
      const { service, course, ...values } = parsed.data;
      const [services, courses] = await Promise.all([
        service ? req.payload.find({ collection: 'services', where: { and: [{ slug: { equals: service } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 0, req, overrideAccess: false }) : null,
        course ? req.payload.find({ collection: 'courses', where: { and: [{ slug: { equals: course } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 0, req, overrideAccess: false }) : null,
      ]);
      if ((service && !services?.docs.length) || (course && !courses?.docs.length)) return Response.json({ error: 'This service or course is unavailable.' }, { status: 400 });
      // Public creation is limited to the validated intake shape; no private document is returned.
      const created = await createWebsiteRequest(req, { ...values, phone: values.phone || undefined, email: values.email || undefined, service: services?.docs[0]?.id, course: courses?.docs[0]?.id });
      return Response.json({ reference: created.reference }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
    } },
    { path: '/payment-summary/:reference', method: 'get', handler: async req => {
      if (!internal(req)) return Response.json({ error: 'Unauthorised' }, { status: 401 });
      const reference = String(req.routeParams?.reference || '');
      if (!/^[a-f0-9-]{36}$/.test(reference)) return Response.json({ error: 'Not found' }, { status: 404 });
      const result = await req.payload.find({ collection: 'payments', where: { reference: { equals: reference } }, limit: 1, depth: 0, req, overrideAccess: true });
      const payment = result.docs[0];
      if (!payment) return Response.json({ error: 'Not found' }, { status: 404 });
      return Response.json({ reference: payment.reference, amount: payment.amount, status: payment.status, checkoutUrl: payment.status === 'pending' ? payment.checkoutUrl : null }, { headers: { 'Cache-Control': 'no-store' } });
    } },
  ],
});
