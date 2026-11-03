import assert from 'node:assert/strict';

const origin = new URL(process.env.WEB_URL || 'http://127.0.0.1:8080').origin;
const get = path => fetch(`${origin}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
for (const path of ['/healthz', '/', '/services', '/support', '/admin/login', '/api/services?limit=1']) {
  const response = await get(path);
  assert.equal(response.status, 200, `${path}: ${response.status}`);
  await response.arrayBuffer();
}
for (const path of ['/api/support-requests', '/api/payments', '/api/users']) {
  const response = await get(path);
  assert.ok(response.status >= 400, `${path} must deny anonymous access`);
}
for (const [originHeader, expected] of [[origin, 400], ['https://foreign.example.test', 403]]) {
  const response = await fetch(`${origin}/support`, { method: 'POST', headers: { Origin: originHeader, 'Content-Type': 'application/x-www-form-urlencoded' }, body: '', signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, expected, 'Form validation/origin check');
}
assert.equal((await fetch(`${origin}/api/intake`, { method: 'POST', body: '{}', headers: { 'Content-Type': 'application/json', 'X-Internal-Key': 'caller-controlled' } })).status, 401);
console.log('PASS: combined public/staff routing, readiness, private-record denial and form validation/origin checks. No records created.');
