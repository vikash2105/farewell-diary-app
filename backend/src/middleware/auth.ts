import { Request, Response, NextFunction } from "express";

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
 * Require authentication (Passport-based + Header Fallback)
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 1. Check Passport Session (Cookie)
  if (req.isAuthenticated && req.isAuthenticated() && req.user?.id) {
    req.userId = String(req.user.id);
    req.userEmail = req.user.email ? String(req.user.email) : undefined;
    req.userName = req.user.name ? String(req.user.name) : undefined;
    next();
    return;
  }

  // 2. Check Authorization Header (Bearer Token) - Future proofing / Mobile support
  // Note: Currently we don't have JWT logic implemented, but we should safely reject
  // if this is the only auth method attempted and it fails.
  // For now, if no session, we return 401.

  res.status(401).json({
    success: false,
    error: "Authentication required",
    message: "Please log in to access this resource",
  });
};

/**
 * Optional authentication - Never throws
 */
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.id) {
        req.userId = String(req.user.id);
        req.userEmail = req.user.email ? String(req.user.email) : undefined;
        req.userName = req.user.name ? String(req.user.name) : undefined;
      }
  } catch (e) {
      // Gracefully handle session errors by treating user as guest
  }
  next();
};

/**
 * Backward-compatible alias
 */
export const isAuthenticated = requireAuth;
