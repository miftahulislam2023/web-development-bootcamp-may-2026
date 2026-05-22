import { env } from '@socialIO/env/server';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

function getKey(): Buffer {
	const hex = env.ENCRYPTION_KEY;

	if (!hex) {
		throw new Error('ENCRYPTION_KEY is not set');
	}
	if (hex.length !== 64) {
		throw new Error(`ENCRYPTION_KEY must be 64 hex chars (32 bytes), got ${hex.length}`);
	}

	return Buffer.from(hex, 'hex');
}

export interface EncryptedPayload {
	content_enc: string; // base64: The encrypted content (ciphertext)
	content_iv: string; // base64: The initialization vector used for encryption
}

export function encrypt(plainText: string): EncryptedPayload {
	const encryptionKey = getKey();

	// Generate a random initialization vector (IV) for encryption
	const iv = randomBytes(env.IV_BYTES);

	// Create a cipher instance using the specified algorithm, encryption key, and IV
	const cipher = createCipheriv(env.ALGORITHM, encryptionKey, iv);

	// Encrypt the plaintext and concatenate with the final block
	const cipherText = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);

	// Get the authentication tag generated during encryption
	const authTag = cipher.getAuthTag();

	// Combine the ciphertext and authentication tag into a single buffer
	const combined = Buffer.concat([cipherText, authTag]);

	return {
		content_enc: combined.toString('base64'),
		content_iv: iv.toString('base64'),
	};
}

export function decrypt(payload: EncryptedPayload): string {
	const decryptionKey = getKey();

	// Decode the base64-encoded IV and combined ciphertext+authTag from the payload
	const iv = Buffer.from(payload.content_iv, 'base64');

	// The combined buffer contains the ciphertext followed by the authentication tag
	const combined = Buffer.from(payload.content_enc, 'base64');

	// Separate the ciphertext and authentication tag
	const authTag = combined.subarray(combined.length - env.TAG_BYTES);
	const cipherText = combined.subarray(0, combined.length - env.TAG_BYTES);

	// Create a decipher instance using the specified algorithm, key, and IV
	const decipher = createDecipheriv(env.ALGORITHM, decryptionKey, iv);
	decipher.setAuthTag(authTag);

	// Decrypt the ciphertext and concatenate with the final block
	const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]).toString('utf8');

	return decrypted;
}
