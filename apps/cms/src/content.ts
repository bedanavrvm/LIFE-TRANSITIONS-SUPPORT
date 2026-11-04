import { APIError, type CollectionBeforeOperationHook, type CollectionBeforeValidateHook, type Field } from 'payload';
import { safeBody } from '../../../packages/shared/src/rich-content';

export function plainText(node: any): string {
  if (!node || typeof node !== 'object') return '';
  if (node.type === 'linebreak') return '\n';
  if (typeof node.text === 'string') return node.text;
  const children = node.root?.children || node.children || [];
  return children.map(plainText).join(node.root || node.type === 'root' || node.type === 'list' ? '\n\n' : '');
}
export function textBody(text: string) {
  return { root: { type: 'root', version: 1, direction: null, format: '', indent: 0, children: String(text).split(/\n\s*\n/).map(paragraph => ({ type: 'paragraph', version: 1, direction: null, format: '', indent: 0, children: [{ type: 'text', version: 1, text: paragraph, format: 0, detail: 0, mode: 'normal', style: '' }] })) } };
}
export const captureContentInput = (legacy: string): CollectionBeforeOperationHook => ({ args, req }) => {
  req.context.legacyOnlyContent = Boolean('data' in args && args.data && Object.hasOwn(args.data, legacy) && !Object.hasOwn(args.data, 'body'));
  return args;
};
export const syncContent = (legacy: string): CollectionBeforeValidateHook => ({ data, operation, context }) => {
  if (!data) return data;
  if (context.isRestoringVersion) data._status = 'draft';
  if (context.legacyOnlyContent && typeof data[legacy] === 'string') data.body = textBody(data[legacy]);
  if (data.body) {
    try { data.body = safeBody(data.body); } catch { throw new APIError('Use supported text, headings, lists and safe links.', 400); }
    data[legacy] = plainText(data.body);
  }
  else if (typeof data[legacy] === 'string') data.body = textBody(data[legacy]);
  // Compatibility for older editors/API clients; the native publish controls remain authoritative.
  if (!data._status && typeof data.published === 'boolean') data._status = data.published ? 'published' : 'draft';
  if (data._status) data.published = data._status === 'published';
  if (operation === 'create' && !data._status) data._status = 'draft';
  return data;
};
export const mediaFields: Field[] = [
  { name: 'image', type: 'relationship', relationTo: 'media', filterOptions: { mimeType: { contains: 'image/' } } },
  { name: 'downloads', type: 'relationship', relationTo: 'media', hasMany: true, filterOptions: { mimeType: { equals: 'application/pdf' } } },
];
