import { customAlphabet } from 'nanoid';

/**
 * Generates a unique, URL-friendly link
 */
export const generateUniqueLink = (length = 12): string => {
  const alphabet =
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  return customAlphabet(alphabet, length)();
};

/**
 * Generates a full shareable URL
 */
export const generateShareableUrl = (
  uniqueLink: string,
  frontendUrl: string
): string => {
  return `${frontendUrl}/diary/${uniqueLink}`;
};
