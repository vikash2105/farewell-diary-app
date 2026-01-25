import CryptoJS from 'crypto-js';

/**
 * IMPORTANT:
 * ENCRYPTION_KEY must be defined in environment variables
 * and should be at least 32 characters long
 */
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  throw new Error(
    'ENCRYPTION_KEY is missing or too short. It must be at least 32 characters long.'
  );
}

/**
 * Encrypts a string using AES encryption
 */
export const encrypt = (text: string): string => {
  try {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  } catch {
    throw new Error('Encryption failed');
  }
};

/**
 * Decrypts an AES encrypted string
 */
export const decrypt = (encryptedText: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('Invalid encrypted text');
    }

    return decrypted;
  } catch {
    throw new Error('Decryption failed');
  }
};

/**
 * Generates a secure random encryption key
 */
export const generateKey = (length = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString(CryptoJS.enc.Hex);
};
