import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { signToken, verifyToken } from '../src/shared/jwt.js';

describe('jwt helpers', () => {
  it('signs and verifies a user token', () => {
    const user = {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com'
    };

    const token = signToken(user);
    const decoded = verifyToken(token);

    assert.equal(decoded.id, user.id);
    assert.equal(decoded.name, user.name);
    assert.equal(decoded.email, user.email);
  });

  it('rejects an invalid token', () => {
    assert.throws(() => verifyToken('not-a-real-token'));
  });
});
