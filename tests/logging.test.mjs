import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Writable } from 'node:stream';
import pino from 'pino';
import { reportFailure, safeError, safePayloadLog } from '../scripts/observability.mjs';

test('database errors retain useful metadata without messages, values, SQL, tokens or credentials', () => {
  const secret = 'private-password-and-care-details';
  const error = new Error(`Failed query containing ${secret}`, { cause: { code: '23505', constraint: 'users_email_idx', detail: secret, query: secret, parameters: [secret] } });
  error.stack = `Error: ${secret}\n    at handler (/private/path/api.js:12:8)`;
  error.data = { errors: [{ path: 'email', message: secret, value: secret }] };
  const result = safeError(error);
  assert.equal(result.code, '23505');
  assert.deepEqual(result.fields, ['email']);
  assert.deepEqual(result.locations, ['api.js:12:8']);
  assert.ok(!JSON.stringify(result).includes(secret));
  assert.ok(!JSON.stringify(result).includes('/private/path'));
  assert.doesNotThrow(() => safeError({ data: { errors: {} } }));
});

test('Payload logger replaces raw error objects and messages before Pino serialisation', () => {
  let output = '';
  const secret = 'synthetic-secret-never-log';
  const destination = new Writable({ write(chunk, encoding, done) { output += chunk; done(); } });
  const logger = pino({ hooks: { logMethod: safePayloadLog } }, destination);
  logger.error({ err: new Error(secret), body: { password: secret } }, `Could not save ${secret}`);
  assert.ok(!output.includes(secret));
  assert.equal(JSON.parse(output).event, 'payload_error');
});

test('request failure logs use safe routes and IDs, excluding all request values', () => {
  const original = console.error;
  let output;
  console.error = line => { output = line; };
  try {
    const id = reportFailure({ event: 'http_request_failed', id: 'bad\nrequest-id', method: 'POST', pathname: '/api/users/123?password=private', status: 403, body: 'private' });
    const result = JSON.parse(output);
    assert.equal(result.requestId, id);
    assert.match(id, /^[a-f0-9-]{36}$/);
    assert.equal(result.route, '/api/users');
    assert.equal(result.level, 'warn');
    assert.ok(!output.includes('private'));
    assert.ok(!output.includes('123'));
  } finally { console.error = original; }
});
