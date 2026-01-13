import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
}

/**
 * Encrypts a string using AES encryption
 * @param text - The plain text to encrypt
 * @returns Encrypted string
 */
export const encrypt = (text: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    throw new Error('Encryption failed');
  }
};

/**
 * Decrypts an AES encrypted string
 * @param encryptedText - The encrypted text to decrypt
 * @returns Decrypted plain text
 */
export const decrypt = (encryptedText: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Decryption resulted in empty string');
    }
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed');
  }
};

/**
 * Generates a random encryption key
 * @param length - Length of the key (default: 32)
 * @returns Random key string
 */
export const generateKey = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString();
};
