import { randomInt } from 'node:crypto';

/**
 * Generates a unique, URL-friendly link
 */
export const generateUniqueLink = (length = 12): string => {
  const alphabet =
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let link = '';

  for (let i = 0; i < length; i += 1) {
    link += alphabet[randomInt(alphabet.length)];
  }

  return link;
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
