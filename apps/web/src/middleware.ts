import { defineMiddleware } from 'astro:middleware';

// shortcut: process-local limits suit local development; use shared limits before public deployment.
const submissions = new Map<string, { count: number; reset: number }>();

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.request.method === 'POST' && context.url.pathname === '/support') {
    const origin = context.request.headers.get('origin');
    const expectedOrigin = new URL(process.env.WEB_URL || context.request.url).origin;
    if (origin && origin !== expectedOrigin) return new Response('Please submit the form from this website.', { status: 403 });
    if (Number(context.request.headers.get('content-length') || 0) > 16384) return new Response('The request is too large.', { status: 413 });
    const now = Date.now();
    for (const [key, entry] of submissions) if (entry.reset < now) submissions.delete(key);
    const key = context.clientAddress;
    const entry = submissions.get(key) || { count: 0, reset: now + 600000 };
    entry.count++;
    submissions.set(key, entry);
    if (entry.count > 20) return new Response('Too many requests. Please try again later.', { status: 429, headers: { 'Retry-After': '600' } });
  }
  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'same-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Cache-Control', 'no-store');
  return response;
});
