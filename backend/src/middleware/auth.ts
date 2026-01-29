/**
 * Authentication Middleware
 * Verifies user is authenticated before accessing protected routes
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Extend Express Request type to include session data
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      userName?: string;
    }
  }
}

/**
 * Require authentication middleware
 * Checks if user is logged in via session
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check if user session exists
  if (!req.session || !req.session.userId) {
    res.status(401).json({
      error: 'Authentication required',
      message: 'Please log in to access this resource',
    });
    return;
  }

  // Attach user data to request for easy access
  req.userId = req.session.userId;
  req.userEmail = req.session.userEmail;
  req.userName = req.session.userName;

  next();
};

/**
 * Optional authentication middleware
 * Attaches user data if logged in, but doesn't require it
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    req.userEmail = req.session.userEmail;
    req.userName = req.session.userName;
  }

  next();
};
