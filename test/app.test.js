'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createServer } = require('../server');

let server;
let baseUrl;

function get(path) {
  return new Promise((resolve, reject) => {
    http
      .get(baseUrl + path, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      })
      .on('error', reject);
  });
}

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET / returns the home page', async () => {
  const res = await get('/');
  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /text\/html/);
  assert.match(res.body, /Jenkins CI\/CD Demo App/);
});

test('GET /health returns status ok', async () => {
  const res = await get('/health');
  assert.equal(res.status, 200);
  assert.deepEqual(JSON.parse(res.body), { status: 'ok' });
});

test('GET /api/info returns name, version and build', async () => {
  const res = await get('/api/info');
  assert.equal(res.status, 200);
  const data = JSON.parse(res.body);
  assert.equal(data.name, 'jenkins-demo-app');
  assert.equal(data.version, '1.0.0');
  assert.ok(data.build);
});

test('unknown route returns 404', async () => {
  const res = await get('/does-not-exist');
  assert.equal(res.status, 404);
});
