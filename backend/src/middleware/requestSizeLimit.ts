import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middleware/errorHandler';

/**
 * Middleware factory to limit request body size for specific routes
 * Provides more granular control than global body parser limits
 * 
 * @param maxBytes - Maximum allowed request size in bytes
 * @returns Express middleware function
 * 
 * @example
 * router.post('/notes', limitRequestSize(LIMITS.NOTE), createNote);
 */
export const limitRequestSize = (maxBytes: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = req.headers['content-length'];
    
    if (contentLength && parseInt(contentLength) > maxBytes) {
      const maxKB = Math.round(maxBytes / 1024);
      throw new ApiError(
        413,
        `Request size exceeds maximum allowed size of ${maxKB}KB`
      );
    }
    
    next();
  };
};

/**
 * Predefined request size limits for different route types
 * Based on the maximum expected payload size for each operation
 */
export const LIMITS = {
  /**
   * For farewell notes
   * Max note is 5000 characters, plus metadata
   * Actual limit: ~6-7KB, set to 10KB for safety
   */
  NOTE: 10 * 1024, // 10KB
  
  /**
   * For diary creation/updates
   * Title (255 chars) + Description (1000 chars) + settings
   * Actual limit: ~2-3KB, set to 5KB for safety
   */
  DIARY: 5 * 1024, // 5KB
  
  /**
   * For future image uploads (profile pictures, diary covers)
   * Reasonable limit for web images
   */
  IMAGE: 5 * 1024 * 1024, // 5MB
  
  /**
   * For JSON API responses
   * Standard limit for API calls
   */
  JSON: 1 * 1024 * 1024, // 1MB
};

/**
 * Helper to convert bytes to human-readable format
 * Useful for logging and error messages
 */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${Math.round(bytes / (1024 * 1024))}MB`;
};
