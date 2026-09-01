/**
 * ApnoSe Client-Side Zero-Knowledge Encryption Engine
 * Uses Web Crypto API (AES-GCM-256 + PBKDF2 with SHA-256)
 * Data is encrypted locally in the browser before being sent to the server.
 * The server only receives ciphertext and cannot read the content.
 */

// Helper to convert ArrayBuffer to Base64 string
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper to convert Base64 string to Uint8Array
export function base64ToBuffer(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Derive AES-GCM 256 Key from user password/passkey using PBKDF2
export async function deriveKeyFromPassphrase(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt any text/JSON data with AES-256-GCM
 * Returns an unreadable formatted ciphertext string: "ENC:v1:<salt_b64>:<iv_b64>:<ciphertext_b64>"
 */
export async function encryptData(plainText: string, secretKeyOrPass: string): Promise<string> {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKeyFromPassphrase(secretKeyOrPass, salt);

    const enc = new TextEncoder();
    const encodedData = enc.encode(plainText);

    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      key,
      encodedData
    );

    const saltB64 = bufferToBase64(salt.buffer);
    const ivB64 = bufferToBase64(iv.buffer);
    const cipherB64 = bufferToBase64(ciphertextBuffer);

    return `ENC:v1:${saltB64}:${ivB64}:${cipherB64}`;
  } catch (err) {
    console.error('Encryption failed:', err);
    throw new Error('एन्क्रिप्शन विफल रहा');
  }
}

/**
 * Decrypt ciphertext formatted as "ENC:v1:<salt_b64>:<iv_b64>:<ciphertext_b64>"
 */
export async function decryptData(encryptedString: string, secretKeyOrPass: string): Promise<string> {
  try {
    if (!encryptedString.startsWith('ENC:v1:')) {
      // Not encrypted with this format, return as is
      return encryptedString;
    }

    const parts = encryptedString.split(':');
    if (parts.length !== 5) {
      throw new Error('अमान्य एन्क्रिप्शन प्रारूप');
    }

    const salt = base64ToBuffer(parts[2]);
    const iv = base64ToBuffer(parts[3]);
    const cipherBytes = base64ToBuffer(parts[4]);

    const key = await deriveKeyFromPassphrase(secretKeyOrPass, salt);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      key,
      cipherBytes as unknown as BufferSource
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (err) {
    console.error('Decryption failed (possibly wrong key):', err);
    throw new Error('डिक्रिप्शन विफल रहा: गलत गुप्त कुंजी / पासवर्ड');
  }
}

/**
 * Checks if a string is encrypted
 */
export function isEncrypted(value: string): boolean {
  return typeof value === 'string' && value.startsWith('ENC:v1:');
}
