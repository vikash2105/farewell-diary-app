import { Request, Response, NextFunction, RequestHandler } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware to check if user is authenticated
 */
export const isAuthenticated: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated?.() && req.user) {
    return next();
  }

  logger.warn('Unauthorized access attempt', {
    path: req.path,
    ip: req.ip,
  });

  res.status(401).json({
    success: false,
    error: 'Unauthorized. Please login first.',
  });
};

/**
 * Optional authentication middleware
 * Attaches user if available, but does not block request
 */
export const optionalAuth: RequestHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next();
};
