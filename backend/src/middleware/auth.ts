import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Extended Express Request with user information
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    profilePicture?: string | null;
  };
}

/**
 * Middleware to check if user is authenticated
 */
export const isAuthenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
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
export const optionalAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  next();
};
