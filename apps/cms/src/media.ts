import { APIError, type Where, type CollectionConfig } from 'payload';
import sharp from 'sharp';

export const storageReady = ['R2_BUCKET', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'].every(key => Boolean(process.env[key]));
const canEdit = ({ req }: any) => ['admin', 'care-team', 'editor'].includes(req.user?.role);
export const Media: CollectionConfig = {
  slug: 'media', admin: { group: 'Website content', useAsTitle: 'title', description: storageReady ? 'Public assets only. Never upload client records or private care documents.' : 'Uploads are unavailable until the administrator configures R2. Use bundled photos meanwhile. Public assets only.' },
  access: { read: () => true, create: canEdit, update: canEdit, delete: ({ req }) => req.user?.role === 'admin' },
  upload: { disableLocalStorage: true, mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'], imageSizes: [{ name: 'card', width: 480, withoutEnlargement: true }, { name: 'detail', width: 960, withoutEnlargement: true }, { name: 'large', width: 1600, withoutEnlargement: true }], adminThumbnail: 'card' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'alt', label: 'Image description (alt text)', type: 'text', validate: (value: unknown, { data }: any) => !data?.mimeType?.startsWith('image/') || Boolean(String(value || '').trim()) || 'Describe the image for people who cannot see it.' },
    { name: 'caption', type: 'textarea' }, { name: 'credit', label: 'Source / credit', type: 'text' },
    { name: 'approvedForPublicUse', type: 'checkbox', required: true, validate: (value: unknown) => value === true || 'Confirm that this asset is approved for public use.' },
  ],
  hooks: {
    beforeOperation: [async ({ operation, req }) => {
      if ((operation === 'create' || operation === 'update') && req.file) {
        if (!canEdit({ req })) throw new APIError('Sign in to manage public media.', 403);
        if (!storageReady) throw new APIError('Media storage is not configured. Ask the administrator to configure R2.', 400);
        const file = req.file;
        const pdf = file.mimetype === 'application/pdf';
        if (file.size > (pdf ? 10 : 5) * 1024 * 1024) throw new APIError(`Use a file smaller than ${pdf ? 10 : 5} MB.`, 400);
        if (pdf) {
          if (file.data.subarray(0, 5).toString() !== '%PDF-') throw new APIError('This file is not a valid PDF.', 400);
        } else {
          let metadata;
          try { metadata = await sharp(file.data, { limitInputPixels: 25000000 }).metadata(); } catch { throw new APIError('Use a valid JPEG, PNG or WebP image.', 400); }
          const expected: Record<string, string> = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
          if (!metadata.format || expected[metadata.format] !== file.mimetype) throw new APIError('The image content does not match its file type.', 400);
        }
      }
    }],
    beforeDelete: [async ({ req, id }) => {
      for (const collection of ['services', 'courses']) {
        const where: Where = { or: [{ image: { equals: id } }, { downloads: { contains: id } }, { 'meta.image': { equals: id } }] };
        const current = await req.payload.count({ collection, where, req, overrideAccess: true });
        const versions = await req.payload.findVersions({ collection, where: { or: [{ 'version.image': { equals: id } }, { 'version.downloads': { contains: id } }, { 'version.meta.image': { equals: id } }] }, limit: 1, req, overrideAccess: true });
        if (current.totalDocs || versions.totalDocs) throw new APIError('This asset is referenced by content or retained history. Remove those references before deleting it.', 400);
      }
      const settings = await req.payload.findGlobal({ slug: 'site-settings', req, overrideAccess: true, depth: 0 });
      if (String(settings.meta?.image) === String(id)) throw new APIError('This asset is used in website settings.', 400);
    }],
  },
};
