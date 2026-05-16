import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { requireAuth } from '../src/shared/auth.middleware.js';
import { signToken } from '../src/shared/jwt.js';

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

describe('requireAuth middleware', () => {
  it('returns 401 when authorization header is missing', () => {
    const req = { headers: {} };
    const res = createResponse();
    let nextCalled = false;

    requireAuth(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { message: 'Authentication token is required' });
  });

  it('attaches the decoded user and calls next for a valid token', () => {
    const token = signToken({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com'
    });
    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };
    const res = createResponse();
    let nextCalled = false;

    requireAuth(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(req.user.id, 'user-1');
    assert.equal(req.user.email, 'test@example.com');
  });

  it('returns 401 for an invalid token', () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid-token'
      }
    };
    const res = createResponse();
    let nextCalled = false;

    requireAuth(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { message: 'Invalid or expired token' });
  });
});
