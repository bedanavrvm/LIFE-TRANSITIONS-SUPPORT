import { randomUUID } from 'node:crypto';

export function requestId(value) {
  return typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value) ? value : randomUUID();
}

export function routeLabel(pathname = '') {
  const match = /^\/api\/(users|services|courses|media|support-requests|appointments|payments)(?:\/|$)/.exec(pathname);
  if (match) return `/api/${match[1]}`;
  if (pathname.startsWith('/admin')) return '/admin';
  if (pathname === '/support') return '/support';
  if (pathname.startsWith('/payment/')) return '/payment/:reference';
  return '/other';
}

// Error messages, SQL/parameters, request bodies and nested causes can contain private data.
export function safeError(error) {
  const token = value => typeof value === 'string' && /^[A-Za-z0-9_.:-]{1,100}$/.test(value) ? value : undefined;
  const metadata = { type: token(error?.name) || 'Error' };
  let cause = error;
  for (let i = 0; cause && i < 4; i++, cause = cause.cause) {
    if (!metadata.code && token(cause.code)) metadata.code = cause.code;
    if (!metadata.constraint && token(cause.constraint)) metadata.constraint = cause.constraint;
  }
  const fields = Array.isArray(error?.data?.errors) ? error.data.errors.map(item => token(item?.path)).filter(Boolean) : [];
  if (fields?.length) metadata.fields = fields.slice(0, 10);
  const locations = typeof error?.stack === 'string' ? error.stack.split('\n').slice(1).map(line => /([^/\\\s()]+:\d+:\d+)\)?$/.exec(line)?.[1]).filter(Boolean).slice(0, 6) : [];
  if (locations.length) metadata.locations = locations;
  return metadata;
}

export function safePayloadLog(args, method) {
  const entry = args[0];
  const error = entry instanceof Error ? entry : entry && typeof entry === 'object' ? entry.err : undefined;
  if (error) return method.call(this, { event: 'payload_error', error: safeError(error) }, 'Payload operation failed');
  return method.apply(this, args);
}

export function reportFailure({ event, id, method, pathname, status, error }) {
  const entry = {
    level: status >= 500 ? 'error' : 'warn', event,
    requestId: requestId(id), method: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'].includes(method) ? method : 'OTHER',
    route: routeLabel(pathname), status,
    ...(error ? { error: safeError(error) } : {}),
  };
  console.error(JSON.stringify(entry));
  return entry.requestId;
}
