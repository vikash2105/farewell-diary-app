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
    profilePicture?: string;
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
  if (req.isAuthenticated && req.isAuthenticated()) {
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
 * Middleware to check if user is authenticated (optional)
 * Continues even if not authenticated
 */
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Always continue, but user info might not be available
  next();
};

/**
 * Middleware to attach user info from session
 */
export const attachUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.session && (req.session as any).passport && (req.session as any).passport.user) {
    req.user = (req.session as any).passport.user;
  }
  next();
};
