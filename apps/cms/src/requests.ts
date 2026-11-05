import { randomUUID } from 'node:crypto';
import { APIError, type Access, type CollectionBeforeDeleteHook, type CollectionConfig, type Endpoint, type PayloadRequest } from 'payload';
import { requestSchema } from '@ltsp/shared';

const workflow = Symbol('request-workflow');
export const careAccess: Access = ({ req }) => ['admin', 'care-team'].includes(String(req.user?.role));
const permitted = (req: PayloadRequest) => Boolean((req.context as any)[workflow]);
const commandAccess: Access = ({ req }) => Boolean(careAccess({ req } as any) && permitted(req));
const readOnly = { admin: { readOnly: true }, access: { update: () => false } };
const statusLabels = ['new', 'reviewed', 'closed'];
const json = (value: unknown, status = 200) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });

export const preserveRequestedContent = (field: 'service' | 'course'): CollectionBeforeDeleteHook => async ({ req, id }) => {
  const used = await req.payload.count({ collection: 'support-requests', req, overrideAccess: false, where: { [field]: { equals: id } } });
  if (used.totalDocs) throw new APIError('This item is referenced by an original request and cannot be deleted. Unpublish it instead.', 400);
};

function assertStaff(req: PayloadRequest) {
  if (!careAccess({ req } as any)) throw new APIError('You do not have access to requests.', 403);
}
async function input(req: PayloadRequest) {
  assertStaff(req);
  const origin = req.headers.get('origin');
  const expected = process.env.WEB_URL || process.env.CMS_URL;
  if (origin && origin !== expected && origin !== process.env.CMS_URL) throw new APIError('Use the staff workspace to submit this action.', 403);
  if (!req.headers.get('content-type')?.startsWith('application/json')) throw new APIError('Send a JSON request.', 400);
  try { return await req.json!(); } catch { throw new APIError('The request could not be read.', 400); }
}
function only(data: any, fields: string[]) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).some(key => !fields.includes(key))) throw new APIError('This action contains unsupported fields.', 400);
}
function noteText(value: unknown, required = true) {
  if (typeof value !== 'string' || value.trim().length > 2000 || (required && !value.trim())) throw new APIError('Enter a note of between 1 and 2,000 characters.', 400);
  return value.trim();
}
async function activity(req: PayloadRequest, data: Record<string, unknown>) {
  (req.context as any)[workflow] = true;
  return req.payload.create({ collection: 'request-activity', req, context: { [workflow]: true }, overrideAccess: false, data: {
    ...data, author: req.user!.id, authorName: req.user!.name || req.user!.email,
  } });
}

export async function createWebsiteRequest(req: PayloadRequest, data: any) {
  (req.context as any)[workflow] = true;
  // Only the validated, internal-key-protected intake handler calls this deliberate public create bypass.
  return req.payload.create({ collection: 'support-requests', req, context: { [workflow]: true }, overrideAccess: true, data: {
    ...data, source: 'website', capturedBy: null, originalRequest: null, status: 'new',
  } });
}

export const RequestActivity: CollectionConfig = {
  slug: 'request-activity',
  admin: { hidden: true },
  access: { read: careAccess, create: commandAccess, update: () => false, delete: () => false },
  fields: [
    { name: 'request', type: 'relationship', relationTo: 'support-requests', index: true },
    { name: 'kind', type: 'select', options: ['note', 'status'], required: true },
    { name: 'text', type: 'textarea', required: true, maxLength: 2000 },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'authorName', type: 'text', required: true },
    { name: 'fromStatus', type: 'text' }, { name: 'toStatus', type: 'text' },
    { name: 'transitionKey', type: 'text', unique: true },
  ],
  hooks: { beforeOperation: [({ operation, req }) => {
    if (['create', 'update', 'delete'].includes(operation) && (operation !== 'create' || !permitted(req))) throw new APIError('Request history cannot be edited or deleted.', 403);
  }] },
};

export const Requests: CollectionConfig = {
  slug: 'support-requests',
  disableDuplicate: true,
  admin: { useAsTitle: 'reference', group: 'Care & training', defaultColumns: ['reference', 'kind', 'name', 'status', 'createdAt'], description: 'Use Request inbox for triage, notes and recording an enquiry. Original submissions are read-only.' },
  access: { read: careAccess, create: commandAccess, update: commandAccess, delete: ({ req }) => req.user?.role === 'admin' },
  fields: [
    { name: 'reference', type: 'text', required: true, unique: true, defaultValue: () => 'LT-' + randomUUID().slice(0, 8).toUpperCase(), ...readOnly },
    { name: 'kind', type: 'select', required: true, options: ['care', 'callback', 'referral', 'training-group', 'training-private'], ...readOnly },
    { name: 'status', type: 'select', required: true, defaultValue: 'new', options: statusLabels, admin: { readOnly: true } },
    { name: 'workflowRevision', type: 'text', defaultValue: 'legacy', ...readOnly },
    { name: 'source', type: 'select', defaultValue: 'legacy', options: [
      { label: 'Website', value: 'website' }, { label: 'Phone', value: 'phone' }, { label: 'WhatsApp', value: 'whatsapp' },
      { label: 'Staff follow-up', value: 'staff-follow-up' }, { label: 'Legacy / source not recorded', value: 'legacy' },
    ], ...readOnly },
    { name: 'capturedBy', type: 'relationship', relationTo: 'users', ...readOnly },
    { name: 'capturedByName', type: 'text', ...readOnly },
    { name: 'originalRequest', type: 'relationship', relationTo: 'support-requests', ...readOnly },
    { type: 'collapsible', label: 'Original contact details', fields: [
      { name: 'name', type: 'text', required: true, ...readOnly }, { name: 'phone', type: 'text', ...readOnly },
      { name: 'email', type: 'email', ...readOnly }, { name: 'preferredContact', type: 'select', options: ['phone', 'whatsapp', 'email'], required: true, ...readOnly },
    ] },
    { type: 'collapsible', label: 'Original support context', fields: [
      { name: 'service', type: 'relationship', relationTo: 'services', ...readOnly }, { name: 'course', type: 'relationship', relationTo: 'courses', ...readOnly },
      { name: 'relationship', type: 'select', options: ['self', 'family', 'employer', 'professional'], ...readOnly },
      { name: 'ageGroup', type: 'select', options: ['adult', 'child', 'not-applicable'], ...readOnly },
      { name: 'area', type: 'text', ...readOnly }, { name: 'availability', type: 'text', ...readOnly }, { name: 'message', type: 'textarea', ...readOnly },
      { name: 'consent', label: 'Privacy acknowledgement received', type: 'checkbox', required: true, ...readOnly },
    ] },
    { name: 'staffNotes', label: 'Legacy staff notes', type: 'textarea', ...readOnly },
  ],
  hooks: {
    beforeOperation: [({ operation, req }) => {
      if (['create', 'update'].includes(operation) && !permitted(req)) throw new APIError('Use Request inbox. Original submissions cannot be edited.', 403);
    }],
    beforeChange: [({ operation, data, originalDoc }) => {
      if (operation === 'create') return { ...data, status: 'new', workflowRevision: randomUUID() };
      // Field access also protects the original values; this allowlist protects internal callers.
      return { ...originalDoc, status: data.status, workflowRevision: randomUUID() };
    }],
  },
};

export const requestEndpoints: Endpoint[] = [
  { path: '/request-workflow/capture', method: 'post', handler: async req => {
    const data = await input(req);
    const { source, originalRequest, note, ...values } = data || {};
    let parentID: number | string | undefined;
    if (!['phone', 'whatsapp', 'staff-follow-up'].includes(source)) throw new APIError('Choose Phone or WhatsApp, or use a linked staff follow-up.', 400);
    const parsed = requestSchema.safeParse(values);
    if (!parsed.success) throw new APIError(parsed.error.issues[0]?.message || 'Check the enquiry details.', 400);
    if (source !== 'staff-follow-up' && (originalRequest || note)) throw new APIError('Only staff follow-ups can link an earlier request.', 400);
    if (source === 'staff-follow-up') {
      if (!originalRequest) throw new APIError('Choose the original request.', 400);
      noteText(note);
      const parent = await req.payload.findByID({ collection: 'support-requests', id: originalRequest, req, overrideAccess: false, depth: 0 });
      parentID = parent.id;
    }
    const { service, course, ...submission } = parsed.data;
    const selected: Record<string, number | undefined> = {};
    for (const [key, collection, slug] of [['service', 'services', service], ['course', 'courses', course]]) {
      if (!slug) continue;
      const found = await req.payload.find({ collection, req, overrideAccess: false, depth: 0, limit: 1, where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] } });
      if (!found.docs[0]) throw new APIError('The selected service or training is unavailable.', 400);
      selected[key] = found.docs[0].id as number;
    }
    const transaction = await req.payload.db.beginTransaction();
    if (transaction == null) throw new APIError('Could not start a safe transaction. Please retry.', 503);
    req.transactionID = transaction;
    (req.context as any)[workflow] = true;
    try {
      const created = await req.payload.create({ collection: 'support-requests', req, context: { [workflow]: true }, overrideAccess: false, data: {
        ...submission, ...selected, source, capturedBy: req.user!.id, capturedByName: req.user!.name || req.user!.email, originalRequest: parentID || null,
      } });
      if (source === 'staff-follow-up') {
        await activity(req, { request: created.id, kind: 'note', text: noteText(note) });
        await activity(req, { request: parentID, kind: 'note', text: 'Linked follow-up ' + created.reference + ': ' + noteText(note).slice(0, 1900) });
      }
      await req.payload.db.commitTransaction(transaction);
      delete req.transactionID;
      return json({ doc: created }, 201);
    } catch (error) {
      if (req.transactionID) await req.payload.db.rollbackTransaction(req.transactionID);
      delete req.transactionID;
      throw error;
    }
  } },
  { path: '/request-workflow/:id/note', method: 'post', handler: async req => {
    const data = await input(req);
    only(data, ['text']);
    const record = await req.payload.findByID({ collection: 'support-requests', id: String(req.routeParams?.id), req, overrideAccess: false, depth: 0 });
    const entry = await activity(req, { request: record.id, kind: 'note', text: noteText(data.text) });
    return json({ doc: entry }, 201);
  } },
  { path: '/request-workflow/:id/status', method: 'post', handler: async req => {
    const data = await input(req);
    only(data, ['status', 'revision', 'reason']);
    if (!['reviewed', 'closed'].includes(data.status) || typeof data.revision !== 'string') throw new APIError('Choose a valid status action.', 400);
    const reason = data.status === 'closed' ? noteText(data.reason) : '';
    const transaction = await req.payload.db.beginTransaction();
    if (transaction == null) throw new APIError('Could not start a safe transaction. Please retry.', 503);
    req.transactionID = transaction;
    try {
      const record = await req.payload.findByID({ collection: 'support-requests', id: String(req.routeParams?.id), req, overrideAccess: false, depth: 0 });
      if ((record.workflowRevision || 'legacy') !== data.revision || record.status === data.status) throw new APIError('This request has changed. Refresh before trying again.', 409);
      // A unique revision key reserves the change inside the transaction, preventing concurrent stale writes.
      await activity(req, { request: record.id, kind: 'status', fromStatus: record.status, toStatus: data.status, transitionKey: String(record.id) + ':' + data.revision, text: reason || (record.status === 'closed' ? 'Reopened for review.' : 'Request reviewed.') });
      const updated = await req.payload.update({ collection: 'support-requests', id: record.id, req, context: { [workflow]: true }, overrideAccess: false, data: { status: data.status } });
      await req.payload.db.commitTransaction(transaction);
      delete req.transactionID;
      return json({ doc: updated });
    } catch (error: any) {
      if (req.transactionID) await req.payload.db.rollbackTransaction(req.transactionID);
      delete req.transactionID;
      if (error?.status === 409 || error?.status === 400 && error?.data?.errors?.some((e: any) => e.path === 'transitionKey')) throw new APIError('This request has changed. Refresh before trying again.', 409);
      throw error;
    }
  } },
];
