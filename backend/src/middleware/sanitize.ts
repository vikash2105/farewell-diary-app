import { Request, Response, NextFunction } from 'express';

const stripHtmlTags = (str: string): string => {
  if (!str) return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') return stripHtmlTags(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }
  return obj;
};

export const sanitizeInput = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};
