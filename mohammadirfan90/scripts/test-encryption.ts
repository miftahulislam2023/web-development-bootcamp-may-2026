import test from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';

// Setup environment for testing
process.env.MESSAGE_ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');

// Import after env setup to avoid throw
import { encryptMessage, decryptMessage, decryptMessageDoc } from '../lib/encryption';

test('Encryption Suite', async (t) => {
  
  await t.test('encrypts and decrypts a simple message', () => {
    const text = 'Hello, this is a secret message!';
    const { ciphertext, iv, authTag } = encryptMessage(text);
    
    assert.notStrictEqual(ciphertext, text);
    assert.ok(ciphertext.length > 0);
    assert.ok(iv.length > 0);
    assert.ok(authTag.length > 0);
    
    const decrypted = decryptMessage(ciphertext, iv, authTag);
    assert.strictEqual(decrypted, text);
  });

  await t.test('handles unicode and emojis', () => {
    const text = 'Hello 🌍, 123 !@# 👋';
    const { ciphertext, iv, authTag } = encryptMessage(text);
    const decrypted = decryptMessage(ciphertext, iv, authTag);
    assert.strictEqual(decrypted, text);
  });

  await t.test('handles empty messages safely', () => {
    const text = '';
    const { ciphertext, iv, authTag } = encryptMessage(text);
    const decrypted = decryptMessage(ciphertext, iv, authTag);
    assert.strictEqual(decrypted, '');
  });

  await t.test('fails securely on corrupted ciphertext', () => {
    const text = 'Secret';
    const { ciphertext, iv, authTag } = encryptMessage(text);
    
    // Corrupt the ciphertext by changing the first character
    const corruptedCiphertext = ciphertext.substring(1) + 'a';
    
    const decrypted = decryptMessage(corruptedCiphertext, iv, authTag);
    assert.strictEqual(decrypted, '[Message corrupted or unavailable]');
  });

  await t.test('fails securely on corrupted authTag', () => {
    const text = 'Secret';
    const { ciphertext, iv, authTag } = encryptMessage(text);
    
    // Corrupt authTag
    const corruptedAuthTag = Buffer.from(authTag, 'base64');
    corruptedAuthTag[0] = corruptedAuthTag[0] ^ 1; // Flip a bit
    
    const decrypted = decryptMessage(ciphertext, iv, corruptedAuthTag.toString('base64'));
    assert.strictEqual(decrypted, '[Message corrupted or unavailable]');
  });

  await t.test('decryptMessageDoc safely mutates and falls back', () => {
    const text = 'Doc Secret';
    const { ciphertext, iv, authTag } = encryptMessage(text);
    
    // Test Encrypted Doc
    const doc = {
      _id: '123',
      content: 'legacy text', // Might exist or not
      ciphertext, iv, authTag
    };
    
    const decryptedDoc = decryptMessageDoc(doc);
    assert.strictEqual(decryptedDoc.content, text);

    // Test Unencrypted Legacy Doc
    const legacyDoc = {
      _id: '124',
      content: 'plain text legacy'
    };
    
    const untouchedDoc = decryptMessageDoc(legacyDoc);
    assert.strictEqual(untouchedDoc.content, 'plain text legacy');
  });

});
