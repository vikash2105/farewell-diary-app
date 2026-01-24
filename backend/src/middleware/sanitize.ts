import { Request, Response, NextFunction } from 'express';

/**
 * Basic HTML tag stripper to prevent XSS
 * Removes HTML tags while preserving the text content
 */
const stripHtmlTags = (str: string): string => {
  if (!str) return str;
  // Remove HTML tags and decode HTML entities
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags first
    .replace(/<[^>]*>/g, '') // Remove all other HTML tags
    .trim();
};

/**
 * Sanitize request body fields recursively
 * Handles strings, arrays, and nested objects
 */
const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return stripHtmlTags(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
};

/**
 * Middleware to sanitize request body
 * Prevents XSS attacks by removing HTML tags from all string inputs
 * 
 * @example
 * router.post('/diary', sanitizeInput, createDiary);
 */
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};
