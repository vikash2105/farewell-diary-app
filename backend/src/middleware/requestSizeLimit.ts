import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

export const limitRequestSize = (maxBytes: number) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const contentLength = req.headers['content-length'];

    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      throw new ApiError(
        413,
        `Request size exceeds maximum allowed size of ${Math.round(
          maxBytes / 1024
        )}KB`
      );
    }

    next();
  };
};

export const LIMITS = {
  NOTE: 10 * 1024,   // 10KB
  DIARY: 5 * 1024,   // 5KB
  IMAGE: 5 * 1024 * 1024,
  JSON: 1 * 1024 * 1024,
};
