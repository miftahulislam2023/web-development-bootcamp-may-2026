import assert from 'node:assert/strict';
import http from 'node:http';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../src/app.js';

let server;
let baseUrl;

function listen(app) {
  return new Promise((resolve) => {
    const activeServer = http.createServer(app);

    activeServer.listen(0, () => {
      const address = activeServer.address();
      resolve({
        activeServer,
        url: `http://127.0.0.1:${address.port}`
      });
    });
  });
}

function close(activeServer) {
  return new Promise((resolve, reject) => {
    activeServer.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

describe('express app', () => {
  before(async () => {
    process.env.CLIENT_URL = 'http://localhost:5173';
    const { app } = createApp();
    const result = await listen(app);

    server = result.activeServer;
    baseUrl = result.url;
  });

  after(async () => {
    await close(server);
  });

  it('responds to the health check route', async () => {
    const response = await fetch(`${baseUrl}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.equal(body, 'Chat server is running');
  });

  it('allows configured CORS origin for auth preflight requests', async () => {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST'
      }
    });

    assert.equal(response.status, 204);
    assert.equal(
      response.headers.get('access-control-allow-origin'),
      'http://localhost:5173'
    );
  });
});
