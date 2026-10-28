import { randomUUID, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { APIError, buildConfig, type Access, type CollectionConfig, type PayloadRequest } from 'payload';
import { requestSchema, safeCheckoutUrl } from '@ltsp/shared';

const directory = path.dirname(fileURLToPath(import.meta.url));
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
  slug: 'users', auth: true, admin: { useAsTitle: 'email', group: 'Administration' },
  endpoints: [{ path: '/first-register', method: 'post', handler: () => Response.json({ error: 'Create the first administrator locally with npm run admin.' }, { status: 403 }) }],
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

const Services: CollectionConfig = {
  slug: 'services', admin: { useAsTitle: 'title', group: 'Website content' },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isAdmin },
  fields: [
    { name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'category', type: 'select', defaultValue: 'service', options: [{ label: 'Service', value: 'service' }, { label: 'Signature package', value: 'package' }] },
    { name: 'number', type: 'text', required: true }, { name: 'summary', type: 'textarea', required: true },
    { name: 'description', type: 'textarea', required: true }, { name: 'audience', type: 'text', required: true },
    { name: 'free', type: 'checkbox', defaultValue: false },
  ],
};
const Courses: CollectionConfig = {
  slug: 'courses', admin: { useAsTitle: 'title', group: 'Website content' },
  access: { read: ({ req }) => req.user ? true : { published: { equals: true } }, create: isEditor, update: isEditor, delete: isAdmin },
  fields: [
    { name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'audience', type: 'text', required: true }, { name: 'summary', type: 'textarea', required: true },
    { name: 'details', type: 'textarea', required: true }, { name: 'published', type: 'checkbox', defaultValue: false },
    { name: 'date', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'location', type: 'text' }, { name: 'capacity', type: 'number', min: 1 },
    { name: 'price', label: 'Fee in KES (leave blank until agreed)', type: 'number', min: 0, validate: validAmount },
  ],
};
const Requests: CollectionConfig = {
  slug: 'support-requests', admin: { useAsTitle: 'reference', group: 'Care & training', defaultColumns: ['reference', 'kind', 'name', 'status', 'createdAt'] }, access: privateAccess,
  fields: [
    { name: 'reference', type: 'text', required: true, unique: true, defaultValue: () => `LT-${randomUUID().slice(0, 8).toUpperCase()}`, admin: { readOnly: true } },
    { name: 'kind', type: 'select', required: true, options: ['care', 'callback', 'referral', 'training-group', 'training-private'] },
    { name: 'status', type: 'select', required: true, defaultValue: 'new', options: ['new', 'reviewed', 'closed'] },
    { name: 'name', type: 'text', required: true }, { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' }, { name: 'preferredContact', type: 'select', options: ['phone', 'whatsapp', 'email'], required: true },
    { name: 'service', type: 'relationship', relationTo: 'services' }, { name: 'course', type: 'relationship', relationTo: 'courses' },
    { name: 'relationship', type: 'select', options: ['self', 'family', 'employer', 'professional'] },
    { name: 'ageGroup', type: 'select', options: ['adult', 'child', 'not-applicable'] },
    { name: 'area', type: 'text' }, { name: 'availability', type: 'text' }, { name: 'message', type: 'textarea' },
    { name: 'consent', label: 'Privacy acknowledgement received', type: 'checkbox', required: true },
    { name: 'staffNotes', type: 'textarea', admin: { description: 'Necessary operational notes only. Do not use this MVP as a medical record.' } },
  ],
  hooks: { beforeValidate: [({ data, originalDoc }) => {
    const item = { ...originalDoc, ...data };
    if (item.preferredContact === 'email' && !String(item.email || '').trim()) throw new APIError('Enter an email address for an email reply.', 400);
    if (['phone', 'whatsapp'].includes(item.preferredContact) && !String(item.phone || '').trim()) throw new APIError('Enter a phone number for a call or WhatsApp reply.', 400);
    return data;
  }] },
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

if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32) throw new Error('Run npm run setup and provide a PAYLOAD_SECRET of at least 32 characters.');

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  graphQL: { disable: true },
  email: () => ({ name: 'local-disabled', defaultFromAddress: 'no-reply@example.test', defaultFromName: 'Life Transitions local preview', sendEmail: async () => { console.info('Email delivery is disabled in local preview; no message content was logged.'); } }),
  serverURL: process.env.CMS_URL || 'http://127.0.0.1:3000',
  admin: { user: 'users', importMap: { baseDir: directory }, meta: { titleSuffix: ' | Life Transitions' } },
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URI || `file:${path.resolve(directory, '../../../data/development.sqlite').replaceAll('\\', '/')}` } }),
  typescript: { autoGenerate: false },
  collections: [Users, Services, Courses, Requests, Appointments, Payments],
  globals: [{ slug: 'site-settings', access: { read: () => true, update: isEditor }, fields: [
    { name: 'phone', type: 'text' }, { name: 'whatsapp', label: 'WhatsApp number including country code', type: 'text' },
    { name: 'email', type: 'email' }, { name: 'responseNote', type: 'text' }, { name: 'aboutText', type: 'textarea' },
  ] }],
  endpoints: [
    { path: '/intake', method: 'post', handler: async req => {
      if (!internal(req)) return Response.json({ error: 'Unauthorised' }, { status: 401 });
      let raw: unknown;
      try { raw = await req.json?.(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
      const parsed = requestSchema.safeParse(raw);
      if (!parsed.success) return Response.json({ error: 'Please check the form.' }, { status: 400 });
      const { service, course, ...values } = parsed.data;
      const [services, courses] = await Promise.all([
        service ? req.payload.find({ collection: 'services', where: { slug: { equals: service } }, limit: 1, depth: 0, req, overrideAccess: false }) : null,
        course ? req.payload.find({ collection: 'courses', where: { and: [{ slug: { equals: course } }, { published: { equals: true } }] }, limit: 1, depth: 0, req, overrideAccess: false }) : null,
      ]);
      if ((service && !services?.docs.length) || (course && !courses?.docs.length)) return Response.json({ error: 'This service or course is unavailable.' }, { status: 400 });
      // Public creation is limited to the validated intake shape; no private document is returned.
      const created = await req.payload.create({ collection: 'support-requests', overrideAccess: true, req, data: { ...values, phone: values.phone || undefined, email: values.email || undefined, status: 'new', service: services?.docs[0]?.id, course: courses?.docs[0]?.id } });
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
