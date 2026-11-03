import http from 'node:http';
import { isIP } from 'node:net';
import { requestId, reportFailure } from './observability.mjs';

const hopHeaders = ['connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'transfer-encoding', 'upgrade'];
function endToEnd(headers) {
  const clean = { ...headers };
  const connectionHeaders = String(headers.connection || '').split(',').map(value => value.trim().toLowerCase());
  for (const name of [...hopHeaders, ...connectionHeaders]) delete clean[name];
  return clean;
}

export function createProxy({ website, cmsPort, webPort, render = false, ready = () => true }) {
  const origin = new URL(website);
  return http.createServer({ requestTimeout: 60000, headersTimeout: 15000, maxHeaderSize: 16384 }, (req, res) => {
    const id = requestId();
    res.setHeader('X-Request-ID', id);
    res.on('finish', () => {
      if (res.statusCode >= 400 && req.url !== '/healthz') reportFailure({ event: 'http_request_failed', id, method: req.method, pathname: req.url?.split('?')[0], status: res.statusCode });
    });
    const reply = (status, message) => {
      if (!res.headersSent) { res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(message); }
      else res.destroy();
    };
    if (req.url === '/healthz' && ['GET', 'HEAD'].includes(req.method)) {
      reply(ready() ? 200 : 503, ready() ? 'OK' : 'Starting');
      return;
    }
    if (!ready()) { reply(503, 'Please try again shortly.'); return; }
    if (req.headers.host !== origin.host) { reply(421, 'Unrecognised website host.'); return; }
    // Reject ambiguous paths rather than letting the two frameworks normalise them differently.
    if (!req.url?.startsWith('/') || req.url.startsWith('//')) { reply(400, 'Invalid request path.'); return; }
    let pathname;
    try { pathname = decodeURIComponent(req.url.split('?')[0]); } catch { reply(400, 'Invalid request path.'); return; }
    if (pathname.includes('\\') || pathname.includes('//') || pathname.split('/').some(part => part === '.' || part === '..')) {
      reply(400, 'Invalid request path.'); return;
    }
    const port = /^\/(admin|api|_next)(\/|$)/.test(pathname) ? cmsPort : webPort;
    const headers = endToEnd(req.headers);
    // Only Render's edge may supply CF-Connecting-IP. Ignore caller-supplied forwarding chains.
    const edgeIP = render ? req.headers['cf-connecting-ip'] : undefined;
    const clientIP = typeof edgeIP === 'string' && isIP(edgeIP) ? edgeIP : req.socket.remoteAddress;
    delete headers.forwarded;
    delete headers['x-internal-key'];
    headers.host = origin.host;
    headers['x-forwarded-host'] = origin.host;
    headers['x-forwarded-proto'] = origin.protocol.slice(0, -1);
    headers['x-forwarded-port'] = origin.port || (origin.protocol === 'https:' ? '443' : '80');
    headers['x-forwarded-for'] = clientIP;
    headers['x-request-id'] = id;
    const upstream = http.request({ hostname: '127.0.0.1', port, method: req.method, path: req.url, headers }, response => {
      res.writeHead(response.statusCode || 502, endToEnd(response.headers));
      response.on('error', () => res.destroy());
      response.pipe(res);
    });
    upstream.setTimeout(60000, () => upstream.destroy());
    upstream.on('error', () => reply(502, 'Service temporarily unavailable. Please try again.'));
    req.on('aborted', () => upstream.destroy());
    req.on('error', () => upstream.destroy());
    res.on('close', () => { if (!res.writableFinished) upstream.destroy(); });
    req.pipe(upstream);
  });
}
