'use strict';

const http = require('node:http');
const pkg = require('./package.json');

const PORT = process.env.PORT || 3000;

// The Jenkins pipeline passes BUILD_NUMBER into the container,
// so the page shows which pipeline build is currently deployed.
function  {
  return process.env.BUILD_NUMBER || 'local';
}

function homePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jenkins CI/CD Demo</title>
  <style>
    body { font-family: Arial, sans-serif; background: #111827; color: #e5e7eb;
           display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: #1f2937; padding: 40px 56px; border-radius: 12px; text-align: center; }
    h1 { margin: 0 0 12px; color: #f87171; }
    .ok { color: #4ade80; font-weight: bold; }
    .build { color: #fbbf24; font-size: 1.4em; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Jenkins CI/CD Demo App</h1>
    <p>Built, tested and deployed automatically by <b>Jenkins</b> and <b>Docker</b>.</p>
    <p class="ok">Deployment successful</p>
    <p class="build">Jenkins build #${buildNumber()}</p>
    <p>App version ${pkg.version}</p>
  </div>
</body>
</html>`;
}

function handler(req, res) {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok' }));
  }
  if (req.url === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(
      JSON.stringify({ name: pkg.name, version: pkg.version, build: buildNumber(), node: process.version })
    );
  }
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(homePage());
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({ error: 'Not found' }));
}

function createServer() {
  return http.createServer(handler);
}

if (require.main === module) {
  createServer().listen(PORT, () => {
    console.log(`${pkg.name} v${pkg.version} (build ${buildNumber()}) listening on port ${PORT}`);
  });
}

module.exports = { createServer, handler };
