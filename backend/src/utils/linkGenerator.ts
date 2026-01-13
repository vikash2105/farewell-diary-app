import { nanoid, customAlphabet } from 'nanoid';

/**
 * Generates a unique, URL-friendly link for diaries
 * @param length - Length of the link (default: 12)
 * @returns Unique link string
 */
export const generateUniqueLink = (length: number = 12): string => {
  // Custom alphabet without confusing characters (0, O, I, l)
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const nanoidCustom = customAlphabet(alphabet, length);
  return nanoidCustom();
};

/**
 * Validates if a link format is correct
 * @param link - The link to validate
 * @returns Boolean indicating validity
 */
export const validateLinkFormat = (link: string): boolean => {
  // Should be alphanumeric, 8-20 characters
  const linkRegex = /^[a-zA-Z0-9]{8,20}$/;
  return linkRegex.test(link);
};

/**
 * Generates a full shareable URL for a diary
 * @param uniqueLink - The unique link identifier
 * @param frontendUrl - Base frontend URL
 * @returns Full shareable URL
 */
export const generateShareableUrl = (uniqueLink: string, frontendUrl: string): string => {
  return `${frontendUrl}/diary/${uniqueLink}`;
};
