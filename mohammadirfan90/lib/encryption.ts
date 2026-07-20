import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM recommended IV length is 12 bytes (96 bits)

// We validate the key at module load time. If it's invalid, the server will intentionally fail to start.
const keyString = process.env.MESSAGE_ENCRYPTION_KEY;
if (!keyString) {
  throw new Error("MESSAGE_ENCRYPTION_KEY environment variable is missing.");
}
if (keyString.length !== 64) {
  throw new Error("MESSAGE_ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters).");
}

const KEY = Buffer.from(keyString, 'hex');

export interface EncryptedMessage {
  ciphertext: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Allocates a new random IV for every encryption to prevent nonce reuse attacks.
 */
export function encryptMessage(text: string): EncryptedMessage {
  if (!text) return { ciphertext: '', iv: '', authTag: '' };

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let ciphertext = cipher.update(text, 'utf8', 'base64');
  ciphertext += cipher.final('base64');
  
  const authTag = cipher.getAuthTag();
  
  return {
    ciphertext,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64')
  };
}

/**
 * Decrypts a ciphertext string using AES-256-GCM and verifies the authentication tag.
 * Fails gracefully and logs securely if ciphertext is tampered with.
 */
export function decryptMessage(ciphertext: string, ivBase64: string, authTagBase64: string): string {
  if (!ciphertext || !ivBase64 || !authTagBase64) return '';

  try {
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    
    let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
    plaintext += decipher.final('utf8');
    
    return plaintext;
  } catch (err) {
    // Gracefully handle corrupted ciphertext or authentication failures without exposing raw crypto errors to the client
    console.error("[Encryption Error]: Failed to decrypt message.");
    return "[Message corrupted or unavailable]";
  }
}

/**
 * Helper to safely decrypt a Mongoose document or POJO.
 * Mutates the object by injecting the decrypted text into the 'content' field.
 * Safely falls back to the existing 'content' if unencrypted (for backward compatibility).
 */
export function decryptMessageDoc(doc: any): any {
  if (!doc) return doc;
  
  if (doc.ciphertext && doc.iv && doc.authTag) {
    const plaintext = decryptMessage(doc.ciphertext, doc.iv, doc.authTag);
    doc.content = plaintext;
  }
  
  return doc;
}
