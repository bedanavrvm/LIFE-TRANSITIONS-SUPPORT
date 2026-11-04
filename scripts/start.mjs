import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProxy } from './proxy.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const website = new URL(process.env.WEB_URL || 'http://127.0.0.1:8080');
if (!['http:', 'https:'].includes(website.protocol) || website.pathname !== '/' || website.search || website.hash || website.username || website.password) throw new Error('WEB_URL must be an HTTP(S) origin.');
if (process.env.RENDER === 'true' && (!process.env.WEB_URL || website.protocol !== 'https:' || !/^postgres(ql)?:\/\//.test(process.env.DATABASE_URI || process.env.DATABASE_URL || ''))) throw new Error('Render requires an HTTPS WEB_URL and PostgreSQL DATABASE_URL or DATABASE_URI.');
for (const key of ['PAYLOAD_SECRET', 'INTERNAL_API_KEY']) {
  if ((process.env[key] || '').length < 32) throw new Error(`${key} must contain at least 32 characters.`);
}
const port = Number(process.env.PORT || 8080);
const cmsPort = Number(process.env.CMS_PORT || 3000);
const webPort = Number(process.env.ASTRO_PORT || 4321);
if ([port, cmsPort, webPort].some(value => !Number.isInteger(value) || value < 1 || value > 65535) || new Set([port, cmsPort, webPort]).size !== 3) throw new Error('Use three different valid ports.');
const env = { ...process.env, NODE_ENV: 'production', CMS_URL: website.origin, WEB_URL: website.origin, CMS_INTERNAL_URL: `http://127.0.0.1:${cmsPort}` };
let ready = false;
let stopping = false;
const children = [];
const server = createProxy({ website: website.origin, cmsPort, webPort, render: process.env.RENDER === 'true', ready: () => ready });
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  ready = false;
  const terminate = () => { for (const child of children) child.kill('SIGTERM'); };
  // Finish in-flight requests before stopping workers; stay within Render's 30-second shutdown window.
  server.close(terminate);
  if (code !== 0) terminate();
  const force = setTimeout(() => { for (const child of children) child.kill('SIGKILL'); process.exit(code); }, 25000);
  Promise.all(children.map(child => child.exitCode !== null || child.signalCode !== null ? Promise.resolve() : new Promise(resolve => child.once('exit', resolve)))).then(() => { clearTimeout(force); server.closeAllConnections(); process.exit(code); });
}
function launch(args, cwd, extra = {}) {
  const child = spawn(process.execPath, args, { cwd, env: { ...env, ...extra }, stdio: 'inherit' });
  children.push(child);
  child.on('error', () => { console.error('A production server could not start.'); stop(1); });
  child.on('exit', () => { if (!stopping) { console.error('A production server stopped; stopping the combined service.'); stop(1); } });
}
process.on('SIGTERM', () => stop());
process.on('SIGINT', () => stop());
if (process.send) process.on('message', message => { if (message === 'shutdown') stop(); });
server.on('error', () => { console.error('Could not bind the public service port.'); stop(1); });
// Existing Render dashboard commands can outlive render.yaml; enforce setup at the shared entrypoint.
if (process.env.RENDER === 'true') {
  for (const [label, args] of [
    ['migrations', ['scripts/payload.mjs', 'migrate']],
    ['public content', ['--import', 'tsx', 'scripts/seed.ts']],
    ['administrator', ['--import', 'tsx', 'scripts/create-admin.ts']],
  ]) {
    console.log(`Preparing production ${label}.`);
    const child = spawn(process.execPath, args, { cwd: root, env, stdio: 'inherit' });
    children.push(child);
    const code = await new Promise(resolve => {
      child.once('error', () => resolve(1));
      child.once('exit', code => resolve(code ?? 1));
    });
    children.splice(children.indexOf(child), 1);
    if (stopping) break;
    if (code !== 0) { console.error(`Production ${label} setup failed; application servers were not started.`); stop(1); break; }
  }
  if (!stopping) console.log('Production bootstrap complete.');
}
if (!stopping) {
  launch([path.join(root, 'node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(cmsPort)], path.join(root, 'apps/cms'));
  launch([path.join(root, 'apps/web/dist/server/entry.mjs')], root, { HOST: '127.0.0.1', PORT: String(webPort) });
  server.listen(port, process.env.HOST || '0.0.0.0');
  const deadline = Date.now() + 120000;
  while (!stopping && Date.now() < deadline) {
    try {
      const responses = await Promise.all([
        fetch(`http://127.0.0.1:${cmsPort}/api/services?limit=1&depth=0`, { signal: AbortSignal.timeout(5000) }),
        fetch(`http://127.0.0.1:${webPort}/`, { headers: { 'X-Forwarded-Host': website.host, 'X-Forwarded-Proto': website.protocol.slice(0, -1) }, signal: AbortSignal.timeout(10000) }),
      ]);
      for (const response of responses) await response.arrayBuffer();
      if (responses.every(response => response.ok)) { ready = true; console.log(`Combined production service ready on port ${port}.`); break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  if (!ready && !stopping) { console.error('Production servers failed their startup checks.'); stop(1); }
}
